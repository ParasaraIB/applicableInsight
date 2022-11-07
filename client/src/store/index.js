import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose
} from "redux";
import thunk from "redux-thunk";

import adminReducer from "./reducers/adminReducer";
import numberReducer from "./reducers/numberReducer";

const reducers = combineReducers({
  adminReducer,
  numberReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = applyMiddleware(thunk);
const enhancer = composeEnhancers(middlewares);

const store = createStore(reducers, enhancer);

export default store;