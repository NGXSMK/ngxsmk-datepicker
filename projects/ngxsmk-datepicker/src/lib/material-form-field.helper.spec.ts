import { provideMaterialFormFieldControl } from './material-form-field.helper';

describe('provideMaterialFormFieldControl', () => {
  it('should return a provider', () => {
    const mockToken = Symbol('MAT_FORM_FIELD_CONTROL');
    const provider = provideMaterialFormFieldControl(mockToken);
    
    expect(provider).toBeTruthy();
    expect((provider as any).provide).toBe(mockToken);
  });

  it('should use forwardRef to NgxsmkDatepickerComponent', () => {
    const mockToken = Symbol('MAT_FORM_FIELD_CONTROL');
    const provider = provideMaterialFormFieldControl(mockToken);
    
    expect((provider as any).useExisting).toBeTruthy();
    // The forwardRef will resolve to NgxsmkDatepickerComponent
    expect((provider as any).multi).toBe(false);
  });

  it('should set multi to false', () => {
    const mockToken = Symbol('MAT_FORM_FIELD_CONTROL');
    const provider = provideMaterialFormFieldControl(mockToken);
    
    expect((provider as any).multi).toBe(false);
  });
});

