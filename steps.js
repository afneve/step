"use strict";

var stepTracker = {
    stepsArray : [],
    friendsObject : {},
    init: function(){
        // If user hasn't authed with Fitbit, redirect to Fitbit OAuth Implicit Grant Flow
        var fitbitAccessToken;

        if (!window.location.hash) {
            window.location.replace('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=228JW3&&redirect_uri=https%3A%2F%2Fafneve.github.io%2Fstep%2F&scope=activity%20social%20profile');
            //
        } else {
            var fragmentQueryParameters = {};
            window.location.hash.slice(1).replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function($0, $1, $2, $3) { fragmentQueryParameters[$1] = $3; }
            );

            fitbitAccessToken = fragmentQueryParameters.access_token;
        }

    /*    fetch(
            'https://api.fitbit.com/1/user/-/activities/steps/date/today/7d.json',
        {
            headers: new Headers({
                'Authorization': 'Bearer ' + fitbitAccessToken
            }),
            mode: 'cors',
            method: 'GET'
        }
        ).then(stepTracker.processResponse)
        .then(stepTracker.processSteps)
        .catch(function(error) {
            console.log(error);
        });*/

        

        fetch(
            'https://api.fitbit.com/1/user/-/friends.json',
        {
            headers: new Headers({
                'Authorization': 'Bearer ' + fitbitAccessToken
            }),
            mode: 'cors',
            method: 'GET'
        }
        ).then(stepTracker.processResponse)
        .then(stepTracker.processFriends)
        .catch(function(error) {
            console.log(error);
        });

        fetch(
            'https://api.fitbit.com/1/user/-/profile.json',
        {
            headers: new Headers({
                'Authorization': 'Bearer ' + fitbitAccessToken
            }),
            mode: 'cors',
            method: 'GET'
        }
        ).then(stepTracker.processResponse)
        .then(stepTracker.processMe)
        .catch(function(error) {
            console.log(error);
        });
    },

    processMe: function(me){
        console.log(me);
        stepTracker.friendsObject.friends.push(me);
    },

    processFriends: function(friends){
        console.log(friends);
        stepTracker.friendsObject = friends;
    },

    processSteps : function(steps) {
        console.log(steps);
        console.log(steps['activities-steps']);

        var d = new Date();
        var n = d.getDay();
        var daysToDisplay = n;
        var stepsForWeek = 0;

        stepTracker.stepsArray = steps['activities-steps'];

        for(var i = stepTracker.stepsArray.length - 1; i >= stepTracker.stepsArray.length - n; i--){
            console.log(stepTracker.stepsArray[i].dateTime);
            stepsForWeek += parseInt(stepTracker.stepsArray[i].value);
        }
        $('body').html(stepsForWeek);

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


stepTracker.init();