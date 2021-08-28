import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/database';
import "firebase/auth";

const firebaseConfig = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
})

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const auth = app.auth();
const db = app.firestore();
const realtimedb = firebase.database();

const googleProvider = new firebase.auth.GoogleAuthProvider();

const signinWithSocial = async (provider, rememberMe = false, setLoginUserDetails) => {
    try {
        console.log("Here I am inside signinWithSocial beginning");
        const persistence = rememberMe
            ? firebase.auth.Auth.Persistence.LOCAL
            : firebase.auth.Auth.Persistence.SESSION;

        await firebase.auth().setPersistence(persistence).then((res) => { console.log("response ", res) });
        console.log("Here I am inside signinWithSocial");

        const providers = {
            google: firebase.auth.GoogleAuthProvider,
            facebook: firebase.auth.FacebookAuthProvider,
            twitter: firebase.auth.TwitterAuthProvider,
        };

        const res = await firebase
            .auth()
            .signInWithPopup(new providers[provider]());

        console.log("res", res);
        setLoginUserDetails("hello");
    }
    catch (err) {
        console.log("error ", err);
    }
}

const signInWithGoogle = async (setGoogleLoginUserDetails) => {
    try {
        console.log("inside signInwithGoogle beginning");
        const res = await auth.signInWithPopup(googleProvider);
        const user = res.user;
        const query = await db
            .collection("users")
            .where("uid", "==", user.uid)
            .get();
        if (query.docs.length === 0) {
            await db.collection("users").add({
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
        console.log("inside signInwithGoogle");
        setGoogleLoginUserDetails(user.email);

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    auth.signOut();
};

export {
    auth,
    db,
    realtimedb,
    signInWithGoogle,
    logout,
    signinWithSocial
};