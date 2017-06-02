"use strict";

var stepTracker = {
    stepsArray : [],
    friendsObject : {},
    fitbitAccessToken: '',
    friendsCounter: 0,
    init: function(){
        // If user hasn't authed with Fitbit, redirect to Fitbit OAuth Implicit Grant Flow

        if (!window.location.hash) {
            window.location.replace('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=228JW3&&redirect_uri=https%3A%2F%2Fafneve.github.io%2Fstep%2F&scope=activity%20social%20profile');
            //
        } else {
            var fragmentQueryParameters = {};
            window.location.hash.slice(1).replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function($0, $1, $2, $3) { fragmentQueryParameters[$1] = $3; }
            );

            stepTracker.fitbitAccessToken = fragmentQueryParameters.access_token;
        }

        fetch(
            'https://api.fitbit.com/1/user/-/friends.json',
        {
            headers: new Headers({
                'Authorization': 'Bearer ' + stepTracker.fitbitAccessToken
            }),
            mode: 'cors',
            method: 'GET'
        }
        ).then(stepTracker.processResponse)
        .then(stepTracker.processFriends)
        .then(stepTracker.getMe)
        .catch(function(error) {
            console.log(error);
        });

        
    },

    getMe: function(){
        fetch(
            'https://api.fitbit.com/1/user/-/profile.json',
        {
            headers: new Headers({
                'Authorization': 'Bearer ' + stepTracker.fitbitAccessToken
            }),
            mode: 'cors',
            method: 'GET'
        }
        ).then(stepTracker.processResponse)
        .then(stepTracker.processMe)
        .then(stepTracker.processObject)
        .catch(function(error) {
            console.log(error);
        });
    },

    processObject: function(){
        var html = '';

        if(stepTracker.friendsObject.friends[stepTracker.friendsCounter] != undefined){
            fetch(
            'https://api.fitbit.com/1/user/'+ stepTracker.friendsObject.friends[stepTracker.friendsCounter].user.encodedId  +'/activities/steps/date/today/7d.json',
            {
                headers: new Headers({
                    'Authorization': 'Bearer ' + stepTracker.fitbitAccessToken
                }),
                mode: 'cors',
                method: 'GET'
            }
            ).then(stepTracker.processResponse)
            .then(stepTracker.addSteps)
            .catch(function(error) {
                console.log(error);
                stepTracker.friendsCounter++;
                stepTracker.processObject();
            });
        }
        else{
            
            for(var i = 0; i < stepTracker.friendsObject.friends[i].length; i++){
                if(stepTracker.friendsObject.friends[i].user.hasOwnProperty('steps')){
                    html += '<div class="user">';
                    html += '<img src="' + stepTracker.friendsObject.friends[i].user.avatar150 + '"/>';
                    html += '<div>' + stepTracker.friendsObject.friends[i].user.firstName + '</div>';
                    html += '<div>' + stepTracker.friendsObject.friends[i].user.steps + '</div>';
                    html += '</div>';
                }
            }
            $('body').html(html);
        }
    },

    addSteps: function(steps){

        var d = new Date();
        var n = d.getDay();
        var daysToDisplay = n;
        var stepsForWeek = 0;

        stepTracker.stepsArray = steps['activities-steps'];

        for(var i = stepTracker.stepsArray.length - 1; i >= stepTracker.stepsArray.length - n; i--){
            console.log(stepTracker.stepsArray[i].dateTime);
            stepsForWeek += parseInt(stepTracker.stepsArray[i].value);
        }

        stepTracker.friendsObject.friends[stepTracker.friendsCounter].user.steps = stepsForWeek;
        //$('body').html(stepsForWeek);

        stepTracker.friendsCounter++;
        stepTracker.processObject();
    },

    processMe: function(me){
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