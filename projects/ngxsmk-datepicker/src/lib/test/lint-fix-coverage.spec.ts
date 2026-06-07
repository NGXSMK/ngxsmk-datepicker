import { Type } from '@angular/core';
import { NgxsmkDatepickerComponent } from '../ngxsmk-datepicker';

describe('NgxsmkDatepickerComponent Coverage Boost', () => {
  it('should patch metadata providers arrays', () => {
    const patchMetadataArrays = (NgxsmkDatepickerComponent as unknown as {
      _patchMetadataArrays: (
        target: Type<unknown> & Record<string, unknown>,
        token: unknown,
        provider: unknown
      ) => void;
    })._patchMetadataArrays;
    const target = {
      decorators: [{ args: [{ providers: [] as unknown[] }] }],
    } as unknown as Type<unknown> & Record<string, unknown>;
    patchMetadataArrays(target, 'TOKEN', 'PROVIDER');
    const decorators = target['decorators'] as Array<{ args?: Array<{ providers?: unknown[] }> }>;
    expect(decorators[0]?.args?.[0]?.providers).toContain('PROVIDER');
  });

  it('should handle material support static call on metadata-only mock', () => {
    class MockComp {
      static decorators: unknown[] = [{ args: [{ providers: [] as unknown[] }] }];
    }
    const token = { toString: () => 'MatFormFieldControl' };
    expect(() =>
      NgxsmkDatepickerComponent.withMaterialSupport(
        token,
        MockComp as unknown as Type<unknown> & Record<string, unknown>
      )
    ).not.toThrow();
    const decorators = MockComp.decorators as Array<{ args?: Array<{ providers?: unknown[] }> }>;
    expect(decorators[0]?.args?.[0]?.providers?.length).toBeGreaterThan(0);
  });

  it('should detect environment-specific features gracefully', () => {
    // Check if private method doesn't crash
    const comp = Object.create(NgxsmkDatepickerComponent.prototype) as Record<string, unknown>;
    comp['touchService'] = { handleDateCellTouchStart: () => {} }; // Mock touchService if needed
    expect(() => (comp['isIonicEnvironment'] as () => boolean)()).not.toThrow();
  });
});
