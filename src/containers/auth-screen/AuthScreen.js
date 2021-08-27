import React from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';

import { signInWithGoogle } from "../../firebase";

import '../../style.css';

function AuthScreen({ props, setGoogleLoginUserDetails, isAuth }) {

    return (
        <div className={"login-screen"}>
            <div className={"login-screen-heading"}>
                Welcome To My App
            </div>
            <div className={"login-screen-buttons"}>
                <div className={"login-facebook"}>
                    <Button variant="contained" color="primary">
                        <FacebookIcon style={{ fontSize: 40 }} />
                        Login With Facebook
                    </Button>
                </div>
                <div className={"login-google"}>
                    <Button variant="contained" color="secondary" onClick={() => signInWithGoogle(setGoogleLoginUserDetails)}>
                        <img src="https://img.icons8.com/office/30/000000/google-logo.png" alt={"Google logo"} className={"google-logo"} />
                        Login With Google
                    </Button>
                </div>
            </div>
        </div >
    );
}

export default withRouter(AuthScreen);