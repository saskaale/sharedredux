import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';

import reducer from './reducers';

//here place your middlewares
const middleware = [];

const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  });
const store = createStore(reducer, composeEnhancers(
    applyMiddleware(...middleware),
    // other store enhancers if any
  )
);

const dispatch = (o) => store.dispatch(o);

export {dispatch};
export default store;