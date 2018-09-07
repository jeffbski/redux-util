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
import {
  createActions,
  handleActions,
  combineActions
} from '@jeffbski/redux-util';

const defaultState = { counter: 10 };

const { increment, decrement } = createActions({
  increment: (amount = 1) => ({ amount }),
  decrement: (amount = 1) => ({ amount: -amount })
});

const reducer = handleActions(
  {
    [combineActions(increment, decrement)]: (
      state,
      { payload: { amount } }
    ) => {
      return { ...state, counter: state.counter + amount };
    }
  },
  defaultState
);

export default reducer;
```

# Documentation

See the [documentation here](./docs/README.md)

## Forked from redux-actions

This code was forked from redux-actions which was created by Andrew Clark and released under the MIT license. This was done to accommodate a different philosophy towards the api.

Differences from redux-actions

- automatic camel casing is not used in createActions to prevent confusion.
- handleActions renamed createReducer
- removed handleAction export
- removed combineActions
- renamed options.namespace to options.divider in createActions and createReducer

The original contributors can be found at https://github.com/redux-utilities/redux-actions/graphs/contributors
