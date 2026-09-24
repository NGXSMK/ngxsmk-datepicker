/**
 * Services entry point
 *
 * Internal services used by the datepicker component.
 * These are exported for advanced use cases and testing.
 *
 * @example
 * ```typescript
 * import { ValueManagementService } from 'ngxsmk-datepicker/services';
 * ```
 *
 * Note: Day Selection lives on the Datepicker Host today. A future Selection module will
 * replace the unused `DateSelectionService` prototype (no longer re-exported from this entry).
 */

export { ValueManagementService } from './lib/services/value-management.service';
export { KeyboardNavigationService } from './lib/services/keyboard-navigation.service';
export { TouchGestureHandlerService } from './lib/services/touch-gesture-handler.service';
export { FieldSyncService } from './lib/services/field-sync.service';

export type {
  KeyboardNavigationState,
  KeyboardNavigationCallbacks,
  KeyboardNavigationConfig,
} from './lib/services/keyboard-navigation.service';

export type {
  TouchGestureState,
  TouchGestureConfig,
  TouchGestureCallbacks,
} from './lib/services/touch-gesture-handler.service';

export type { SignalFormField, FieldSyncCallbacks } from './lib/services/field-sync.service';
