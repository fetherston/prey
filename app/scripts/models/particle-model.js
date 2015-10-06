'use strict';

var Backbone = require('Backbone');
var _ = require('underscore');

var X_BOUNDS_COLLISION = 'Collided with world sides';
var Y_BOUNDS_COLLISION = 'Collided with world top or bottom';

var ParticleModel = Backbone.Model.extend({

    defaults: {
        width: 10, // width in px of the thing
        maxV: 10, // max velocity
        minV: 1, // min velocity
        affection: 150, // distance in pixels from another particle before being influenced
        showAffection: false, // render a container showing the affection range in the view
        velocity: 0,
        angle: 0, // angle in degrees
        x: 100, // initial x/y position
        y: 100,
        directionChangethrottle: 500 // min time between direction computations
    },

    initialize: function(options) {
        this.worldModel = options.worldModel;
        this.setRandom();
        this.listenTo(this.worldModel, 'tick', this.setPosition);
        this.listenTo(this, 'invalid', this.onValidationError);

        this.setAngleAndVelocity = _.throttle(_.bind(this.setAngleAndVelocity, this), this.get('directionChangethrottle'));
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
        this.headTowardsSwarm();
        var v = this.get('velocity');
        var angle = this.angleAsRadians(this.get('angle'));
        var currX = this.get('x');
        var currY = this.get('y');

        this.set({
            'x': currX + (v * Math.cos(angle)),
            'y': currY + (v * Math.sin(angle))
        }, {validate: true});
        this.trigger('positionChange');
    },

    validate: function(attrs) {
        var x = attrs.x || false;
        var y = attrs.y || false;
        var width = this.get('width');
        // world bounds collision validation
        if (x || y) {
            var worldHeight = this.worldModel.get('height');
            var worldWidth = this.worldModel.get('width');
            if (x <= 0 || x >= (worldWidth - width)) {
                return X_BOUNDS_COLLISION;
            }

            if (y <= 0 || y >= (worldHeight - width)) {
                return Y_BOUNDS_COLLISION;
            }
        }
    },

    headTowardsSwarm: function() {
        var neighbors = [];
        var angles = [];
        var v = this.get('velocity');
        for (var i = 0; i < this.worldModel.particles.length; i++) {
            var particleModel = this.worldModel.particles[i].model;
            var isClose = this.testDistance(particleModel);
            if (isClose && particleModel.get('velocity') >= this.get('velocity')) {
                neighbors.push(particleModel);
                angles.push(particleModel.get('angle'))
                v += particleModel.get('velocity');
            }
        }

        if (!neighbors.length) {
            return;
        }

        this.setAngleAndVelocity(this.meanAngleOfAngles(angles), (v / (neighbors.length + 1)));
    },

    testDistance: function(particleModel) {
        if (particleModel.cid === this.cid) {
            return false;
        }
        var particleRadius = this.get('width') / 2;
        var dx = (this.get('x') + particleRadius) - (particleModel.get('x') + particleRadius);
        var dy = (this.get('y') + particleRadius) - (particleModel.get('y') + particleRadius);
        var distance = Math.sqrt(dx * dx + dy * dy);
        return (distance - particleRadius) < this.get('affection') ? particleModel : false;
    },

    onValidationError: function(model, error) {
        if (error === X_BOUNDS_COLLISION) {
            this.set('angle', 180 - this.get('angle'));
        }
        if (error === Y_BOUNDS_COLLISION) {
            this.set('angle', -this.get('angle'));
        }
    },

    setAngleAndVelocity: function(a, v) {
        this.set({
            'angle': Math.trunc(a),
            'velocity': v
        });
    },

    // TODO: utils?
    angleAsRadians: function(a) {
        return a * (Math.PI / 180);
    },

    // TODO: utils?
    meanAngleOfAngles: function(arrayOfAngles) {
        var sum = function(array) {
            var s = 0;
            for (var i in array) {
                s += array[i];
            }
            return s;
        };
        // i stole this from rosetta code
        return 180 / Math.PI * Math.atan2(sum(arrayOfAngles.map(this.angleAsRadians).map(Math.sin)) / arrayOfAngles.length, sum(arrayOfAngles.map(this.angleAsRadians).map(Math.cos))/arrayOfAngles.length);
    },
});

module.exports = ParticleModel;
