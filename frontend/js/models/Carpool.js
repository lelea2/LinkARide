//File js/models/Carpool.js model
define([
    'jquery',
    'underscore',
    'backbone',
    'pubsub'
], function($, _, Backbone, PubSub) {
    var Carpool = Backbone.Model.extend({
        cpthat: this,
        carpools: {},
        count: 0,

        initialize: function() {
            Carpool.that = this;
            carpools = {};
            me = localStorage.getItem("userId");
        },

        getCarpools: function() {            
            var cpStartPoint = new Parse.GeoPoint(37.708813, -122.526398);
            var Carpools = Parse.Object.extend("Carpools");
            var query = new Parse.Query(Carpools);
            query.notEqualTo("userid", me);
            query.equalTo("status", 1);
            //query.equalTo("carPoolType", carpoolType);
            query.withinMiles("startPoint", cpStartPoint, 40);
            //query.near("startPoint", cpStartPoint);
            //query.ascending("startPoint");
            query.limit(5);
            query.find({
                success: function(results) {
                    console.log("Successfully retrieved " + results.length + " carpools.");
                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++) { 
                        var object = results[i];
                        var resultStartPoint = object.get('startPoint');
                        //if (object.get('carpoolType').toString() === localStorage.getItem("carpoolInfo")) {
                            Carpool.that.carpools[object.id] = {
                                'title' : object.get('title'),
                                'startDate' : object.get('startDate'),
                                'endDate' : object.get('endDate'),
                                'carpoolType' : object.get('carpoolType'),
                                'userid' : object.get('userid'),
                                'distance' : parseFloat(resultStartPoint.milesTo(cpStartPoint)).toFixed(2),
                                'carpoolId': object.id
                            };
                            Carpool.that.getUser(object.get('userid'), object.id, (i === results.length - 1));
                            Carpool.that.count = Carpool.that.count + 1;
                        //}
                    } 
                    //console.log(carpools);
                },
                error: function(error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        },

        getUser: function(userid, carpoolId, eventTrigger) {
            var RequesterObject = Parse.Object.extend("Users");
            var query = new Parse.Query(RequesterObject);
            var requester = {};
            query.equalTo("userid", userid);
            query.find({
                success: function(results) {
                    if (results != null && results.length > 0) {
                        for (var i = 0; i < results.length; i++) {
                            var requester = results[i]['attributes'];
                            //console.log(requester);
                            Carpool.that.carpools[carpoolId]['userinfo'] = {
                                'firstName' : requester['firstName'],
                                'lastName' : requester['lastName'],
                                'imgLink' : requester['imglink'],
                                'company' : requester['company'],
                                'currentTitle' : requester['currentTitle'],
                                'publicProfile' : requester['publicProfile'] 
                           };
                        }
                    }
                    if(eventTrigger) {
                        setTimeout(function() {
                            PubSub.trigger("linkaride:carpoolview");
                        }, 1000);
                    }
                },
                error: function(error) {

                }
            });
        },

        getSignedInUser: function() {
            return(localStorage.getItem("userId"));
        },

        getModel: function () {
            return Carpool.that;
        }
    });

    return Carpool;
});
