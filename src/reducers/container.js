import {ActionTypes} from '../actions/container';
import createReducer from '../lib/createReducer';

import {dispatch} from '../store';

const defaultState = {value: 12};

const {reducer, addSubscriber} = createReducer((state = defaultState, action) => {
    const {type, payload} = action;


    switch (type){
        case ActionTypes.ADD:
            return {
                ...state,
                value: state.value+payload
            }
        default:
            return state;
    }
}, o => dispatch(o), {URL:'http://localhost:3333/container'}, (state) => ({key: `model_${state.app.container}`}));

export {addSubscriber};
export default reducer;