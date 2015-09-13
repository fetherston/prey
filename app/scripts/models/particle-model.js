'use strict';

var Backbone = require('Backbone');

var ParticleModel = Backbone.Model.extend({

    defaults: {
        maxV: 50,
        minV: 1,
        velocity: 10,
        angle: 0,
        x: 100,
        y: 100
    },

    initialize: function(options) {
        this.worldModel = options.worldModel;
        this.setRandom();
        this.listenTo(this.worldModel, 'tick', this.setPosition);
    },

    setRandom: function() {
        this.set({
            'velocity': Math.floor(Math.random() * this.get('maxV')) + this.get('minV'),
            'angle': Math.floor(Math.random() * 360) + 0,
            'x': Math.floor(Math.random() * this.worldModel.get('width')),
            'y': Math.floor(Math.random() * this.worldModel.get('height'))
        });
    },

    setPosition: function() {
        var v = this.get('velocity');
        var angle = this.angleAsRadians();
        var currX = this.get('x');
        var currY = this.get('y');
        this.set('x', currX + (v * Math.cos(angle)));
        this.set('y', currY + (v * Math.sin(angle)));
        this.trigger('positionChange');
    },

    angleAsRadians: function() {
        return this.get('angle') * (Math.PI / 180);
    }
});

module.exports = ParticleModel;
