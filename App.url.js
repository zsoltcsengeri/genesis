(function(window, $, undefined){
    var url = (function(){
        var BASE_URL = "/content/genesis";
        var MOBILE_CD = "m";
        var _isDispatcher = false;

        var _init = function(){
            var currentUrl = window.location.href;

            if (currentUrl.indexOf(":4502") != -1
                    || currentUrl.indexOf(":4503") != -1
                    || currentUrl.indexOf(":8443") != -1
                    || currentUrl.indexOf(":8090") != -1
                    || currentUrl.indexOf("admin-kr") != -1){
                _isDispatcher = false;
            } else {
                _isDispatcher = true;
            }
        };

        var _relativeToAbsolutePath = function(countryCd, localeCd){
            var container = $("#htmlGenerator");
            var prefixUrl = "";

            if (_isDispatcher){
                prefixUrl = "/" + countryCd + "/" + localeCd;
            } else {
                if (_Device.type === 0){
                    prefixUrl = "/" + BASE_URL + "/" + countryCd + "/" + localeCd;
                } else {
                    prefixUrl = "/" + BASE_URL + "/" + countryCd + "/" + localeCd + "/" + MOBILE_CD;
                }
            }

            $.each(container.find("a"), function(){
                var hrefUrl = $(this).attr("href");

                if (typeof(hrefUrl) !== "undefined" && hrefUrl !== ""){
                    if (hrefUrl.indexOf("/", 0) !== 0
                            && (hrefUrl.toLowerCase()).indexOf("javascript", 0) !== 0
                            && (hrefUrl.toLowerCase()).indexOf("http", 0) !== 0
                            && (hrefUrl.toLowerCase()).indexOf("mailto", 0) !== 0
                            && (hrefUrl.toLowerCase()).indexOf("#", 0) !== 0){

                        $(this).attr("href", prefixUrl + "/" + hrefUrl);
                    }
                }
            });
        };

        return {
            init : _init,
            relativeToAbsolutePath : _relativeToAbsolutePath
        };
    })();

    $(function(){
        App.url = url;
        App.url.init();
    });
}(window, jQuery));