/**
 * When given a reducer that produces `data` in it's success case,
 * this mutates it to include pagination data there as well.
 *
 * It relies on a specific API response structure,
 * with paging data under `payload.meta`.
 *
 * @param {Function} reducer reducer function
 * @param {object} options
 * @param {string} options.successType action type paging will be attached on
 */
const makePagedReducer = (reducer, options) => (
  state = reducer(undefined, {}),
  action
) => {
  switch (action.type) {
    case options.successType: {
      const { data, ...newState } = reducer(state, action);
      const { nextPage, totalPages } = action.payload.meta;

      const pagedData = nextPage === 1 ? data : [...state.data, ...data];

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
