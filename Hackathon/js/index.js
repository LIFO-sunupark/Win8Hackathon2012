var init = function () {

    $('#btnGameStart').click(function() {
        $('#backgroundBody').fadeOut(700, function(){
            $('#gameCanvas').fadeIn(1000);
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