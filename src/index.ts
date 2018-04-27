export type MutationFunction<TStore, TPayload> = (store: TStore, payload: TPayload) => TStore;
export type MutationVoidFunction<TStore> = (store: TStore) => TStore;

export interface MutationMap<TStore> {
  [type: string]: MutationFunction<TStore, any>;
}

export interface Action<TPayload> {
  payload: Readonly<TPayload>;
  type: string;
}

export interface ActionFunction<TStore, TPayload> {
  (payload: TPayload): Action<TPayload>;
  toString(): string;
  toMutation(store: TStore, payload: TPayload): TStore;
}

export interface ActionVoidFunction<TStore> {
  (): Action<undefined>;
  toString(): string;
  toMutation(store: TStore): TStore;
}

let actionIncrementalIndex = 1;

function payloadFunction<TPayload>(type: string) {
  return (payload: TPayload) => ({
    payload,
    type,
  });
}

// this definition is for when payload is void and so user
// dose not have to pass action argument
function createReducerAction<TStore>(
  toMutation: MutationVoidFunction<TStore>,
): ActionVoidFunction<TStore>;
// this definition is for when payload has its typing required
function createReducerAction<TStore, TPayload>(
  toMutation: MutationFunction<TStore, TPayload>,
): ActionFunction<TStore, TPayload>;
function createReducerAction<TStore, TPayload>(
  toMutation: MutationFunction<TStore, TPayload>,
): ActionFunction<TStore, TPayload> {
  // add any due to typescript not seeing name property of function
  const type = `${actionIncrementalIndex++}.${(toMutation as any).name}`;
  const action = payloadFunction(type) as ActionFunction<TStore, TPayload>;
  action.toString = () => type;
  action.toMutation = toMutation;
  return action;
}

function combineActions<TStore>(
  initialState: Readonly<TStore>,
  reducers: Array<ActionFunction<TStore, any>>,
) {
  const mutations = reducers.reduce<MutationMap<TStore>>(
    (previous: MutationMap<TStore>, current: ActionFunction<TStore, any>) => {
      return {
        ...previous,
        [current.toString()]: current.toMutation,
      };
    },
    {},
  );
  return (store: TStore = initialState, action: Action<any>): TStore => {
    const mutation = mutations[action.type];
    if (!!mutation) {
      return mutation(store, action.payload);
    } else {
      return store;
    }
  };
}

export { createReducerAction, combineActions };
