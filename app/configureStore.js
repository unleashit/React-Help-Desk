import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
// import {saveChatState} from './libs/utils';
import throttle from 'lodash/throttle';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

export default function configureStore(initialState) {
    const store = createStoreWithMiddleware(
        rootReducer,
        initialState,
        typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' && !process.env.NODE_ENV ?
            window.devToolsExtension() :
            f => f
    );

    // store.subscribe(throttle(() => {
    //     saveChatState({
    //         liveChat: store.getState().liveChat
    //     });
    // }), 5000);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
