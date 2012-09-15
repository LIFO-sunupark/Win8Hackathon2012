ig.module(
		'game.managers.popManager'
)
.requires(
        'game.managers.hurdleManager'
)
.defines(function () {
    var hurdle = new HurdleManager();
    PopManager = ig.Class.extend({
        entities: null,
        entitiesArray: new Array(8),
        popCheckArray: new Array(8),
        killArray: new Array(64),
        highestEntity: null,    // 새로 생기는 entity가운데 가장 높은 곳에서 떨어지는 것.
        doPop: false,
        doComboCheck: false,
        doTimeCheck: false,
        doUnsetBase: false,
        doChangeGravity: false,
        doKillEntities: false,
        delayTime: 0,
        offset: -1,
        popTimer: null,
        runTimer: null,
        runCount: 0,    //longest run count
        scoreToMakeHurdle: 4000,
        scoreHurdleGap: 3900,
        tempScore: 0,
        doubleScore: null,
        hurdles: {},            // variable for icing entitiy
        hurdle_index: 0,        // variable for icing entitiy


        staticInstantiate: function () {
            if (PopManager.instance == null) {
                return null;
            }
            else {
                return PopManager.instance;
            }
        },


        init: function () {
            PopManager.instance = this;
            tempPopManager = this;
            this.doubleScore = false;

            for (var i = 0; i < 8; i++) {
                this.entitiesArray[i] = new Array(8);
                this.popCheckArray[i] = new Array(8);
            }
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    this.popCheckArray[i][j] = false;
                }
            }
            this.popTimer = new ig.Timer();
            this.popTimer.set(0.5);
            this.runTimer = new ig.Timer(3);	//longest run

        },


        check: function (entities) {
            if (entities == null) {
                console.log('popManager check : entities is null');
                return;
            }

            //console.log(this.doComboCheck);
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    this.popCheckArray[i][j] = false;
                }
            }
            this.entities = entities;
            for (var i = 0; i < entities.length; i++) {		//8*8 array에 entity들의 위치에 맞게 배치
                if (ig.game.entities[i].isInside) {
                    var x = Math.round(entities[i].pos.x / 70);/*****************/
                    var y = Math.round(entities[i].pos.y / 70);/****************/
                    this.entitiesArray[x][y] = entities[i];
                    this.entitiesArray[x][y].isInside = true;/***************/
                }
            }
            this.tempScore = 0;

            //console.log(input);
            for (var i = 0; i < 8; i++) {		//세로줄 터질 엔티티 체크
                var count = 0;
                var saladType = null;
                for (var j = 0; j < 8; j++) {
                    //console.log(this.entitiesArray[i][j].saladType + ": " + this.entitiesArray[i][j].pos.x + "," + this.entitiesArray[i][j].pos.y);
                    if (saladType != null) {	//첫칸이 아닐 경우
                        if (saladType == this.entitiesArray[i][j].saladType) {	//count하는 entity일 경우(즉 이전칸의 entity와 동일한 경우)
                            count++;
                            if (count == 3) {
                                this.popCheckArray[i][j] = true;
                                this.popCheckArray[i][j - 1] = true;
                                this.popCheckArray[i][j - 2] = true;
                                this.doPop = true;

                                this.tempScore += 300;
                            }
                            else if (count == 4) {
                                this.popCheckArray[i][j] = true;

                                this.tempScore += 400;
                            }
                            else if (count == 5) {
                                this.popCheckArray[i][j] = true;

                                this.tempScore += 600;
                            }
                            else if (count == 6) {
                                this.popCheckArray[i][j] = true;

                                this.tempScore += 900;
                            }
                            else if (count == 7) {
                                this.popCheckArray[i][j] = true;

                                this.tempScore += 1100;
                            }
                            else if (count == 8) {
                                this.popCheckArray[i][j] = true;

                                this.tempScore += 1500;
                            }
                        }
                        else {		//count하는 entity와 다른 경우
                            saladType = this.entitiesArray[i][j].saladType;
                            count = 1;
                        }
                    }
                    else {	//첫칸일 경우
                        saladType = this.entitiesArray[i][j].saladType;
                        count = 1;
                    }
                }
            }

            

            if (this.doPop) {
                ig.input.bind(ig.KEY.MOUSE1, "nothing");
                if (this.runTimer.delta() < 0) {
                    this.runCount++;
                }
                else {
                    this.runCount = 1;
                }
                this.runTimer.reset();
                if (longestRun < this.runCount)
                    longestRun = this.runCount;
                this.popEntity();
            }
            else {
                comboCount = 0;
                document.getElementById("comboValue").textContent = '';
                ig.input.bind(ig.KEY.MOUSE1, "touch");
                if (score > this.scoreToMakeHurdle) {
                    this.scoreToMakeHurdle += this.scoreHurdleGap;
                    if (this.scoreHurdleGap > 1000)
                        this.scoreHurdleGap -= 100;
                    //hurdle.makeIce(1);

                    //for (var i = 0 ; i < 2 ; i++) {
                        var hurdle = new HurdleManager();
                        hurdle.makeIce(1);
                        this.hurdles[this.hurdle_index] = hurdle;
                        this.hurdle_index = (this.hurdle_index + 1) % 5;
                    //}
                }
            }
        },



        popEntity: function () {

            this.doPop = false;
            for (var i = 0; i < this.killArray.length; i++) {
                this.killArray[i] = null;
            }

            for (var i = 0; i < ig.game.entities.length; i++) {
                ig.game.entities[i].isFalling = false;
            }
            this.setBase();

            //this.delayTime = 0.25;
            var longestDelay = 0;
            var fall;
            var delayCount;
            for (var i = 0; i < 8; i++) {
                fall = false;
                delayCount = 0;
                for (var j = 7; j >= 0; j--) {
                    if (this.popCheckArray[i][j]) {
                        fall = true;
                        delayCount++;
                    }
                    this.entitiesArray[i][j].isFalling = fall;
                    if (fall) {
                        this.entitiesArray[i][j].destY = (j + delayCount) * 70;
                        //console.log("destY " + this.entitiesArray[i][j].destY);
                    }
                }
                if (longestDelay < delayCount)
                    longestDelay = delayCount;
            }
            
           // this.delayTime += (longestDelay * 0.3);
            switch (longestDelay) {
                case 1: this.delayTime = 0.30; break;
                case 2: this.delayTime = 0.55; break;
                case 3: this.delayTime = 0.70; break;
                case 4: this.delayTime = 0.80; break;
                default: this.delayTime = 0.40 + longestDelay * 0.1; break;
            }

            this.spawnOnTop();

            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    var a = i + 1;
                    var b = j + 1;
                    if (this.popCheckArray[i][j] == true) {
                        //console.log(a + "," + b + ": " + this.entitiesArray[i][j].saladType);
                        this.entitiesArray[i][j].updateState("kill");
                        this.killArray[i * 8 + j] = this.entitiesArray[i][j];
                        this.entitiesArray[i][j].collides = ig.Entity.COLLIDES.PASSIVE;
                        if (j != 0) {
                            this.entitiesArray[i][j - 1].collides = ig.Entity.COLLIDES.PASSIVE;
                        }
                    }
                    //else
                    //    this.entitiesArray[i][j].update("idle");
                }
            }
            var highestY = 0;
            for (var i = 0; i < ig.game.entities.length; i++) {
                if (ig.game.entities[i].pos.y < highestY) {
                    highestY = ig.game.entities[i].pos.y;
                    this.highestEntity = ig.game.entities[i];
                }
            }
            //console.log("highest" + this.highestEntity.pos.y);
            this.popTimer.set((this.delayTime));
            
            this.changeGravity();

            comboCount++;
            if (maxComboCount < comboCount) {
                maxComboCount = comboCount;
            }
            
            //score += (this.tempScore);
            if (this.doubleScore) {
                this.tempScore = this.tempScore * 2;
                //console.log('double score added.');
            }

            score += (this.tempScore * comboCount);

            //console.log('temp score : ' + this.tempScore + ' / score : ' + score);
            addScore(score);

            //console.log("combo: " + comboCount);
            if (comboCount <= 0) {
                comboText = '';
            } else if (comboCount == 1) {
                comboText = '1 Combo';
            } else {
                comboText = comboCount + ' Combos';
            }
            document.getElementById("comboValue").textContent = comboText;
            this.doUnsetBase = true;
            this.doKillEntities = true;
            this.doChangeGravity = true;
            this.doTimeCheck = true;
        },



        setBase: function () {
            //console.log("setBase()");
            ig.game.spawnEntity(EntityBlock, 0, 560).isInside = false;
            ig.game.spawnEntity(EntityBlock, 70, 560).isInside = false;
            ig.game.spawnEntity(EntityBlock, 140, 560).isInside = false;
            ig.game.spawnEntity(EntityBlock, 210, 560).isInside = false;
            ig.game.spawnEntity(EntityBlock, 280, 560).isInside = false;
            ig.game.spawnEntity(EntityBlock, 350, 560).isInside = false;
            ig.game.spawnEntity(EntityBlock, 420, 560).isInside = false;
            ig.game.spawnEntity(EntityBlock, 490, 560).isInside = false;
        },

        changeGravity: function () {
            //console.log(ig.game.entities.length);
            for (var i = 0 ; i < ig.game.entities.length ; i++) {
                if (ig.game.entities[i].isInside)
                    if (ig.game.entities[i].isFalling) {
                        ig.game.entities[i].switchCollides();
                    }
            }
            for (var i = 0 ; i < ig.game.entities.length ; i++) {
                if (ig.game.entities[i].isInside)
                    if (ig.game.entities[i].isFalling)
                        ig.game.entities[i].switchGravity();
            }
        },
        


        unsetBase: function () {
            var blocks = ig.game.getEntitiesByType(EntityBlock);
            for (var i = 0 ; i < blocks.length ; i++)
                blocks[i].kill();
        },



        spawnOnTop: function () {
            var theX;
            var theY;
            var thisEntity;
//            var highestOffset = 0;
            for (var i = 0 ; i < 8 ; i++) {
                var numOfNewEntitiesInACol = 0;
                for (var j = 0; j < 8; j++) {
                    if (this.popCheckArray[i][j] == true) {
                        numOfNewEntitiesInACol++;
                    }
                }
                this.offset = -1;
                for (var j = 0; j < 8; j++) {
                    if (this.popCheckArray[i][j] == true) {
                        theY = this.offset * 70;
                        theX = i * 70;
                        this.offset--;
                        var randNum = 0;
                        if (score < 5000) {
                            randNum = Math.floor(Math.random() * 6);
                        }
                        else if (score < 10000) {
                            randNum = Math.floor(Math.random() * 7);
                        }
                        else {
                            randNum = Math.floor(Math.random() * 8);
                        }
                        switch (randNum) {
                            case 0:
                                //thisEntity = ig.game.spawnEntity(EntityTomato, 560, 560);
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityTomato", animSheet: new ig.AnimationSheet('media/tomato.png', 70, 70) });
                                break;
                            case 1:
                                //thisEntity = ig.game.spawnEntity(EntityPaprika, 560, 560);
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityPaprika", animSheet: new ig.AnimationSheet('media/paprika.png', 70, 70) });
                                break;
                            case 2:
                                //thisEntity = ig.game.spawnEntity(EntityEggplant, 560, 560);
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityEggplant", animSheet: new ig.AnimationSheet('media/eggplant.png', 70, 70) });
                                break;
                            case 3:
                                //thisEntity = ig.game.spawnEntity(EntityKiwi, 560, 560);
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityKiwi", animSheet: new ig.AnimationSheet('media/kiwi.png', 70, 70) });
                                break;
                            case 4:
                                //thisEntity = ig.game.spawnEntity(EntityOnion, 560, 560);
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityOnion", animSheet: new ig.AnimationSheet('media/onion.png', 70, 70) });
                                break;
                            case 5:
                                //thisEntity = ig.game.spawnEntity(EntityOrange, 560, 560);
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityOrange", animSheet: new ig.AnimationSheet('media/orange.png', 70, 70) });
                                break;
                            case 6:
                                //thisEntity = ig.game.spawnEntity(EntityEgg, 560, 560);
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityEgg", animSheet: new ig.AnimationSheet('media/egg.png', 70, 70) });
                                break;
                            case 7:
                                //isEntity = ig.game.spawnEntity(EntityCheese, 560, 560);
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityCheese", animSheet: new ig.AnimationSheet('media/cheese.png', 70, 70) });
                                break;
                        }
                        thisEntity.pos.x = theX;
                        thisEntity.pos.y = theY;
                        thisEntity.isFalling = true;
                        thisEntity.destY = 70 * ((numOfNewEntitiesInACol--) - 1);
                        //console.log("destY " + thisEntity.destY);
                        /*if (offset < highestOffset) {   //가장 높이 있던 엔티티를 highestEntity로 지정
                            highestOffset = offset;
                            this.highestEntity = thisEntity;
                            console.log("offset" + highestOffset);
                        }*/
                    }
                }
            }
        },

        update: function () {
            if (this.doTimeCheck) {
                //console.log('delta)' + this.popTimer.delta());
                if(this.popTimer.delta() > 0){
                    this.doTimeCheck = false;
                    this.check(ig.game.entities);
                }
                else if (this.popTimer.delta() > -0.05) {
                    if (this.doChangeGravity) {
                        this.doChangeGravity = false;
                        this.changeGravity();
                    }
                    if(this.doUnsetBase){
                        anythingFalling = false;
                        for (var i = 0 ; i < ig.game.entities.length ; i++) {
                            if (ig.game.entities[i].sameY == false) {
                                anythingFalling = true;
                            }
                        }
                        if (anythingFalling == false) {
                            this.doUnsetBase = false;
                            this.unsetBase();
                            //console.log('1');
                        }
                        
                    }
                }
                /*else if(this.popTimer.delta() > -0.1){
                    if (this.doChangeGravity) {
                        anythingFalling = false;
                        for (var i = 0 ; i < ig.game.entities.length ; i++) {
                            if (ig.game.entities[i].sameY == false) {
                                anythingFalling = true;
                            }
                        }
                        if (anythingFalling == false) {
                            this.doChangeGravity = false;
                            this.changeGravity();
                            //console.log('2');
                        }
                        
                    }
                }*/
                else{   //해야되는것
                    //else if(this.popTimer.delta() > -0.6){
                    if(this.doKillEntities){
                        this.doKillEntities = false;
                        this.killEntities();
                        //console.log('3');
                    }
                }
            }
            //hurdle.update();
            for (var k = 0 ; k < 5 ; k++) {
                if (this.hurdles[k] != null)
                    this.hurdles[k].update();
            }
        },



        killEntities: function () {

            var crushCnt = 0;
            var tempX = 0;
            var tempY = 0;

            for(var i=0; i < this.killArray.length; i++){
                if(this.killArray[i] != null){
                    this.killArray[i].kill();
                    if (!checkMuted()) {
                        switch (comboCount) {
                            case 1:
                                Sound.playPopSound();
                                break;
                            case 2:
                                Sound.playPopSound2();
                                break;
                            case 3:
                                Sound.playPopSound3();
                                break;
                            case 4:
                                Sound.playPopSound4();
                                break;
                            case 5:
                                Sound.playPopSound5();
                                break;
                            default:
                                Sound.playPopSound5();
                                break;
                        }
                    }

                    crushCnt++;
                    tempX = this.killArray[i].pos.x;
                    tempY = this.killArray[i].pos.y;
                }
            }

            //console.log('crushCnt : ' + crushCnt);
            setInterval(Popup.showPopup(crushCnt, this.tempScore * comboCount, tempX, tempY), 30);

            //console.log("score: " + score);
        },



        waitPopping: function () {
            //console.log('combo count : ' + comboCount);
            if (comboCount == 0) {
                var evt = document.createEvent('Event');
                evt.data = { score: score, longestrun: longestRun, xp: getXp(), coin: Math.floor(score / 70), level: getLevel()};
                evt.initEvent('gameEnd', true, true);
                ig.system.canvas.dispatchEvent(evt);
                // game 종료가 필요하다.
                Sound.increaseBackground();
                Sound.stopCountDownSound();
                Sound.playTimeUpSound();
                ig.system.stopRunLoop.call(ig.system);
            }
        },



        doubleScoreBoost: function () {

            booster = Boost.getBoosterList();
            if (booster[1]) {
                this.doubleScore = true;
            }
        }
    });
    PopManager.instance = null;
});

//score와 combo등의 데이터를 얻어오는 function
var score = 0;
var comboCount = 0;
var maxComboCount = 0;
var longestRun = 0;
var booster = null;
var popSound = null;
var level = 1;
//var level = 1;

function getScore() {
    return score;
}

function setScore(value) {
    //score = value;
    var evt = document.createEvent('Event');
    evt.initEvent('scoreChange', true, true);
    evt.data = value;
    ig.system.canvas.dispatchEvent(evt);
}
function addScore(value) {
    //setScore(getScore() + value);
    setScore(value);
}

function getComboCoount() {
    return comboCount;
}

function getMaxComboCount() {
    return maxComboCount;
}

function getLongestRun() {
    return longestRun;
}

function getBooster() {
    booster = Boost.getBoosterList();
    if (booster[1]) {
        return true;
    } else {
        return false;
    }
}

function checkMuted() {
    var isMuted = Sound.isEffectMuted();
    if (isMuted) {
        ig.Sound.enabled = false;
    } else {
        ig.Sound.enabled = true;
    }
}

function getXp() {
    var xp = Math.floor(score / 200);
    return xp;
}

function getLevel(){
    return level;
}
  