
import React, { useState } from 'react';
import { withRouter } from 'react-router';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { realtimedb } from '../../firebase';
import '../../style.css';

function AnalyticsScreen({ props, SetIsAuth, setGoogleLoginUserDetails }) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    let [allRevenueData, setAllRevenueData] = useState([]);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = (SetIsAuth, setGoogleLoginUserDetails) => {
        localStorage.setItem("isAuth", false);
        localStorage.setItem("googleLoginUserDetails", '#');
        setGoogleLoginUserDetails('#');
        SetIsAuth(false);
        props.history.push('/');
    };

    if (allRevenueData.length === 0) {
        realtimedb.ref().on("value", snapshot => {
            let allRevenueData = [];
            if (snapshot) {
                snapshot.forEach(snap => {
                    allRevenueData.push(snap.val());
                });
                setAllRevenueData(allRevenueData)
            }
        })
    }

    console.log("all revenue data ", allRevenueData);

    return (
        <div>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" id={"menu-icon"} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={"nav-item"} >
                            Photos
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
                                    <MenuItem onClick={() => handleLogOut(SetIsAuth, setGoogleLoginUserDetails)}>Log Out</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
            <h1 style={{ textAlign: 'center' }}>Welcome to AnalyticsScreen.</h1>
        </div>
    );
}

export default withRouter(AnalyticsScreen);