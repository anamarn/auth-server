import { JSONObject } from 'src/types/json-object.type';
import { normalizeJSON } from '../utils/normalize-json.util';

describe('normalizeJSON', () => {
  it('should return the same object if it is already normalized', () => {
    const input = { a: 1, b: 2, c: 3 };
    const result = normalizeJSON(input);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should sort the keys of an object', () => {
    const input = { c: 3, a: 1, b: 2 };
    const result = normalizeJSON(input);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should recursively normalize nested objects', () => {
    const input = { c: { b: 2, a: 1 }, a: 1, b: 2 };
    const result = normalizeJSON(input);
    expect(result).toEqual({ a: 1, b: 2, c: { a: 1, b: 2 } });
  });

  it('should handle properties arrays by normalizing each element', () => {
    const input = {
      data: [
        { c: 3, a: 1, b: 2 },
        { b: 2, a: 1 },
      ],
    };
    const result = normalizeJSON(input as JSONObject);
    expect(result).toEqual({
      data: [
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2 },
      ],
    });
  });

  it('should handle empty objects and arrays', () => {
    expect(normalizeJSON({})).toEqual({});
  });
});
