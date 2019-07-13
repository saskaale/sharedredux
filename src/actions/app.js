const URL = 'APP';

const ActionTypes = {
    SELECT: `${URL}_SELECT_CONTAINER`,
}

const select = (i) => ({
    type: ActionTypes.SELECT,
    payload: i
})

export {
    ActionTypes,
    select
};