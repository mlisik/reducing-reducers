import { makePagedReducer } from "./pagedReducer";

const successType = "successType";

const reducer = jest.fn();

const makeAction = ({
  type = successType,
  data = ["payload"],
  page = 1,
  totalPages = 10
} = {}) => ({
  type,
  meta: { previousAction: { meta: { page } } },
  payload: {
    data,
    rawData: { meta: { totalPages } }
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
  const action = makeAction();

  beforeEach(() => {
    result = pagedReducer(state, action);
  });

  it("should call wrapped reducer ", () => {
    expect(reducer).toBeCalledWith(state, action);
  });

  it("should reset data and produce correct paging", () => {
    expect(result).toEqual({
      data: ["payload"],
      nextPage: 2,
      totalPages: 10
    });
  });
});

describe("when called with success type and page in the middle", () => {
  const state = { data: ["item"] };
  const action = makeAction({ page: 2 });

  beforeEach(() => {
    result = pagedReducer(state, action);
  });

  it("should call wrapped reducer ", () => {
    expect(reducer).toBeCalledWith(state, action);
  });

  it("should add data and produce correct paging", () => {
    expect(result).toEqual({
      data: ["item", "payload"],
      nextPage: 3,
      totalPages: 10
    });
  });
});

describe("when called with success type and last page", () => {
  const state = { data: ["item"] };
  const action = makeAction({ page: 10 });

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

describe("with different response structure", () => {
  const state = { data: ["item"] };

  const action = {
    type: successType,
    meta: { previousAction: { meta: { page: 1 } } },
    payload: {
      data: {
        results: [
          {
            hits: ["payload"],
            nbPages: 10
          }
        ]
      }
    }
  };

  beforeEach(() => {
    reducer.mockImplementation((s, a) => {
      if (a.type === successType) {
        return { ...s, data: a.payload.data.results[0].hits };
      }

      return {
        ...s,
        hitDefaultCase: true
      };
    });

    const altPagedReducer = makePagedReducer(reducer, {
      successType,
      totalPagesPath: "payload.data.results[0].nbPages"
    });

    result = altPagedReducer(state, action);
  });

  it("should call wrapped reducer ", () => {
    expect(reducer).toBeCalledWith(state, action);
  });

  it("should reset data and produce correct paging", () => {
    expect(result).toEqual({
      data: ["payload"],
      nextPage: 2,
      totalPages: 10
    });
  });
});
