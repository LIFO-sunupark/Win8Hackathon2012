var init = function () {

    $('#btnGameStart').click(function() {
        $('#menuArea').fadeOut(700,function() {
            $('#gameArea').fadeIn(1000);
        });
    });

    $('#btnOption').click(function() {
        openOption();
    });
    
};

var settingsPane;
function openOption() {

    if(!settingsPane) {
        settingsPane = Windows.UI.ApplicationSettings.SettingsPane;
    }

    settingsPane.show();
}