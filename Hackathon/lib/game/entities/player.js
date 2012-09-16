ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function () {
    // The Bouncing Player Ball thing
    EntityPlayer = ig.Entity.extend({
        size: { x: 4, y: 4 },
        checkAgainst: ig.Entity.TYPE.B,

        animSheet: new ig.AnimationSheet('media/player.png', 4, 4),

        maxVel: { x: 50, y: 300 },
        friction: { x: 600, y: 0 },
        speed: 300,
        bounciness: 0,
        sound: new ig.Sound('media/bounce.ogg'),

        updatePosCnt: 0,
        lastPosY: 0,

        init: function (x, y, settings) {
            this.addAnim('idle', 0.1, [0]);
            this.parent(x, y, settings);
        },

        update: function () {
            // User Input
            if (ig.input.state('left')) {
                this.accel.x = -this.speed;
            }
            else if (ig.input.state('right')) {
                this.accel.x = this.speed;
            }
            else {
                this.accel.x = 0;
            }

            this.parent();
        },

        handleMovementTrace: function (res) {
            if (res.collision.y && this.vel.y > 32) {
                this.sound.play();
            }
            this.parent(res);
        },

        check: function (other) {
            other.pickup();
        }
    });
});