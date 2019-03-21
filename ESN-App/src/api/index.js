import * as firebase from 'firebase'

export default class Firebase {
    static init() {
        firebase.initializeApp({
            apiKey: "AIzaSyDavx19z8FXliXsu-5RuHIKC9eN0AO74Jc",
            authDomain: "internetservicesandapplication.firebaseapp.com",
            databaseURL: "https://internetservicesandapplication.firebaseio.com",
            projectId: "internetservicesandapplication",
            storageBucket: "internetservicesandapplication.appspot.com",
        })
    }
}

