const FAVORITES_REQUEST = "FAVORITES_REQUEST";
const FAVORITES_SUCCESS = "FAVORITES_SUCCESS";
const FAVORITES_FAILURE = "FAVORITES_FAILURE";

const build = data => data.map(el => el.toUpperCase());

const initialState = {
  data: [],
  error: null,
  isLoading: false,
  nextPage: null,
  totalPages: null
};

const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FAVORITES_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true
      };
    case FAVORITES_SUCCESS: {
      const currentPage = action.meta.page;
      const shouldResetData = currentPage === 0;
      const newData = build(action.payload.data);
      const nextPage = currentPage + 1;
      const totalPages = action.payload.meta.total;

      const data = shouldResetData ? newData : [...state.data, ...newData];

      return {
        ...state,
        data,
        error: null,
        isLoading: false,
        nextPage: nextPage <= totalPages ? nextPage : null,
        totalPages
      };
    }
    case FAVORITES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default favoritesReducer;
export {
  initialState,
  FAVORITES_REQUEST,
  FAVORITES_SUCCESS,
  FAVORITES_FAILURE
};
