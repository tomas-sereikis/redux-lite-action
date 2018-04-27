import { combineReducers, createStore } from 'redux';
import { combineActions, createReducerAction } from '../src';

interface Reducer {
  a: boolean;
  b: boolean;
  c: boolean;
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
  c: false,
};

const mutationActionA = createReducerAction(function actionMutationA(
  store: Reducer,
  payload: PayloadA,
) {
  return {
    ...store,
    a: payload.a,
  };
});

const mutationActionB = createReducerAction(function actionMutationB(
  store: Reducer,
  payload: PayloadB,
) {
  return {
    ...store,
    b: payload.b,
  };
});

const mutationActionC = createReducerAction(function actionMutationC(store: Reducer) {
  return {
    ...store,
    c: true,
  };
});

it('should check if action a class was created', () => {
  const action = mutationActionA({ a: true });
  expect(action.payload).toEqual({ a: true });
  expect(action.type).toEqual('1.actionMutationA');
  expect(mutationActionA.toString()).toEqual('1.actionMutationA');
  expect(mutationActionA.toMutation(initialState, action.payload)).toEqual({
    a: true,
    b: false,
    c: false,
  });
});

it('should check if action b class was created', () => {
  const action = mutationActionB({ b: true });
  expect(action.payload).toEqual({ b: true });
  expect(action.type).toEqual('2.actionMutationB');
  expect(mutationActionB.toString()).toEqual('2.actionMutationB');
  expect(mutationActionB.toMutation(initialState, action.payload)).toEqual({
    a: false,
    b: true,
    c: false,
  });
});

it('should check if action c class was created', () => {
  const action = mutationActionC();
  expect(action.payload).toEqual(undefined);
  expect(action.type).toEqual('3.actionMutationC');
  expect(mutationActionC.toString()).toEqual('3.actionMutationC');
  expect(mutationActionC.toMutation(initialState)).toEqual({
    a: false,
    b: false,
    c: true,
  });
});

it('should combine action', () => {
  const reducer = combineActions(initialState, [mutationActionA, mutationActionB, mutationActionC]);
  const state1 = reducer(undefined, mutationActionA({ a: true }));
  const state2 = reducer(state1, mutationActionB({ b: true }));
  const state3 = reducer(state2, mutationActionC());
  expect(state3).toEqual({
    a: true,
    b: true,
    c: true,
  });
});

it('should create redux store and fire an action', () => {
  const reducer = combineActions(initialState, [mutationActionA, mutationActionB, mutationActionC]);
  const store = createStore(combineReducers({ reducer }));
  expect(store.getState()).toEqual({
    reducer: {
      a: false,
      b: false,
      c: false,
    },
  });
  store.dispatch(mutationActionA({ a: true }));
  expect(store.getState()).toEqual({
    reducer: {
      a: true,
      b: false,
      c: false,
    },
  });
  store.dispatch(mutationActionB({ b: true }));
  expect(store.getState()).toEqual({
    reducer: {
      a: true,
      b: true,
      c: false,
    },
  });
  store.dispatch(mutationActionC());
  expect(store.getState()).toEqual({
    reducer: {
      a: true,
      b: true,
      c: true,
    },
  });
});
