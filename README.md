# @jeffbski/redux-util - Redux Utilities

Initial codebase was based on redux-actions. Utility methods to simplify building action creators and reducers.

Differences from redux-actions

- no automatic camel casing in createActions
- renamed handleActions to createReducer
- removed handleAction export
- removed combineActions
- renamed options.namespace to options.divider in createActions and createReducer

[![Build Status](https://travis-ci.org/jeffbski/redux-util.svg?branch=master)](https://travis-ci.org/jeffbski/redux-util)

> [Flux Standard Action](https://github.com/acdlite/flux-standard-action) utilities for Redux

### Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Documentation](#documentation)

# Getting Started

## Installation

```bash
$ npm install --save @jeffbski/redux-util
```

or

```
$ yarn add @jeffbski/redux-util
```

The [npm](https://www.npmjs.com) package provides a [CommonJS](http://webpack.github.io/docs/commonjs.html) build for use in Node.js, and with bundlers like [Webpack](http://webpack.github.io/) and [Browserify](http://browserify.org/). It also includes an [ES modules](http://jsmodules.io/) build that works well with [Rollup](http://rollupjs.org/) and [Webpack2](https://webpack.js.org)'s tree-shaking.

## Usage

```js
import { createActions, createReducer } from '@jeffbski/redux-util';

const defaultState = { counter: 10 };

const actions = createActions(
  {
    counter: {
      increment: (amount = 1) => amount,
      decrement: (amount = 1) => amount
    }
  },
  { prefix: 'foo' }
); // my namespace for these actions

// we now have an object with two action creators:
const a1 = actions.counter.increment(10);
console.log(a1); // { type: 'foo/counter/increment', payload: 10 }

const a2 = actions.counter.decrement(20);
console.log(a2); // { type: 'foo/counter/decrement', payload: 20 }

// Also these action creators will return the original action type
// if you coerce a toString on the function.
console.log(actions.counter.increment.toString()); // foo/counter/increment

// Let's use createReducer to create a reducer which handles all
// of our actions. We can coerce actionCreator to a string using
// [] in a key for our reducerMap.

// No switch statement needed here, reducer handles all the
// provided actions and the default.

const reducer = handleActions(
  {
    [actions.counter.increment]: (state, { payload }) => {
      return { ...state, counter: state.counter + payload };
    },

    [actions.counter.decrement]: (state, { payload }) => {
      return { ...state, counter: state.counter - payload };
    }
  },
  defaultState
);

export default reducer;
```

# Documentation

See the [full documentation here](./docs/README.md)

## Forked from redux-actions

This code was forked from redux-actions which was created by Andrew Clark and released under the MIT license. This was done to accommodate a different philosophy towards the api.

Differences from redux-actions

- automatic camel casing is not used in createActions to prevent confusion.
- handleActions renamed createReducer
- removed handleAction export
- removed combineActions
- renamed options.namespace to options.divider in createActions and createReducer

The original contributors can be found at https://github.com/redux-utilities/redux-actions/graphs/contributors
