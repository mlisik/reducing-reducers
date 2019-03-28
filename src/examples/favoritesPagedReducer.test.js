import reducer, {
  initialState,
  FAVORITES_REQUEST,
  FAVORITES_SUCCESS,
  FAVORITES_FAILURE
} from "./favoritesPagedReducer";

it("should return initial state for not matching types", () => {
  const action = {
    type: "noop"
  };

  const result = reducer(undefined, action);

  const expected = initialState;

  expect(result).toEqual(expected);
});

it("should return initialState for undefined state and actions of unsupported types", () => {
  const action = {
    type: FAVORITES_REQUEST
  };

  const result = reducer(undefined, action);

  const expected = {
    ...initialState,
    isLoading: true
  };

  expect(result).toEqual(expected);
});

it("should transition to loading state on request action", () => {
  const state = {
    ...initialState,
    data: ["data"],
    error: "error"
  };

  const action = {
    type: FAVORITES_REQUEST
  };

  const result = reducer(state, action);

  const expected = {
    ...initialState,
    data: ["data"],
    isLoading: true
  };

  expect(result).toEqual(expected);
});

it("should transform payload correctly (with undefined state)", () => {
  const action = {
    type: FAVORITES_SUCCESS,
    payload: { data: ["payload"], meta: { total: 10 } },
    meta: { page: 0 }
  };

  const result = reducer(undefined, action);

  const expected = {
    ...initialState,
    data: ["PAYLOAD"],
    nextPage: 1,
    totalPages: 10
  };

  expect(result).toEqual(expected);
});

it("should transform payload correctly (with previous state)", () => {
  const state = {
    ...initialState,
    data: ["OLD DATA"],
    error: "error",
    isLoading: true
  };

  const action = {
    type: FAVORITES_SUCCESS,
    payload: { data: ["payload"], meta: { total: 10 } },
    meta: { page: 10 }
  };

  const result = reducer(state, action);

  const expected = {
    ...initialState,
    data: ["OLD DATA", "PAYLOAD"],
    nextPage: null,
    totalPages: 10
  };

  expect(result).toEqual(expected);
});

it("should transform payload correctly and reset state (with previous state and next page = 0)", () => {
  const state = {
    ...initialState,
    data: ["OLD DATA"],
    error: "error",
    isLoading: true
  };

  const action = {
    type: FAVORITES_SUCCESS,
    payload: { data: ["payload"], meta: { total: 10 } },
    meta: { page: 0 }
  };

  const result = reducer(state, action);

  const expected = {
    ...initialState,
    data: ["PAYLOAD"],
    nextPage: 1,
    totalPages: 10
  };

  expect(result).toEqual(expected);
});

it("should transform error correctly (with undefined state)", () => {
  const action = {
    type: FAVORITES_FAILURE,
    error: "error"
  };

  const result = reducer(undefined, action);

  const expected = {
    ...initialState,
    data: [],
    error: "error"
  };

  expect(result).toEqual(expected);
});

it("should transform error correctly (with existing state)", () => {
  const state = {
    ...initialState,
    data: ["OLD DATA"],
    error: "old error",
    isLoading: true
  };

  const action = {
    type: FAVORITES_FAILURE,
    error: "error"
  };

  const result = reducer(state, action);

  const expected = {
    ...initialState,
    data: ["OLD DATA"],
    error: "error",
    isLoading: false
  };

  expect(result).toEqual(expected);
});
