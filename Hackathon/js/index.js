var init = function() {

    $('#btnGameStart').click(function() {
        loadFromLocalStorage();
        ig.main('#gameCanvas',DropGame,30,64,96,5,DropLoader);
        $('#menuArea').fadeOut(700,function() {
            $('#gameArea').fadeIn(1000);
        });
    });

    $('#btnOption').click(function() {
        openOption();
    });
    
    $('#btnContinue').click(function() {
        $('#pauseLayout').hide();
        ig.system.startRunLoop.call(ig.system);
    });

    $('#popupInputName').keypress(function(e) {
        if(e.key=='Enter') {
            inputSubmit();
            return;
        }
    });
    $('#popupInputButton').click(function() {
        if($('#popupInputName')[0].value!="") {
            inputSubmit();
        }
    });

    window.addEventListener("blur",function() {
        checkFocus();
    }, false);

    window.addEventListener("resize",function() {
        checkResize();
    },false);

    $.fn.digits=function() {
        return this.each(function() {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,"));
        });
    };
};

function checkFocus() {
    try {
        if(window.ig && ig.system.running) {
            ig.system.stopRunLoop.call(ig.system);
            $('#pauseLayout').show();
        }
    } catch(e) {
    }
}

function checkResize(event) {
    var isSnapped = window.msMatchMedia("(-ms-view-state: snapped)").matches;

    try {
        if(isSnapped) {
            $('#snapped').show();
        } else {
            $('#snapped').hide();
        }
    } catch(e) {
    }

}

function inputSubmit(){
    var _name = $('#popupInputName')[0].value;
    var _score = $('#popupScore').text();
    var _depth=$('#popupDepth').text();

    saveToLocalStorage(_name,_score,_depth);
    addLeaderBoardList(_name,_score,recordIndex,true);

    hidePopup();
    $('#popupInputName')[0].value="";
}

var settingsPane; //charm bar 변수
// 참바 띄우기
function openOption() {

    if(!settingsPane) {
        settingsPane = Windows.UI.ApplicationSettings.SettingsPane;
    }

    settingsPane.show();
}

// 리더보드에 항목 추가
function addLeaderBoardList(name, score, idx, isNew) {

    var item = $('<li/>',{ 'class': 'leaderBoardBGFriend', 'id': 'leaderList_'+idx });
    item.append($('<span/>',{ 'class': 'leaderBoardName' }).text(name));
    item.append($('<span/>',{ 'class': 'leaderBoardScore' }).text(score).digits());

    $('#leaderBoardList').append(item);

    if(isNew) {
        animateLeaderBoard(score,item,$('#leaderBoardList').children().length-1);
    }
    
}

var ANIMATE_HEIGHT = 68;
function animateLeaderBoard(score, curItem, curIdx) {

    var list = $('#leaderBoardList')[0];
    var targetIdx = 0;
    var needAnimate = false;

    for(var i=0;i<list.childElementCount;i++) {
        if(parseInt(score.replace(/[^0-9]/g,''))>parseInt(list.children(i).children(1).textContent.replace(/[^0-9]/g,''))) {
            $('#leaderBoardList>#targetList').attr('id','');
            var a=$('#leaderBoardList').find('#leaderList_'+i);
            console.log(a.attr('id'));
            $('#leaderBoardList').find('#leaderList_'+i).attr('id','targetList');
            targetIdx = i;
            needAnimate = true;
            break;
        }
    }

    if(!needAnimate){
        return;
    }

    var moveHeight = (curIdx - targetIdx)*ANIMATE_HEIGHT;
    curItem.css({ 'zIndex': '5','background': 'url("/media/leaderBoard/leaderboard_user.png")' });
    curItem.animate({
        top : '+=3',
        left : '-=3'
    }, 500, function(){
        var _id;
        for(var i=targetIdx;i<curIdx;i++) {
            _id = $('#leaderBoardList').find('.leaderBoardBGFriend')[i].id;
            $('#leaderBoardList').find('#'+_id).animate({
                top : '+='+ANIMATE_HEIGHT
            }, 800);
        }

        curItem.animate({
            top : '-='+moveHeight,
            left : 0
        }, 800, function(){
            curItem.css('zIndex','0');
            loadFromLocalStorage();
        });
    });

}

//리더보드 정보 스코어 순으로 소팅 
function sortRanking(recordList) {
    recordList.sort(function(a,b) {
        var aScore,bScore;

        aScore = parseInt(JSON.parse(a).score.replace(/[^0-9]/g,''));
        bScore = parseInt(JSON.parse(b).score.replace(/[^0-9]/g,''));
        return ((aScore<bScore)?1:((aScore>bScore)?-1:0));
    });
    return recordList;
}

var recordIndex = 0; // 로컬 스토리지 저장 인덱스
var recordList = []; // 리더보드 리스트 
// 로컬 스토리지에서 리더보드 정보 가져오기
function loadFromLocalStorage() {
    
    var item;
    recordIndex = 0;
    recordList = [];
    $('#leaderBoardList').empty();

    while(true) {
        item = localStorage.getItem("user_"+recordIndex);
        
        if(item != undefined){
            recordList.push(item);
        } else{
            break;
        }

        recordIndex++;
    }

    if(recordList.length > 1){
        recordList = sortRanking(recordList);
    }

    for(var i=0;i<recordList.length;i++) {
        addLeaderBoardList(JSON.parse(recordList[i]).name, JSON.parse(recordList[i]).score, i, false);
    }
}

//로컬 스토리지에 저장 
function saveToLocalStorage(name, score, depth) {
    userInfo = {
        "name": name,
        "score": score.replace(/[^0-9]/g,''),
        "depth": depth
    };

    localStorage.setItem("user_"+recordIndex,JSON.stringify(userInfo));

    recordIndex++;
}

// 게임 종료 팝업 띄우기
function showPopup(score, depth) {
    $('#popupScore').text(score).digits();
    $('#popupDepth').text(depth).digits();
    $('#gameEndPopup').show();
}

// 게임 종료 팝업 숨기기
function hidePopup() {
    $('#gameEndPopup').hide();
}

// 점수 동적 갱신
function updateScore(score) {
    $('#score').text(score).digits();
}
// 깊이 동적 갱신
function updateDepth(depth) {
    $('#depth').text(depth).digits();
}