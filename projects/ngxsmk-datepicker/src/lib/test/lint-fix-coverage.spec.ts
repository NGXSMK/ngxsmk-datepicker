import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

describe('NgxsmkDatepickerComponent Coverage Boost', () => {
  it('should patch metadata providers arrays', () => {
    const patchMetadataArrays = (NgxsmkDatepickerComponent as any)._patchMetadataArrays;
    const target: any = {
      decorators: [{ args: [{ providers: [] }] }],
    };
    patchMetadataArrays(target, 'TOKEN', 'PROVIDER');
    expect(target.decorators[0].args[0].providers).toContain('PROVIDER');
  });

  it('should handle material support static call on metadata-only mock', () => {
    class MockComp {
      static decorators: any[] = [{ args: [{ providers: [] }] }];
    }
    const token = { toString: () => 'MatFormFieldControl' };
    expect(() => NgxsmkDatepickerComponent.withMaterialSupport(token, MockComp)).not.toThrow();
    expect((MockComp.decorators[0].args[0].providers as any[]).length).toBeGreaterThan(0);
  });

  it('should detect environment-specific features gracefully', () => {
    // Check if private method doesn't crash
    const comp = Object.create(NgxsmkDatepickerComponent.prototype);
    (comp as any).touchService = { handleDateCellTouchStart: () => {} }; // Mock touchService if needed
    expect(() => (comp as any).isIonicEnvironment()).not.toThrow();
  });
});
