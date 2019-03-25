import { reduceReducers } from "./reduceReducers";

const addEntityReducer = (state, action) => {
  switch (action.type) {
    case "addEntity":
      return {
        ...state,
        entities: [...state.entities, action.payload]
      };
    default:
      return state;
  }
};

const removeEntityReducer = (state, action) => {
  switch (action.type) {
    case "removeEntity":
      return {
        ...state,
        entities: state.entities.filter(el => el !== action.payload)
      };
    default:
      return state;
  }
};

const dirtyReducer = (state, action) => {
  switch (action.type) {
    case "addEntity":
    case "removeEntity":
      return {
        ...state,
        dirty: true
      };
  }
};

describe("when given mutually exclusive reducers", () => {
  const reducer = reduceReducers([addEntityReducer, removeEntityReducer], {});

  it("should create correct state on addEntity", () => {
    const state = { entities: ["oldEntity"] };
    const action = { type: "addEntity", payload: "newEntity" };
    const expected = { entities: ["oldEntity", "newEntity"] };
    const result = reducer(state, action);

    expect(result).toEqual(expected);
  });

  it("should create correct state on removeEntity", () => {
    const state = { entities: ["oldEntity"] };
    const action = { type: "removeEntity", payload: "oldEntity" };
    const expected = { entities: [] };
    const result = reducer(state, action);

    expect(result).toEqual(expected);
  });

  it("should create correct state on unsupported action", () => {
    const state = { entities: ["oldEntity"] };
    const action = { type: "noop", payload: "incompatible payload" };
    const expected = { entities: ["oldEntity"] };
    const result = reducer(state, action);

    expect(result).toEqual(expected);
  });
});

describe("when given reducers that are not mutually exclusive", () => {
  const reducer = reduceReducers(
    [addEntityReducer, removeEntityReducer, dirtyReducer],
    {}
  );

  it("should create correct state on addEntity", () => {
    const state = { entities: ["oldEntity"] };
    const action = { type: "addEntity", payload: "newEntity" };
    const expected = { entities: ["oldEntity", "newEntity"], dirty: true };
    const result = reducer(state, action);

    expect(result).toEqual(expected);
  });

  it("should create correct state on removeEntity", () => {
    const state = { entities: ["oldEntity"] };
    const action = { type: "removeEntity", payload: "oldEntity" };
    const expected = { entities: [], dirty: true };
    const result = reducer(state, action);

    expect(result).toEqual(expected);
  });
});
