import { combineReducers } from 'redux';

const appReducer = combineReducers({

})

const rootReducer = ( state, action ) => {
    if( action.type === "USER_LOGOUT" ) {
        // Object.keys(state).forEach(key => {
        //     persistState.removeItem(`persist:${key}`);
        // });
        state = undefined;
    }
        
    return appReducer(state, action)
}

export default rootReducer;