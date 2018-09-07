import expect from 'expect-legacy';
import unflattenActionCreators from '../src/utils/unflattenActionCreators';

describe('unflattenActionCreators', () => {
  it('unflattens a flattened action map', () => {
    const actionMap = unflattenActionCreators({
      'app/counter/increment': amount => ({ amount }),
      'app/counter/decrement': amount => ({ amount: -amount }),
      'app/notify': (username, message) => ({
        message: `${username}: ${message}`
      }),
      login: username => ({ username })
    });

    expect(actionMap.login('yangmillstheory')).toEqual({
      username: 'yangmillstheory'
    });
    expect(actionMap.app.notify('yangmillstheory', 'Hello World')).toEqual({
      message: 'yangmillstheory: Hello World'
    });
    expect(actionMap.app.counter.increment(100)).toEqual({ amount: 100 });
    expect(actionMap.app.counter.decrement(100)).toEqual({ amount: -100 });
  });

  it('unflattens a flattened action map with custom namespace', () => {
    const actionMap = unflattenActionCreators(
      {
        'app--counter--increment': amount => ({ amount }),
        'app--counter--decrement': amount => ({ amount: -amount }),
        'app--notify': (username, message) => ({
          message: `${username}: ${message}`
        }),
        login: username => ({ username })
      },
      { namespace: '--' }
    );

    expect(actionMap.login('yangmillstheory')).toEqual({
      username: 'yangmillstheory'
    });
    expect(actionMap.app.notify('yangmillstheory', 'Hello World')).toEqual({
      message: 'yangmillstheory: Hello World'
    });
    expect(actionMap.app.counter.increment(100)).toEqual({ amount: 100 });
    expect(actionMap.app.counter.decrement(100)).toEqual({ amount: -100 });
  });

  it('unflattens a flattened action map with prefix', () => {
    const actionMap = unflattenActionCreators(
      {
        'my/feature/app/counter/increment': amount => ({ amount }),
        'my/feature/app/counter/decrement': amount => ({ amount: -amount }),
        'my/feature/app/notify': (username, message) => ({
          message: `${username}: ${message}`
        }),
        'my/feature/login': username => ({ username })
      },
      { prefix: 'my/feature' }
    );

    expect(actionMap.login('test')).toEqual({ username: 'test' });
    expect(actionMap.app.notify('yangmillstheory', 'Hello World')).toEqual({
      message: 'yangmillstheory: Hello World'
    });
    expect(actionMap.app.counter.increment(100)).toEqual({ amount: 100 });
    expect(actionMap.app.counter.decrement(100)).toEqual({ amount: -100 });
  });

  it('unflattens a flattened action map with custom namespace and prefix', () => {
    const actionMap = unflattenActionCreators(
      {
        'my--feature--app--counter--increment': amount => ({ amount }),
        'my--feature--app--counter--decrement': amount => ({ amount: -amount }),
        'my--feature--app--notify': (username, message) => ({
          message: `${username}: ${message}`
        }),
        'my--feature--login': username => ({ username })
      },
      { namespace: '--', prefix: 'my--feature' }
    );

    expect(actionMap.login('test')).toEqual({ username: 'test' });
    expect(actionMap.app.notify('yangmillstheory', 'Hello World')).toEqual({
      message: 'yangmillstheory: Hello World'
    });
    expect(actionMap.app.counter.increment(100)).toEqual({ amount: 100 });
    expect(actionMap.app.counter.decrement(100)).toEqual({ amount: -100 });
  });
});
