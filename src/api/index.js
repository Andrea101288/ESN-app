import * as firebase from 'firebase'

export default class Firebase {
    static init() {
        firebase.initializeApp({
            apiKey: "<apikey>",
            authDomain: "FireBaseDomainName",
            databaseURL: "<FireBAseDatabseURL>",
            projectId: "internetservicesandapplication",
            storageBucket: "internetservicesandapplication.appspot.com",
        })
    }
}

