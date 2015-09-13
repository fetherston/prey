'use strict';

var Backbone = require('Backbone');

var ParticleModel = require('../models/particle-model');

var ParticleView = Backbone.View.extend({

    className: 'particle',

    initialize: function(options) {
        this.model = new ParticleModel(options);
        this.listenTo(this.model, 'positionChange', this.render);
    },

    render: function() {
        this.$el.css({
            left: this.model.get('x'),
            top: this.model.get('y')
        });
    }
});

module.exports = ParticleView;
