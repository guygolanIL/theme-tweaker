import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {createThemeTweaker} from 'theme-tweaker'

const Provider = createThemeTweaker();

ReactDOM.render(
    <Provider theme={{my: 'theme'}}>
        <App />
    </Provider>
, document.getElementById('root'))
