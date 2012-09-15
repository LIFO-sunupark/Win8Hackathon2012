ig.module('game.levels.saladBowl2')
.requires(
    'impact.image',
    'game.entities.salad'
)
.defines(function () {
    setSettings = function () {
        var type;
        var randNum = Math.floor(Math.random() * 6);
        switch (randNum) {
            case 0:
                if (cTomato < 12) {
                    //type = "EntityTomato";
                    var settings = { saladType: "EntityTomato", animSheet: new ig.AnimationSheet('media/tomato.png', 70, 70) };
                    cTomato++;
                    return settings;
                }
                else {
                    return setSettings();
                }
            case 1:
                if (cPaprika < 12) {
                    //type = "EntityPaprika";
                    var settings = { saladType: "EntityPaprika", animSheet: new ig.AnimationSheet('media/paprika.png', 70, 70) };
                    cPaprika++;
                    return settings;
                }
                else {
                    return setSettings();
                }
            case 2:
                if (cEggplant < 12) {
                    //type = "EntityEggplant";
                    var settings = { saladType: "EntityEggplant", animSheet: new ig.AnimationSheet('media/eggplant.png', 70, 70) };
                    cEggplant++;
                    return settings;
                }
                else {
                    return setSettings();
                }
            case 3:
                if (cKiwi < 12) {
                    //type = "EntityKiwi";
                    var settings = { saladType: "EntityKiwi", animSheet: new ig.AnimationSheet('media/kiwi.png', 70, 70) };
                    cKiwi++;
                    return settings;
                }
                else {
                    return setSettings();
                }
            case 4:
                if (cOnion < 12) {
                    //type = "EntityOnion";
                    var settings = { saladType: "EntityOnion", animSheet: new ig.AnimationSheet('media/onion.png', 70, 70) };
                    cOnion++;
                    return settings;
                }
                else {
                    return setSettings();
                }
            case 5:
                if (cOrange < 12) {
                    //type = "EntityOrange";
                    var settings = { saladType: "EntityOrange", animSheet: new ig.AnimationSheet('media/orange.png', 70, 70) };
                    cOrange++;
                    return settings;
                }
                else {
                    return setSettings();
                }
            case 6:
                if (cEgg < 12) {
                    //type = "EntityEgg";
                    var settings = { saladType: "EntityEgg", animSheet: new ig.AnimationSheet('media/egg.png', 70, 70) };
                    cEgg++;
                    return settings;
                }
                else {
                    return setSettings();
                }
            case 7:
                if (cCheese < 12) {
                    //type = "EntityCheese";
                    var settings = { saladType: "EntityCheese", animSheet: new ig.AnimationSheet('media/cheese.png', 70, 70) };
                    cCheese++;
                    return settings;
                }
                else {
                    return setSettings();
                }
        }
    };

    var entitiesArray = new Array(64);
    var count = 0;
    var cCheese = 0;
    var cEgg = 0;
    var cEggplant = 0;
    var cKiwi = 0;
    var cOnion = 0;
    var cOrange = 0;
    var cPaprika = 0;
    var cTomato = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var y = i * 70;
            var x = j * 70;
            var _settings = setSettings();
            var entity = { "type": Salad, "x": x, "y": y ,"settings": _settings};
            entitiesArray[count] = entity;
            count++;
        }
    }


    console.log(cCheese + "," + cEgg + "," + cEggplant + "," + cKiwi + "," + cOnion + "," + cOrange + "," + cPaprika + "," + cTomato);
    LevelSaladBowl2 =/*JSON[*/{
        "entities": entitiesArray,
        "layer": [{ "name": "background", "width": 8, "height": 8, "linkWithCollision": false, "visible": 1, "tilesetName": "media/560x560-bowl-center.png", "repeat": false, "preRender": true, "distance": "1", "tilesize": 70, "foreground": false, "data": [[1, 2, 3, 4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15, 16], [17, 18, 19, 20, 21, 22, 23, 24], [25, 26, 27, 28, 29, 30, 31, 32], [33, 34, 35, 36, 37, 38, 39, 40], [41, 42, 43, 44, 45, 46, 47, 48], [49, 50, 51, 52, 53, 54, 55, 56], [57, 58, 59, 60, 61, 62, 63, 64]] }]
    }/*]JSON*/;

    SaladBowlBackground1 =/*JSON[*/{
        "layer": [{ "name": "background", "width": 8, "height": 8, "linkWithCollision": false, "visible": 1, "tilesetName": "media/560x560-bowl-center.png", "repeat": false, "preRender": true, "distance": "1", "tilesize": 70, "foreground": false, "data": [[1, 2, 3, 4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15, 16], [17, 18, 19, 20, 21, 22, 23, 24], [25, 26, 27, 28, 29, 30, 31, 32], [33, 34, 35, 36, 37, 38, 39, 40], [41, 42, 43, 44, 45, 46, 47, 48], [49, 50, 51, 52, 53, 54, 55, 56], [57, 58, 59, 60, 61, 62, 63, 64]] }]
    }

    SaladBowlBackground2 =/*JSON[*/{
        "layer": [{ "name": "background", "width": 8, "height": 8, "linkWithCollision": false, "visible": 1, "tilesetName": "media/560x560-bowl-red.png", "repeat": false, "preRender": true, "distance": "1", "tilesize": 70, "foreground": false, "data": [[1, 2, 3, 4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15, 16], [17, 18, 19, 20, 21, 22, 23, 24], [25, 26, 27, 28, 29, 30, 31, 32], [33, 34, 35, 36, 37, 38, 39, 40], [41, 42, 43, 44, 45, 46, 47, 48], [49, 50, 51, 52, 53, 54, 55, 56], [57, 58, 59, 60, 61, 62, 63, 64]] }]
    }

    // image preloading
    LevelSaladBowlResources1 = [new ig.Image('media/560x560-bowl-center.png')];
    LevelSaladBowlResources2 = [new ig.Image('media/560x560-bowl-red.png')];
});/*]JSON*/