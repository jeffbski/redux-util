import expect from 'expect-legacy';
import handleAction from '../src/handleAction';
import createAction from '../src/createAction';
import createActions from '../src/createActions';

const type = 'TYPE';
const prevState = { counter: 3 };
const defaultState = { counter: 0 };

describe('handleAction', () => {
  it('throws an error if the reducer is the wrong type', () => {
    const wrongTypeReducers = [1, 'string', [], null];

    wrongTypeReducers.forEach(wrongTypeReducer => {
      expect(() => {
        handleAction(type, wrongTypeReducer, defaultState);
      }).toThrow(
        'Expected reducer to be a function or object with next and throw reducers'
      );
    });
  });

  it('uses the identity if the specified reducer is undefined', () => {
    const reducer = handleAction(type, undefined, defaultState);

    expect(reducer(prevState, { type })).toBe(prevState);
    expect(
      reducer(prevState, { type, error: true, payload: new Error() })
    ).toBe(prevState);
  });

  it('single handler form - throw an error if defaultState is not specified', () => {
    expect(() => {
      handleAction(type, undefined);
    }).toThrow('defaultState for reducer handling TYPE should be defined');
  });

  it('single handler form - resulting reducer - returns previous state if type does not match', () => {
    const reducer = handleAction('NOTTYPE', () => null, defaultState);
    expect(reducer(prevState, { type })).toBe(prevState);
  });

  it('single handler form - resulting reducer - returns default state if type does not match', () => {
    const reducer = handleAction('NOTTYPE', () => null, { counter: 7 });
    expect(reducer(undefined, { type })).toEqual({
      counter: 7
    });
  });

  it('single handler form - resulting reducer - accepts single function as handler', () => {
    const reducer = handleAction(
      type,
      (state, action) => ({
        counter: state.counter + action.payload
      }),
      defaultState
    );
    expect(reducer(prevState, { type, payload: 7 })).toEqual({
      counter: 10
    });
  });

  it('single handler form - resulting reducer - accepts action function as action type', () => {
    const incrementAction = createAction(type);
    const reducer = handleAction(
      incrementAction,
      (state, action) => ({
        counter: state.counter + action.payload
      }),
      defaultState
    );

    expect(reducer(prevState, incrementAction(7))).toEqual({
      counter: 10
    });
  });

  it('single handler form - resulting reducer - accepts a default state used when the previous state is undefined', () => {
    const reducer = handleAction(
      type,
      (state, action) => ({
        counter: state.counter + action.payload
      }),
      { counter: 3 }
    );

    expect(reducer(undefined, { type, payload: 7 })).toEqual({
      counter: 10
    });
  });

  it('single handler form - resulting reducer - works with createActions action creators', () => {
    const { increment } = createActions('increment');

    const reducer = handleAction(
      increment,
      (state, { payload }) => ({
        counter: state.counter + payload
      }),
      defaultState
    );

    expect(reducer(undefined, increment(7))).toEqual({
      counter: 7
    });
  });

  it('single handler form - resulting reducer - not throws and returns state when action is non-FSA', () => {
    const reducer = handleAction(type, state => state, defaultState);
    const action = {
      foo: {
        bar: 'baz'
      }
    };

    expect(() => reducer(undefined, action)).toNotThrow();
    expect(reducer(undefined, action)).toEqual({
      counter: 0
    });
  });

  it('map of handlers form - throws an error if defaultState is not specified', () => {
    expect(() => {
      handleAction(type, { next: () => null });
    }).toThrow('defaultState for reducer handling TYPE should be defined');
  });

  it('map of handlers form - resulting reducer - returns previous state if type does not match', () => {
    const reducer = handleAction('NOTTYPE', { next: () => null }, defaultState);
    expect(reducer(prevState, { type })).toBe(prevState);
  });

  it('map of handlers form - resulting reducer - uses `next()` if action does not represent an error', () => {
    const reducer = handleAction(
      type,
      {
        next: (state, action) => ({
          counter: state.counter + action.payload
        })
      },
      defaultState
    );
    expect(reducer(prevState, { type, payload: 7 })).toEqual({
      counter: 10
    });
  });

  it('map of handlers form - resulting reducer - uses `throw()` if action represents an error', () => {
    const reducer = handleAction(
      type,
      {
        throw: (state, action) => ({
          counter: state.counter + action.payload
        })
      },
      defaultState
    );

    expect(reducer(prevState, { type, payload: 7, error: true })).toEqual({
      counter: 10
    });
  });

  it('map of handlers form - resulting reducer - returns previous state if matching handler is not function', () => {
    const reducer = handleAction(
      type,
      { next: null, error: 123 },
      defaultState
    );
    expect(reducer(prevState, { type, payload: 123 })).toBe(prevState);
    expect(reducer(prevState, { type, payload: 123, error: true })).toBe(
      prevState
    );
  });
});
