interface MutationMap<TStore> {
  [type: string]: (store: TStore, payload: any) => TStore;
}

/**
 * Action type interface. This is a standard interface for an action
 * that has a name which is under `type` property and a payload
 * that is a Readonly property.
 */
export interface Action<TPayload> {
  payload: Readonly<TPayload>;
  type: string;
}

export interface ActionMut<TStore, TPayload> {
  (payload: TPayload): Action<TPayload>;
  toString(): string;
  toMutation(store: TStore, payload: TPayload): TStore;
}

export interface ActionMutNoPayload<TStore> {
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

/**
 * Reducer action creates an action that also contains a reducer mutation
 * function in it. You this one if your reducer mutation function dose not
 * have a payload.
 */
export function createReducerAction<TStore>(
  toMutation: (store: TStore) => TStore,
  name?: string,
): ActionMutNoPayload<TStore>;
/**
 * Reducer action creates an action that also contains a reducer mutation
 * function in it. You this one if your reducer mutation function has a payload.
 * Otherwise do not set payload type.
 */
export function createReducerAction<TStore, TPayload>(
  toMutation: (store: TStore, payload: TPayload) => TStore,
  name?: string,
): ActionMut<TStore, TPayload>;
export function createReducerAction<TStore, TPayload>(
  toMutation: (store: TStore, payload: TPayload) => TStore,
  name?: string,
): ActionMut<TStore, TPayload> {
  // add any due to typescript not seeing name property of function
  const type = name ? name : `${actionIncrementalIndex++}.${(toMutation as any).name}`;
  const action = payloadFunction(type) as ActionMut<TStore, TPayload>;
  action.toString = () => type;
  action.toMutation = toMutation;
  return action;
}

/**
 * Combine actions method connects multiple actions into single reducer.
 * You need to pass initial reducer state and actions list.
 */
export function combineActions<TStore>(
  initialState: TStore,
  actions: Array<ActionMut<TStore, any>>,
) {
  const mutations = actions.reduce<MutationMap<TStore>>(
    (previous: MutationMap<TStore>, current: ActionMut<TStore, any>) => {
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
