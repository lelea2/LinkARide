// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'router' // Request router.js
], function($, _, Backbone, AppRouter) {
    var initialize = function() {
        // Pass in our Router module and call it's initialize function
        var appRouter = new AppRouter();
        appRouter.initialize();
        //Initialize parse on page load
        Parse.initialize("BxGSjXYeQM1DVtCdk3x9dVLagXLDoD1XLpBCzK54", "yxfECLJrXCO9UMlH5wFOjaB2LDpNsqvoGxY4G6IR");
        //Start Backbone history
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});

//http://backbonetutorials.com/organizing-backbone-using-modules/
