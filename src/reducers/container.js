import {ActionTypes} from '../actions/container';
import createReducer from '../lib/createReducer';

import {dispatch} from '../store';

const defaultState = {value: 12};

const {reducer} = createReducer((state = defaultState, action) => {
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
}, o => dispatch(o), {URL:'http://localhost:3333/container'}, {key: 'model_3'});

export default reducer;