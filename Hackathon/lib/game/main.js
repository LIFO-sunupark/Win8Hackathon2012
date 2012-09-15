ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.image',
	'game.levels.saladBowl2',
	'game.managers.popManager',
    'game.managers.popManager2',
	'game.managers.touchManager',
	'game.managers.resizeManager',
    'game.managers.timeManager'
)
.defines(function(){
	
    var time = null;
    var pop = null;
    var touch = null;
    var resize = new ResizeManager();
    var backgroundChangeFlag = 0;

	var ready = document.getElementsByClassName('readyClass hide')[0];
    var go = document.getElementsByClassName('goClass hide')[0];
	var curtain = document.getElementById('topCurtain');

	var timerStart = false;
	var boosterList = null;
	var checkDoubleScore = false;

	//document.getElementById('topCurtain').addEventListener('transitionend', startTimer, false);
    //document.getElementById('topCurtain').addEventListener('webkitTransitionEnd', startTimer, false);
    //document.getElementById('topCurtain').addEventListener('OTransitionEnd', startTimer, false);
	//document.getElementById('topCurtain').addEventListener('MSTransitionEnd', startTimer, false);

	//curtain.addEventListener('MSTransitionEnd', startTimer, false);

	MyGame = ig.Game.extend({


	    init: function () {
            time = new EntityTimeManager();
            pop = new PopManager2(time);
            touch = new EntityTouchManager(pop,time);
	        //ig.game = this;
			// Initialize your game here; bind keys etc.
	        this.loadLevel(LevelSaladBowl2);
	        console.log("Game Loaded");
	        ig.input.bind(ig.KEY.MOUSE1, 'touch');
	        timerStart = false;

            // Finding every properties in certain Object.
            // Utility for debugging @_@
            // also for studying javascript.
            /*
            Usage : ig.game.toString(object_which_to_test);
            */
		    ig.game.toString = function (object) {
		        for (var i in object) {
		            if (typeof (object[i]) == 'object') {
		                console.log(i + " : {");
		                toString(object[i]);
		                console.log("}");
		            }
		            else if (typeof (object[i]) == 'function') {
		                return;
		            }
		            else {
		                console.log(i + " : " + object[i]);
		            }
		        }
		    }
		},

		update: function() {
			// Update all entities and backgroundMaps
		    this.parent();
			// Add your own, additional update code here
			/********************************************/

		    if (timerStart) {
			    time.update();
			    touch.update();

			    if (time.leftTime == 15) {
			        Sound.decreaseBackground();
			    }
			    if (time.leftTime <= 15 && time.leftTime > 0) {
			        Sound.playCountDownSound();

			        if (time.leftTime % 2 == 1 && backgroundChangeFlag == 0) {
			            this.changeBackground(SaladBowlBackground1);
			            backgroundChangeFlag = 1;
			        } else if (time.leftTime % 2 == 0 && backgroundChangeFlag == 1) {
			            this.changeBackground(SaladBowlBackground2);
			            backgroundChangeFlag = 0;
			        }

                }

			    if (time.leftTime == 10
                    && boosterList[1] && !checkDoubleScore) {
		            console.log('double score!!!');
		            checkDoubleScore = true;
		            pop.doubleScoreBoost();
                }

			    if (time.leftTime == 0) {
			        document.getElementById("pauseButton").disabled = true;
			        pop.waitPopping();
			        
			    }
			}
            
		}
	});
	function startTimer() {

	    if (curtain.currentStyle.msTransform == 'matrix(1, 0, 0, 1, 0, 0)'
            && timerStart == false && (Start.getIsGameStart() == 1)) {
	        console.log('curtain opened!');
	        console.log('==========================');
                showReady();
            }
	}
	function showReady() {
	    if (ready.className == 'readyClass hide') {
	        ready.className = 'readyClass';
	    }
	    window.setTimeout(hideReady, 1000);
	}
	function hideReady() {
	    if (ready.className == 'readyClass') {
	        ready.className = 'readyClass hide';
	    }
	    window.setTimeout(showGo, 200);
	}
	function showGo() {
	    if (go.className == 'goClass hide') {
	        go.className = 'goClass';
	    }
	    window.setTimeout(hideGo, 1000);
	}
	function hideGo() {
	    if (go.className == 'goClass') {
	        go.className = 'goClass hide';
	    }
	    document.getElementById('pauseButton').disabled = false;

	    boosterList = Boost.getBoosterList();

	    if (!boosterList[0]) {
	        time.init();
        } else {
            time.boost();
	    }
        
	    timerStart = true;
	    score = 0;
	    comboCount = 0;
	    maxComboCount = 0;
	    longestRun = 0;
	}

//	Start the Game with 60fps, a resolution of 320x240, scaled
//	up by a factor of 2
	//ig.main('#gameCanvas', MyGame, 60, 560, 560, 1);
});