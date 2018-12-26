import act from './../../constants/actions.constants.js'

let nextProductId = 0;
export const addProduct = content => ({
  type: act.ADD_PRODUCT,
  payload: {
    id: ++nextProductId,
    content
  }
});

export const setUserAuth = content => ({
  type: act.SET_USER_AUTH,
  payload: content
});

export const setAppStarting = content => ({
  type: act.SET_APP_STARTING,
  payload: content
});

export const setToken = content => ({
  type: act.SET_TOKEN,
  payload: content
});

export const setSocket = content => ({
  type: act.SET_SOCKET,
  payload: content
});