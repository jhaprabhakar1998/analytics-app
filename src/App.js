import React, { useState, useEffect } from 'react';
import { withRouter, Switch, Route } from 'react-router';

import PATHS from './paths';

import AuthScreen from './auth-screen/AuthScreen';
import AnalyticsScreen from './analytics-screen/analytics-screen';

const routes = [
    { path: PATHS.LOGIN, component: () => <AuthScreen /> },
    { path: PATHS.ANALYTICS, component: () => <AnalyticsScreen /> }
]

function App() {
    const getIsAuth = localStorage.getItem("isAuth");
    const getGoogleLoginUserDetails = localStorage.getItem("googleLoginUserDetails");
    const [googleLoginUserDetails, setGoogleLoginUserDetails] = useState(getGoogleLoginUserDetails);
    const [isAuth, SetIsAuth] = useState(getIsAuth);
    const [currentLoggedUser, SetCurrentLoggedUser] = useState('');

    console.log("getisAuth value", getIsAuth);
    console.log("isAuth value", isAuth);
    console.log("currentLoggedUser", currentLoggedUser);
    console.log("googleLoginUserDetails ", JSON.stringify(googleLoginUserDetails));

    useEffect(() => {
        // Update the document title using the browser API
        console.log("googleLoginUserDetails in useEffect", googleLoginUserDetails);

        googleLoginUserDetails ? localStorage.setItem("isAuth", true) : localStorage.setItem("isAuth", false);

        localStorage.setItem("googleLoginUserDetails", googleLoginUserDetails);

        console.log("isAuth in useEffect", localStorage.getItem("isAuth"));
        console.log("googleLoginUserDetails in useEffect", localStorage.getItem("googleLoginUserDetails"));
    }, [googleLoginUserDetails]);

    return (
        <div>
            {/* {isAuth === true ? <AnalyticsScreen /> : <AuthScreen SetIsAuth={SetIsAuth} SetCurrentLoggedUser={SetCurrentLoggedUser} setGoogleLoginUserDetails={setGoogleLoginUserDetails} />}
            {isAuth === true ? <h1>isAuth is true</h1> : <h1>isAuth is false</h1>} */}

            <Switch>
                {
                    routes.map(route => (
                        <Route key={route.path} path={route.path} component={route.component} />
                    ))
                }
                <Route component={AuthScreen} />
            </Switch>
        </div>
    );
}

export default App;
