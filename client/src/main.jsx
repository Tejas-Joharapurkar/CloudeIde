import { enableMapSet } from "immer";
enableMapSet();

import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Provider} from "react-redux"
import store from './Store/index.js'
import './index.css'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <div className="app">
            <App />
        </div>
    </Provider>
)
