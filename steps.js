"use strict";

var iceAge = {
    init: function(){
        // If user hasn't authed with Fitbit, redirect to Fitbit OAuth Implicit Grant Flow
        var fitbitAccessToken;

        if (!window.location.hash) {
            window.location.replace('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=228JW3&&redirect_uri=https%3A%2F%2Fafneve.github.io%2Fstep%2F&scope=activity');
            //
        } else {
            var fragmentQueryParameters = {};
            window.location.hash.slice(1).replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function($0, $1, $2, $3) { fragmentQueryParameters[$1] = $3; }
            );

            fitbitAccessToken = fragmentQueryParameters.access_token;
        }

        fetch(
            'https://api.fitbit.com/1/user/-/activities/steps/date/today/1m.json',
        {
            headers: new Headers({
                'Authorization': 'Bearer ' + fitbitAccessToken
            }),
            mode: 'cors',
            method: 'GET'
        }
        ).then(iceAge.processResponse)
        .then(iceAge.processSteps)
        .catch(function(error) {
            console.log(error);
        });
    },

    processSteps : function(steps) {
         console.log(steps);
        console.log(steps.activities_steps);
        var stepsArray = steps.activities_steps;
        document.write(stepsArray[stepsArray.length-1]);

    },

    // Make an API request and graph it
    processResponse : function(res) {
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
iceAge.init();