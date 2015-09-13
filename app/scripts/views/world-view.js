'use strict';

var Backbone = require('Backbone');
var $ = require('jquery');
var _ = require('underscore');

var WorldModel = require('../models/world-model');
var ParticleView = require('./particle-view');

var WorldView = Backbone.View.extend({

    particles: [],

    events: {
        'click': 'spawnParticle'
    },

    initialize: function() {
        this.model = new WorldModel();
        $(window).resize(_.bind(this.updateBounds, this));
        this.updateBounds();
    },

    updateBounds: function() {
        this.model.set('height', this.$el.height());
        this.model.set('width', this.$el.width());
    },

    spawnParticle: function() {
        var particle = new ParticleView({
            worldModel: this.model
        });
        this.$el.append(particle.$el);
        this.particles.push(particle);
    }

});

module.exports = WorldView;
