//Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'views/SignupView',
    'views/HeaderView',
    'views/InviteView',
    'views/CarpoolView'
], function($, _, Backbone, Bootstrap, SignupView, HeaderView, InviteView, CarpoolView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "signupRoute",
            "search": "searchRoute",
            "notification": "notificationRoute"
        },

        signupRoute: function() {
            var signupView = new SignupView();
                headerView = new HeaderView();
        },

        searchRoute: function() {
            var headerView = new HeaderView(),
                signupView = new SignupView({notShowProfile: true})//Passing obj to backbone view
                carpoolView = new CarpoolView();
        },

        notificationRoute: function() {
            var headerView = new HeaderView(),
                signupView = new SignupView({notShowProfile: true}),//Passing obj to backbone view
                inviteView = new InviteView();
        }

    });

    return AppRouter;
});