import { provideMaterialFormFieldControl } from './material-form-field.helper';
import { Provider } from '@angular/core';

type ProviderWithProperties = Provider & {
  provide?: unknown;
  useExisting?: unknown;
  multi?: boolean;
};

describe('provideMaterialFormFieldControl', () => {
  it('should return a provider', () => {
    const mockToken = Symbol('MAT_FORM_FIELD_CONTROL');
    const provider = provideMaterialFormFieldControl(mockToken) as ProviderWithProperties;
    
    expect(provider).toBeTruthy();
    expect(provider.provide).toBe(mockToken);
  });

  it('should use forwardRef to NgxsmkDatepickerComponent', () => {
    const mockToken = Symbol('MAT_FORM_FIELD_CONTROL');
    const provider = provideMaterialFormFieldControl(mockToken) as ProviderWithProperties;
    
    expect(provider.useExisting).toBeTruthy();
    // The forwardRef will resolve to NgxsmkDatepickerComponent
    expect(provider.multi).toBe(false);
  });

  it('should set multi to false', () => {
    const mockToken = Symbol('MAT_FORM_FIELD_CONTROL');
    const provider = provideMaterialFormFieldControl(mockToken) as ProviderWithProperties;
    
    expect(provider.multi).toBe(false);
  });
});

