import React, { useState, useEffect } from 'react';

import { withRouter, Switch, Route } from 'react-router';
import { useLocation } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import AuthScreen from './containers/auth-screen/auth-screen';
import AnalyticsScreen from './containers/analytics-screen/analytics-screen';
import CountryAnalysis from './containers/analytics-screen/country-analysis-screen';
import MonthlyAnalysis from './containers/analytics-screen/monthly-analysis-screen';
import QuaterlyAnalysis from './containers/analytics-screen/quaterly-analysis-screen';

import PATHS from './paths';
import { realtimedb } from './firebase';

const isNULL = (obj) => {
    if (obj) {
        return false;
    }
    return true;
}

function App(props) {
    /* Maintain the authentication as well as persist state. */
    const routerLocation = useLocation().pathname;
    console.log(routerLocation);

    const getLoginUserDetails = localStorage.getItem("loginUserDetails");
    const authValue = isNULL(getLoginUserDetails) ? false : true;

    const [loginUserDetails, setLoginUserDetails] = useState(getLoginUserDetails);
    const [isAuth, SetIsAuth] = useState(authValue);

    const routes = [
        { path: PATHS.LOGIN, component: () => <AuthScreen props={props} isAuth={isAuth} setLoginUserDetails={setLoginUserDetails} /> },
        { path: PATHS.ANALYTICS_COUNTRY, component: () => <CountryAnalysis props={props} data={allRevenueData} /> },
        { path: PATHS.ANALYTICS_MONTHLY, component: () => <MonthlyAnalysis props={props} data={allRevenueData} /> },
        { path: PATHS.ANALYTICS_QUATERLY, component: () => <QuaterlyAnalysis props={props} data={allRevenueData} /> },
        { path: PATHS.ANALYTICS, component: () => <AnalyticsScreen props={props} data={allRevenueData} /> },
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

    }, [loginUserDetails, isAuth, props.history, routerLocation]);

    /* When the user has successfully logged in fetch the data and set up the default routes correctly which now can be accessed by authenticated user.*/
    let [allRevenueData, setAllRevenueData] = useState([]);
    const countryAnalysispath = PATHS.ANALYTICS_COUNTRY.replace(':name', 'india');
    const quaterlyAnalysispath = PATHS.ANALYTICS_QUATERLY.replace(':id', '1');
    const monthlyAnalysispath = PATHS.ANALYTICS_MONTHLY.replace(':id', '1')

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = (SetIsAuth, setLoginUserDetails) => {
        localStorage.clear();
        setLoginUserDetails(null);
        SetIsAuth(false);
        props.history.push('/');
    };

    if (allRevenueData.length === 0 && authValue === true) {
        realtimedb.ref().on("value", snapshot => {
            let allRevenueData = [];
            if (snapshot) {
                snapshot.forEach(snap => {
                    const objData = snap.val();
                    for (let key in objData) {
                        if (objData.hasOwnProperty(key)) {
                            if (key !== "Company" && key !== "Country") {
                                let numWithCommas = objData[key].toString();
                                const numWithoutCommas = numWithCommas.replace(/[.,\s]/g, "");
                                const revenue = parseInt(numWithoutCommas);
                                objData[key] = revenue;
                            }
                        }
                    }
                    allRevenueData.push(objData);
                });
                setAllRevenueData(allRevenueData)
            }
        })
    }

    return (
        <div>
            {
                isAuth ?
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" className={"nav-item"} onClick={() => props.history.push(PATHS.ANALYTICS)}>
                                Revenue Figure
                            </Typography>
                            <Typography variant="h6" className={"nav-item"} onClick={() => props.history.push(countryAnalysispath)}>
                                Country Analysis
                            </Typography>
                            <Typography variant="h6" className={"nav-item"} onClick={() => props.history.push(monthlyAnalysispath)}>
                                Monthly Analysis
                            </Typography>
                            <Typography variant="h6" className={"nav-item"} onClick={() => props.history.push(quaterlyAnalysispath)}>
                                Quarterly Analysis
                            </Typography>
                            {(
                                <div>
                                    <IconButton
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={() => handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={() => handleLogOut(SetIsAuth, setLoginUserDetails)}>Log Out</MenuItem>
                                    </Menu>
                                </div>
                            )}
                        </Toolbar>
                    </AppBar>
                    :
                    null
            }
            <Switch>
                {
                    routes.map(route => (
                        <Route key={route.path} path={route.path} component={route.component} />
                    ))
                }
            </Switch>
        </div >
    );
}

export default withRouter(App);
