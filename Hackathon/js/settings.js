(function () {
    "use strict";

    function ready(element, options) {
        
        $('#clearStorage').click(function() {
            localStorage.clear();
            loadFromLocalStorage();
        });

    }

    WinJS.UI.Pages.define("/html/settings.html", {
        ready: ready
    });

})();
