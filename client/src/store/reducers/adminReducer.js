import {
  LOGIN_ADMIN,
  CLEAR_TOKEN
} from "../actionTypes";

const initialState = {
  access_token: null
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
    default:
      return state;
  }
}

export default adminReducer;