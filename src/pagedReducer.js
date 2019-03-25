import get from "lodash.get";

const DEFAULT_TOTAL_PAGES_PATH = "payload.rawData.meta.totalPages";
const DEFAULT_REQUEST_ACTION_PAGE_PATH = "meta.previousAction.meta.page";

const buildPagination = (
  action,
  totalPagesPath = DEFAULT_TOTAL_PAGES_PATH,
  requestActionPagePath = DEFAULT_REQUEST_ACTION_PAGE_PATH
) => {
  const totalPages = get(action, totalPagesPath);
  const currentPage = get(action, requestActionPagePath);

  const nextPage = currentPage + 1;

  return {
    totalPages,
    currentPage,
    nextPage: nextPage > totalPages ? null : nextPage
  };
};

const buildPagedData = (state, data, currentPage, resetOnPageNumber = 1) => {
  if (currentPage === resetOnPageNumber) {
    return data;
  }
  return [...state.data, ...data];
};

/**
 * When given a reducer that produces `data` in it's success case,
 * this mutates it to include pagination data there as well.
 *
 * It relies on our API response structure (here, normalized json-api),
 * with paging data under `payload.rawData.meta`.
 *
 * It also requires the original request action to pass current page under it's `meta.page` key.

 * @param {Function} reducer reducer function
 * @param {object} options
 * @param {string} options.successType action type paging will be attached on
 * @param {string} options.totalPagesPath path in action object to query for totalPages number
 * @param {string} options.resetOnPageNumber indicates when to reset results
 */
const makePagedReducer = (reducer, options) => (
  state = reducer(undefined, {}),
  action
) => {
  switch (action.type) {
    case options.successType: {
      const { data, ...newState } = reducer(state, action);
      const { currentPage, nextPage, totalPages } = buildPagination(
        action,
        options.totalPagesPath
      );
      const pagedData = buildPagedData(
        state,
        data,
        currentPage,
        options.resetOnPageNumber
      );

      return {
        ...newState,
        nextPage,
        totalPages,
        data: pagedData
      };
    }
    default:
      return {
        ...state,
        ...reducer(state, action)
      };
  }
};

export { makePagedReducer };
