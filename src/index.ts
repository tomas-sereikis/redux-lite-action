export type MutationFunction<TStore, TPayload> = (
  store: TStore,
  payload: TPayload,
) => TStore;

export interface MutationMap<TStore> {
  [type: string]: MutationFunction<TStore, any>;
}

export interface Action<TPayload> {
  payload: Readonly<TPayload>;
  type: string;
}

export interface ActionClass<TStore, TPayload> {
  new (payload: TPayload): Action<TPayload>;
  toString(): string;
  toMutation(store: Readonly<TStore>, payload: Readonly<TPayload>): Readonly<TStore>;
}

let actionIncrementalIndex = 1;

export function createReducerAction<TStore, TPayload>(
  mutation: MutationFunction<TStore, TPayload>,
): ActionClass<TStore, TPayload> {
  // add any due to typescript not seeing name property of function
  const type = `${actionIncrementalIndex++}.${(mutation as any).name}`;
  return class {
    static toString() {
      return type;
    }
    static toMutation(store: Readonly<TStore>, payload: Readonly<TPayload>) {
      return mutation(store, payload);
    }
    public type: string = type;
    constructor(public payload: Readonly<TPayload>) {
    }
  };
}

export function combineActions<TStore>(
  initialState: Readonly<TStore>,
  reducers: Array<ActionClass<TStore, any>>,
) {
  const mutations = reducers.reduce<MutationMap<TStore>>(
    (previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue.toString()]: currentValue.toMutation,
      };
    },
    { } as MutationMap<TStore>,
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
