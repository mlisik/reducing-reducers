import { makeApiReducer } from "./apiReducer";
import get from "lodash.get";

const reducer = makeApiReducer({
  types: ["request", "success", "failure"],
  dataTransform: ({ payload }) => [payload.toUpperCase()],
  errorTransform: ({ error }) => get(error, "response.data.errors[0]")
});

it("should return initial state for not matching types", () => {
  const action = {
    type: "noop"
  };

  const result = reducer(undefined, action);

  const expected = {
    data: [],
    error: null,
    isLoading: false
  };

  expect(result).toEqual(expected);
});

it("should return initialState for undefined state and actions of unsupported types", () => {
  const action = {
    type: "request"
  };

  const result = reducer(undefined, action);

  const expected = {
    data: [],
    error: null,
    isLoading: true
  };

  expect(result).toEqual(expected);
});

it("should transition to loading state on request action", () => {
  const state = {
    data: ["data"],
    error: "error",
    isLoading: false
  };

  const action = {
    type: "request"
  };

  const result = reducer(state, action);

  const expected = {
    data: ["data"],
    error: null,
    isLoading: true
  };

  expect(result).toEqual(expected);
});

it("should transform payload correctly (with undefined state)", () => {
  const action = {
    type: "success",
    payload: "payload"
  };

  const result = reducer(undefined, action);

  const expected = {
    data: ["PAYLOAD"],
    error: null,
    isLoading: false
  };

  expect(result).toEqual(expected);
});

it("should transform payload correctly (with previous state)", () => {
  const state = {
    data: ["OLD DATA"],
    error: "error",
    isLoading: true
  };

  const action = {
    type: "success",
    payload: "payload"
  };

  const result = reducer(state, action);

  const expected = {
    data: ["PAYLOAD"],
    error: null,
    isLoading: false
  };

  expect(result).toEqual(expected);
});

it("should transform error correctly (with undefined state)", () => {
  const action = {
    type: "failure",
    error: { response: { data: { errors: ["error"] } } }
  };

  const result = reducer(undefined, action);

  const expected = {
    data: [],
    error: "error",
    isLoading: false
  };

  expect(result).toEqual(expected);
});

it("should transform error correctly (with existing state)", () => {
  const state = {
    data: ["OLD DATA"],
    error: "old error",
    isLoading: true
  };

  const action = {
    type: "failure",
    error: { response: { data: { errors: ["error"] } } }
  };

  const result = reducer(state, action);

  const expected = {
    data: ["OLD DATA"],
    error: "error",
    isLoading: false
  };

  expect(result).toEqual(expected);
});
