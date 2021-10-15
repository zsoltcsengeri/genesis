//------------------------------------------------------------------
//  last update: 2016.07.01 - ver 1.0
//------------------------------------------------------------------

(function(window, $, undefined){
    var video = (function(){
        var _youtubeScrollTop = 0;

        var _init = function(){

            },

            /**
             *	비디오 태그 ADD
             *	@param container 비디오 컨테이너
             *	@param template 비디오 태그를 포함한 템플릿
             *	view.addVideo($("#section-kv .video-con"), $("#template-video").html());
             */
            _addVideo = function(container, template){
                container.append(template);
                container.find("video").on("ended", _videoComplete).css({"position":"absolute", "width":"100%", "height":"100%"});
                container.find("img").addClass("hide")
            },


            /**
             *	비디오 태그 ADD
             *	@param container 비디오 컨테이너
             *	@param flashId 플래시 아이디
             *	@param playerId 플레이어 아이디
             *	@param videoUrl 비디오 파일 경로
             *	@param swfUrl swf파일 경로
             *	view.addFlashPlayer($("#section-kv .video-con"), "kvPlayer", "kv-video-player", "../video/eq900_2.mp4", "../asset/swf/model.swf");
             */
            _addFlashPlayer = function(container, flashId, playerId, videoUrl, swfUrl){
                container.append($("<div id='"+playerId+"'></div>"));

                var flashVars = {
                    videoUrl:videoUrl
                }

                var params = {
                    allowscriptaccess: 'always',
                    menu : 'false',
                    wmode : 'transparent'
                }

                var attribute = {
                    id : flashId,
                    name : flashId
                }

                swfobject.embedSWF(
                    swfUrl,
                    playerId,
                    "100%",
                    "100%",
                    "9.0.0",
                    "../asset/swf/expressInstall.swf",
                    flashVars,
                    params,
                    attribute
                )

                var selector = $("#"+flashId);
                selector.css({
                    "position":"absolute",
                    "top":0,
                    "left":0,
                    "opacity":1
                });
            },

            /**
             *	비디오 재생 완료
             */
            _videoComplete = function(){
                $(App.Events).trigger(App.Events.VIDEO_COMPLETE);
            },

            /**
             *	비디오 재생
             *	@param flashId 플래시 아이디
             */
            _videoPlay = function(flashId){
                App.util.thisFlashContent(flashId).callback_videoPlay();
            },

            /**
             *	비디오 정지
             *	@param flashId 플래시 아이디
             */
            _videoStop = function(flashId){
                App.util.thisFlashContent(flashId).callback_videoStop();
            },



        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //  유투브 팝업 전체창
        //	.popup.yotube-pop css (position:fixed; width :100% ; left:0; top:0; bottom:0; padding:0; background:#0000;)
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            _showBody = function(){
                $(".wrapper").removeClass("hide");
                $(window).scrollTop(_youtubeScrollTop);
            },

            _hideBody = function(){
                _youtubeScrollTop = $(window).scrollTop()
                $(".wrapper").addClass("hide");
            },

            /**
             *	유투브 팝업 보여주기
             *	@param popupCon 팝업 컨테이너 div
             *	@param youtubePlayer 유투브 플레이어 div
             */
            _showYoutubePlayerPopup = function(popupCon, youtubePlayer, url){
                $(App.Events).trigger(App.Events.SHOW_POPUP);
                //var videoUrl = popupCon.find("iframe").attr("data-src")+"?autoplay=1&rel=0&wmode=opaque";
                var videoUrl = url+"?autoplay=1&rel=0&wmode=opaque&showinfo=1&autohide=1&controls=2&fs=1&loop=0&modestbranding=1";
                $("body").css({"overflow": "hidden"});
                popupCon.removeClass("hide");
                youtubePlayer.attr("src", videoUrl);
                _resizeYoutubePopup(popupCon, youtubePlayer);
            },


            /**
             *	유투브 팝업 닫아주기
             *	@param popupCon 팝업 컨테이너 div
             *	@param youtubePlayer 유투브 플레이어 div
             */
            _hideYoutubePlayerPopup = function(popupCon, youtubePlayer){
                popupCon.addClass("hide");
                youtubePlayer.attr("src", "");
                $("body").css({"overflow": "visible"});
                $(App.Events).trigger(App.Events.HIDE_POPUP);
            },


            /**
             *	유투브 팝업 전체창 리사이즈
             *	@param popupCon 팝업 컨테이너 div
             *	@param youtubePlayer 유투브 플레이어 div
             */
            _resizeYoutubePopup =function(popupCon, youtubePlayer){
                // $("#kv-popup-youtube")
                popupCon.css({"width": "100%",
                    "height": "100%"});

                // $(".youtube-player")
                youtubePlayer.attr({"width":"100%",
                    "height":"99.8%"});
            }


        return {
            init : _init,
            addVideo:_addVideo,
            addFlashPlayer:_addFlashPlayer,
            videoComplete:_videoComplete,
            videoPlay:_videoPlay,
            videoStop:_videoStop,
            showBody : _showBody,
            hideBody : _hideBody,
            showYoutubePlayerPopup:_showYoutubePlayerPopup,
            hideYoutubePlayerPopup:_hideYoutubePlayerPopup,
            resizeYoutubePopup:_resizeYoutubePopup
        };
    })();

    $(function(){
        App.video = video;
        App.video.init();
    });
}(window, jQuery));
