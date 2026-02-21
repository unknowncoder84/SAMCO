/**
 * Basic setup test to verify the testing environment
 */
import { describe, it, expect } from 'vitest';

describe('Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should have access to testing utilities', () => {
    expect(typeof describe).toBe('function');
    expect(typeof it).toBe('function');
    expect(typeof expect).toBe('function');
  });
});
