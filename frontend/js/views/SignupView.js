//File js./views/SignupView.js
define ([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'models/Signup',
    'models/Carpool',
    'mycss!css/signup.css',
    'text!templates/signup.html',
    'text!templates/signinHeader.html'
], function($, _, Backbone, Bootstrap, Signup, Carpool, signupcss, signupTemplate, headerTemplate) {
    var SignupView = Backbone.View.extend({
        el: '#profile',
        that: this,

        events: {
            "click #rideoption a": "chooseOption",
            "click #connected": "getCarpool"
        },

        model: Signup, 
        carpoolModel: Carpool,
        notShowProfile: false,

        initialize: function(params) {
            if (typeof params !== "undefined") {
                this.notShowProfile = params.notShowProfile;
            }
            //console.log(this.notShowProfile);
            that = this;
            this.model = new Signup();
            this.model.on("change", this.render, this);
            this.render();
        },

        render: function() {
            if (this.model.isUserSignIn()) {
                //console.log($("#signout").length);
                //$("#signout").bind("click", that.logUserOut);
                if (!this.notShowProfile) {
                    //console.log("testing");
                    var template = _.template(signupTemplate, {user: this.model});
                    this.$el.html(template);
                }
                var headertemplate = _.template(headerTemplate, {user: this.model});
                $("#header").html(headertemplate);
            } else {
                this.$el.html('<div class="logo"><img src="css/lib/img/logo.png"></div><center><h1>Linking professional women through ride sharing.</h1></center>' +
                '<center><button class="btn btn-success" id="signin" onClick="IN.User.authorize(); return false;">'
                + '<span>Sign Up with LinkedIn</span></button></center>');
            }
        },

        chooseOption: function(e) {
            e.preventDefault();
            //console.log("Choose option");
            var target = $(e.target);
            //console.log(target.text());
            this.$el.find("#currentOption").html(target.text());
        },

        getCarpool: function() {
            //Need a ride is 1, other is 2
            var i = ($("#connected").text() === "Need a Ride") ? 1 : 2;
            localStorage.setItem("carpoolInfo", i);
            localStorage.setItem("start", $("#zip1").val());
            localStorage.setItem("end", $("#zip2").val());
            Backbone.history.navigate("/search");
            window.location.reload();
        }
    });

    return SignupView;

});
