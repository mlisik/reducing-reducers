import { makePagedReducer } from "./pagedReducer";

const successType = "successType";

const reducer = jest.fn();

const makeAction = ({
  type = successType,
  data = ["payload"],
  nextPage = 1,
  totalPages = 10
} = {}) => ({
  type,
  payload: {
    data,
    meta: { nextPage, totalPages }
  }
});

const pagedReducer = makePagedReducer(reducer, { successType });

let result;

beforeEach(() => {
  reducer.mockImplementation((state, action) => {
    if (action.type === successType) {
      return { ...state, data: action.payload.data };
    }

    return {
      ...state,
      hitDefaultCase: true
    };
  });
});

afterEach(() => {
  reducer.mockReset();
});

describe("when called with success type and first page ", () => {
  const state = { data: ["item"] };
  const action = makeAction({ nextPage: 1 });

  beforeEach(() => {
    result = pagedReducer(state, action);
  });

  it("should call wrapped reducer ", () => {
    expect(reducer).toBeCalledWith(state, action);
  });

  it("should reset data and produce correct paging", () => {
    expect(result).toEqual({
      data: ["payload"],
      nextPage: 1,
      totalPages: 10
    });
  });
});

describe("when called with success type and next page in the middle", () => {
  const state = { data: ["item"] };
  const action = makeAction({ nextPage: 5 });

  beforeEach(() => {
    result = pagedReducer(state, action);
  });

  it("should call wrapped reducer ", () => {
    expect(reducer).toBeCalledWith(state, action);
  });

  it("should add data and produce correct paging", () => {
    expect(result).toEqual({
      data: ["item", "payload"],
      nextPage: 5,
      totalPages: 10
    });
  });
});

describe("when called with success type and last page", () => {
  const state = { data: ["item"] };
  const action = makeAction({ nextPage: null });

  beforeEach(() => {
    result = pagedReducer(state, action);
  });

  it("should call wrapped reducer ", () => {
    expect(reducer).toBeCalledWith(state, action);
  });

  it("should add data and produce correct paging", () => {
    expect(result).toEqual({
      data: ["item", "payload"],
      nextPage: null,
      totalPages: 10
    });
  });
});

describe("when called with another type and first page", () => {
  const state = { nextPage: 2, totalPages: 10 };
  const action = makeAction({ type: "anotherType", page: 1 });

  beforeEach(() => {
    result = pagedReducer(state, action);
  });

  it("should call wrapped reducer ", () => {
    expect(reducer).toBeCalledWith(state, action);
  });

  it("should merge state and new state from reducer", () => {
    expect(result).toEqual({
      nextPage: 2,
      totalPages: 10,
      hitDefaultCase: true
    });
  });
});
