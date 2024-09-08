import { configureStore } from '@reduxjs/toolkit'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App.js'
import testReducer from './reducers/testReducer.js'
import testTypeReducer from './reducers/testTypeReducer.js'

const store = configureStore({
    reducer: {
        testTypes: testTypeReducer,
        test: testReducer,
    },
})

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('Root element not found')
}

createRoot(rootElement).render(
    <Provider store={store}>
        <StrictMode>
            <App />
        </StrictMode>
    </Provider>
)
