'use strict';

var Backbone = require('Backbone');

var X_BOUNDS_COLLISION = 'Collided with world sides';
var Y_BOUNDS_COLLISION = 'Collided with world top or bottom';

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
        this.listenTo(this, 'invalid', this.onValidationError);
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

        this.set({
            'x': currX + (v * Math.cos(angle)),
            'y': currY + (v * Math.sin(angle))
        }, {validate: true});
        this.trigger('positionChange');
    },

    angleAsRadians: function() {
        return this.get('angle') * (Math.PI / 180);
    },

    validate: function(attrs) {
        var x = attrs.x || false;
        var y = attrs.y || false;
        // world bounds collision validation
        if (x || y) {
            var worldHeight = this.worldModel.get('height');
            var worldWidth = this.worldModel.get('width');
            if (x <= 0 || x >= worldWidth) {
                return X_BOUNDS_COLLISION;
            }

            if (y <= 0 || y >= worldHeight) {
                return Y_BOUNDS_COLLISION;
            }
        }
    },

    onValidationError: function(model, error) {
        if (error === X_BOUNDS_COLLISION) {
            console.log('OUT OF X BOUNDS', this.get('angle'));
            this.set('angle', 180 - this.get('angle'));
        }
        if (error === Y_BOUNDS_COLLISION) {
            console.log('OUT OF Y BOUNDS', this.get('angle'));
            this.set('angle', -this.get('angle'));
        }

    }
});

module.exports = ParticleModel;
