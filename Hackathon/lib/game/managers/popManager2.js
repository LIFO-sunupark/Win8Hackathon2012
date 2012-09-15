ig.module(
		'game.managers.popManager2'
)
.requires(
        'game.managers.hurdleManager',
        'game.managers.entityManager',
        'game.managers.animManager',
        'game.entities.walnut'
)
.defines(function () {
    var hurdle = new HurdleManager();   
    PopManager2 = ig.Class.extend({
        entities: null,
        entitiesArray: new Array(8),
        killArray: new Array(64),
        highestEntity: null,    // 새로 생기는 entity가운데 가장 높은 곳에서 떨어지는 것.
        doPop: false,
        doKillAnim: false,
        checkNextPop: false,
        //delayTime: 0,
        offset: -1,
        //popTimer: null,
        killAnimTimer: null,
        runTimer: null,
        runCount: 0,    //longest run count
        scoreToMakeHurdle: 10000,
        scoreHurdleGap: 6000,
        tempScore: 0,
        doubleScore: null,
        hurdles: {},            // variable for icing entitiy
        hurdle_index: 0,        // variable for icing entitiy

        entityManager: null,
        animManager: null,
        itemManager: null,

        staticInstantiate: function () {  
            if (PopManager2.instance == null) {
                return null;
            }
            else {
                return PopManager2.instance;
            }
        },



        init: function (time) {
            PopManager2.instance = this;   
            tempPopManager = this;
            this.doubleScore = false;
            this.entityManager = new EntityManager();
            this.animManager = new AnimManager();
            this.itemManager = new ItemManager(time);

            for (var i = 0; i < 8; i++) {
                this.entitiesArray[i] = new Array(8);
            }
            this.killAnimTimer = new ig.Timer(0.3);
            this.runTimer = new ig.Timer(3);	//longest run   //필요함
        },
        


        ////////////////////////////////////////////////////////////
        //
        //  Checking continuously about moveEntity & kill entity
        //
        ///////////////////////////////////////////////////////////
        update: function () {
            if (this.doKillAnim) {
                if (this.killAnimTimer.delta() > 0) {
                    this.doKillAnim = false;
                    this.checkNextPop = true;
                    //////////////////////////////////////////////////////////////////
                    // Kill the finded entities
                    //////////////////////////////////////////////////////////////////

                    this.killEntities();

                    //////////////////////////////////////////////////////////////////
                    // Move Entities - Gravity works
                    //////////////////////////////////////////////////////////////////

                    this.entities = this.entityManager.getSaladEntities();
                    for (var i = 0 ; i < this.entities.length ; i++) {
                        if (this.entities[i].isFalling == true) {
                            this.entities[i].moveEntity(this.entities[i].destY, 14);
                        }
                    }
                }
            }
            if (this.checkNextPop) {
                this.entities = this.entityManager.getSaladEntities();
                var done = true;
                for (var i = 0; i < this.entities.length; i++) {
                    if (this.entities[i].isFalling) {
                        if (Math.round(this.entities[i].destY) != Math.round(this.entities[i].pos.y)) {
                            done = false;
                        }
                    }
                }
                if (done) {
                    ig.input.bind(ig.KEY.MOUSE1, "touch");
                    this.checkNextPop = false;
                    this.check();
                    
                }
                //this.check();
            }
            for (var k = 0 ; k < 5 ; k++) {
                if (this.hurdles[k] != null)
                    this.hurdles[k].update();
            }
            /*if (this.gameStart) {
                score = 0;
                comboCount = 0;
                maxComboCount = 0;
                longestRun = 0;
            }*/ 
        },
        


        ////////////////////////////////////////////////////////////
        //
        //  Check whether there is a entities to kill
        //
        ///////////////////////////////////////////////////////////
        check: function () {

            //////////////////////////////////////////////////////////////////
            // Initializing
            //////////////////////////////////////////////////////////////////
            
            this.entities = this.entityManager.getSaladEntities();
            
            for(var i = 0 ; i < this.entities.length ; i++){
                this.entities[i].popCheck = false;
                this.entities[i].isFalling = false;
            }
            
            this.entities = this.entityManager.getSaladEntities();
            for (var i = 0 ; i < this.entities.length ; i++) {
                if (this.entities[i].isEeing) {
                    if (this.entities[i].attachedItem != null)
                        this.entities[i].attachedItem.effect();
                    this.entities[i].popCheck = true;
                    this.doPop = true;
                }
            }
            
            
            for (var i = 0; i < this.entities.length; i++) {		//8*8 array에 entity들의 위치에 맞게 배치
                if (this.entities[i].isInside) {
                    var x = Math.round(this.entities[i].pos.x / 70);
                    var y = Math.round(this.entities[i].pos.y / 70);
                    if (x >= 8) {
                        x = 7;
                    }
                    if (y >= 8) {
                        y = 7;
                    }
                    if (x < 0) {
                        x = 0;
                    }
                    if (y < 0) {
                        y = 0;
                    }
                    this.entitiesArray[x][y] = this.entities[i];
                    this.entitiesArray[x][y].isInside = true;/***************/
                }
            }
            this.tempScore = 0;


            //////////////////////////////////////////////////////////////////
            // Finding Pop entities
            //////////////////////////////////////////////////////////////////
            
            this._checkPopArray('VERTICAL');
            this._checkPopArray('HORIZONTAL');
            
            //////////////////////////////////////////////////////////////////
            // updateState('kill');
            //////////////////////////////////////////////////////////////////

            if (!this.doPop) {
                comboCount = 0;
                document.getElementById("comboValue").textContent = '';
                
                if (score > this.scoreToMakeHurdle) {
                    this.scoreToMakeHurdle += this.scoreHurdleGap;
                    if (this.scoreHurdleGap > 1000) {
                        this.scoreHurdleGap -= 100;
                    }
                    var hurdle = new HurdleManager();
                    hurdle.makeIce(1);
                    this.hurdles[this.hurdle_index] = hurdle;
                    this.hurdle_index = (this.hurdle_index + 1) % 5;
                }
                return;
            }
            else {
                //////////////////////////////////////////////////////////////////
                // Lock mouse KEY
                //////////////////////////////////////////////////////////////////

                ig.input.bind(ig.KEY.MOUSE1, "nothing");

                //////////////////////////////////////////////////////////////////
                //  Check and reset runCount
                //////////////////////////////////////////////////////////////////

                if (this.runTimer.delta() < 0) {
                    this.runCount++;
                }
                else {
                    this.runCount = 1;
                }
                this.runTimer.reset();
                if (longestRun < this.runCount) {
                    longestRun = this.runCount;
                }
                //////////////////////////////////////////////////////////////////
                // Spawn the entities on the top of the map
                //////////////////////////////////////////////////////////////////

                this._spawnOnTop();

                //////////////////////////////////////////////////////////////////
                // Set destY
                //////////////////////////////////////////////////////////////////

                for (var i = 0; i < 8; i++) {
                    fall = false;
                    delayCount = 0;
                    for (var j = 7; j >= 0; j--) {
                        if (this.entitiesArray[i][j].popCheck) {
                            fall = true;
                            delayCount++;
                        }
                        this.entitiesArray[i][j].isFalling = fall;
                        if (fall) {
                            this.entitiesArray[i][j].destY = (j + delayCount) * 70;

                        }
                    }
                }

                comboCount++;
                if (maxComboCount < comboCount) {
                    maxComboCount = comboCount;
                }

                
                if (this.doubleScore) {
                    this.tempScore = this.tempScore * 2;
                }

                score += (this.tempScore * comboCount);

                addScore(score);

                if (comboCount <= 0) {
                    comboText = '';
                } else if (comboCount == 1) {
                    comboText = '1 Combo';
                } else {
                    comboText = comboCount + ' Combos';
                }
                document.getElementById("comboValue").textContent = comboText;
                if (comboCount > 3) {
                    this.itemManager.makeItem("SEPICAL");
                }
                //////////////////////////////////////////////////////////////////
                // set killAnimTimer
                //////////////////////////////////////////////////////////////////

                this.killAnimTimer.reset();
                this.doKillAnim = true;

                //////////////////////////////////////////////////////////////////
                // do killAnimation
                //////////////////////////////////////////////////////////////////

                this.doKillingAnim();

            }
            
            this.doPop = false;

        },

        doKillingAnim: function(){
            this.entities = this.entityManager.getSaladEntities();
            for (var i = 0 ; i < this.entities.length ; i++) {
                if (this.entities[i].popCheck == true) {
                    this.entities[i].updateState('kill');
                }
            }
        },

        killEntities: function () {
            var crushCnt = 0;
            var tempX = 0;
            var tempY = 0;
            this.entities = this.entityManager.getSaladEntities();
            for (var i = 0 ; i < this.entities.length ; i++) {
                if (this.entities[i].popCheck == true) {
                    tempX = this.entities[i].pos.x;
                    tempY = this.entities[i].pos.y;
                    this.entities[i].kill();
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
                    
                }
            }

            setInterval(Popup.showPopup(crushCnt, this.tempScore * comboCount, tempX, tempY), 30);

        },


        ///////////////////////////////////////////////////////////////////////////////////////////

        _checkPopArray: function(dir){
            if(dir == 'VERTICAL'){
                for (var i = 0; i < 8; i++) {	
                    var count = 0;
                    var saladType = null;
                    var prevEntityType = null;
                    for (var j = 0; j < 8; j++) {
                        if (saladType != null) {	//첫칸이 아닐 경우
                            if (this.entitiesArray[i][j].saladType != 'EntityWalnut') {
                                if ((saladType == this.entitiesArray[i][j].saladType) || (this.entitiesArray[i][j].saladType == 'EntityJoker')||(prevEntityType == 'EntityJoker')) {	//count하는 entity일 경우(즉 이전칸의 entity와 동일한 경우)
                                    count++;
                                    
                                    if ((saladType == 'EntityJoker')&&(this.entitiesArray[i][j].saladType != 'EntityJoker')) { //EntityJoker로 시작했고 지금의 entity는 조커가 아닐때.
                                        saladType = this.entitiesArray[i][j].saladType;
                                    }
                                    if ((saladType != 'EntityJoker') && (saladType != this.entitiesArray[i][j].saladType)&&(this.entitiesArray[i][j].saladType != 'EntityJoker')) {    //EntityJoker부터 다시 카운트해야함.
                                        saladType = this.entitiesArray[i][j].saladType;
                                        count = 2;
                                    }

                                    if (count == 3) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;
                                        if (this.entitiesArray[i][j-1].isEeing)
                                            this.entitiesArray[i][j-1].popCheck = true;
                                        if (this.entitiesArray[i][j-2].isEeing)
                                            this.entitiesArray[i][j-2].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);
                                        this.entitiesArray[i][j - 1].setPopCheck(true);
                                        this.entitiesArray[i][j - 2].setPopCheck(true);
                                        this.doPop = true;

                                        this.tempScore += 300;

                                        this.entitiesArray[i][j].activateAttachedItem();
                                        this.entitiesArray[i][j - 1].activateAttachedItem();
                                        this.entitiesArray[i][j - 2].activateAttachedItem();
                                    }
                                    else if (count == 4) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);

                                        this.tempScore += 400;

                                        this.entitiesArray[i][j].activateAttachedItem();
                                    }
                                    else if (count == 5) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);

                                        this.tempScore += 600;
                                        this.entitiesArray[i][j].activateAttachedItem();
                                    }
                                    else if (count == 6) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);

                                        this.tempScore += 900;
                                        this.entitiesArray[i][j].activateAttachedItem();
                                    }
                                    else if (count == 7) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);

                                        this.tempScore += 1100;
                                        this.entitiesArray[i][j].activateAttachedItem();
                                    }
                                    else if (count == 8) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);

                                        this.tempScore += 1500;
                                        this.entitiesArray[i][j].activateAttachedItem();
                                    }
                                    prevEntityType = this.entitiesArray[i][j].saladType;
                                }
                                else {		//count하는 entity와 다른 경우
                                    saladType = this.entitiesArray[i][j].saladType;
                                    prevEntityType = saladType;
                                    count = 1;

                                }
                            }
                            else {  //호두인 경우
                                saladType = null;
                                prevEntityType = null;
                                count = 0;
                            }
                        }
                        else {	//첫칸일 경우
                            saladType = this.entitiesArray[i][j].saladType;
                            prevEntityType = saladType;
                            count = 1;
                        }
                    }
                }
            }
            else if (dir == 'HORIZONTAL') {
                for (var j = 0; j < 8; j++) {		//가로줄 터질 엔티티 체크
                    var count = 0;
                    var saladType = null;
                    var prevEntityType = null;
                    for (var i = 0; i < 8; i++) {
                        if (saladType != null) {	//첫칸이 아닐 경우
                            if (this.entitiesArray[i][j].saladType != 'EntityWalnut') {
                                if ((saladType == this.entitiesArray[i][j].saladType) || (this.entitiesArray[i][j].saladType == 'EntityJoker')||(prevEntityType == 'EntityJoker')) {	//count하는 entity일 경우(즉 이전칸의 entity와 동일한 경우)
                                    count++;
                                    
                                    if ((saladType == 'EntityJoker')&&(this.entitiesArray[i][j].saladType != 'EntityJoker')) { //EntityJoker로 시작했고 지금의 entity는 조커가 아닐때.
                                        saladType = this.entitiesArray[i][j].saladType;
                                    }
                                    if ((saladType != 'EntityJoker') && (saladType != this.entitiesArray[i][j].saladType)&&(this.entitiesArray[i][j].saladType != 'EntityJoker')) {    //EntityJoker부터 다시 카운트해야함.
                                        saladType = this.entitiesArray[i][j].saladType;
                                        count = 2;
                                    }

                                    if (count == 3) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;
                                        if (this.entitiesArray[i-1][j].isEeing)
                                            this.entitiesArray[i-1][j].popCheck = true;
                                        if (this.entitiesArray[i-2][j].isEeing)
                                            this.entitiesArray[i-2][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);
                                        this.entitiesArray[i - 1][j].setPopCheck(true);
                                        this.entitiesArray[i - 2][j].setPopCheck(true);
                                        this.doPop = true;

                                        this.tempScore += 300;

                                        this.entitiesArray[i][j].activateAttachedItem();
                                        this.entitiesArray[i - 1][j].activateAttachedItem();
                                        this.entitiesArray[i - 2][j].activateAttachedItem();
                                    }
                                    else if (count == 4) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);

                                        this.tempScore += 400;

                                        this.entitiesArray[i][j].activateAttachedItem();
                                    }
                                    else if (count == 5) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);

                                        this.tempScore += 600;
                                        this.entitiesArray[i][j].activateAttachedItem();
                                    }
                                    else if (count == 6) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);

                                        this.tempScore += 900;
                                        this.entitiesArray[i][j].activateAttachedItem();
                                    }
                                    else if (count == 7) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);

                                        this.tempScore += 1100;
                                        this.entitiesArray[i][j].activateAttachedItem();
                                    }
                                    else if (count == 8) {
                                        if (this.entitiesArray[i][j].isEeing)
                                            this.entitiesArray[i][j].popCheck = true;

                                        this.entitiesArray[i][j].setPopCheck(true);

                                        this.tempScore += 1500;
                                        this.entitiesArray[i][j].activateAttachedItem();
                                    }
                                    prevEntityType = this.entitiesArray[i][j].saladType;
                                }
                                else {		//count하는 entity와 다른 경우
                                    saladType = this.entitiesArray[i][j].saladType;
                                    prevEntityType = saladType;
                                    count = 1;

                                }
                            }
                            else {  //호두인 경우
                                saladType = null;
                                prevEntityType = null;
                                count = 0;
                            }
                        }
                        else {	//첫칸일 경우
                            saladType = this.entitiesArray[i][j].saladType;
                            prevEntityType = saladType;
                            count = 1;
                        }
                    }
                }
            }
        },

        _spawnOnTop: function(){
            var theX;
            var theY;
            var thisEntity;

            for (var i = 0 ; i < 8 ; i++) {
                var numOfNewEntitiesInACol = 0;
                for (var j = 0; j < 8; j++) {
                    if (this.entitiesArray[i][j].popCheck == true) {
                        numOfNewEntitiesInACol++;
                    }
                }
                this.offset = -1;
                for (var j = 0; j < 8; j++) {
                    if (this.entitiesArray[i][j].popCheck == true) {
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
                        else{
                            randNum = Math.floor(Math.random() * 8);
                        }
                        if (score > 18000)
                            randNum = Math.floor(Math.random() * 9);
                        //randNum = 8;
                        switch (randNum) {
                            case 0:
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityTomato", animSheet: this.animManager.getSaladAnim('EntityTomato') });
                                break;
                            case 1:
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityPaprika", animSheet: this.animManager.getSaladAnim('EntityParika') });
                                break;
                            case 2:
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityEggplant", animSheet: this.animManager.getSaladAnim('EntityEggplant') });
                                break;
                            case 3:
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityKiwi", animSheet: this.animManager.getSaladAnim('EntityKiwi') });
                                break;
                            case 4:
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityOnion", animSheet: this.animManager.getSaladAnim('EntityOnion') });
                                break;
                            case 5:
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityOrange", animSheet: this.animManager.getSaladAnim('EntityOrange') });
                                break;
                            case 6:
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityEgg", animSheet: this.animManager.getSaladAnim('EntityEgg') });
                                break;
                            case 7:
                                thisEntity = ig.game.spawnEntity(Salad, 560, 560, { saladType: "EntityCheese", animSheet: this.animManager.getSaladAnim('EntityCheese') });
                                break;
                            case 8:
                                thisEntity = ig.game.spawnEntity(Walnut, 560, 560, { saladType: "EntityWalnut", animSheet: this.animManager.getSaladAnim('EntityWalnut') });
                                break;
                        }
                        thisEntity.pos.x = theX;
                        thisEntity.pos.y = theY;
                        thisEntity.isFalling = true;
                        thisEntity.destY = 70 * ((--numOfNewEntitiesInACol));
                    }
                }
            }
        },

        waitPopping: function () {
            if (comboCount == 0) {
                var evt = document.createEvent('Event');
                evt.data = { score: score, longestrun: longestRun, xp: getXp(), coin: Math.floor(score / 70), level: getLevel() };
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

    PopManager2.instance = null;    //PopManager로 변경해야
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

function getLevel() {
    return level;
}
