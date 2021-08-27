import React, { useState, useEffect } from 'react';
import { withRouter, Switch, Route } from 'react-router';

import PATHS from './paths';

import AuthScreen from './containers/auth-screen/AuthScreen';
import AnalyticsScreen from './containers/analytics-screen/analytics-screen';

const isNULL = (obj) => {
    if (obj) {
        return false;
    }
    return true;
}

function App(props) {
    const getGoogleLoginUserDetails = localStorage.getItem("googleLoginUserDetails");
    const authValue = isNULL(getGoogleLoginUserDetails) ? false : true;

    const [googleLoginUserDetails, setGoogleLoginUserDetails] = useState(getGoogleLoginUserDetails);
    const [isAuth, SetIsAuth] = useState(authValue);

    const routes = [
        { path: PATHS.LOGIN, component: () => <AuthScreen props={props} isAuth={isAuth} setGoogleLoginUserDetails={setGoogleLoginUserDetails} /> },
        { path: PATHS.ANALYTICS, component: () => <AnalyticsScreen props={props} SetIsAuth={SetIsAuth} setGoogleLoginUserDetails={setGoogleLoginUserDetails} /> },
        { path: '/', component: () => <AuthScreen props={props} isAuth={isAuth} setGoogleLoginUserDetails={setGoogleLoginUserDetails} /> },
    ]

    useEffect(() => {
        isNULL(googleLoginUserDetails) ? localStorage.removeItem("googleLoginUserDetails") : localStorage.setItem("googleLoginUserDetails", googleLoginUserDetails);
        isNULL(googleLoginUserDetails) ? localStorage.setItem("isAuth", false) : localStorage.setItem("isAuth", true);
        isNULL(googleLoginUserDetails) ? props.history.push(PATHS.LOGIN) : props.history.push(PATHS.ANALYTICS);
        isNULL(googleLoginUserDetails) ? SetIsAuth(false) : SetIsAuth(true);

    }, [googleLoginUserDetails, isAuth, props.history]);

    // console.log("check getIsAuth ", isAuth);
    // console.log("check googleLoginUserDetails ", googleLoginUserDetails);

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
