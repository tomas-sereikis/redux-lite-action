## Redux Lite Action

#### Install

Install via npm `npm install react-lite-action` or yarn `yarn add react-lite-action`. 
Typescript typings are includes into package :). 

#### Usage

Redux lite action solves issues that you need to define redux action names mutation functions separately.
`redux-lite-action` whats to simplify that process in just writing the mutation functions which can
be used as a action.

For example lets create a simple reducer which couple actions.

Reducer file.
```typescript
import { combineActions, createReducerAction } from 'redux-lite-action';

interface Reducer {
  a: boolean;
  b: boolean;
}

interface PayloadA {
  a: boolean;
}

interface PayloadB {
  b: boolean;
}

const initialState: Readonly<Reducer> = {
  a: false,
  b: false,
};

export const mutationActionA = createReducerAction(
  // name your action function which will be used as a action name witch 
  // id prefix in front of name function name, this will prevent same action names
  // when function name is duplicated 
  function actionMutationA(store: Reducer, payload: PayloadA) {
    return { ...store, a: payload.a };
  },
);

export const mutationActionB = createReducerAction(
  function actionMutationB(store: Reducer, payload: PayloadB) {
    return { ...store, b: payload.b };
  },
);

export const reducer = combineActions(initialState, [
  mutationActionA,
  mutationActionB,
]);
```

Some point here you use your action.
```typescript
import { mutationActionA, mutationActionB } from './reducer';

dispatch(mutationActionA({ a: true }));
dispatch(mutationActionB({ b: true }));
```

#### Issues

When using action without a payload it gets tricky due to typescript typings but it should be
resolved one way or another.

Example

```typescript
// we need to default that out payload is undefined
const mutationActionC = createReducerAction(function actionMutationC(
  store: Reducer,
  payload: undefined,
) {
  return {
    ...store,
    c: true,
  };
});

// then later on we have to call with undefined payload 
// while it just should be as a empty parameter
dispatch(mutationActionC(undefined));
```
