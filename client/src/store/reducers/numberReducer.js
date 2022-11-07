import {
  ADD_COUNTER, DELETE_DOCNUMBER, DETAIL_DOCNUMBER, EDIT_DOCNUMBER, LIST_DOCNUMBER, LIST_DOCTYPE, LIST_UKER, SET_PAGE, SHOW_LOADING
} from "../actionTypes";

const initialState = {
  numberInfo: null,
  numberInfos: [],
  docTypes: [],
  pages: 0,
  page: 0,
  ukers: [],
  detailDocNumber: null,
  isShowLoading: true
};

const numberReducer = (state=initialState, action) => {
  switch(action.type) {
    case ADD_COUNTER:
      return {
        ...state,
        numberInfo: action.payload.newNumberInfo,
        numberInfos: [action.payload.newNumberInfo].concat(state.numberInfos)
      };
    case LIST_DOCNUMBER:
      return {
        ...state,
        numberInfos: action.payload.numberInfos,
        pages: action.payload.pages
      };
    case LIST_DOCTYPE:
      return {
        ...state,
        docTypes: action.payload.docTypes
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.page
      };
    case LIST_UKER:
      return {
        ...state,
        ukers: action.payload.ukers
      };
    case DETAIL_DOCNUMBER:
      return {
        ...state,
        detailDocNumber: action.payload.docNumber
      };
    case DELETE_DOCNUMBER:
      const notDeleted = state.numberInfos.filter(num => num._id !== action.payload.docNumber._id);
      const returnedState = {
        ...state,
        numberInfos: notDeleted
      };
      if (state.numberInfo && (action.payload.docNumber._id === state.numberInfo._id)) returnedState.numberInfo = null;
      return returnedState;
    case EDIT_DOCNUMBER:
      const filteredDocNumber = state.numberInfos.filter(num => num._id !== action.payload.editedDocNumber._id);
      return {
        ...state,
        numberInfos: filteredDocNumber.concat(action.payload.editedDocNumber),
        detailDocNumber: action.payload.editedDocNumber
      };
    case SHOW_LOADING:
      return {
        ...state,
        isShowLoading: action.payload
      };
    default:
      return state;
  }
}

export default numberReducer;