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

const MutationActionA = createReducerAction(
  function actionMutationA(store: Reducer, payload: PayloadA) {
    return { ...store, a: payload.a };
  },
);

const MutationActionB = createReducerAction(
  function actionMutationB(store: Reducer, payload: PayloadB) {
    return { ...store, b: payload.b };
  },
);

it('should check if action a class was created', () => {
  const action = new MutationActionA({ a: true });
  expect(action.payload).toEqual({ a: true });
  expect(action.type).toEqual('1.actionMutationA');
  expect(MutationActionA.toString()).toEqual('1.actionMutationA');
  expect(MutationActionA.toMutation(initialState, action.payload)).toEqual({ a: true, b: false });
});

it('should check if action b class was created', () => {
  const action = new MutationActionB({ b: true });
  expect(action.payload).toEqual({ b: true });
  expect(action.type).toEqual('2.actionMutationB');
  expect(MutationActionB.toString()).toEqual('2.actionMutationB');
  expect(MutationActionB.toMutation(initialState, action.payload)).toEqual({ a: false, b: true });
});

it('should combine action', () => {
  const reducer = combineActions(initialState, [
    MutationActionA,
    MutationActionB,
  ]);
  const state1 = reducer(undefined, new MutationActionA({ a: true }));
  const state2 = reducer(state1, new MutationActionB({ b: true }));
  expect(state2).toEqual({ a: true, b: true });
});
