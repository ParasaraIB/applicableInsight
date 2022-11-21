import {
  LOGIN_ADMIN,
  CLEAR_TOKEN,
  SHOW_LOGINLOADING
} from "../actionTypes";

const initialState = {
  access_token: null,
  showLoginLoading: false
};

const adminReducer = (state=initialState, action) => {
  switch(action.type) {
    case LOGIN_ADMIN:
      return {
        ...state,
        access_token: action.payload
      };
    case CLEAR_TOKEN:
      return {
        ...state,
        access_token: null
      };
    case SHOW_LOGINLOADING:
      return {
        ...state,
        showLoginLoading: action.payload
      };
    default:
      return state;
  }
}

export default adminReducer;