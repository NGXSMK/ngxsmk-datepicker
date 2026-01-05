/**
 * @license Angular v21.0.6
 * (c) 2010-2025 Google LLC. https://angular.dev/
 * License: MIT
 */

import { untracked, ɵRuntimeError as _RuntimeError, computed, runInInjectionContext, Injector, linkedSignal, signal, APP_ID, effect, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SIGNAL } from '@angular/core/primitives/signals';

let boundPathDepth = 0;
function getBoundPathDepth() {
  return boundPathDepth;
}
function setBoundPathDepthForResolution(fn, depth) {
  return (...args) => {
    try {
      boundPathDepth = depth;
      return fn(...args);
    } finally {
      boundPathDepth = 0;
    }
  };
}

function shortCircuitFalse(value) {
  return !value;
}
function shortCircuitTrue(value) {
  return value;
}
function getInjectorFromOptions(options) {
  if (options.kind === 'root') {
    return options.fieldManager.injector;
  }
  return options.parent.structure.root.structure.injector;
}

function isArray(value) {
  return Array.isArray(value);
}
function isObject(value) {
  return (typeof value === 'object' || typeof value === 'function') && value != null;
}

const DYNAMIC = Symbol();
const IGNORED = Symbol();
class AbstractLogic {
  predicates;
  fns = [];
  constructor(predicates) {
    this.predicates = predicates;
  }
  push(logicFn) {
    this.fns.push(wrapWithPredicates(this.predicates, logicFn));
  }
  mergeIn(other) {
    const fns = this.predicates ? other.fns.map(fn => wrapWithPredicates(this.predicates, fn)) : other.fns;
    this.fns.push(...fns);
  }
}
class BooleanOrLogic extends AbstractLogic {
  get defaultValue() {
    return false;
  }
  compute(arg) {
    return this.fns.some(f => {
      const result = f(arg);
      return result && result !== IGNORED;
    });
  }
}
class ArrayMergeIgnoreLogic extends AbstractLogic {
  ignore;
  static ignoreNull(predicates) {
    return new ArrayMergeIgnoreLogic(predicates, e => e === null);
  }
  constructor(predicates, ignore) {
    super(predicates);
    this.ignore = ignore;
  }
  get defaultValue() {
    return [];
  }
  compute(arg) {
    return this.fns.reduce((prev, f) => {
      const value = f(arg);
      if (value === undefined || value === IGNORED) {
        return prev;
      } else if (isArray(value)) {
        return [...prev, ...(this.ignore ? value.filter(e => !this.ignore(e)) : value)];
      } else {
        if (this.ignore && this.ignore(value)) {
          return prev;
        }
        return [...prev, value];
      }
    }, []);
  }
}
class ArrayMergeLogic extends ArrayMergeIgnoreLogic {
  constructor(predicates) {
    super(predicates, undefined);
  }
}
class MetadataMergeLogic extends AbstractLogic {
  key;
  get defaultValue() {
    return this.key.reducer.getInitial();
  }
  constructor(predicates, key) {
    super(predicates);
    this.key = key;
  }
  compute(ctx) {
    if (this.fns.length === 0) {
      return this.key.reducer.getInitial();
    }
    let acc = this.key.reducer.getInitial();
    for (let i = 0; i < this.fns.length; i++) {
      const item = this.fns[i](ctx);
      if (item !== IGNORED) {
        acc = this.key.reducer.reduce(acc, item);
      }
    }
    return acc;
  }
}
function wrapWithPredicates(predicates, logicFn) {
  if (predicates.length === 0) {
    return logicFn;
  }
  return arg => {
    for (const predicate of predicates) {
      let predicateField = arg.stateOf(predicate.path);
      const depthDiff = untracked(predicateField.structure.pathKeys).length - predicate.depth;
      for (let i = 0; i < depthDiff; i++) {
        predicateField = predicateField.structure.parent;
      }
      if (!predicate.fn(predicateField.context)) {
        return IGNORED;
      }
    }
    return logicFn(arg);
  };
}
class LogicContainer {
  predicates;
  hidden;
  disabledReasons;
  readonly;
  syncErrors;
  syncTreeErrors;
  asyncErrors;
  metadata = new Map();
  constructor(predicates) {
    this.predicates = predicates;
    this.hidden = new BooleanOrLogic(predicates);
    this.disabledReasons = new ArrayMergeLogic(predicates);
    this.readonly = new BooleanOrLogic(predicates);
    this.syncErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
    this.syncTreeErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
    this.asyncErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
  }
  hasMetadata(key) {
    return this.metadata.has(key);
  }
  getMetadataKeys() {
    return this.metadata.keys();
  }
  getMetadata(key) {
    if (!this.metadata.has(key)) {
      this.metadata.set(key, new MetadataMergeLogic(this.predicates, key));
    }
    return this.metadata.get(key);
  }
  mergeIn(other) {
    this.hidden.mergeIn(other.hidden);
    this.disabledReasons.mergeIn(other.disabledReasons);
    this.readonly.mergeIn(other.readonly);
    this.syncErrors.mergeIn(other.syncErrors);
    this.syncTreeErrors.mergeIn(other.syncTreeErrors);
    this.asyncErrors.mergeIn(other.asyncErrors);
    for (const key of other.getMetadataKeys()) {
      const metadataLogic = other.metadata.get(key);
      this.getMetadata(key).mergeIn(metadataLogic);
    }
  }
}

class AbstractLogicNodeBuilder {
  depth;
  constructor(depth) {
    this.depth = depth;
  }
  build() {
    return new LeafLogicNode(this, [], 0);
  }
}
class LogicNodeBuilder extends AbstractLogicNodeBuilder {
  constructor(depth) {
    super(depth);
  }
  current;
  all = [];
  addHiddenRule(logic) {
    this.getCurrent().addHiddenRule(logic);
  }
  addDisabledReasonRule(logic) {
    this.getCurrent().addDisabledReasonRule(logic);
  }
  addReadonlyRule(logic) {
    this.getCurrent().addReadonlyRule(logic);
  }
  addSyncErrorRule(logic) {
    this.getCurrent().addSyncErrorRule(logic);
  }
  addSyncTreeErrorRule(logic) {
    this.getCurrent().addSyncTreeErrorRule(logic);
  }
  addAsyncErrorRule(logic) {
    this.getCurrent().addAsyncErrorRule(logic);
  }
  addMetadataRule(key, logic) {
    this.getCurrent().addMetadataRule(key, logic);
  }
  getChild(key) {
    if (key === DYNAMIC) {
      const children = this.getCurrent().children;
      if (children.size > (children.has(DYNAMIC) ? 1 : 0)) {
        this.current = undefined;
      }
    }
    return this.getCurrent().getChild(key);
  }
  hasLogic(builder) {
    if (this === builder) {
      return true;
    }
    return this.all.some(({
      builder: subBuilder
    }) => subBuilder.hasLogic(builder));
  }
  mergeIn(other, predicate) {
    if (predicate) {
      this.all.push({
        builder: other,
        predicate: {
          fn: setBoundPathDepthForResolution(predicate.fn, this.depth),
          path: predicate.path
        }
      });
    } else {
      this.all.push({
        builder: other
      });
    }
    this.current = undefined;
  }
  getCurrent() {
    if (this.current === undefined) {
      this.current = new NonMergeableLogicNodeBuilder(this.depth);
      this.all.push({
        builder: this.current
      });
    }
    return this.current;
  }
  static newRoot() {
    return new LogicNodeBuilder(0);
  }
}
class NonMergeableLogicNodeBuilder extends AbstractLogicNodeBuilder {
  logic = new LogicContainer([]);
  children = new Map();
  constructor(depth) {
    super(depth);
  }
  addHiddenRule(logic) {
    this.logic.hidden.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addDisabledReasonRule(logic) {
    this.logic.disabledReasons.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addReadonlyRule(logic) {
    this.logic.readonly.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addSyncErrorRule(logic) {
    this.logic.syncErrors.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addSyncTreeErrorRule(logic) {
    this.logic.syncTreeErrors.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addAsyncErrorRule(logic) {
    this.logic.asyncErrors.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addMetadataRule(key, logic) {
    this.logic.getMetadata(key).push(setBoundPathDepthForResolution(logic, this.depth));
  }
  getChild(key) {
    if (!this.children.has(key)) {
      this.children.set(key, new LogicNodeBuilder(this.depth + 1));
    }
    return this.children.get(key);
  }
  hasLogic(builder) {
    return this === builder;
  }
}
class LeafLogicNode {
  builder;
  predicates;
  depth;
  logic;
  constructor(builder, predicates, depth) {
    this.builder = builder;
    this.predicates = predicates;
    this.depth = depth;
    this.logic = builder ? createLogic(builder, predicates, depth) : new LogicContainer([]);
  }
  getChild(key) {
    const childBuilders = this.builder ? getAllChildBuilders(this.builder, key) : [];
    if (childBuilders.length === 0) {
      return new LeafLogicNode(undefined, [], this.depth + 1);
    } else if (childBuilders.length === 1) {
      const {
        builder,
        predicates
      } = childBuilders[0];
      return new LeafLogicNode(builder, [...this.predicates, ...predicates.map(p => bindLevel(p, this.depth))], this.depth + 1);
    } else {
      const builtNodes = childBuilders.map(({
        builder,
        predicates
      }) => new LeafLogicNode(builder, [...this.predicates, ...predicates.map(p => bindLevel(p, this.depth))], this.depth + 1));
      return new CompositeLogicNode(builtNodes);
    }
  }
  hasLogic(builder) {
    return this.builder?.hasLogic(builder) ?? false;
  }
}
class CompositeLogicNode {
  all;
  logic;
  constructor(all) {
    this.all = all;
    this.logic = new LogicContainer([]);
    for (const node of all) {
      this.logic.mergeIn(node.logic);
    }
  }
  getChild(key) {
    return new CompositeLogicNode(this.all.flatMap(child => child.getChild(key)));
  }
  hasLogic(builder) {
    return this.all.some(node => node.hasLogic(builder));
  }
}
function getAllChildBuilders(builder, key) {
  if (builder instanceof LogicNodeBuilder) {
    return builder.all.flatMap(({
      builder,
      predicate
    }) => {
      const children = getAllChildBuilders(builder, key);
      if (predicate) {
        return children.map(({
          builder,
          predicates
        }) => ({
          builder,
          predicates: [...predicates, predicate]
        }));
      }
      return children;
    });
  } else if (builder instanceof NonMergeableLogicNodeBuilder) {
    return [...(key !== DYNAMIC && builder.children.has(DYNAMIC) ? [{
      builder: builder.getChild(DYNAMIC),
      predicates: []
    }] : []), ...(builder.children.has(key) ? [{
      builder: builder.getChild(key),
      predicates: []
    }] : [])];
  } else {
    throw new _RuntimeError(1909, ngDevMode && 'Unknown LogicNodeBuilder type');
  }
}
function createLogic(builder, predicates, depth) {
  const logic = new LogicContainer(predicates);
  if (builder instanceof LogicNodeBuilder) {
    const builtNodes = builder.all.map(({
      builder,
      predicate
    }) => new LeafLogicNode(builder, predicate ? [...predicates, bindLevel(predicate, depth)] : predicates, depth));
    for (const node of builtNodes) {
      logic.mergeIn(node.logic);
    }
  } else if (builder instanceof NonMergeableLogicNodeBuilder) {
    logic.mergeIn(builder.logic);
  } else {
    throw new _RuntimeError(1909, ngDevMode && 'Unknown LogicNodeBuilder type');
  }
  return logic;
}
function bindLevel(predicate, depth) {
  return {
    ...predicate,
    depth: depth
  };
}

const PATH = Symbol('PATH');
class FieldPathNode {
  keys;
  parent;
  keyInParent;
  root;
  children = new Map();
  fieldPathProxy = new Proxy(this, FIELD_PATH_PROXY_HANDLER);
  logicBuilder;
  constructor(keys, root, parent, keyInParent) {
    this.keys = keys;
    this.parent = parent;
    this.keyInParent = keyInParent;
    this.root = root ?? this;
    if (!parent) {
      this.logicBuilder = LogicNodeBuilder.newRoot();
    }
  }
  get builder() {
    if (this.logicBuilder) {
      return this.logicBuilder;
    }
    return this.parent.builder.getChild(this.keyInParent);
  }
  getChild(key) {
    if (!this.children.has(key)) {
      this.children.set(key, new FieldPathNode([...this.keys, key], this.root, this, key));
    }
    return this.children.get(key);
  }
  mergeIn(other, predicate) {
    const path = other.compile();
    this.builder.mergeIn(path.builder, predicate);
  }
  static unwrapFieldPath(formPath) {
    return formPath[PATH];
  }
  static newRoot() {
    return new FieldPathNode([], undefined, undefined, undefined);
  }
}
const FIELD_PATH_PROXY_HANDLER = {
  get(node, property) {
    if (property === PATH) {
      return node;
    }
    return node.getChild(property).fieldPathProxy;
  }
};

let currentCompilingNode = undefined;
const compiledSchemas = new Map();
class SchemaImpl {
  schemaFn;
  constructor(schemaFn) {
    this.schemaFn = schemaFn;
  }
  compile() {
    if (compiledSchemas.has(this)) {
      return compiledSchemas.get(this);
    }
    const path = FieldPathNode.newRoot();
    compiledSchemas.set(this, path);
    let prevCompilingNode = currentCompilingNode;
    try {
      currentCompilingNode = path;
      this.schemaFn(path.fieldPathProxy);
    } finally {
      currentCompilingNode = prevCompilingNode;
    }
    return path;
  }
  static create(schema) {
    if (schema instanceof SchemaImpl) {
      return schema;
    }
    return new SchemaImpl(schema);
  }
  static rootCompile(schema) {
    try {
      compiledSchemas.clear();
      if (schema === undefined) {
        return FieldPathNode.newRoot();
      }
      if (schema instanceof SchemaImpl) {
        return schema.compile();
      }
      return new SchemaImpl(schema).compile();
    } finally {
      compiledSchemas.clear();
    }
  }
}
function isSchemaOrSchemaFn(value) {
  return value instanceof SchemaImpl || typeof value === 'function';
}
function assertPathIsCurrent(path) {
  if (currentCompilingNode !== FieldPathNode.unwrapFieldPath(path).root) {
    throw new _RuntimeError(1908, ngDevMode && `A FieldPath can only be used directly within the Schema that owns it, **not** outside of it or within a sub-schema.`);
  }
}

function metadata(path, key, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addMetadataRule(key, logic);
  return key;
}
const MetadataReducer = {
  list() {
    return {
      reduce: (acc, item) => item === undefined ? acc : [...acc, item],
      getInitial: () => []
    };
  },
  min() {
    return {
      reduce: (acc, item) => {
        if (acc === undefined || item === undefined) {
          return acc ?? item;
        }
        return Math.min(acc, item);
      },
      getInitial: () => undefined
    };
  },
  max() {
    return {
      reduce: (prev, next) => {
        if (prev === undefined || next === undefined) {
          return prev ?? next;
        }
        return Math.max(prev, next);
      },
      getInitial: () => undefined
    };
  },
  or() {
    return {
      reduce: (prev, next) => prev || next,
      getInitial: () => false
    };
  },
  and() {
    return {
      reduce: (prev, next) => prev && next,
      getInitial: () => true
    };
  },
  override
};
function override(getInitial) {
  return {
    reduce: (_, item) => item,
    getInitial: () => getInitial?.()
  };
}
class MetadataKey {
  reducer;
  create;
  brand;
  constructor(reducer, create) {
    this.reducer = reducer;
    this.create = create;
  }
}
function createMetadataKey(reducer) {
  return new MetadataKey(reducer ?? MetadataReducer.override());
}
function createManagedMetadataKey(create, reducer) {
  return new MetadataKey(reducer ?? MetadataReducer.override(), create);
}
const REQUIRED = createMetadataKey(MetadataReducer.or());
const MIN = createMetadataKey(MetadataReducer.max());
const MAX = createMetadataKey(MetadataReducer.min());
const MIN_LENGTH = createMetadataKey(MetadataReducer.max());
const MAX_LENGTH = createMetadataKey(MetadataReducer.min());
const PATTERN = createMetadataKey(MetadataReducer.list());

function calculateValidationSelfStatus(state) {
  if (state.errors().length > 0) {
    return 'invalid';
  }
  if (state.pending()) {
    return 'unknown';
  }
  return 'valid';
}
class FieldValidationState {
  node;
  constructor(node) {
    this.node = node;
  }
  rawSyncTreeErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return [...this.node.logicNode.logic.syncTreeErrors.compute(this.node.context), ...(this.node.structure.parent?.validationState.rawSyncTreeErrors() ?? [])];
  }, ...(ngDevMode ? [{
    debugName: "rawSyncTreeErrors"
  }] : []));
  syncErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return [...this.node.logicNode.logic.syncErrors.compute(this.node.context), ...this.syncTreeErrors(), ...normalizeErrors(this.node.submitState.serverErrors())];
  }, ...(ngDevMode ? [{
    debugName: "syncErrors"
  }] : []));
  syncValid = computed(() => {
    if (this.shouldSkipValidation()) {
      return true;
    }
    return this.node.structure.reduceChildren(this.syncErrors().length === 0, (child, value) => value && child.validationState.syncValid(), shortCircuitFalse);
  }, ...(ngDevMode ? [{
    debugName: "syncValid"
  }] : []));
  syncTreeErrors = computed(() => this.rawSyncTreeErrors().filter(err => err.fieldTree === this.node.fieldProxy), ...(ngDevMode ? [{
    debugName: "syncTreeErrors"
  }] : []));
  rawAsyncErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return [...this.node.logicNode.logic.asyncErrors.compute(this.node.context), ...(this.node.structure.parent?.validationState.rawAsyncErrors() ?? [])];
  }, ...(ngDevMode ? [{
    debugName: "rawAsyncErrors"
  }] : []));
  asyncErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return this.rawAsyncErrors().filter(err => err === 'pending' || err.fieldTree === this.node.fieldProxy);
  }, ...(ngDevMode ? [{
    debugName: "asyncErrors"
  }] : []));
  errors = computed(() => [...this.syncErrors(), ...this.asyncErrors().filter(err => err !== 'pending')], ...(ngDevMode ? [{
    debugName: "errors"
  }] : []));
  errorSummary = computed(() => this.node.structure.reduceChildren(this.errors(), (child, result) => [...result, ...child.errorSummary()]), ...(ngDevMode ? [{
    debugName: "errorSummary"
  }] : []));
  pending = computed(() => this.node.structure.reduceChildren(this.asyncErrors().includes('pending'), (child, value) => value || child.validationState.asyncErrors().includes('pending')), ...(ngDevMode ? [{
    debugName: "pending"
  }] : []));
  status = computed(() => {
    if (this.shouldSkipValidation()) {
      return 'valid';
    }
    let ownStatus = calculateValidationSelfStatus(this);
    return this.node.structure.reduceChildren(ownStatus, (child, value) => {
      if (value === 'invalid' || child.validationState.status() === 'invalid') {
        return 'invalid';
      } else if (value === 'unknown' || child.validationState.status() === 'unknown') {
        return 'unknown';
      }
      return 'valid';
    }, v => v === 'invalid');
  }, ...(ngDevMode ? [{
    debugName: "status"
  }] : []));
  valid = computed(() => this.status() === 'valid', ...(ngDevMode ? [{
    debugName: "valid"
  }] : []));
  invalid = computed(() => this.status() === 'invalid', ...(ngDevMode ? [{
    debugName: "invalid"
  }] : []));
  shouldSkipValidation = computed(() => this.node.hidden() || this.node.disabled() || this.node.readonly(), ...(ngDevMode ? [{
    debugName: "shouldSkipValidation"
  }] : []));
}
function normalizeErrors(error) {
  if (error === undefined) {
    return [];
  }
  if (isArray(error)) {
    return error;
  }
  return [error];
}
function addDefaultField(errors, fieldTree) {
  if (isArray(errors)) {
    for (const error of errors) {
      error.fieldTree ??= fieldTree;
    }
  } else if (errors) {
    errors.fieldTree ??= fieldTree;
  }
  return errors;
}

const DEBOUNCER = createMetadataKey();

class FieldNodeContext {
  node;
  cache = new WeakMap();
  constructor(node) {
    this.node = node;
  }
  resolve(target) {
    if (!this.cache.has(target)) {
      const resolver = computed(() => {
        const targetPathNode = FieldPathNode.unwrapFieldPath(target);
        let field = this.node;
        let stepsRemaining = getBoundPathDepth();
        while (stepsRemaining > 0 || !field.structure.logic.hasLogic(targetPathNode.root.builder)) {
          stepsRemaining--;
          field = field.structure.parent;
          if (field === undefined) {
            throw new _RuntimeError(1900, ngDevMode && 'Path is not part of this field tree.');
          }
        }
        for (let key of targetPathNode.keys) {
          field = field.structure.getChild(key);
          if (field === undefined) {
            throw new _RuntimeError(1901, ngDevMode && `Cannot resolve path .${targetPathNode.keys.join('.')} relative to field ${['<root>', ...this.node.structure.pathKeys()].join('.')}.`);
          }
        }
        return field.fieldProxy;
      }, ...(ngDevMode ? [{
        debugName: "resolver"
      }] : []));
      this.cache.set(target, resolver);
    }
    return this.cache.get(target)();
  }
  get fieldTree() {
    return this.node.fieldProxy;
  }
  get state() {
    return this.node;
  }
  get value() {
    return this.node.structure.value;
  }
  get key() {
    return this.node.structure.keyInParent;
  }
  get pathKeys() {
    return this.node.structure.pathKeys;
  }
  index = computed(() => {
    const key = this.key();
    if (!isArray(untracked(this.node.structure.parent.value))) {
      throw new _RuntimeError(1906, ngDevMode && 'Cannot access index, parent field is not an array.');
    }
    return Number(key);
  }, ...(ngDevMode ? [{
    debugName: "index"
  }] : []));
  fieldTreeOf = p => this.resolve(p);
  stateOf = p => this.resolve(p)();
  valueOf = p => {
    const result = this.resolve(p)().value();
    if (result instanceof AbstractControl) {
      throw new _RuntimeError(1907, ngDevMode && `Tried to read an 'AbstractControl' value from a 'form()'. Did you mean to use 'compatForm()' instead?`);
    }
    return result;
  };
}

class FieldMetadataState {
  node;
  metadata = new Map();
  constructor(node) {
    this.node = node;
    for (const key of this.node.logicNode.logic.getMetadataKeys()) {
      if (key.create) {
        const logic = this.node.logicNode.logic.getMetadata(key);
        const result = untracked(() => runInInjectionContext(this.node.structure.injector, () => key.create(computed(() => logic.compute(this.node.context)))));
        this.metadata.set(key, result);
      }
    }
  }
  get(key) {
    if (this.has(key)) {
      if (!this.metadata.has(key)) {
        if (key.create) {
          throw Error('Managed metadata cannot be created lazily');
        }
        const logic = this.node.logicNode.logic.getMetadata(key);
        this.metadata.set(key, computed(() => logic.compute(this.node.context)));
      }
    }
    return this.metadata.get(key);
  }
  has(key) {
    return this.node.logicNode.logic.hasMetadata(key);
  }
}

const FIELD_PROXY_HANDLER = {
  get(getTgt, p, receiver) {
    const tgt = getTgt();
    const child = tgt.structure.getChild(p);
    if (child !== undefined) {
      return child.fieldProxy;
    }
    const value = untracked(tgt.value);
    if (isArray(value)) {
      if (p === 'length') {
        return tgt.value().length;
      }
      if (p === Symbol.iterator) {
        return () => {
          tgt.value();
          return Array.prototype[Symbol.iterator].apply(tgt.fieldProxy);
        };
      }
    }
    if (isObject(value)) {
      if (p === Symbol.iterator) {
        return function* () {
          for (const key in receiver) {
            yield [key, receiver[key]];
          }
        };
      }
    }
    return undefined;
  },
  getOwnPropertyDescriptor(getTgt, prop) {
    const value = untracked(getTgt().value);
    const desc = Reflect.getOwnPropertyDescriptor(value, prop);
    if (desc && !desc.configurable) {
      desc.configurable = true;
    }
    return desc;
  },
  ownKeys(getTgt) {
    const value = untracked(getTgt().value);
    return typeof value === 'object' && value !== null ? Reflect.ownKeys(value) : [];
  }
};

function deepSignal(source, prop) {
  const read = computed(() => source()[prop()]);
  read[SIGNAL] = source[SIGNAL];
  read.set = value => {
    source.update(current => valueForWrite(current, value, prop()));
  };
  read.update = fn => {
    read.set(fn(untracked(read)));
  };
  read.asReadonly = () => read;
  return read;
}
function valueForWrite(sourceValue, newPropValue, prop) {
  if (isArray(sourceValue)) {
    const newValue = [...sourceValue];
    newValue[prop] = newPropValue;
    return newValue;
  } else {
    return {
      ...sourceValue,
      [prop]: newPropValue
    };
  }
}

class FieldNodeStructure {
  logic;
  node;
  createChildNode;
  identitySymbol = Symbol();
  _injector = undefined;
  get injector() {
    this._injector ??= Injector.create({
      providers: [],
      parent: this.fieldManager.injector
    });
    return this._injector;
  }
  constructor(logic, node, createChildNode) {
    this.logic = logic;
    this.node = node;
    this.createChildNode = createChildNode;
  }
  children() {
    const map = this.childrenMap();
    if (map === undefined) {
      return [];
    }
    return Array.from(map.byPropertyKey.values()).map(child => untracked(child.reader));
  }
  getChild(key) {
    const strKey = key.toString();
    let reader = untracked(this.childrenMap)?.byPropertyKey.get(strKey)?.reader;
    if (!reader) {
      reader = this.createReader(strKey);
    }
    return reader();
  }
  reduceChildren(initialValue, fn, shortCircuit) {
    const map = this.childrenMap();
    if (!map) {
      return initialValue;
    }
    let value = initialValue;
    for (const child of map.byPropertyKey.values()) {
      if (shortCircuit?.(value)) {
        break;
      }
      value = fn(untracked(child.reader), value);
    }
    return value;
  }
  destroy() {
    this.injector.destroy();
  }
  createKeyInParent(options, identityInParent, initialKeyInParent) {
    if (options.kind === 'root') {
      return ROOT_KEY_IN_PARENT;
    }
    if (identityInParent === undefined) {
      const key = initialKeyInParent;
      return computed(() => {
        if (this.parent.structure.getChild(key) !== this.node) {
          throw new _RuntimeError(1902, ngDevMode && `Orphan field, looking for property '${key}' of ${getDebugName(this.parent)}`);
        }
        return key;
      });
    } else {
      let lastKnownKey = initialKeyInParent;
      return computed(() => {
        const parentValue = this.parent.structure.value();
        if (!isArray(parentValue)) {
          throw new _RuntimeError(1903, ngDevMode && `Orphan field, expected ${getDebugName(this.parent)} to be an array`);
        }
        const data = parentValue[lastKnownKey];
        if (isObject(data) && data.hasOwnProperty(this.parent.structure.identitySymbol) && data[this.parent.structure.identitySymbol] === identityInParent) {
          return lastKnownKey;
        }
        for (let i = 0; i < parentValue.length; i++) {
          const data = parentValue[i];
          if (isObject(data) && data.hasOwnProperty(this.parent.structure.identitySymbol) && data[this.parent.structure.identitySymbol] === identityInParent) {
            return lastKnownKey = i.toString();
          }
        }
        throw new _RuntimeError(1904, ngDevMode && `Orphan field, can't find element in array ${getDebugName(this.parent)}`);
      });
    }
  }
  createChildrenMap() {
    return linkedSignal({
      source: this.value,
      computation: (value, previous) => {
        if (!isObject(value)) {
          return undefined;
        }
        const prevData = previous?.value ?? {
          byPropertyKey: new Map()
        };
        let data;
        const parentIsArray = isArray(value);
        if (prevData !== undefined) {
          if (parentIsArray) {
            data = maybeRemoveStaleArrayFields(prevData, value, this.identitySymbol);
          } else {
            data = maybeRemoveStaleObjectFields(prevData, value);
          }
        }
        for (const key of Object.keys(value)) {
          let trackingKey = undefined;
          const childValue = value[key];
          if (childValue === undefined) {
            if (prevData.byPropertyKey.has(key)) {
              data ??= {
                ...prevData
              };
              data.byPropertyKey.delete(key);
            }
            continue;
          }
          if (parentIsArray && isObject(childValue) && !isArray(childValue)) {
            trackingKey = childValue[this.identitySymbol] ??= Symbol(ngDevMode ? `id:${globalId++}` : '');
          }
          let childNode;
          if (trackingKey) {
            if (!prevData.byTrackingKey?.has(trackingKey)) {
              data ??= {
                ...prevData
              };
              data.byTrackingKey ??= new Map();
              data.byTrackingKey.set(trackingKey, this.createChildNode(key, trackingKey, parentIsArray));
            }
            childNode = (data ?? prevData).byTrackingKey.get(trackingKey);
          }
          const child = prevData.byPropertyKey.get(key);
          if (child === undefined) {
            data ??= {
              ...prevData
            };
            data.byPropertyKey.set(key, {
              reader: this.createReader(key),
              node: childNode ?? this.createChildNode(key, trackingKey, parentIsArray)
            });
          } else if (childNode && childNode !== child.node) {
            data ??= {
              ...prevData
            };
            child.node = childNode;
          }
        }
        return data ?? prevData;
      }
    });
  }
  createReader(key) {
    return computed(() => this.childrenMap()?.byPropertyKey.get(key)?.node);
  }
}
class RootFieldNodeStructure extends FieldNodeStructure {
  fieldManager;
  value;
  get parent() {
    return undefined;
  }
  get root() {
    return this.node;
  }
  get pathKeys() {
    return ROOT_PATH_KEYS;
  }
  get keyInParent() {
    return ROOT_KEY_IN_PARENT;
  }
  childrenMap;
  constructor(node, logic, fieldManager, value, createChildNode) {
    super(logic, node, createChildNode);
    this.fieldManager = fieldManager;
    this.value = value;
    this.childrenMap = this.createChildrenMap();
  }
}
class ChildFieldNodeStructure extends FieldNodeStructure {
  logic;
  parent;
  root;
  pathKeys;
  keyInParent;
  value;
  childrenMap;
  get fieldManager() {
    return this.root.structure.fieldManager;
  }
  constructor(node, logic, parent, identityInParent, initialKeyInParent, createChildNode) {
    super(logic, node, createChildNode);
    this.logic = logic;
    this.parent = parent;
    this.root = this.parent.structure.root;
    this.keyInParent = this.createKeyInParent({
      kind: 'child',
      parent,
      pathNode: undefined,
      logic,
      initialKeyInParent,
      identityInParent,
      fieldAdapter: undefined
    }, identityInParent, initialKeyInParent);
    this.pathKeys = computed(() => [...parent.structure.pathKeys(), this.keyInParent()], ...(ngDevMode ? [{
      debugName: "pathKeys"
    }] : []));
    this.value = deepSignal(this.parent.structure.value, this.keyInParent);
    this.childrenMap = this.createChildrenMap();
    this.fieldManager.structures.add(this);
  }
}
let globalId = 0;
const ROOT_PATH_KEYS = computed(() => [], ...(ngDevMode ? [{
  debugName: "ROOT_PATH_KEYS"
}] : []));
const ROOT_KEY_IN_PARENT = computed(() => {
  throw new _RuntimeError(1905, ngDevMode && 'The top-level field in the form has no parent.');
}, ...(ngDevMode ? [{
  debugName: "ROOT_KEY_IN_PARENT"
}] : []));
function getDebugName(node) {
  return `<root>.${node.structure.pathKeys().join('.')}`;
}
function maybeRemoveStaleArrayFields(prevData, value, identitySymbol) {
  let data;
  const oldKeys = new Set(prevData.byPropertyKey.keys());
  const oldTracking = new Set(prevData.byTrackingKey?.keys());
  for (let i = 0; i < value.length; i++) {
    const childValue = value[i];
    oldKeys.delete(i.toString());
    if (isObject(childValue) && childValue.hasOwnProperty(identitySymbol)) {
      oldTracking.delete(childValue[identitySymbol]);
    }
  }
  if (oldKeys.size > 0) {
    data ??= {
      ...prevData
    };
    for (const key of oldKeys) {
      data.byPropertyKey.delete(key);
    }
  }
  if (oldTracking.size > 0) {
    data ??= {
      ...prevData
    };
    for (const id of oldTracking) {
      data.byTrackingKey?.delete(id);
    }
  }
  return data;
}
function maybeRemoveStaleObjectFields(prevData, value) {
  let data;
  for (const key of prevData.byPropertyKey.keys()) {
    if (!value.hasOwnProperty(key)) {
      data ??= {
        ...prevData
      };
      data.byPropertyKey.delete(key);
    }
  }
  return data;
}

class FieldSubmitState {
  node;
  selfSubmitting = signal(false, ...(ngDevMode ? [{
    debugName: "selfSubmitting"
  }] : []));
  serverErrors;
  constructor(node) {
    this.node = node;
    this.serverErrors = linkedSignal({
      ...(ngDevMode ? {
        debugName: "serverErrors"
      } : {}),
      source: this.node.structure.value,
      computation: () => []
    });
  }
  submitting = computed(() => {
    return this.selfSubmitting() || (this.node.structure.parent?.submitting() ?? false);
  }, ...(ngDevMode ? [{
    debugName: "submitting"
  }] : []));
}

class FieldNode {
  structure;
  validationState;
  metadataState;
  nodeState;
  submitState;
  fieldAdapter;
  _context = undefined;
  get context() {
    return this._context ??= new FieldNodeContext(this);
  }
  fieldProxy = new Proxy(() => this, FIELD_PROXY_HANDLER);
  pathNode;
  constructor(options) {
    this.pathNode = options.pathNode;
    this.fieldAdapter = options.fieldAdapter;
    this.structure = this.fieldAdapter.createStructure(this, options);
    this.validationState = this.fieldAdapter.createValidationState(this, options);
    this.nodeState = this.fieldAdapter.createNodeState(this, options);
    this.metadataState = new FieldMetadataState(this);
    this.submitState = new FieldSubmitState(this);
  }
  pendingSync = linkedSignal({
    ...(ngDevMode ? {
      debugName: "pendingSync"
    } : {}),
    source: () => this.value(),
    computation: (_source, previous) => {
      previous?.value?.abort();
      return undefined;
    }
  });
  get logicNode() {
    return this.structure.logic;
  }
  get value() {
    return this.structure.value;
  }
  _controlValue = linkedSignal(() => this.value(), ...(ngDevMode ? [{
    debugName: "_controlValue"
  }] : []));
  get controlValue() {
    return this._controlValue.asReadonly();
  }
  get keyInParent() {
    return this.structure.keyInParent;
  }
  get errors() {
    return this.validationState.errors;
  }
  get errorSummary() {
    return this.validationState.errorSummary;
  }
  get pending() {
    return this.validationState.pending;
  }
  get valid() {
    return this.validationState.valid;
  }
  get invalid() {
    return this.validationState.invalid;
  }
  get dirty() {
    return this.nodeState.dirty;
  }
  get touched() {
    return this.nodeState.touched;
  }
  get disabled() {
    return this.nodeState.disabled;
  }
  get disabledReasons() {
    return this.nodeState.disabledReasons;
  }
  get hidden() {
    return this.nodeState.hidden;
  }
  get readonly() {
    return this.nodeState.readonly;
  }
  get fieldBindings() {
    return this.nodeState.fieldBindings;
  }
  get submitting() {
    return this.submitState.submitting;
  }
  get name() {
    return this.nodeState.name;
  }
  get max() {
    return this.metadata(MAX);
  }
  get maxLength() {
    return this.metadata(MAX_LENGTH);
  }
  get min() {
    return this.metadata(MIN);
  }
  get minLength() {
    return this.metadata(MIN_LENGTH);
  }
  get pattern() {
    return this.metadata(PATTERN) ?? EMPTY;
  }
  get required() {
    return this.metadata(REQUIRED) ?? FALSE;
  }
  metadata(key) {
    return this.metadataState.get(key);
  }
  hasMetadata(key) {
    return this.metadataState.has(key);
  }
  markAsTouched() {
    this.nodeState.markAsTouched();
    this.pendingSync()?.abort();
    this.sync();
  }
  markAsDirty() {
    this.nodeState.markAsDirty();
  }
  reset(value) {
    untracked(() => this._reset(value));
  }
  _reset(value) {
    if (value !== undefined) {
      this.value.set(value);
    }
    this.nodeState.markAsUntouched();
    this.nodeState.markAsPristine();
    for (const child of this.structure.children()) {
      child._reset();
    }
  }
  setControlValue(newValue) {
    this._controlValue.set(newValue);
    this.markAsDirty();
    this.debounceSync();
  }
  sync() {
    this.value.set(this.controlValue());
  }
  async debounceSync() {
    this.pendingSync()?.abort();
    const debouncer = this.nodeState.debouncer();
    if (debouncer) {
      const controller = new AbortController();
      const promise = debouncer(controller.signal);
      if (promise) {
        this.pendingSync.set(controller);
        await promise;
        if (controller.signal.aborted) {
          return;
        }
      }
    }
    this.sync();
  }
  static newRoot(fieldManager, value, pathNode, adapter) {
    return adapter.newRoot(fieldManager, value, pathNode, adapter);
  }
  createStructure(options) {
    return options.kind === 'root' ? new RootFieldNodeStructure(this, options.logic, options.fieldManager, options.value, this.newChild.bind(this)) : new ChildFieldNodeStructure(this, options.logic, options.parent, options.identityInParent, options.initialKeyInParent, this.newChild.bind(this));
  }
  newChild(key, trackingId, isArray) {
    let childPath;
    let childLogic;
    if (isArray) {
      childPath = this.pathNode.getChild(DYNAMIC);
      childLogic = this.structure.logic.getChild(DYNAMIC);
    } else {
      childPath = this.pathNode.getChild(key);
      childLogic = this.structure.logic.getChild(key);
    }
    return this.fieldAdapter.newChild({
      kind: 'child',
      parent: this,
      pathNode: childPath,
      logic: childLogic,
      initialKeyInParent: key,
      identityInParent: trackingId,
      fieldAdapter: this.fieldAdapter
    });
  }
}
const EMPTY = computed(() => [], ...(ngDevMode ? [{
  debugName: "EMPTY"
}] : []));
const FALSE = computed(() => false, ...(ngDevMode ? [{
  debugName: "FALSE"
}] : []));

class FieldNodeState {
  node;
  selfTouched = signal(false, ...(ngDevMode ? [{
    debugName: "selfTouched"
  }] : []));
  selfDirty = signal(false, ...(ngDevMode ? [{
    debugName: "selfDirty"
  }] : []));
  markAsTouched() {
    this.selfTouched.set(true);
  }
  markAsDirty() {
    this.selfDirty.set(true);
  }
  markAsPristine() {
    this.selfDirty.set(false);
  }
  markAsUntouched() {
    this.selfTouched.set(false);
  }
  fieldBindings = signal([], ...(ngDevMode ? [{
    debugName: "fieldBindings"
  }] : []));
  constructor(node) {
    this.node = node;
  }
  dirty = computed(() => {
    const selfDirtyValue = this.selfDirty() && !this.isNonInteractive();
    return this.node.structure.reduceChildren(selfDirtyValue, (child, value) => value || child.nodeState.dirty(), shortCircuitTrue);
  }, ...(ngDevMode ? [{
    debugName: "dirty"
  }] : []));
  touched = computed(() => {
    const selfTouchedValue = this.selfTouched() && !this.isNonInteractive();
    return this.node.structure.reduceChildren(selfTouchedValue, (child, value) => value || child.nodeState.touched(), shortCircuitTrue);
  }, ...(ngDevMode ? [{
    debugName: "touched"
  }] : []));
  disabledReasons = computed(() => [...(this.node.structure.parent?.nodeState.disabledReasons() ?? []), ...this.node.logicNode.logic.disabledReasons.compute(this.node.context)], ...(ngDevMode ? [{
    debugName: "disabledReasons"
  }] : []));
  disabled = computed(() => !!this.disabledReasons().length, ...(ngDevMode ? [{
    debugName: "disabled"
  }] : []));
  readonly = computed(() => (this.node.structure.parent?.nodeState.readonly() || this.node.logicNode.logic.readonly.compute(this.node.context)) ?? false, ...(ngDevMode ? [{
    debugName: "readonly"
  }] : []));
  hidden = computed(() => (this.node.structure.parent?.nodeState.hidden() || this.node.logicNode.logic.hidden.compute(this.node.context)) ?? false, ...(ngDevMode ? [{
    debugName: "hidden"
  }] : []));
  name = computed(() => {
    const parent = this.node.structure.parent;
    if (!parent) {
      return this.node.structure.fieldManager.rootName;
    }
    return `${parent.name()}.${this.node.structure.keyInParent()}`;
  }, ...(ngDevMode ? [{
    debugName: "name"
  }] : []));
  debouncer = computed(() => {
    if (this.node.logicNode.logic.hasMetadata(DEBOUNCER)) {
      const debouncerLogic = this.node.logicNode.logic.getMetadata(DEBOUNCER);
      const debouncer = debouncerLogic.compute(this.node.context);
      if (debouncer) {
        return signal => debouncer(this.node.context, signal);
      }
    }
    return this.node.structure.parent?.nodeState.debouncer?.();
  }, ...(ngDevMode ? [{
    debugName: "debouncer"
  }] : []));
  isNonInteractive = computed(() => this.hidden() || this.disabled() || this.readonly(), ...(ngDevMode ? [{
    debugName: "isNonInteractive"
  }] : []));
}

class BasicFieldAdapter {
  newRoot(fieldManager, value, pathNode, adapter) {
    return new FieldNode({
      kind: 'root',
      fieldManager,
      value,
      pathNode,
      logic: pathNode.builder.build(),
      fieldAdapter: adapter
    });
  }
  newChild(options) {
    return new FieldNode(options);
  }
  createNodeState(node) {
    return new FieldNodeState(node);
  }
  createValidationState(node) {
    return new FieldValidationState(node);
  }
  createStructure(node, options) {
    return node.createStructure(options);
  }
}

class FormFieldManager {
  injector;
  rootName;
  constructor(injector, rootName) {
    this.injector = injector;
    this.rootName = rootName ?? `${this.injector.get(APP_ID)}.form${nextFormId++}`;
  }
  structures = new Set();
  createFieldManagementEffect(root) {
    effect(() => {
      const liveStructures = new Set();
      this.markStructuresLive(root, liveStructures);
      for (const structure of this.structures) {
        if (!liveStructures.has(structure)) {
          this.structures.delete(structure);
          untracked(() => structure.destroy());
        }
      }
    }, {
      injector: this.injector
    });
  }
  markStructuresLive(structure, liveStructures) {
    liveStructures.add(structure);
    for (const child of structure.children()) {
      this.markStructuresLive(child.structure, liveStructures);
    }
  }
}
let nextFormId = 0;

function normalizeFormArgs(args) {
  let model;
  let schema;
  let options;
  if (args.length === 3) {
    [model, schema, options] = args;
  } else if (args.length === 2) {
    if (isSchemaOrSchemaFn(args[1])) {
      [model, schema] = args;
    } else {
      [model, options] = args;
    }
  } else {
    [model] = args;
  }
  return [model, schema, options];
}

function form(...args) {
  const [model, schema, options] = normalizeFormArgs(args);
  const injector = options?.injector ?? inject(Injector);
  const pathNode = runInInjectionContext(injector, () => SchemaImpl.rootCompile(schema));
  const fieldManager = new FormFieldManager(injector, options?.name);
  const adapter = options?.adapter ?? new BasicFieldAdapter();
  const fieldRoot = FieldNode.newRoot(fieldManager, model, pathNode, adapter);
  fieldManager.createFieldManagementEffect(fieldRoot.structure);
  return fieldRoot.fieldProxy;
}
function applyEach(path, schema) {
  assertPathIsCurrent(path);
  const elementPath = FieldPathNode.unwrapFieldPath(path).getChild(DYNAMIC).fieldPathProxy;
  apply(elementPath, schema);
}
function apply(path, schema) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.mergeIn(SchemaImpl.create(schema));
}
function applyWhen(path, logic, schema) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.mergeIn(SchemaImpl.create(schema), {
    fn: logic,
    path
  });
}
function applyWhenValue(path, predicate, schema) {
  applyWhen(path, ({
    value
  }) => predicate(value()), schema);
}
async function submit(form, action) {
  const node = form();
  markAllAsTouched(node);
  if (node.invalid()) {
    return;
  }
  node.submitState.selfSubmitting.set(true);
  try {
    const errors = await action(form);
    errors && setServerErrors(node, errors);
  } finally {
    node.submitState.selfSubmitting.set(false);
  }
}
function setServerErrors(submittedField, errors) {
  if (!isArray(errors)) {
    errors = [errors];
  }
  const errorsByField = new Map();
  for (const error of errors) {
    const errorWithField = addDefaultField(error, submittedField.fieldProxy);
    const field = errorWithField.fieldTree();
    let fieldErrors = errorsByField.get(field);
    if (!fieldErrors) {
      fieldErrors = [];
      errorsByField.set(field, fieldErrors);
    }
    fieldErrors.push(errorWithField);
  }
  for (const [field, fieldErrors] of errorsByField) {
    field.submitState.serverErrors.set(fieldErrors);
  }
}
function schema(fn) {
  return SchemaImpl.create(fn);
}
function markAllAsTouched(node) {
  node.markAsTouched();
  for (const child of node.structure.children()) {
    markAllAsTouched(child);
  }
}

export { BasicFieldAdapter, DEBOUNCER, FieldNode, FieldNodeState, FieldNodeStructure, FieldPathNode, MAX, MAX_LENGTH, MIN, MIN_LENGTH, MetadataKey, MetadataReducer, PATTERN, REQUIRED, addDefaultField, apply, applyEach, applyWhen, applyWhenValue, assertPathIsCurrent, calculateValidationSelfStatus, createManagedMetadataKey, createMetadataKey, form, getInjectorFromOptions, isArray, metadata, normalizeFormArgs, schema, submit };
//# sourceMappingURL=_structure-chunk.mjs.map
