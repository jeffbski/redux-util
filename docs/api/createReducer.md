# API Reference for createReducer

- [Methods](#methods)
  - [createReducer](#createreducer)
    - [`createReducer(reducerMap, defaultState)`](#createreducerreducermap-defaultstate)

## Methods

### createReducer

```js
createReducer(reducerMap, defaultState);
```

Creates multiple reducers using `handleAction()` and combines them into a single reducer that handles multiple actions. Accepts a map where the keys are passed as the first parameter to `handleAction()` (the action type), and the values are passed as the second parameter (either a reducer or reducer map). The map must not be empty.

If `reducerMap` has a recursive structure, its leaves are used as reducers, and the action type for each leaf is the path to that leaf. If a node's only children are `next()` and `throw()`, the node will be treated as a reducer. If the leaf is `undefined` or `null`, the identity function is used as the reducer. Otherwise, the leaf should be the reducer function. When using this form, you can pass an object with key `divider` as the last positional argument (the default is `/`).

```js
import { createReducer } from '@jeffbski/redux-util';
```

#### `createReducer(reducerMap, defaultState)` {#createreducerreducermap-defaultstate}

The second parameter `defaultState` is required, and is used when `undefined` is passed to the reducer.

(Internally, `createReducer()` works by applying multiple reducers in sequence using [reduce-reducers](https://github.com/redux-utilities/reduce-reducers).)

###### EXAMPLE

```js
const reducer = createReducer(
  {
    increment: (state, action) => ({
      counter: state.counter + action.payload
    }),

    decrement: (state, action) => ({
      counter: state.counter - action.payload
    })
  },
  { counter: 0 }
);
```

Or using a JavaScript `Map` type:

```js
const reducer = createReducer(
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
  { counter: 0 }
);
```

You can also use an action function as the key to a reduce function instead of using a string const:

Putting the key inside of `[]` makes it evaluate the toString to get the string constant from the action creator.

```js
const increment = createAction('MY_INCREMENT');
const decrement = createAction('MY_DECREMENT');

const reducer = createReducer(
  {
    // listens for MY_INCREMENT
    [increment]: (state, action) => ({
      counter: state.counter + action.payload
    }),

    // listens for MY_DECREMENT
    [decrement]: (state, action) => ({
      counter: state.counter - action.payload
    })
  },
  { counter: 0 }
);
```

or using a Map

```js
const increment = createAction(increment);
const decrement = createAction(decrement);

const reducer = createReducer(
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
  { counter: 0 }
);
```
