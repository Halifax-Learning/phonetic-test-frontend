import { configureStore } from '@reduxjs/toolkit'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import rootReducer from './reducers/rootReducer'

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>

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
