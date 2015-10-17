//File js./views/SignupView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap'
], function($, _, Backbone, Bootstrap) {
    var HeaderView = Backbone.View.extend({
        el: '#header',
        events: {
            "click #notification": "getNotification",
            "click .navbar-brand": "backtoHome"
        },

        initialize: function() {
            //this.$el.find("#notification").tooltip("toggle");
        },

        getNotification: function(e) {
            e.preventDefault();
            Backbone.history.navigate("/notification");
            window.location.reload(true);
        },

        backtoHome: function(e) {
            e.preventDefault();
            Backbone.history.navigate("/");
            window.location.reload();
        }
    });

    return HeaderView;

});
