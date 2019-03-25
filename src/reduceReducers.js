const reduceReducers = (reducers, defaultState) => (state, action) => {
  const initialState =
    defaultState || reducers[0](undefined, { type: undefined });

  return reducers.reduce(
    (accState, reducer) => reducer(accState, action),
    state || initialState
  );
};

export { reduceReducers };
