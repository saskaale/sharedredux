const URL = 'CONTAINER';

const ActionTypes = {
    ADD: `${URL}_ADD`,
}

const addInteger = (i) => ({
    type: ActionTypes.ADD,
    payload: i
})

export {
    ActionTypes,
    addInteger
};