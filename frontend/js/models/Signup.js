//File js/models/Signup.js model
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var Signup = Backbone.Model.extend({
        that: this,

        initialize: function() {
            Signup.that = this;
            IN.Event.on(IN, "auth", this.onLinkedInAuth);
        },

        storeUserData: function(UserObject, userInfo) {
            var userobj = new UserObject(),
                currentCompany = this.getCurrentCompany(userInfo.positions.values);
            userobj.save({
                userid: userInfo.id,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                publicProfile: userInfo.publicProfileUrl,
                imglink: userInfo.pictureUrl,
                currentTitle: currentCompany.title,
                company: currentCompany.company.name,
                companyId: currentCompany.company.id
            }, {
                success: function(object) {
                    console.log("Store user data in Parse table");
                }
            });
        },

        getCurrentCompany: function(position) {
            for(var i in position) {
                if (position[i].isCurrent) {
                    return position[i];
                }
            }
            return {};
        },

        setModel: function(userInfo) {
            //Repeat logic of storeUserData, should have a better way to handle this
            var  currentCompany = this.getCurrentCompany(userInfo.positions.values);
            this.set("imglink", userInfo.pictureUrl);
            this.set("email", userInfo.emailAddress);
            this.set("name", userInfo.firstName + "" + userInfo.lastName);
            this.set("title", currentCompany.title);
            this.set("company", currentCompany.company.name);
            this.set("profule", userInfo.publicProfileUrl);
        },

        onLinkedInAuth: function() {
            IN.API.Profile("me")
            .fields(["positions", "email-address", "id", "firstName", "lastName", "pictureUrl", "publicProfileUrl", "industry"])
            .result( function(me) {
                //Store Data in Parse Table
                var UserObject = Parse.Object.extend("Users"),
                    query = new Parse.Query(UserObject);
                query.equalTo("userid", me.values[0].id);
                query.find({
                    success: function(results) {
                        //Store New Data
                        if(results.length === 0) {
                            Signup.that.storeUserData(UserObject, me.values[0]);
                        }
                    },
                    error: function(error) {
                        console.log(error.code);
                    }
                });
                //Changing current Model object
                Signup.that.setUserSignIn(me.values[0]);
                Signup.that.setModel(me.values[0]);
            });
        },

        setUserSignIn: function(userInfo) {
            localStorage.setItem("userId", userInfo.id);
        },

        setUserSignOut: function() {
            localStorage.removeItem("userId");
        },

        isUserSignIn: function() {
            return(localStorage.getItem("userId"));
        }
    });

    return Signup;
});
