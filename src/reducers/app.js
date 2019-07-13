import {ActionTypes} from '../actions/app';

const defaultState = {container: 12};

const reducer = (state = defaultState, action) => {
    const {type, payload} = action;


    switch (type){
        case ActionTypes.SELECT:
            return {
                ...state,
                container: payload
            }
        default:
            return state;
    }
};

export default reducer;