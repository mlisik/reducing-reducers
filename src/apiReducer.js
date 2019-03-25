const defaultInitialState = {
  data: [],
  error: null,
  isLoading: false
};

const makeTypes = base => [
  `${base}_REQUEST`,
  `${base}_SUCCESS`,
  `${base}_FAILURE`
];

/**
 * Creates a reducer that will handle API requests.
 *
 * @param {Object} options
 * @param {string[]} options.types - [requestType, successType, failureType]
 * @param {function} options.dataTransform - will receive your action as its only argument
 * @param {function} options.errorTransform - will receive your action and previous state as arguments
 * @param {{ data: any, isLoading: boolean, error: any }} options.initialState - the initial state your reducer should use
 *
 * @returns reducer function
 */
const makeApiReducer = ({
  types: [requestType, successType, failureType],
  dataTransform = ({ payload }) => payload,
  errorTransform = ({ error }) => error,
  initialState = defaultInitialState
}) => (state = initialState, action) => {
  switch (action.type) {
    case requestType:
      return {
        ...state,
        error: null,
        isLoading: true
      };
    case successType:
      return {
        data: dataTransform(action, state),
        error: null,
        isLoading: false
      };
    case failureType:
      return {
        ...state,
        error: errorTransform(action),
        isLoading: false
      };
    default:
      return state;
  }
};

export { makeApiReducer };
