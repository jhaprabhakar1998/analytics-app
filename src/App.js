import React, { useState, useEffect } from 'react';
import { withRouter, Switch, Route } from 'react-router';

import PATHS from './paths';

import { useLocation } from 'react-router-dom';

import AuthScreen from './containers/auth-screen/AuthScreen';
import AnalyticsScreen from './containers/analytics-screen/analytics-screen';
import CountryAnalysis from './containers/analytics-screen/country-analysis';
import MonthlyAnalysis from './containers/analytics-screen/monthly-analysis';
import QuaterlyAnalysis from './containers/analytics-screen/quaterly-analysis';

const isNULL = (obj) => {
    if (obj) {
        return false;
    }
    return true;
}

function App(props) {
    const routerLocation = useLocation().pathname;
    console.log(routerLocation);

    const getLoginUserDetails = localStorage.getItem("loginUserDetails");
    const authValue = isNULL(getLoginUserDetails) ? false : true;

    const [loginUserDetails, setLoginUserDetails] = useState(getLoginUserDetails);
    const [isAuth, SetIsAuth] = useState(authValue);

    const routes = [
        { path: PATHS.LOGIN, component: () => <AuthScreen props={props} isAuth={isAuth} setLoginUserDetails={setLoginUserDetails} /> },
        { path: PATHS.ANALYTICS_COUNTRY, component: () => <CountryAnalysis /> },
        { path: PATHS.ANALYTICS_MONTHLY, component: () => <MonthlyAnalysis /> },
        { path: PATHS.ANALYTICS_QUATERLY, component: () => <QuaterlyAnalysis /> },
        { path: PATHS.ANALYTICS, component: () => <AnalyticsScreen props={props} SetIsAuth={SetIsAuth} setLoginUserDetails={setLoginUserDetails} /> },
        { path: '/', component: () => <AuthScreen props={props} isAuth={isAuth} setLoginUserDetails={setLoginUserDetails} /> },
    ]

    useEffect(() => {
        let nextRoute = PATHS.ANALYTICS;
        if (routerLocation.includes(PATHS.ANALYTICS)) {
            nextRoute = routerLocation;
        }

        isNULL(loginUserDetails) ? localStorage.removeItem("loginUserDetails") : localStorage.setItem("loginUserDetails", loginUserDetails);
        isNULL(loginUserDetails) ? localStorage.setItem("isAuth", false) : localStorage.setItem("isAuth", true);
        isNULL(loginUserDetails) ? props.history.push(PATHS.LOGIN) : props.history.push(nextRoute);
        isNULL(loginUserDetails) ? SetIsAuth(false) : SetIsAuth(true);

    }, [loginUserDetails, isAuth, props.history]);

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
