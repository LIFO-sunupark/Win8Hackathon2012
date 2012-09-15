var init = function () {

    $('#btnGameStart').click(function() {
        $('#backgroundBody').hide();
        $('#gameCanvas').show();
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