import { combineReducers, createStore } from 'redux';
import { combineActions, createReducerAction } from '../src';

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

const mutationActionA = createReducerAction(function actionMutationA(
  store: Reducer,
  payload: PayloadA,
) {
  return { ...store, a: payload.a };
});

const mutationActionB = createReducerAction(function actionMutationB(
  store: Reducer,
  payload: PayloadB,
) {
  return { ...store, b: payload.b };
});

it('should check if action a class was created', () => {
  const action = mutationActionA({ a: true });
  expect(action.payload).toEqual({ a: true });
  expect(action.type).toEqual('1.actionMutationA');
  expect(mutationActionA.toString()).toEqual('1.actionMutationA');
  expect(mutationActionA.toMutation(initialState, action.payload)).toEqual({ a: true, b: false });
});

it('should check if action b class was created', () => {
  const action = mutationActionB({ b: true });
  expect(action.payload).toEqual({ b: true });
  expect(action.type).toEqual('2.actionMutationB');
  expect(mutationActionB.toString()).toEqual('2.actionMutationB');
  expect(mutationActionB.toMutation(initialState, action.payload)).toEqual({ a: false, b: true });
});

it('should combine action', () => {
  const reducer = combineActions(initialState, [mutationActionA, mutationActionB]);
  const state1 = reducer(undefined, mutationActionA({ a: true }));
  const state2 = reducer(state1, mutationActionB({ b: true }));
  expect(state2).toEqual({ a: true, b: true });
});

it('should create redux store and fire an action', () => {
  const reducer = combineActions(initialState, [mutationActionA, mutationActionB]);
  const store = createStore(combineReducers({ reducer }));
  expect(store.getState()).toEqual({ reducer: { a: false, b: false } });
  store.dispatch(mutationActionA({ a: true }));
  expect(store.getState()).toEqual({ reducer: { a: true, b: false } });
  store.dispatch(mutationActionB({ b: true }));
  expect(store.getState()).toEqual({ reducer: { a: true, b: true } });
});
