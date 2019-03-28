const FAVORITES_REQUEST = "FAVORITES_REQUEST";
const FAVORITES_SUCCESS = "FAVORITES_SUCCESS";
const FAVORITES_FAILURE = "FAVORITES_FAILURE";

const build = data => data.map(el => el.toUpperCase());

const initialState = {
  data: [],
  error: null,
  isLoading: false
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
      const data = build(action.payload) || [];

      return {
        data,
        error: null,
        isLoading: false
      };
    }
    case FAVORITES_FAILURE:
      return {
        ...state,
        error: action.error,
        isLoading: false
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
