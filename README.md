## WIP: redux-lite-actions

Redux lite actions solves issues that you need to define redux action names mutation functions separately.
`redux-lite-actions` whats to simplify that process in just writing the mutation functions which can
be used as a action.

For example lets create a simple reducer which couple actions.

Reducer file.
```typescript
import { combineActions, createReducerAction } from 'redux-lite-actions';

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

export const MutationActionA = createReducerAction(
  // name your action function which will be used as a action name witch 
  // id prefix in front of name function name, this will prevent same action names
  // when function name is duplicated 
  function actionMutationA(store: Reducer, payload: PayloadA) {
    return { ...store, a: payload.a };
  },
);

export const MutationActionB = createReducerAction(
  function actionMutationB(store: Reducer, payload: PayloadB) {
    return { ...store, b: payload.b };
  },
);

export const reducer = combineActions(initialState, [
  MutationActionA,
  MutationActionB,
]);
```

Some point here you use your action.
```typescript
import { MutationActionA, MutationActionB } from './reducer';

dispatch(new MutationActionA({ a: true }));
dispatch(new MutationActionB({ b: true }));
```
