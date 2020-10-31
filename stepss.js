"use strict";

var sleepTracker = {
    fitbitAccessToken: '',
    init: function(){
        // If user hasn't authed with Fitbit, redirect to Fitbit OAuth Implicit Grant Flow

        if (!window.location.hash) {
            window.location.replace('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=228JW3&&redirect_uri=https%3A%2F%2Fafneve.github.io%2Fstep%2F&scope=sleep');
            //
        } else {
            var fragmentQueryParameters = {};
            window.location.hash.slice(1).replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function($0, $1, $2, $3) { fragmentQueryParameters[$1] = $3; }
            );

            sleepTracker.fitbitAccessToken = fragmentQueryParameters.access_token;
        }

        fetch(
            'https://api.fitbit.com/1.2/user/-/sleep/date/2020-04-02/2020-10-08.json',
        {
            headers: new Headers({
                'Authorization': 'Bearer ' + sleepTracker.fitbitAccessToken
            }),
            mode: 'cors',
            method: 'GET'
        }
        ).then(sleepTracker.processResponse)
        .catch(function(error) {
            console.log(error);
        });

        
    },

    // Make an API request and graph it
    processResponse : function(res) {
        console.log('Res: ', res)
        //console.log(res);
        //console.log(res.json());
    if (!res.ok) {
        throw new Error('Fitbit API request failed: ' + res);
    }
 
    var contentType = res.headers.get('content-type')
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return res.json();
    } else {
        throw new Error('JSON expected but received ' + contentType);
    }
}
};


sleepTracker.init();