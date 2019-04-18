// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    // 'facebookAuth' : {
    //     'clientID'      : 'your-secret-clientID-here', // your App ID
    //     'clientSecret'  : 'your-client-secret-here', // your App Secret
    //     'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    // },

    // 'twitterAuth' : {
    //     'consumerKey'       : 'your-consumer-key-here',
    //     'consumerSecret'    : 'your-client-secret-here',
    //     'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    // },

    'googleAuth' : {
        'clientID'      : '403499052685-6kocp4poer25rf9bc6eprko825b2v2uj.apps.googleusercontent.com',
        'clientSecret'  : 't7ZOmoaWGlTYbZvr2EGgjrUe',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};
