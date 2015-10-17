//File js/models/Invite.js model
define([
    'jquery',
    'underscore',
    'backbone',
    'pubsub'
], function($, _, Backbone, PubSub){
    var Invite = Backbone.Model.extend({
        that: this,
        invites: {},
        requesters: {},
        carpools: {},

        initialize: function() {
            Invite.that = this;
            this.invites = {};
            this.requesters = {};
            this.carpools = {};
            requesterIds = new Array();
            carpoolIds = new Array();
            me = this.getSignedInUser();
        },

        getInvites: function() {
            //Get Invite Data in Parse Table
            var InviteObject = Parse.Object.extend("Invites");
            var driverQuery = new Parse.Query(InviteObject);
            driverQuery.equalTo("driverId", me);
            var passengerQuery = new Parse.Query(InviteObject);
            passengerQuery.equalTo("passengerId", me);
            var mainQuery = Parse.Query.or(driverQuery, passengerQuery);
            mainQuery.equalTo("status", 2);
            mainQuery.find({
                success: function(results) {
                    if(results.length > 0) {
                        for (var i = 0; i < results.length; i++) {
                            var invite = results[i]['attributes'];
                            var requesterId = null;
                            if (invite['driverId'] == me) {
                                requesterId = invite['passengerId'];
                            } else {
                                requesterId = invite['driverId'];
                            }
                            requesterIds.push(requesterId);
                            carpoolIds.push(invite['carpoolId']);
                            Invite.that.invites[results[i]['id']] = {
                                'message' : invite['message'],
                                'requesterId' : requesterId
                            };
                        }
                        Invite.that.getRequesters();
                    }
                },
                error: function(error) {
                }
            });
        },

        getRequesters: function() {
            var RequesterObject = Parse.Object.extend("Users");
            var query = new Parse.Query(RequesterObject);
            query.containedIn("userid", requesterIds);
            query.find({
                success: function(results) {
                    if (results != null && results.length > 0) {
                        for (var i = 0; i < results.length; i++) {
                            var requester = results[i]['attributes'];
                            Invite.that.requesters[requester['userid']] = {
                                'firstName' : requester['firstName'],
                                'lastName': requester['lastName'],
                                'imgLink' : requester['imglink'],
                                'company' : requester['company'],
                                'title' : requester['currentTitle']
                            };
                        }
                        Invite.that.getCarpoolData();
                    }
                },
                error: function(error) {
                }
            });
        },

        getCarpoolData: function() {
            var CarpoolObject = Parse.Object.extend("Carpools"),
                query = new Parse.Query(CarpoolObject);
                query.containedIn("objectId", carpoolIds);
                query.find({
                    success: function(results) {
                        if (results != null && results.length > 0) {
                            for (var i = 0; i < results.length; i++) {
                                var carpool = results[i]['attributes'];
                                var id = results[i]['id'];
                                Invite.that.carpools[id] = {
                                    'name' : carpool['title']
                                };
                                var driverId = carpool['driverId'];
                                if (driverId == me) {
                                    Invite.that.carpools[id]['type'] = 1;
                                } else {
                                    Invite.that.carpools[id]['type'] = 2;
                                }
                            }
                        }
                        //console.log("GetCarPool");
                        //console.log(Invite.that.carpools);
                        PubSub.trigger("linkaride:listview");
                    },
                    error: function(error) {
                    }
                });
        },

        sendRequest: function(carpoolId, message) {
            var CarpoolObject = Parse.Object.extend("Carpools"),
                query = new Parse.Query(CarpoolObject);
                query.get(carpoolId, {
                    success: function(results) {
                        if (results != null) {
                            var carpool = results['attributes'];
                            Invite.that.createInvite(results["id"], carpool, message);
                        }
                    },
                    error: function(error) {
                    }
                });
        },

        createInvite: function(carpoolId, carpool, message) {
            var InviteObject = Parse.Object.extend("Invites");
            var invite = new InviteObject();
            var driverId = null;
            var passengerId = null;
            if (carpool["carpoolType"] == 1) {
                driverId = carpool["userid"];
                passengerId = me;
            } else {
                driverId = me;
                passengerId = carpool["userid"];
            }
            invite.set("carpoolId", carpoolId);
            invite.set("status", 2);
            invite.set("message", message);
            invite.set("driverId", driverId);
            invite.set("passengerId", passengerId);
            invite.save(null, {
                success: function(results) {
                },
                error: function(error) {
                }
            });
        },

        respondToRequest: function(inviteId, status) {
            var InviteObject = Parse.Object.extend("Invites"),
                query = new Parse.Query(InviteObject);
                query.get(inviteId, {
                    success: function(result) {
                        if (result != null) {
                            result.set("status", status);
                            result.save(null, {
                                success: function(results) {
                                },
                                error: function(error) {
                                }
                            });

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
            return Invite.that;
        }
    });
    return Invite;
});
