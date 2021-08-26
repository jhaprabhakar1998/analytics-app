import React, { useState, useEffect } from 'react';
import { withRouter, Switch, Route } from 'react-router';

import PATHS from './paths';

import AuthScreen from './containers/auth-screen/AuthScreen';
import AnalyticsScreen from './containers/analytics-screen/analytics-screen';

function App(props) {
    const getIsAuth = localStorage.getItem("isAuth");
    const getGoogleLoginUserDetails = localStorage.getItem("googleLoginUserDetails");
    const [googleLoginUserDetails, setGoogleLoginUserDetails] = useState(getGoogleLoginUserDetails);
    const [isAuth, SetIsAuth] = useState(getIsAuth);

    const routes = [
        { path: PATHS.LOGIN, component: () => <AuthScreen props={props} isAuth={isAuth} setGoogleLoginUserDetails={setGoogleLoginUserDetails} /> },
        { path: PATHS.ANALYTICS, component: () => <AnalyticsScreen props={props} SetIsAuth={SetIsAuth} setGoogleLoginUserDetails={setGoogleLoginUserDetails} /> },
        { path: '/', component: () => <AuthScreen props={props} isAuth={isAuth} setGoogleLoginUserDetails={setGoogleLoginUserDetails} /> },
    ]

    useEffect(() => {
        googleLoginUserDetails !== '#' ? localStorage.setItem("isAuth", true) : localStorage.setItem("isAuth", false);
        localStorage.setItem("googleLoginUserDetails", googleLoginUserDetails);
        googleLoginUserDetails !== '#' ? props.history.push(PATHS.ANALYTICS) : props.history.push(PATHS.LOGIN);
        googleLoginUserDetails !== '#' ? SetIsAuth(true) : SetIsAuth(false);

    }, [googleLoginUserDetails, isAuth, props.history]);

    return (
        <div>
            <Switch>
                {
                    routes.map(route => (
                        <Route key={route.path} path={route.path} component={route.component} />
                    ))
                }
            </Switch>
        </div>
    );
}

export default withRouter(App);
