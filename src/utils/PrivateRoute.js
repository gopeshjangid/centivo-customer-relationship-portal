import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { validateToken } from '../services/service.validateAouthTokens';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const alreadySigned = sessionStorage.getItem('userSignedIn');
    validateToken.init();
    return (
        <Route
            {...rest}
            render={() => {
                return alreadySigned ? <Component {...rest} /> : <Redirect to="/" />
            }} />
    )
}

export default PrivateRoute;