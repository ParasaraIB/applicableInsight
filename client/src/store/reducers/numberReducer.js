import {
  ADD_COUNTER, DELETE_DOCNUMBER, DELETE_DOCUMENT, DETAIL_DOCNUMBER, EDIT_DOCNUMBER, LIST_COUNTER, LIST_DOCNUMBER, LIST_DOCTYPE, LIST_UKER, SET_PAGE, SHOW_LOADING, UPLOAD_DOCUMENT
} from "../actionTypes";

const initialState = {
  numberInfo: null,
  numberInfos: [],
  docTypes: [],
  pages: 0,
  page: 0,
  ukers: [],
  detailDocNumber: null,
  isShowLoading: true,
  counters: []
};

const numberReducer = (state=initialState, action) => {
  switch(action.type) {
    case ADD_COUNTER:
      const returnedData = {
        ...state,
        numberInfo: action.payload.newNumberInfo,
        numberInfos: [action.payload.newNumberInfo].concat(state.numberInfos),
      };
      const nCounter = action.payload.newNumberInfo.counter_info;
      const nCounters = state.counters.filter(num => num._id !== nCounter._id);
      returnedData.counters = [...nCounters, nCounter];
      return returnedData;
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
      const newCounter = action.payload.docNumber.counter_info;
      const newCounters = state.counters.filter(num => num._id !== newCounter._id);
      returnedState.counters = [...newCounters, newCounter];
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
    case UPLOAD_DOCUMENT:
      return {
        ...state,
        detailDocNumber: action.payload.docNumber
      };
    case DELETE_DOCUMENT:
      return {
        ...state,
        detailDocNumber: action.payload.returnedDetail
      };
    case LIST_COUNTER:
      return {
        ...state,
        counters: action.payload.counters
      };
    default:
      return state;
  }
}

export default numberReducer;