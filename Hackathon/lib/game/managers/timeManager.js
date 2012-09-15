ig.module(
		'game.managers.timeManager'
)
.requires(
		'impact.entity',
        'impact.system'
)
.defines(function () {
    EntityTimeManager = ig.Class.extend({

        //newly defined property
        timer: null,
        leftTime: null,
        gameTimer0: null,
        gameTimer1: null,
        gameTimer2: null,

        init: function () {
            // Timer Start
            timer = new ig.Timer();
            timer.set(1);
            this.leftTime = 60;

            this.gameTimer0 = document.getElementById('gameTimer0');
            this.gameTimer1 = document.getElementById('gameTimer1');
            this.gameTimer2 = document.getElementById('gameTimer2');

            this.gameTimer0.src = '/images/timer_1.png';
            this.gameTimer1.src = '/images/timer_0.png';
            this.gameTimer2.src = '/images/timer_0.png';
        },
        update: function () {
            //this.parent();

            // Timer 영역
            var diff = 0;
            if (timer && document.getElementById('gameTimer0')) {
                if ((diff = timer.delta()) > 0) {
                    if (this.leftTime == 0) {
                        // game Over;
                        this.gameTimer0.src = '/images/timer_0.png';
                        this.gameTimer1.src = '/images/timer_0.png';
                        this.gameTimer2.src = '/images/timer_0.png';

                        //var evt = document.createEvent('Event');
                        //evt.initEvent('gameEnd', true, true);
                        //ig.system.canvas.dispatchEvent(evt);
                        //// game 종료가 필요하다.
                        //ig.system.stopRunLoop.call(ig.system);
                    } else if (this.leftTime == -1) {
                        // 게임종료.
                        console.log('game end in Timer');
                    } else {
                        timer.set(1 - diff);
                        this.leftTime--;
                        //console.log("leftTime:" + this.leftTime);
                        // change Time
                        if (this.leftTime < 60) {
                            this.gameTimer0.src = '/images/timer_0.png';
                            this.gameTimer1.src = '/images/timer_' + Math.floor(this.leftTime / 10) + '.png';
                            this.gameTimer2.src = '/images/timer_' + this.leftTime % 10 + '.png';
                        } else if (this.leftTime < 120) {
                            this.gameTimer0.src = '/images/timer_1.png';
                            this.gameTimer1.src = '/images/timer_' + Math.floor((this.leftTime - 60) / 10) + '.png';
                            this.gameTimer2.src = '/images/timer_' + (this.leftTime - 60) % 10 + '.png';
                        } else if (this.leftTime < 180) {
                            this.gameTimer0.src = '/images/timer_2.png';
                            this.gameTimer1.src = '/images/timer_' + Math.floor((this.leftTime - 120) / 10) + '.png';
                            this.gameTimer2.src = '/images/timer_' + (this.leftTime - 120) % 10 + '.png';
                        } else if (this.leftTime < 240) {
                            this.gameTimer0.src = '/images/timer_3.png';
                            this.gameTimer1.src = '/images/timer_' + Math.floor((this.leftTime - 180) / 10) + '.png';
                            this.gameTimer2.src = '/images/timer_' + (this.leftTime - 180) % 10 + '.png';
                        } else if (this.leftTime < 300) {
                            this.gameTimer0.src = '/images/timer_4.png';
                            this.gameTimer1.src = '/images/timer_' + Math.floor((this.leftTime - 240) / 10) + '.png';
                            this.gameTimer2.src = '/images/timer_' + (this.leftTime - 240) % 10 + '.png';
                        }
                        
                    }
                }
            }
        },
        boost: function () {
            timer = new ig.Timer();
            timer.set(1);
            this.leftTime = 80;

            this.gameTimer0 = document.getElementById('gameTimer0');
            this.gameTimer1 = document.getElementById('gameTimer1');
            this.gameTimer2 = document.getElementById('gameTimer2');

            this.gameTimer0.src = '/images/timer_1.png';
            this.gameTimer1.src = '/images/timer_2.png';
            this.gameTimer2.src = '/images/timer_0.png';
        }
    });

});