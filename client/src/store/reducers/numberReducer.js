import {
  ADD_COUNTER
} from "../actionTypes";

const initialState = {
  numberInfo: null
};

const numberReducer = (state=initialState, action) => {
  switch(action.type) {
    case ADD_COUNTER:
      return {
        ...state,
        numberInfo: action.payload.newNumberInfo
      };
    default:
      return state;
  }
}

export default numberReducer;