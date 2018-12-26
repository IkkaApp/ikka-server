import act from './../../constants/actions.constants.js'

const initialState = {
  products: [],
  isConnected: false,
  isStarting: true,
  token: '',
  socket: undefined
}

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case act.ADD_PRODUCT:
      return Object.assign({}, state, {
        products: state.products.concat(action.payload)
      });
    case act.SET_USER_AUTH:
      return Object.assign({}, state, {
        isConnected: action.payload
      });
    case act.SET_APP_STARTING:
      return Object.assign({}, state, {
        isStarting: action.payload
      });
    case act.SET_TOKEN:
      return Object.assign({}, state, {
        token: action.payload
      });
    case act.SET_SOCKET:
      return Object.assign({}, state, {
        socket: action.payload
      });
    default:
      return state;
  }
}

export default rootReducer;