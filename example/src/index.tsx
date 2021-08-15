import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {createThemeTweaker} from 'theme-tweaker'

export type Theme = {my: string};
const theme: Theme = {my: 'theme'};

const Provider = createThemeTweaker();

ReactDOM.render(
    <Provider theme={theme}>
        <App />
    </Provider>
, document.getElementById('root'))
