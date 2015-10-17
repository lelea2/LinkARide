//File js./views/CarpoolView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'pubsub',
    'models/Carpool',
    'models/Invite',
    'text!templates/carlist.html'
], function($, _, Backbone, Bootstrap, PubSub, Carpool, Invite, carlistTemplate) {
    var CarpoolView = Backbone.View.extend({
        el: '#carpoollist',

        model: Carpool,

        events: {
            "click .linkedup": "requestLink"
        },

        initialize: function() {
            that = this;
            this.model = new Carpool();
            //this.model.on("change", this.render, this);
            //this.render();
            this.model.getCarpools();
            PubSub.bind('linkaride:carpoolview', this.render, this);
        },

        render: function() {
            if (this.model.getSignedInUser()) {
                this.model = this.model.getModel();
                console.log(this.model.carpools);
                var carpools = this.model.carpools,
                    zipcode1 = localStorage.getItem("start"),
                    zipcode2 = localStorage.getItem("end");
                var carpooltemplate = _.template(carlistTemplate, {carpools: carpools, count: this.model.count, zipcode1: zipcode1, zipcode2: zipcode2});
                this.$el.html(carpooltemplate);
            } else {
                Backbone.history.navigate("/");
                window.location.reload();
            }
        },

        requestLink: function(e) {
            var target = $(e.target);
            target.text("Requested");
            target.addClass("requested");
            var invite = new Invite();
            invite.sendRequest(target.data("id"), "Hello! I want to share a ride!");
        } 

    });

    return CarpoolView;
});
