import expect from 'expect-legacy';
import handleActions from '../src/handleActions';
import createAction from '../src/createAction';
import createActions from '../src/createActions';
import combineActions from '../src/combineActions';

const defaultState = { counter: 0 };

describe('handleActions', () => {
  it('throws an error when defaultState is not defined', () => {
    expect(() => {
      handleActions({
        increment: ({ counter }, { payload: amount }) => ({
          counter: counter + amount
        }),

        decrement: ({ counter }, { payload: amount }) => ({
          counter: counter - amount
        })
      });
    }).toThrow('defaultState for reducer handling increment should be defined');
  });

  it('throws an error when defaultState is not defined for combinedActions', () => {
    expect(() => {
      handleActions({
        [combineActions('increment', 'decrement')]: (
          { counter },
          { type, payload: amount }
        ) => ({
          counter: counter + (type === 'increment' ? +1 : -1) * amount
        })
      });
    }).toThrow(
      'defaultState for reducer handling increment, decrement should be defined'
    );
  });

  it('creates a single handler from a map of multiple action handlers', () => {
    const reducer = handleActions(
      {
        increment: ({ counter }, { payload: amount }) => ({
          counter: counter + amount
        }),

        decrement: ({ counter }, { payload: amount }) => ({
          counter: counter - amount
        })
      },
      defaultState
    );

    expect(reducer({ counter: 3 }, { type: 'increment', payload: 7 })).toEqual({
      counter: 10
    });
    expect(reducer({ counter: 10 }, { type: 'decrement', payload: 7 })).toEqual(
      {
        counter: 3
      }
    );
  });

  it('creates a single handler from a JavaScript Map of multiple action handlers', () => {
    const reducer = handleActions(
      new Map([
        [
          'increment',
          (state, action) => ({
            counter: state.counter + action.payload
          })
        ],

        [
          'decrement',
          (state, action) => ({
            counter: state.counter - action.payload
          })
        ]
      ]),
      defaultState
    );

    expect(reducer({ counter: 3 }, { type: 'increment', payload: 7 })).toEqual({
      counter: 10
    });
    expect(reducer({ counter: 10 }, { type: 'decrement', payload: 7 })).toEqual(
      {
        counter: 3
      }
    );
  });

  it('works with function action types', () => {
    const increment = createAction('increment');
    const decrement = createAction('decrement');

    const reducer = handleActions(
      new Map([
        [
          increment,
          (state, action) => ({
            counter: state.counter + action.payload
          })
        ],

        [
          decrement,
          (state, action) => ({
            counter: state.counter - action.payload
          })
        ]
      ]),
      defaultState
    );

    expect(reducer({ counter: 3 }, { type: 'increment', payload: 7 })).toEqual({
      counter: 10
    });
    expect(reducer({ counter: 10 }, { type: 'decrement', payload: 7 })).toEqual(
      {
        counter: 3
      }
    );
  });

  it('works with symbol action types', () => {
    const increment = Symbol('increment');

    const reducer = handleActions(
      {
        [increment]: ({ counter }, { payload: amount }) => ({
          counter: counter + amount
        })
      },
      defaultState
    );

    expect(reducer({ counter: 3 }, { type: increment, payload: 7 })).toEqual({
      counter: 10
    });
  });

  it('accepts a default state used when previous state is undefined', () => {
    const reducer = handleActions(
      {
        increment: ({ counter }, { payload: amount }) => ({
          counter: counter + amount
        }),

        decrement: ({ counter }, { payload: amount }) => ({
          counter: counter - amount
        })
      },
      { counter: 3 }
    );

    expect(reducer(undefined, { type: 'increment', payload: 7 })).toEqual({
      counter: 10
    });
  });

  it('accepts action function as action type', () => {
    const incrementAction = createAction('increment');
    const reducer = handleActions(
      {
        [incrementAction]: ({ counter }, { payload: amount }) => ({
          counter: counter + amount
        })
      },
      defaultState
    );

    expect(reducer({ counter: 3 }, incrementAction(7))).toEqual({
      counter: 10
    });
  });

  it('accepts combined actions as action types in single reducer form', () => {
    const { increment, decrement } = createActions({
      increment: amount => ({ amount }),
      decrement: amount => ({ amount: -amount })
    });

    const initialState = { counter: 10 };

    const reducer = handleActions(
      {
        [combineActions(increment, decrement)](
          state,
          {
            payload: { amount }
          }
        ) {
          return { ...state, counter: state.counter + amount };
        }
      },
      defaultState
    );

    expect(reducer(initialState, increment(5))).toEqual({ counter: 15 });
    expect(reducer(initialState, decrement(5))).toEqual({ counter: 5 });
    expect(reducer(initialState, { type: 'NOT_TYPE', payload: 1000 })).toBe(
      initialState
    );
    expect(reducer(undefined, increment(5))).toEqual({ counter: 5 });
  });

  it('accepts combined actions as action types in the next/throw form', () => {
    const { increment, decrement } = createActions({
      increment: amount => ({ amount }),
      decrement: amount => ({ amount: -amount })
    });

    const initialState = { counter: 10 };

    const reducer = handleActions(
      {
        [combineActions(increment, decrement)]: {
          next(
            state,
            {
              payload: { amount }
            }
          ) {
            return { ...state, counter: state.counter + amount };
          },

          throw(state) {
            return { ...state, counter: 0 };
          }
        }
      },
      defaultState
    );
    const error = new Error();

    // Non-Errors
    expect(reducer(initialState, increment(5))).toEqual({ counter: 15 });
    expect(reducer(initialState, decrement(5))).toEqual({ counter: 5 });
    expect(reducer(initialState, { type: 'NOT_TYPE', payload: 1000 })).toBe(
      initialState
    );
    expect(reducer(undefined, increment(5))).toEqual({ counter: 5 });

    // Errors
    expect(
      reducer(initialState, { type: 'increment', payload: error, error: true })
    ).toEqual({ counter: 0 });
    expect(reducer(initialState, decrement(error))).toEqual({ counter: 0 });
  });

  it('works with createActions action creators', () => {
    const { increment, decrement } = createActions('increment', 'decrement');

    const reducer = handleActions(
      {
        [increment]: ({ counter }, { payload }) => ({
          counter: counter + payload
        }),

        [decrement]: ({ counter }, { payload }) => ({
          counter: counter - payload
        })
      },
      defaultState
    );

    expect(reducer({ counter: 3 }, increment(2))).toEqual({
      counter: 5
    });
    expect(reducer({ counter: 10 }, decrement(3))).toEqual({
      counter: 7
    });
  });

  it('works with namespaced actions', () => {
    const {
      app: {
        counter: { increment, decrement },
        notify
      }
    } = createActions({
      app: {
        counter: {
          increment: [
            amount => ({ amount }),
            amount => ({ key: 'value', amount })
          ],
          decrement: amount => ({ amount: -amount })
        },
        notify: [
          (username, message) => ({ message: `${username}: ${message}` }),
          (username, message) => ({ username, message })
        ]
      }
    });

    // NOTE: We should be using combineReducers in production, but this is just a test.
    const reducer = handleActions(
      {
        [combineActions(increment, decrement)]: (
          { counter, message },
          { payload: { amount } }
        ) => ({
          counter: counter + amount,
          message
        }),

        [notify]: ({ counter, message }, { payload }) => ({
          counter,
          message: `${message}---${payload.message}`
        })
      },
      { counter: 0, message: '' }
    );

    expect(reducer({ counter: 3, message: 'hello' }, increment(2))).toEqual({
      counter: 5,
      message: 'hello'
    });
    expect(reducer({ counter: 10, message: 'hello' }, decrement(3))).toEqual({
      counter: 7,
      message: 'hello'
    });
    expect(
      reducer({ counter: 10, message: 'hello' }, notify('me', 'goodbye'))
    ).toEqual({
      counter: 10,
      message: 'hello---me: goodbye'
    });
  });

  it('returns default state with empty handlers and undefined previous state', () => {
    const { unhandled } = createActions('unhandled');
    const reducer = handleActions({}, defaultState);

    expect(reducer(undefined, unhandled())).toEqual(defaultState);
  });

  it('returns previous defined state with empty handlers', () => {
    const { unhandled } = createActions('unhandled');
    const reducer = handleActions({}, defaultState);

    expect(reducer({ counter: 10 }, unhandled())).toEqual({ counter: 10 });
  });

  it('throws an error if handlers object has the wrong type', () => {
    const wrongTypeHandlers = [1, 'string', [], null];

    wrongTypeHandlers.forEach(wrongTypeHandler => {
      expect(() => handleActions(wrongTypeHandler, defaultState)).toThrow(
        'Expected handlers to be a plain object.'
      );
    });
  });

  it('works with nested reducerMap', () => {
    const {
      app: {
        counter: { increment, decrement },
        notify
      }
    } = createActions({
      app: {
        counter: {
          increment: [
            amount => ({ amount }),
            amount => ({ key: 'value', amount })
          ],
          decrement: amount => ({ amount: -amount })
        },
        notify: [
          (username, message) => ({ message: `${username}: ${message}` }),
          (username, message) => ({ username, message })
        ]
      }
    });

    // NOTE: We should be using combineReducers in production, but this is just a test.
    const reducer = handleActions(
      {
        [combineActions(increment, decrement)]: (
          { counter, message },
          { payload: { amount } }
        ) => ({
          counter: counter + amount,
          message
        }),

        app: {
          notify: {
            next: ({ counter, message }, { payload }) => ({
              counter,
              message: `${message}---${payload.message}`
            }),
            throw: ({ _, message }, { payload }) => ({
              counter: 0,
              message: `${message}-x-${payload.message}`
            })
          }
        }
      },
      { counter: 0, message: '' }
    );

    expect(reducer({ counter: 3, message: 'hello' }, increment(2))).toEqual({
      counter: 5,
      message: 'hello'
    });
    expect(reducer({ counter: 10, message: 'hello' }, decrement(3))).toEqual({
      counter: 7,
      message: 'hello'
    });
    expect(
      reducer({ counter: 10, message: 'hello' }, notify('me', 'goodbye'))
    ).toEqual({
      counter: 10,
      message: 'hello---me: goodbye'
    });

    const error = new Error('no notification');
    expect(reducer({ counter: 10, message: 'hello' }, notify(error))).toEqual({
      counter: 0,
      message: 'hello-x-no notification'
    });
  });

  it('works with nested reducerMap and namespace', () => {
    const {
      app: {
        counter: { increment, decrement },
        notify
      }
    } = createActions(
      {
        app: {
          counter: {
            increment: [
              amount => ({ amount }),
              amount => ({ key: 'value', amount })
            ],
            decrement: amount => ({ amount: -amount })
          },
          notify: [
            (username, message) => ({ message: `${username}: ${message}` }),
            (username, message) => ({ username, message })
          ]
        }
      },
      { namespace: ':' }
    );

    // NOTE: We should be using combineReducers in production, but this is just a test.
    const reducer = handleActions(
      {
        [combineActions(increment, decrement)]: (
          { counter, message },
          { payload: { amount } }
        ) => ({
          counter: counter + amount,
          message
        }),

        app: {
          notify: {
            next: ({ counter, message }, { payload }) => ({
              counter,
              message: `${message}---${payload.message}`
            }),
            throw: ({ _, message }, { payload }) => ({
              counter: 0,
              message: `${message}-x-${payload.message}`
            })
          }
        }
      },
      { counter: 0, message: '' },
      { namespace: ':' }
    );

    expect(String(increment)).toBe('app:counter:increment');

    expect(reducer({ counter: 3, message: 'hello' }, increment(2))).toEqual({
      counter: 5,
      message: 'hello'
    });
    expect(reducer({ counter: 10, message: 'hello' }, decrement(3))).toEqual({
      counter: 7,
      message: 'hello'
    });
    expect(
      reducer({ counter: 10, message: 'hello' }, notify('me', 'goodbye'))
    ).toEqual({
      counter: 10,
      message: 'hello---me: goodbye'
    });

    const error = new Error('no notification');
    expect(reducer({ counter: 10, message: 'hello' }, notify(error))).toEqual({
      counter: 0,
      message: 'hello-x-no notification'
    });
  });

  it('works with nested reducerMap and identity handlers', () => {
    const noop = createAction('app/noop');
    const increment = createAction('app/increment');

    const reducer = handleActions(
      {
        app: {
          noop: undefined,
          increment: {
            next: (state, { payload }) => ({
              ...state,
              counter: state.counter + payload
            }),
            throw: null
          }
        }
      },
      { counter: 0, message: '' }
    );

    expect(reducer({ counter: 3, message: 'hello' }, noop('anything'))).toEqual(
      {
        counter: 3,
        message: 'hello'
      }
    );
    expect(reducer({ counter: 3, message: 'hello' }, increment(2))).toEqual({
      counter: 5,
      message: 'hello'
    });

    const error = new Error('cannot increment by Infinity');
    expect(reducer({ counter: 3, message: 'hello' }, increment(error))).toEqual(
      {
        counter: 3,
        message: 'hello'
      }
    );
  });

  it('works with combineActions nested', () => {
    const { apiCall1, apiCall2 } = createActions('apiCall1', 'apiCall2');
    const {
      apiCall1: { loading: apiCallLoading1 },
      apiCall2: { loading: apiCallLoading2 }
    } = createActions({
      apiCall1: { loading: undefined },
      apiCall2: { loading: undefined }
    });

    const reducer = handleActions(
      {
        [combineActions(apiCall1, apiCall2)]: {
          loading: (state, { payload: loading }) => ({ loading })
        }
      },
      { loading: false }
    );

    expect(reducer({ loading: false }, apiCallLoading1(true))).toEqual({
      loading: true
    });
    expect(reducer({ loading: false }, apiCallLoading2(true))).toEqual({
      loading: true
    });
  });
});
