import expect from 'expect-legacy';
import camelCase from '../src/utils/camelCase';

describe('camelCase', () => {
  it('camel-cases a conventional action type', () => {
    expect(camelCase('MY_ACTION')).toBe('myAction');
  });

  it('includes forward slashes in words', () => {
    expect(camelCase('NAMESPACE/MY_ACTION')).toBe('namespace/myAction');
  });

  it('does nothing to an already camel-cased action type', () => {
    expect(camelCase('myAction')).toBe('myAction');
  });
});
