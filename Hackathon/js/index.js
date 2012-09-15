var init = function() {

    $('#btnGameStart').click(function() {
        ig.main('#gameCanvas',DropGame,30,64,96,5,DropLoader);
        $('#menuArea').fadeOut(700,function() {
            $('#gameArea').fadeIn(1000);
        });
    });

    $('#btnOption').click(function() {
        openOption();
    });
    
    $('#popupInputName').keypress(function(e) {
        if(e.key=='Enter') {
            addLeaderBoardList($('#popupInputName')[0].value, $('#popupScore').text());
            hidePopup();
            console.log('aaa');
            $('#popupInputName')[0].value="";
        }
    });

    $.fn.digits=function() {
        return this.each(function() {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,"));
        });
    };
};

var settingsPane;
function openOption() {

    if(!settingsPane) {
        settingsPane = Windows.UI.ApplicationSettings.SettingsPane;
    }

    settingsPane.show();
}

function addLeaderBoardList(name, score) {

    var list = $('<li/>',{ 'class': 'leaderBoardBGFriend' });
    list.append($('<span/>',{ 'class': 'leaderBoardName' }).text(name));
    list.append($('<span/>',{ 'class': 'leaderBoardScore' }).text(score).digits());
    
    $('#leaderBoardList').append(list);
}

function showPopup(score, depth) {
    $('#popupScore').text(score).digits();
    $('#popupDepth').text(depth).diaits();
    $('#gameEndPopup').show();
}

function hidePopup() {
    $('#gameEndPopup').hide();
}

function updateScore(score) {
    $('#score').text(score).digits();
}