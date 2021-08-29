import React from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';

import { signinWithSocial } from "../../firebase";

import '../../style.css';

function AuthScreen({ props, setLoginUserDetails, isAuth }) {

    return (
        <div className={"login-screen"}>
            <div className={"login-screen-heading"}>
                Welcome To Demo Analytics App
            </div>
            <div className={"login-screen-buttons"}>
                <div className={"login-facebook"}>
                    <Button variant="contained" color="primary" onClick={() => signinWithSocial("facebook", true, setLoginUserDetails)}>
                        <FacebookIcon style={{ fontSize: 40 }} />
                        Login With Facebook
                    </Button>
                </div>
                <div className={"login-google"}>
                    <Button variant="contained" color="secondary" onClick={() => signinWithSocial("google", true, setLoginUserDetails)}>
                        <img src="https://img.icons8.com/office/30/000000/google-logo.png" alt={"Google logo"} className={"google-logo"} />
                        Login With Google
                    </Button>
                </div>
            </div>
        </div >
    );
}

export default withRouter(AuthScreen);