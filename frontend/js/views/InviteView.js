//File js./views/InviteView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'pubsub',
    'models/Invite',
    'mycss!css/list.css',
    'text!templates/list.html'
], function($, _, Backbone, Bootstrap, PubSub, Invite, listcss, listTemplate) {
    var InviteView = Backbone.View.extend({
        el: '#invitation',

        model: Invite,

        initialize: function() {
            that = this;
            this.model = new Invite();
            //this.model.on("change", this.render, this);
            this.render();
            this.model.getInvites();
            PubSub.bind('linkaride:listview', this.render, this);
        },

        render: function() {
            if (this.model.getSignedInUser()) {
                this.model = this.model.getModel();
                var invites = this.model.invites;
                var requesters = this.model.requesters;
                var carpools = this.model.carpools;
                //console.log("Testing invites");
                //console.log(invites);
                //console.log(requesters);
                var listtemplate = _.template(listTemplate, {invites: invites, requesters: requesters });
                this.$el.html(listtemplate);
            } else {
                Backbone.history.navigate("/");
                window.location.reload();
            }
        }

    });

    return InviteView;
});
