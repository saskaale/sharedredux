import { combineReducers } from 'redux';

import container, {addSubscriber as addContainerSubscriber} from './container';
import app from './app';

export function addSubscriber(...args){
    addContainerSubscriber(...args);
}

export default combineReducers({
    container,
    app
});
