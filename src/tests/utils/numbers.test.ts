import { parseNumber } from '@/utils/numbers';
import { describe, expect, test } from 'vitest';

describe('Numbers', () => {
  test('An empty string should be parsed as undefined', () => {
    expect(parseNumber('')).toBe(undefined);
  });
  test('A string should be parsed as undefined', () => {
    expect(parseNumber('some string')).toBe(undefined);
  });
  test('A float number should be parsed as float', () => {
    expect(parseNumber('1.443')).toBe(1.443);
  });
  test('A integer number should be parsed as integer', () => {
    expect(parseNumber('321')).toBe(321);
  });
});
