## Tutorial

### Installation

For NPM users

```bash
$ npm install --save @jeffbski/redux-util
```

For Yarn users

```bash
$ yarn add @jeffbski/redux-util
```

For UMD users

The [UMD](https://unpkg.com/@jeffbski/redux-util@latest/dist) build exports a global called `window.ReduxUtil` if you add it to your page via a `<script>` tag. We _don’t_ recommend UMD builds for any serious application, as most of the libraries complementary to Redux are only available on [npm](https://www.npmjs.com/search?q=redux).

### Vanilla Counter

We are going to be building a simple counter, I recommend using something like [jsfiddle](https://jsfiddle.net/) or [codepen](https://codepen.io/pen/) or [codesandbox](https://codesandbox.io) if you would like to follow along, that way you do not need a complicated setup to grasp the basics of `@jeffbski/redux-util`.

To begin we are going to need some scaffolding so here is some HTML to get started with. You may need to create a new file called main.js depending on where you are trying to set this tutorial up.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <script src="https://unpkg.com/redux@latest/dist/redux.js"></script>
    <script src="https://unpkg.com/@jeffbski/redux-util@latest/dist/redux-util.js"></script>
  </head>
  <body>
    <button id="increment">INCREMENT</button>
    <button id="decrement">DECREMENT</button>
    <div id="content" />
    <script src="main.js"></script>
  </body>
</html>
```

Now that we are ready to write some JS let us create our default state for our counter.

```js
const defaultState = { counter: 0 };
```

Now if we want to see our default state we need to render it.
Lets get a reference to our main content and render our default state into the html.

```js
const content = document.getElementById('content');

const render = () => {
  content.innerHTML = defaultState.counter;
};
render();
```

With our default state and renderer in place we can start to use our libraries. `redux` and `redux-util` can be found via the globals `window.Redux` and `window.ReduxUtil`. Okay enough setup lets start to make something with `redux`!

We are going to want a store for our defaultState. We can create one from `redux` using `createStore`.

```js
const { createStore } = window.Redux;
```

We are going to want to create our first action and handle that action.

```js
const { createAction, createReducer } = window.ReduxUtil;
```

Next lets create our first action, 'increment', using `createAction`.

```js
const increment = createAction('INCREMENT');
```

Next we are going to handle that action with `createReducer`. We can provide it our `increment` action to let it know which action to handle, a method to handle our state transformation, and the default state.

```js
const reducer = createReducer({
  [increment]: (state, action) => ({
    ...state,
    counter: state.counter + 1
  }),
  defaultState
);
```

`createReducer` produced a reducer for our `redux` store. Now that we have a reducer we can create a store.

```js
const store = createStore(reducer, defaultState);
```

Now that we have a `store`, we can rewrite our `render` method to use it instead of the `defaultState`. We also want to `subscribe` our `render` to any changes the `store` might have for us.

```js
const render = () => {
  content.innerHTML = store.getState().counter;
};

store.subscribe(render);
```

We are ready to `dispatch` an action. Lets create an event listener for our increment button that will dispatch our `increment` action creator when clicked.

```js
document.getElementById('increment').addEventListener('click', () => {
  store.dispatch(increment());
});
```

If you try to click the increment button you should see the value is now going up by one on each click.

We have one button working, so why don't we try to get the second one working by creating a new action for decrement.

```js
const decrement = createAction('DECREMENT');
```

Now we can extend our previous example adding another entry into our
reducerMap to handle both increment and decrement.

```js
const { createAction, createReducer } = window.ReduxUtil;

const reducer = createReducer(
  {
    [increment]: state => ({ ...state, counter: state.counter + 1 }),
    [decrement]: state => ({ ...state, counter: state.counter - 1 })
  },
  defaultState
);
```

Now we can see both `increment` and `decrement` buttons now function appropriately.

```js
document.getElementById('decrement').addEventListener('click', () => {
  store.dispatch(decrement());
});
```

You might be thinking at this point we are all done. We have both buttons hooked up, and we can call it a day. Yet we have much optimizing to do. `redux-util` has other tools we have not yet taken advantage of. So lets investigate how we can change the code to use the remaining tools and make the code less verbose.

We have declarations for both `increment` and `decrement` action creators. We can modify these lines from using `createAction` to using `createActions` like so.

```js
const { createActions, createReducer } = window.ReduxUtil;

const { increment, decrement } = createActions(['increment', 'decrement');
```

Much more can be accomplished using these tools in many ways, just head on over to the [API Reference](../api) to begin exploring what else `redux-util` can do for you.
