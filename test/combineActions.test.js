import expect from 'expect-legacy';
import combineActions from '../src/combineActions';
import createActions from '../src/createActions';

describe('combineActions', () => {
  it('throws an error if any action is not a function or string', () => {
    expect(() => combineActions(1, 'action2')).toThrow(
      'Expected action types to be strings, symbols, or action creators'
    );
    expect(() => combineActions('action1', () => {}, null)).toThrow(
      'Expected action types to be strings, symbols, or action creators'
    );
  });

  it('accepts action creators and action type strings', () => {
    const { action1, action2 } = createActions('action1', 'action2');

    expect(() => combineActions('action1', 'action2')).toNotThrow();
    expect(() => combineActions(action1, action2)).toNotThrow();
    expect(() => combineActions(action1, action2, 'action3')).toNotThrow();
  });

  it('returns a stringifiable object', () => {
    const { action1, action2 } = createActions('action1', 'action2');

    expect(combineActions('action1', 'action2').toString()).toBe(
      'action1||action2'
    );
    expect(combineActions(action1, action2).toString()).toBe(
      'action1||action2'
    );
    expect(combineActions(action1, action2, 'action3').toString()).toBe(
      'action1||action2||action3'
    );
  });
});
