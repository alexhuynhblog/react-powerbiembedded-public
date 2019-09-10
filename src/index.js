import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './Home';
import * as serviceWorker from './serviceWorker';
import { runWithAdal } from 'react-adal';
import { authContext } from './adalConfig';

import { BrowserRouter } from 'react-router-dom'

const DO_NOT_LOGIN = false;


runWithAdal(authContext, () => {

    ReactDOM.render(<BrowserRouter>
        <Home />
    </BrowserRouter>
        , document.getElementById('root'))


}, DO_NOT_LOGIN);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
