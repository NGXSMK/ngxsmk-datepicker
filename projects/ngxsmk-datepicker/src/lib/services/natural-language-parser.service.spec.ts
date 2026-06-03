import { TestBed } from '@angular/core/testing';
import { NaturalLanguageParserService } from './natural-language-parser.service';

describe('NaturalLanguageParserService', () => {
  let service: NaturalLanguageParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NaturalLanguageParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse "today"', () => {
    const res = service.parse('today');
    expect(res).toBeInstanceOf(Date);
    const today = new Date();
    expect((res as Date).getDate()).toBe(today.getDate());
    expect((res as Date).getMonth()).toBe(today.getMonth());
    expect((res as Date).getFullYear()).toBe(today.getFullYear());
  });

  it('should parse "tomorrow"', () => {
    const res = service.parse('tomorrow');
    expect(res).toBeInstanceOf(Date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect((res as Date).getDate()).toBe(tomorrow.getDate());
  });

  it('should parse relative days "in 3 days"', () => {
    const res = service.parse('in 3 days');
    expect(res).toBeInstanceOf(Date);
    const expected = new Date();
    expected.setDate(expected.getDate() + 3);
    expect((res as Date).getDate()).toBe(expected.getDate());
  });

  it('should parse relative weeks "2 weeks ago"', () => {
    const res = service.parse('2 weeks ago');
    expect(res).toBeInstanceOf(Date);
    const expected = new Date();
    expected.setDate(expected.getDate() - 14);
    expect((res as Date).getDate()).toBe(expected.getDate());
  });

  it('should parse quarter codes "q3 2026"', () => {
    const res = service.parse('q3 2026') as { start: Date; end: Date };
    expect(res).toBeDefined();
    expect(res.start.getFullYear()).toBe(2026);
    expect(res.start.getMonth()).toBe(6); // July
    expect(res.end.getFullYear()).toBe(2026);
    expect(res.end.getMonth()).toBe(8); // September
  });

  it('should return null for invalid expressions', () => {
    expect(service.parse('something random')).toBeNull();
  });
});
