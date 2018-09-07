import expect from 'expect-legacy';
import createActions from '../src/createActions';

describe('createActions', () => {
  it('throws an error when given arguments that contain a non-string', () => {
    const expectedError =
      'Expected optional object followed by string action types';

    expect(() => createActions(1)).toThrow(expectedError);
    expect(() => createActions({ ACTION_1: undefined }, [])).toThrow(
      expectedError
    );
    expect(() => createActions('ACTION_1', true)).toThrow(expectedError);
  });

  it('throws an error when given bad payload creators', () => {
    expect(() =>
      createActions({
        ACTION_1: () => {},
        ACTION_2: 'string'
      })
    ).toThrow(
      'Expected function, undefined, null, or array with payload and meta functions for ACTION_2'
    );
  });

  it('throws an error when given a bad payload or meta creator in array form', () => {
    expect(() =>
      createActions({
        ACTION_1: [[], () => {}]
      })
    ).toThrow(
      'Expected function, undefined, null, or array with payload and meta functions for ACTION_1'
    );

    expect(() =>
      createActions({
        ACTION_1: [() => {}, () => {}],
        ACTION_2: [() => {}, 1]
      })
    ).toThrow(
      'Expected function, undefined, null, or array with payload and meta functions for ACTION_2'
    );
  });

  it('throws an error when no meta creator is given in array form', () => {
    expect(() =>
      createActions({
        ACTION_1: [() => {}]
      })
    ).toThrow(
      'Expected function, undefined, null, or array with payload and meta functions for ACTION_1'
    );
  });

  it('returns a map of action types to action creators', () => {
    const { ACTION_ONE, ACTION_TWO } = createActions({
      ACTION_ONE: (key, value) => ({ [key]: value }),
      ACTION_TWO: (first, second) => [first, second]
    });

    expect(ACTION_ONE('value', 1)).toEqual({
      type: 'ACTION_ONE',
      payload: { value: 1 }
    });
    expect(ACTION_TWO('value', 2)).toEqual({
      type: 'ACTION_TWO',
      payload: ['value', 2]
    });
  });

  it('honors special delimiters in action types', () => {
    const {
      p: { ACTION_ONE },
      q: { ACTION_TWO }
    } = createActions({
      'p/ACTION_ONE': (key, value) => ({ [key]: value }),
      'q/ACTION_TWO': (first, second) => [first, second]
    });

    expect(ACTION_ONE('value', 1)).toEqual({
      type: 'p/ACTION_ONE',
      payload: { value: 1 }
    });
    expect(ACTION_TWO('value', 2)).toEqual({
      type: 'q/ACTION_TWO',
      payload: ['value', 2]
    });
  });

  it('uses the identity if the payload creator is undefined in map', () => {
    const {
      action1,
      foo: { bar }
    } = createActions({
      action1: undefined,
      foo: {
        bar: undefined
      }
    });

    expect(action1(1)).toEqual({
      type: 'action1',
      payload: 1
    });

    expect(bar(1)).toEqual({
      type: 'foo/bar',
      payload: 1
    });
  });

  it('uses the identity if the payload creator is null in map', () => {
    const {
      action1,
      foo: { bar }
    } = createActions({
      action1: null,
      foo: {
        bar: null
      }
    });

    expect(action1(1)).toEqual({
      type: 'action1',
      payload: 1
    });

    expect(bar(1)).toEqual({
      type: 'foo/bar',
      payload: 1
    });
  });

  it('uses the identity if the payload creator is undefined in array form', () => {
    const { action1, action2 } = createActions({
      action1: [undefined, meta1 => ({ meta1 })],
      action2: [undefined, ({ value }) => ({ meta2: value })]
    });

    expect(action1(1)).toEqual({
      type: 'action1',
      payload: 1,
      meta: { meta1: 1 }
    });

    expect(action2({ value: 2 })).toEqual({
      type: 'action2',
      payload: { value: 2 },
      meta: { meta2: 2 }
    });
  });

  it('uses the identity and meta creators in array form', () => {
    const { action1, action2 } = createActions({
      action1: [value => ({ value }), meta1 => ({ meta1 })],
      action2: [({ value }) => value, ({ value }) => ({ meta2: value })]
    });

    expect(action1(1)).toEqual({
      type: 'action1',
      payload: { value: 1 },
      meta: { meta1: 1 }
    });

    expect(action2({ value: 2 })).toEqual({
      type: 'action2',
      payload: 2,
      meta: { meta2: 2 }
    });
  });

  it('uses identity payload creators for trailing string action types', () => {
    const { action1, action2 } = createActions('action1', 'action2');

    expect(action1(1)).toEqual({
      type: 'action1',
      payload: 1
    });

    expect(action2(2)).toEqual({
      type: 'action2',
      payload: 2
    });
  });

  it('creates actions from an action map and action types', () => {
    const { action1, action2, action3, action4 } = createActions(
      {
        action1: (key, value) => ({ [key]: value }),
        action2: [first => [first], (first, second) => ({ second })]
      },
      'action3',
      'action4'
    );

    expect(action1('value', 1)).toEqual({
      type: 'action1',
      payload: { value: 1 }
    });
    expect(action2('value', 2)).toEqual({
      type: 'action2',
      payload: ['value'],
      meta: { second: 2 }
    });
    expect(action3(3)).toEqual({
      type: 'action3',
      payload: 3
    });
    expect(action4(4)).toEqual({
      type: 'action4',
      payload: 4
    });
  });

  it('creates actions from a divided action map', () => {
    const actionCreators = createActions(
      {
        app: {
          counter: {
            increment: amount => ({ amount }),
            decrement: amount => ({ amount: -amount }),
            set: undefined
          },
          notify: (username, message) => ({
            message: `${username}: ${message}`
          })
        },
        login: username => ({ username })
      },
      'actionOne',
      'actionTwo'
    );

    expect(actionCreators.app.counter.increment(1)).toEqual({
      type: 'app/counter/increment',
      payload: { amount: 1 }
    });
    expect(actionCreators.app.counter.decrement(1)).toEqual({
      type: 'app/counter/decrement',
      payload: { amount: -1 }
    });
    expect(actionCreators.app.counter.set(100)).toEqual({
      type: 'app/counter/set',
      payload: 100
    });
    expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).toEqual(
      {
        type: 'app/notify',
        payload: { message: 'yangmillstheory: Hello World' }
      }
    );
    expect(actionCreators.login('yangmillstheory')).toEqual({
      type: 'login',
      payload: { username: 'yangmillstheory' }
    });
    expect(actionCreators.actionOne('one')).toEqual({
      type: 'actionOne',
      payload: 'one'
    });
    expect(actionCreators.actionTwo('two')).toEqual({
      type: 'actionTwo',
      payload: 'two'
    });
  });

  it('creates divided actions with payload creators in array form', () => {
    const actionCreators = createActions({
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

    expect(actionCreators.app.counter.increment(1)).toEqual({
      type: 'app/counter/increment',
      payload: { amount: 1 },
      meta: { key: 'value', amount: 1 }
    });
    expect(actionCreators.app.counter.decrement(1)).toEqual({
      type: 'app/counter/decrement',
      payload: { amount: -1 }
    });
    expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).toEqual(
      {
        type: 'app/notify',
        payload: { message: 'yangmillstheory: Hello World' },
        meta: { username: 'yangmillstheory', message: 'Hello World' }
      }
    );
  });

  it('creates divided actions with a chosen divider string', () => {
    const actionCreators = createActions(
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
      { divider: '--' }
    );

    expect(actionCreators.app.counter.increment(1)).toEqual({
      type: 'app--counter--increment',
      payload: { amount: 1 },
      meta: { key: 'value', amount: 1 }
    });
    expect(actionCreators.app.counter.decrement(1)).toEqual({
      type: 'app--counter--decrement',
      payload: { amount: -1 }
    });
    expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).toEqual(
      {
        type: 'app--notify',
        payload: { message: 'yangmillstheory: Hello World' },
        meta: { username: 'yangmillstheory', message: 'Hello World' }
      }
    );
  });

  it('creates prefixed actions if `prefix` option exists', () => {
    const actionCreators = createActions(
      {
        app: {
          counter: {
            increment: amount => ({ amount }),
            decrement: amount => ({ amount: -amount }),
            set: undefined
          },
          notify: (username, message) => ({
            message: `${username}: ${message}`
          })
        },
        login: username => ({ username })
      },
      'actionOne',
      'actionTwo',
      { prefix: 'my-awesome-feature' }
    );

    expect(actionCreators.app.counter.increment(1)).toEqual({
      type: 'my-awesome-feature/app/counter/increment',
      payload: { amount: 1 }
    });

    expect(actionCreators.app.counter.decrement(1)).toEqual({
      type: 'my-awesome-feature/app/counter/decrement',
      payload: { amount: -1 }
    });

    expect(actionCreators.app.counter.set(100)).toEqual({
      type: 'my-awesome-feature/app/counter/set',
      payload: 100
    });

    expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).toEqual(
      {
        type: 'my-awesome-feature/app/notify',
        payload: { message: 'yangmillstheory: Hello World' }
      }
    );

    expect(actionCreators.login('yangmillstheory')).toEqual({
      type: 'my-awesome-feature/login',
      payload: { username: 'yangmillstheory' }
    });

    expect(actionCreators.actionOne('one')).toEqual({
      type: 'my-awesome-feature/actionOne',
      payload: 'one'
    });

    expect(actionCreators.actionTwo('two')).toEqual({
      type: 'my-awesome-feature/actionTwo',
      payload: 'two'
    });
  });

  it('properly handles `prefix` and `divider` options provided together', () => {
    const actionCreators = createActions(
      {
        app: {
          counter: {
            increment: amount => ({ amount }),
            decrement: amount => ({ amount: -amount }),
            set: undefined
          },
          notify: (username, message) => ({
            message: `${username}: ${message}`
          })
        },
        login: username => ({ username })
      },
      'actionOne',
      'actionTwo',
      {
        prefix: 'my-awesome-feature',
        divider: '--'
      }
    );

    expect(actionCreators.app.counter.increment(1)).toEqual({
      type: 'my-awesome-feature--app--counter--increment',
      payload: { amount: 1 }
    });

    expect(actionCreators.app.counter.decrement(1)).toEqual({
      type: 'my-awesome-feature--app--counter--decrement',
      payload: { amount: -1 }
    });

    expect(actionCreators.app.counter.set(100)).toEqual({
      type: 'my-awesome-feature--app--counter--set',
      payload: 100
    });

    expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).toEqual(
      {
        type: 'my-awesome-feature--app--notify',
        payload: { message: 'yangmillstheory: Hello World' }
      }
    );

    expect(actionCreators.login('yangmillstheory')).toEqual({
      type: 'my-awesome-feature--login',
      payload: { username: 'yangmillstheory' }
    });

    expect(actionCreators.actionOne('one')).toEqual({
      type: 'my-awesome-feature--actionOne',
      payload: 'one'
    });

    expect(actionCreators.actionTwo('two')).toEqual({
      type: 'my-awesome-feature--actionTwo',
      payload: 'two'
    });
  });
});
