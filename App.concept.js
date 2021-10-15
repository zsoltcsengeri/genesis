//------------------------------------------------------------------
//  last update: 2020.05.14 - ver.2.0
//------------------------------------------------------------------

(function(window, $, undefined){
    var ny_concept = (function(){
        var KEYVISUAL_DEFAULT_WIDTH = 1920;
        var KEYVISUAL_DEFAULT_HEIGHT = 1080;


        // 컨텐츠 높이 체크
        var _checkHeightContainer = $(".concept .js-check-height");
        var _topBarHeight = $(".head-bg").height();

        var _contentsLen = 0;
        var _arrContentsPosY = [];
        var _arrContentsHeight = [];

        var _arrSwipeCon = [];
        var _swipeNum = 0;
        var _swipeResizeTimer = "";
        var _swipeResizeCount = 0;

        var _arrResizeContentHeight = [];

        var _currentContentsIndex = -2;

        var _isShowYoutubePopup = false;
        var _isPlayKeyvisualVideo = false;

        // tablet resize
        var _oldWidth = 0;
        var _resizeTimer = "";
        var _isStartResizeTimer = false;

        var _isChangeContents = false;

        var _arrSnappingContents = [];

        // 갤러리
        var _arrGalleryPageLen = [];
        var _arrGalleryListLen = [];
        var _currentGalleryConIndex = 0;
        var _currentGalleryDividerIndex = 0;
        var _currentGalleryPage = 0;
        var _currentGalleryPopupVideoIndex = 0;
        var _isGalleryTrans = false;
        var _currentGalleryPopupDividerIndex = 0;
        var _isGalleryPopupTrans = false;
        var _isShowGalleryPopup = false;

        var _scrollTop = 0;

        var _keyvisualReadyStateCount = 0;


        var _init = function(){
                $("img.lazy").load(function(){_onResize();})
                $("img.lazy").lazyload({
                    threshold : 1500
                });

                _show();
                $(App.Events).trigger(App.Events.APP_READY);
            },
            _show = function(){
                App.GlobalVars.isSnappingContents = true;
                _setKeyvisualVideo();
                _onSet_resizeContents();
                _setSnappingContents();
                _setGallery();
                _setSwipe();
                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_TABLET) _makeSwipe();
                _addEvent();
                _onResize();
                _onScrollMove(null, 0);

                //kv area일시 메뉴 숨기기
                if($(window).scrollTop() == 0){
                    $("header .head-bg").css("top", "-80px");
                    $(".shortcut-wrap").css("top", "-50px");
                    $("header .common-menu .location").css("top", "-20px");
                }

            },

            _addEvent = function(){
                //  리사이징
                $(App.Events).on(App.Events.RESIZE_BROWSER, _onResize);

                // 스크롤 이벤트
                $(App.Events).on(App.Events.SCROLL_MOVE, _onScrollMove);

                // 인디게이터 클릭시
                $(App.Events).on(App.Events.CLICK_INDICATOR, _onClick_indicator);

                // 마우스 휠 이벤트
                $(App.Events).on(App.Events.MOUSE_WHEEL, _onMouseWheel);

                // 공유된 갤러리 이미지 보여주기
                $(App.Events).on(App.Events.SHOW_SHARE_GALLERY, _showShareGallery);

                $(window).on("orientationchange", _onChangeOrientation)

                // 유투브 플레이 버튼 클릭시
                $(".concept .btn-youtube-play").on("click", _onClick_btnPlayYoutube);

                // 유투브 팝업 닫기 버튼 클릭시
                $(".youtube-pop .close-pop a").on("click", _onClick_closePopupYoutube);

                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){
                    $(".concept  .kv-area a.gbtn.video").on("mouseover", _onOver_btnKvPlay);
                    $(".concept  .kv-area a.gbtn.video").on("mouseout", _onOut_btnKvPlay);
                }

                $(document).on("click", ".popup.video-pop .close-pop", _onClick_closeKeyvisualVideoPopup);
                $(".concept  .kv-area a.gbtn.video").on("click", _onClick_btnKvPlay);
                $(".concept  .kv-area .bg-holder video").on("ended", _onComplete_keyvisualVideo)

                /*
                 if(!App.GlobalVars.isLowIE){
                 $(".concept  .kv-area a.gbtn.video").on("click", _onClick_btnKvPlay);
                 $(".concept  .kv-area .bg-holder video").on("ended", _onComplete_keyvisualVideo)
                 }
                 */

                // 갤러리 구분자 클릭시
                $(".concept .type-gallery .gallery-holder .gallery-func-area .gallery-selector a").on("click", _onClick_galleryDivider);

                // 갤러리 이전 버튼 클릭시
                $(".concept .type-gallery .gallery-holder .gallery-view-area .btns-holder a.btn-prev").on("click", _onClick_galleryPrev);
                // 갤러리 다음 버튼 클릭시
                $(".concept .type-gallery .gallery-holder .gallery-view-area .btns-holder a.btn-next").on("click", _onClick_galleryNext);
                // 갤러리 리스트 클릭시
                $(".concept .type-gallery .gallery-holder .gallery-view-area .swipe-list .gallery-list-wrap li a").on("click", _onClick_galleryList);
                // 갤러리 팝업 닫기 버튼 클릭시
                $(".gallery-popup .btn-close-pop").on("click", _onClick_closeGalleryPopup);
                // 갤러리 팝업 구분자 클릭
                $(".gallery-popup .select-sub .subject-wrap a").on("click", _onClick_galleryPopupDivider);
                // 갤러리 팝업 인디게이터 클릭
                $(".gallery-popup .pop-view-area .btns-wrap .indicators li a").on("click", _onClick_galleryPopupIndicator);
                $(document).on("click", ".gallery-popup .pop-view-area .btn-holder .btn-prev", _onClick_galleryPopupPrev)
                $(document).on("click", ".gallery-popup .pop-view-area .btn-holder .btn-next", _onClick_galleryPopupNext)

                // key feature - tap col tpye 버튼 클릭시
                $(".concept .type-tab-4col .tab-btn-area ul li").on("click", _onClick_keyFeature);

                // 180402 video event 추가
                $(".concept  .is-video").on("click", _onClick_videoPopPlay);

            },

        // 리사이즈 이벤트
            _onResize = function(e){
                var winW = $(window).width();
                var winH = $(window).height();

                if(App.GlobalVars.currentDevice != App.GlobalVars.DEVICE_TYPE_MOBILE){
                    if(winW<App.GlobalVars.WIN_MIN_WIDTH){
                        winW = App.GlobalVars.WIN_MIN_WIDTH;
                    }else if(winW>App.GlobalVars.WIN_MAX_WIDTH){
                        winW = App.GlobalVars.WIN_MAX_WIDTH;
                    }


                    if(winH < App.GlobalVars.WIN_MIN_HEIGHT) winH= App.GlobalVars.WIN_MIN_HEIGHT

                    if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){
                        App.resize.fullSizeImg(
                            $(".concept .cont-fullsize"),
                            $(".concept .cont-fullsize .bg-holder"),
                            $(".concept .cont-fullsize .bg-holder img"),
                            winW,
                            winH,
                            KEYVISUAL_DEFAULT_WIDTH,
                            KEYVISUAL_DEFAULT_HEIGHT
                        )

                        if(_isShowGalleryPopup){
                            var i = 0;
                            var j = 0;
                            var galleryConLen = $(".gallery-popup").length;
                            for(i=0; i<galleryConLen; i++){
                                var galleryDividerLen = $(".gallery-popup").eq(i).find(".gal-pop-view .pop-view-area").length;
                                for(j=0; j<galleryDividerLen; j++){
                                    _onResize_galleryPopup($(window).width(), $(window).height(), i, j);
                                }
                            }
                        }
                    }else{
                        if(winW != _oldWidth){
                            _stopResizeTimer();
                            _oldWidth = winW;
                            App.resize.fullSizeImg(
                                $(".concept .cont-fullsize"),
                                $(".concept .cont-fullsize .bg-holder"),
                                $(".concept .cont-fullsize .bg-holder img"),
                                winW,
                                winH,
                                KEYVISUAL_DEFAULT_WIDTH,
                                KEYVISUAL_DEFAULT_HEIGHT
                            )
                            $(".gallery-popup .swipe").css({width:winW, height:winH})
                            _startResizeTimer();
                        }else{
                            _stopResizeTimer();
                        }
                    }
                    _onResize_perWidthContents(winW, winH);
                }

                _setContentsPosY();
                App.parallax.setContentsData();

                if(_isShowYoutubePopup){
                    App.video.resizeYoutubePopup($(".youtube-pop"), $(".youtube-player"));
                }

                _onResize_galleryPopup(winW, winH, _currentGalleryConIndex, _currentGalleryDividerIndex)
                _onScrollMove(null, $(window).scrollTop());
            },



        // resize content 높이 저장
            _onSet_resizeContents = function(){
                var len = $(".concept .js-per-width").length;
                for(var i=0; i<len; i++){
                    _arrResizeContentHeight[i] = parseInt( $(".concept .js-per-width").eq(i).css("height") );
                }
            },

        //resize content 높이 리사이징
            _onResize_perWidthContents = function(winW, winH){
                //console.log(winW)
                var targetW = winW;
                if(targetW < App.GlobalVars.WIN_MIN_WIDTH) targetW = App.GlobalVars.WIN_MIN_WIDTH;
                var per = targetW / App.GlobalVars.WIN_MAX_WIDTH;
                if(per > 1 ) per = 1;

                var len = $(".concept .js-per-width").length;
                for(var i=0; i<len; i++){
                    $(".concept .js-per-width").eq(i).css("height", _arrResizeContentHeight[i]*per);
                }


                //highlight resize
                if(winW <= 1600){

                    var gap = App.util.linearFunc(winW, 1600, 1024, 30, 100);
                    $(".model .sec-1 .gallery-holder").css("height", (_arrResizeContentHeight[0]*per) + gap);
                }
            },


        // 스크롤 무브 이벤트
            _onScrollMove = function(e, scrollTop){

                var winW = $(window).width();
                var winH = $(window).height();


                if(App.GlobalVars.currentDevice != App.GlobalVars.DEVICE_TYPE_MOBILE) {
                    _checkIndexToScroll(scrollTop);
                }

                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC) {
                    if(winW > winH) {
                        App.parallax.checkParallaxContent(scrollTop);
                    }else{
                        App.parallax.checkResetContents();
                    }
                }
            },

            _onChangeOrientation = function(e){
                if(_isShowGalleryPopup){
                    _swipeResizeTimerStop()
                    _swipeResizeCount = 0;
                    _swipeResizeTimerStart(_currentGalleryConIndex, _currentGalleryDividerIndex)
                }

            },

        // 인디게이터를 클릭했을 때
            _onClick_indicator = function(e, indicatorIndex){
                _moveTargetContent(indicatorIndex);
            },

        //indicator 번호를 가지고 있는 컨텐츠 중 제일 첫번째 컨텐츠 위치로 이동
            _moveTargetContent = function(indicatorIndex){

                var tg = 0;
                for(var i=0; i<_contentsLen; i++){
                    var data = _checkHeightContainer.eq(i).data("indicator-index");

                    if(indicatorIndex == data){
                        tg = i != 0 ? _arrContentsPosY[i-1] : 0;
                        break;
                    }
                }

                //navigation height만큼 조정
                var isFull = _checkHeightContainer.eq(i).hasClass("cont-fullsize")
                var menuHeight = isFull ? 0 : $(".head-bg").height();
                tg = tg<=0 ? 0 : tg - menuHeight;

                var time = 1200;
                $('html, body').stop().animate({ scrollTop: tg+1}, {duration:time, easing:"easeInOutExpo",complete:_onComplete_changeContents});
            },

        // 스내핑 될 컨텐츠 저장하기
            _setSnappingContents = function(){
                var i = 0;
                var len = _checkHeightContainer.length;
                for(i=0; i<len; i++){
                    var hasClass = _checkHeightContainer.eq(i).hasClass("js-snapping");
                    if(hasClass){
                        //_arrSnappingContents[i] = true;
                    }
                }
            },

        ////////////////////////////////////////////
        //  타블렛 리사이즈 타이머
        ////////////////////////////////////////////
            _startResizeTimer = function(){
                if(!_isStartResizeTimer){
                    //_isStartResizeTimer = true;
                    //_resizeTimer = window.setInterval(_resizeTimerEventHandler, 100);
                }
            },

            _stopResizeTimer = function(){
                if(_isStartResizeTimer) {
                    _isStartResizeTimer = false;
                    window.clearInterval(_resizeTimer);
                }
            },

            _resizeTimerEventHandler = function(){
                App.resize.onResize();
            },

        ////////////////////////////////////////////
        //  스크롤 이동에 따른 컨텐츠 영역 체크
        ////////////////////////////////////////////

        // 스크롤 이동에 따른 인덱스값 체크
            _checkIndexToScroll = function(scrollTop){
                var i = 0;
                var tgIndex = -1;

                if(scrollTop == 0){
                    tgIndex = -1;
                } else {
                    tgIndex = _contentsLen-2;

                    for(i=0; i<_contentsLen; i++){
                        var startY = 0;
                        var endY = 0;

                        if(i != _contentsLen-1) {
                            startY = _arrContentsPosY[i] - _arrContentsPosY[0] + ($(window).height()*.5) ;
                            endY = startY + _arrContentsHeight[i + 1] ;
                        }

                        if(scrollTop>=startY && scrollTop<= endY){
                            tgIndex = i;
                            break;
                        } else if(scrollTop < ($(window).height()*.5)){
                            tgIndex = -1;
                            break;
                        }
                    }
                }

                if(tgIndex == _currentContentsIndex) return;
                _currentContentsIndex = tgIndex;

                var indicatorIndex = $(".js-check-height").eq(_currentContentsIndex+1).data("indicator-index");
                $(App.Events).trigger(App.Events.CHANGE_SECTION, [indicatorIndex, _currentContentsIndex]);
            },



        // 각 컨텐츠 위치 및 높이 저장하기
            _setContentsPosY = function(){
                var i = 0;
                var num = 0;

                _contentsLen = _checkHeightContainer.length;

                var isSame = true;
                for(i=0; i<_contentsLen; i++){
                    var contentsHeight = _checkHeightContainer.eq(i).innerHeight();

                    if(contentsHeight != _arrContentsHeight[i]){
                        isSame = false;
                        break;
                    }
                }
                if(isSame) return;

                for(i=0; i<_contentsLen; i++){
                    var contentsHeight = _checkHeightContainer.eq(i).innerHeight();

                    num = num + contentsHeight;
                    _arrContentsPosY[i] = num;
                    _arrContentsHeight[i] = contentsHeight;
                }
            },


        ////////////////////////////////////////////
        //  마우스 휠
        ////////////////////////////////////////////
            _onMouseWheel = function(e,deltaY){
                if(deltaY < 0){
                    // down : next page
                    _nextContents();
                }else{
                    // up : prev page
                    _prevContents();
                }
            },

        // 이전 컨텐츠
            _prevContents = function(){
                if(!_isChangeContents) {
                    App.GlobalVars.isWheelLock = false;
                }
            },

        // 다음 컨텐츠
            _nextContents = function(){
                var scrollTop = $(window).scrollTop();
                var winW = $(window).width();
                var winH = $(window).height();

                if(winW < winH) {
                    if(winH>App.GlobalVars.WIN_MIN_HEIGHT) winH = App.GlobalVars.WIN_MIN_HEIGHT;
                }


                if (!_isChangeContents) {
                    if (scrollTop < winH) {
                        if(winH > 768) {                            
                            App.GlobalVars.isWheelLock = true;
                            _changeContents(0);
                        } // 2020-05-14
                    } else {
                        var checkIndex = _currentContentsIndex + 1;
                        if (_arrSnappingContents[checkIndex] != undefined) {
                            if (_arrSnappingContents[checkIndex]) {
                                App.GlobalVars.isWheelLock = true;
                                var index = _currentContentsIndex;
                                _changeContents(index);
                            }else{
                                App.GlobalVars.isWheelLock = false;
                            }
                        }else{
                            App.GlobalVars.isWheelLock = false;
                        }
                    }
                }

            },

        // 컨텐츠 변경
            _changeContents = function(index){
                var targetY = 0;
                _isChangeContents = true;
                if(index != -1) targetY = _arrContentsPosY[index]+1;
                //if(index == 4 || index == 10 || index == 21 || index == 29) targetY -= 80;

                $('html, body').stop().animate({ scrollTop: targetY}, {duration:1200, easing:"easeInOutExpo",complete:_onComplete_changeContents});
            },

        // 컨텐츠 변경 완료
            _onComplete_changeContents = function(){
                _isChangeContents = false;
            },


        ////////////////////////////////////////////
        //  키비주얼
        ////////////////////////////////////////////
            _setKeyvisualVideo = function(){
                _isPlayKeyvisualVideo = true;
                $(".concept  .kv-area .bg-holder video").css("z-index", 2);
                $(".concept  .kv-area .bg-holder img").css({"z-index":1, "opacity":0});

                var hasVideo = $(".concept .kv-area a.gbtn.video").attr("href");

                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){

                    if(hasVideo == undefined || hasVideo == "" || App.GlobalVars.isLowIE){
                        _showKeyvisualImage();
                        $(".concept .kv-area a.gbtn.video").addClass("hide");
                    }else{
                        // 0718 자동플레이 제거 - 신형주
                        //_playKeyvisualVideo();
                        _stopKeyvisualVideo();
                        _showKeyvisualImage();
                    }

                }else{
                    if(hasVideo == undefined || hasVideo == ""){
                        $(".concept .kv-area a.gbtn.video").addClass("hide");
                    }

                    $(".concept .kv-area a.gbtn.video").removeClass("skip");
                    _showKeyvisualImage();
                }
            },

        // 키비주얼 동영상 완료시
            _onComplete_keyvisualVideo = function(e){
                _stopKeyvisualVideo();
                _showKeyvisualImage();
            },

            _checkKeyvisualVideoRadyState = function(){
                if(_keyvisualReadyStateCount<100){
                    if($(".concept .kv-area video")[0] != undefined){
                        if($(".concept .kv-area video")[0].readyState == 4){
                            $(".concept .kv-area video")[0].currentTime = 0.1;
                            $(".concept .kv-area video")[0].play();
                        }else{
                            window.setTimeout(function(){
                                _checkKeyvisualVideoRadyState();
                                _keyvisualReadyStateCount++
                            }, 100)
                            return;
                        }
                    }else{
                        window.setTimeout(function(){
                            _checkKeyvisualVideoRadyState();
                            _keyvisualReadyStateCount++
                        }, 100)
                        return;
                    }
                }else{
                    _stopKeyvisualVideo();
                }
            },

            _playKeyvisualVideo = function(){
                _showKeyvisualVideo();

                //$(".concept  .kv-area .bg-holder video")[0].currentTime = 0.1;
                //$(".concept  .kv-area .bg-holder video")[0].play();

                _checkKeyvisualVideoRadyState();

                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC) {
                    $(".concept .kv-area a.gbtn.video").addClass("skip");
                    $(".concept .kv-area a.gbtn.video.btn-youtube-play").removeClass("skip"); //유투브 팝업으로 인한 클래스 추가 160728
                }


            },

            _stopKeyvisualVideo = function(){
                _showKeyvisualImage();

                $(".concept  .kv-area .bg-holder video")[0].pause();

                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC) {
                    $(".concept .kv-area a.gbtn.video").removeClass("skip");
                }
            },

        // 키비주얼 이미지 보여주기
            _showKeyvisualImage = function(){
                _isPlayKeyvisualVideo = false;
                var videoCon = $(".concept  .kv-area .bg-holder video");
                var imageCon = $(".concept  .kv-area .bg-holder img");
                videoCon.css("z-index", 1);
                imageCon.css({"z-index":2, "opacity":0})
                TweenLite.killTweensOf(imageCon);
                TweenLite.to(imageCon, 1, {"css":{"opacity":1}});
            },

            _showKeyvisualVideo = function(){
                _isPlayKeyvisualVideo = true;
                var videoCon = $(".concept  .kv-area .bg-holder video");
                var imageCon = $(".concept  .kv-area .bg-holder img");
                videoCon.css({"z-index": 2, "opacity":0});
                imageCon.css({"z-index":1, "opacity":1})
                TweenLite.killTweensOf(videoCon);
                TweenLite.to(videoCon, 1, {"css":{"opacity":1}});
            },

        // 키비주얼 동영상 재생 버튼 오버
            _onOver_btnKvPlay = function(e){
                $(".concept .kv-area a.gbtn.video span.ico-play").css("border-left-color", "#804033")
            },


        // 키비주얼 동영상 재생 버튼 아웃
            _onOut_btnKvPlay = function(e){
                $(".concept .kv-area a.gbtn.video span.ico-play").css("border-left-color", "#fff")
            },

            _onClick_btnKvPlay = function(e){
                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){
                    if(_isPlayKeyvisualVideo){
                        _stopKeyvisualVideo();
                    }else{
                        _playKeyvisualVideo();
                    }
                }else{
                    e.preventDefault();
                    var videoUrl = $(e.currentTarget).attr("href");
                    _setKeyvisualVideoUrl(videoUrl)
                    _showKeyvisualVideoPopup();
                }
                return false
            },

        // 키비주얼 팝업 닫기버튼 클릭
            _onClick_closeKeyvisualVideoPopup = function(e){
                _hideKeyvisualVideoPopup();
                return false;
            },

// 키비주얼 비디오 팝업 보여주기
            _showKeyvisualVideoPopup = function(){
                $(App.Events).trigger(App.Events.SHOW_POPUP);
                _scrollTop = $(window).scrollTop();
                $("body").css("overflow", "hidden");
                $(".popup.video-pop").removeClass("hide");


                _play_keyvisualPopupVideo();

            },

            _setKeyvisualVideoUrl = function(videoUrl){
                var path = videoUrl.split(".mp4");

                var mp4Url = path[0]+".mp4";
                var webmUrl = path[0]+".webm";

                if($(".popup.video-pop video").length != 0){
                    $(".popup.video-pop video").remove();
                }

                var videoSourceEle = "<video controls><source src='"+mp4Url+"'>"+"<source src='"+webmUrl+"'></video>";
                $(".popup.video-pop .video-holder").append(videoSourceEle);
            },

        // 키비주얼 비디오 팝업 감추기
            _hideKeyvisualVideoPopup = function(){
                $(".popup.video-pop").addClass("hide");

                $("body").css("overflow", "visible");
                $(window).scrollTop(_scrollTop);

                _stop_keyvisualPopupVideo();
                $(App.Events).trigger(App.Events.HIDE_POPUP);
            },

            _play_keyvisualPopupVideo = function(){
                $(".popup.video-pop .video-holder video").currentTime = 0;
                //$(".popup.video-pop .video-holder video")[0].play();
            },

            _stop_keyvisualPopupVideo = function(){
                $(".popup.video-pop .video-holder video")[0].pause();
                $(".popup.video-pop .video-holder video")[0].currentTime = 0;
            },

        ////////////////////////////////////////////
        //  유투브팝업
        ////////////////////////////////////////////

        // 유투브 버튼 클릭했을 때
            _onClick_btnPlayYoutube = function(e){
                var url = $(this).attr("href");
                _showYoutubePlayerPopup(url);
                return false;
            },

            _showYoutubePlayerPopup = function(url){
                _isShowYoutubePopup = true;
                //App.video.hideBody();
                _onResize();
                App.video.showYoutubePlayerPopup($(".youtube-pop"), $(".youtube-player"), url);
            },

        // 팝업 닫기버튼을 눌렀을 때
            _onClick_closePopupYoutube = function(e){
                _isShowYoutubePopup = false;
                //App.video.showBody();
                App.video.hideYoutubePlayerPopup($(".youtube-pop"), $(".youtube-player"));
                _onResize();
                return false;
            },

        ////////////////////////////////////////////
        //  갤러리
        ////////////////////////////////////////////

        // 갤러리 셋팅하기
            _setGallery = function(){
                var i = 0;
                var j = 0;
                var k = 0;
                var l = 0;
                var con = $(".concept .type-gallery");
                var conLen = con.length;

                for(i=0; i<conLen; i++){
                    con.eq(i).attr("data-con-index", i);
                    $(".gallery-popup").eq(i).attr("data-con-index", i)
                    _arrGalleryPageLen[i]=[];
                    _arrGalleryListLen[i]=[];

                    var dividerLen = con.eq(i).find(".gallery-selector a").length;
                    for(j=0; j<dividerLen; j++){
                        var pageLen = con.eq(i).find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(j).find(".swipe-wrap .swipe-list").length;
                        con.eq(i).find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(j).attr("data-currentpage", 0)
                        con.eq(i).find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(j).find(".btns-holder .indicator span.total").text(pageLen);
                        _arrGalleryPageLen[i].push(pageLen);

                        if(pageLen < 2) con.eq(i).find(".gallery-holder .gallery-view-area .btns-holder .prev-next-btns").eq(j).addClass("hide");
                        var listCount = 0;
                        for(k=0; k<pageLen; k++){
                            var listLen = con.eq(i).find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(j).find(".swipe-wrap .swipe-list").eq(k).find(".gallery-list-wrap>li").length;

                            for(l=0; l<listLen; l++){
                                con.eq(i).find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(j).find(".swipe-wrap .swipe-list").eq(k).find(".gallery-list-wrap>li").eq(l).attr("data-list-index", listCount);
                                listCount++
                            }
                        }
                        _arrGalleryListLen[i].push(listCount);
                    }
                }
            },

        // 갤러리 구분자 클릭시
            _onClick_galleryDivider = function(e){
                var con = $(e.currentTarget).closest(".type-gallery");
                var index = $(e.currentTarget).index();
                _changeGalleryDivider(con, index);
                return false;
            },

        // 공유 갤러리 보여주기
            _showShareGallery = function(e, componentIndex, categoryIndex, galleryIndex){
                var con = $(".type-gallery").eq(componentIndex);
                _changeGalleryDivider(con, categoryIndex);
                _showGalleryPopup(componentIndex, categoryIndex, galleryIndex);
            },

        // 갤러리 구분자 선택시
            _changeGalleryDivider = function(con, index){
                if(_currentGalleryDividerIndex != index){
                    _moveGalleryDivider(con, _currentGalleryDividerIndex, index);
                    _offGalleryDivider(con, _currentGalleryDividerIndex);
                    _currentGalleryDividerIndex = index;
                    _onGalleryDivider(con, _currentGalleryDividerIndex);

                    if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_TABLET){
                        var swipeIndex = con.find(".devided-slider").eq(index).attr("data-swipe-index");
                        var swipeLen = parseInt(con.find(".devided-slider").eq(index).find(".btns-holder .indicator span").eq(2).text());

                        //console.log("click divider : ", swipeIndex, swipeLen)
                        _arrSwipeCon[swipeIndex].setup(swipeLen);
                    }
                }
            },

        // 갤러리 구분자 활성화
            _onGalleryDivider = function(con, index){
                con.find(".gallery-holder .gallery-func-area .gallery-selector a").eq(index).addClass("selected");
            },

        // 갤러리 구분자 비활성화
            _offGalleryDivider = function(con, index){
                con.find(".gallery-holder .gallery-func-area .gallery-selector a").eq(index).removeClass("selected");
            },

            _moveGalleryDivider = function(con, oldDividerIndex, currentDividerIndex){
                _isGalleryTrans = true;

                var sliderWidth = con.find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(oldDividerIndex).width();
                var targetX = sliderWidth

                if(oldDividerIndex>currentDividerIndex) targetX = -sliderWidth
                var oldPage = con.find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(oldDividerIndex);
                var currentPage = con.find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(currentDividerIndex);

                TweenLite.killTweensOf(oldPage);
                oldPage.css("z-index", 2);
                TweenLite.to(oldPage, 1, {"css":{"left":-targetX}, ease:Quart.easeInOut});

                TweenLite.killTweensOf(currentPage);
                currentPage.css({"z-index": 1, "left":targetX - (targetX*0.6)}).removeClass("hide");
                TweenLite.to(currentPage, 1, {"css":{"left":0}, ease:Quart.easeOut, onComplete:_onComplete_moveGalleryDivider, onCompleteParams:[oldPage]});
            },

            _onComplete_moveGalleryDivider = function(con){
                con.addClass("hide");
                _isGalleryTrans = false;
            },



        // 갤러리 이전 버튼 클릭시
            _onClick_galleryPrev = function(e){
                if( _isGalleryTrans) return false;
                var con = $(e.currentTarget).closest(".type-gallery");
                var conIndex = parseInt(con.attr("data-con-index"));
                console.log($(e.currentTarget));
                var swipeIndex = parseInt($(e.currentTarget).closest(".swipe").attr("data-swipe-index"));
                var page = parseInt(con.find(".devided-slider").eq(_currentGalleryDividerIndex).attr("data-currentpage"))-1;
                if(page < 0){
                    page = _arrGalleryPageLen[conIndex][_currentGalleryDividerIndex] - 1;
                }

                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){
                    //_onMove_galleryPrev(con, page);
                    _onChange_galleryPage(con, page, false);
                }else{
                    _arrSwipeCon[swipeIndex].prev();
                }
                return false
            },

        // 갤러리 다음 버튼 클릭시
            _onClick_galleryNext = function(e){
                if( _isGalleryTrans) return false;
                var con = $(e.currentTarget).closest(".type-gallery");
                var conIndex = parseInt(con.attr("data-con-index"));
                var swipeIndex = parseInt($(e.currentTarget).closest(".swipe").attr("data-swipe-index"));
                var page = parseInt(con.find(".devided-slider").eq(_currentGalleryDividerIndex).attr("data-currentpage"))+1;
                if(page > _arrGalleryPageLen[conIndex][_currentGalleryDividerIndex] - 1){
                    page = 0;
                }

                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){
                    //_onMove_galleryNext(con, page)
                    _onChange_galleryPage(con, page, true);
                }else{
                    _arrSwipeCon[swipeIndex].next();
                }
                return false
            },

            _onChange_galleryPage = function(con, page, isNext){
                var oldPage = parseInt(con.find(".devided-slider").eq(_currentGalleryDividerIndex).attr("data-currentpage"));
                _onMove_galleryPage(con, oldPage, page, isNext);
                con.find(".devided-slider").eq(_currentGalleryDividerIndex).attr("data-currentpage", page);
                con.find(".devided-slider").eq(_currentGalleryDividerIndex).find(".btns-holder .indicator span.current").text(page+1);
            },

            _onMove_galleryPage = function(con, oldPage, currentPage, isNext){
                _isGalleryTrans = true;
                var sliderWidth = con.find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(_currentGalleryDividerIndex).width();
                var targetX = sliderWidth
                var oldPageCon = con.find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(_currentGalleryDividerIndex).find(".swipe-wrap .swipe-list").eq(oldPage);
                var currentPageCon = con.find(".gallery-holder .gallery-view-area .gallery-view-inner .devided-slider").eq(_currentGalleryDividerIndex).find(".swipe-wrap .swipe-list").eq(currentPage);

                if(!isNext) {
                    targetX = -sliderWidth
                }
                TweenLite.killTweensOf(oldPageCon);
                oldPageCon.css("z-index", 2);
                TweenLite.to(oldPageCon, 0.3, {"css":{"left":0, "opacity":0}, ease:Quart.easeOut});

                TweenLite.killTweensOf(currentPageCon);
                currentPageCon.css({"z-index": 1, "left":0, "opacity":0}).removeClass("hide");
                TweenLite.to(currentPageCon, 0.5, {"css":{"left":0, "opacity":1}, ease:Quart.easeOut, onComplete:_onComplete_moveGalleryPage, onCompleteParams:[oldPageCon]});
            },

        // 갤러리 페이지 트랜지션 완료
            _onComplete_moveGalleryPage = function(con){
                con.addClass("hide");
                _isGalleryTrans = false;
            },

        // 갤러리 리스트 클릭
            _onClick_galleryList = function(e){
                var conIndex = parseInt($(e.currentTarget).closest(".type-gallery").attr("data-con-index"));
                var listIndex = parseInt($(e.currentTarget).parent().attr("data-list-index"));
                var len = $(this).parents(".gallery-holder").find(".gallery-view-area .swipe-list").eq(_currentGalleryPage).find(".gallery-list-wrap li").length;

                _showGalleryPopup(conIndex, _currentGalleryDividerIndex, listIndex);
                return false;
            },

        ////////////////////////////////////////////
        //  갤러리 팝업
        ////////////////////////////////////////////

        // 갤러리 팝업 리사이즈
            _onResize_galleryPopup = function(winW, winH, conIndex, dividerIndex){
                //$(".gallery-popup .gal-pop-view .pop-view-area").css("height", winH);

                /*
                 App.resize.fullSizeImg(
                 $(".gallery-popup .gal-pop-view .pop-view-area"),
                 $(".gallery-popup .gal-pop-view .pop-view-area .pop-swipe li .bg-holder"),
                 $(".gallery-popup .gal-pop-view .pop-view-area .pop-swipe li .bg-holder img"),
                 winW,
                 winH,
                 KEYVISUAL_DEFAULT_WIDTH,
                 KEYVISUAL_DEFAULT_HEIGHT
                 )
                 */

                var i = 0;
                var len = $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe li").length;

                for(i=0; i<len;i++){
                    var defaultW = parseInt($(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe li").eq(i).find(".bg-holder img").attr("data-natural-width"));
                    var defaultH = parseInt($(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe li").eq(i).find(".bg-holder img").attr("data-natural-height"));
                    if(!isNaN(defaultW)){

                        App.resize.fullSizeImg(
                            $(".gallery-popup .gal-pop-view .pop-view-area"),
                            $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe li").eq(i).find(".bg-holder"),
                            $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe li").eq(i).find(".bg-holder img"),
                            winW,
                            winH,
                            defaultW,
                            defaultH
                        )

                        //console.log($(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe>li").eq(i).find(".bg-holder img"))
                        //console.log(defaultW, defaultH)
                    }

                }


                if(winW < winH){
                    var bgH = $(".gallery-popup .gal-pop-view .pop-view-area .pop-swipe li .bg-holder").height();
                    $(".gallery-popup .gal-pop-view .pop-view-area .pop-swipe li .bg-holder").css({"top":"50%", "margin-top":-(bgH/2)} )
                }else{
                    $(".gallery-popup .gal-pop-view .pop-view-area .pop-swipe li .bg-holder").css({"top":0, "margin-top":0})
                }

                $(".gallery-popup .gal-pop-view .pop-view-area").css({"width":winW, "height": winH})
                $(".gallery-popup .gal-pop-view .pop-view-area .pop-swipe li").css("height", winH);
                $(".gallery-popup").css("height", winH);
                $(".gallery-popup .youtube-player").css("height", winH-100);


                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_TABLET && _isShowGalleryPopup){
                    _oldWidth = 0;
                    //_onResize();


                    //console.log($(document).width())
                    var len = $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".swipe .swipe-wrap li").length;
                    var tWidth = winW * len;
                    var docW = $(document).width()


                    $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".swipe .swipe-wrap").css("width", tWidth)
                    $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".swipe .swipe-wrap li").css("width", docW)

                    var swipeIndex = parseInt($(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".swipe").attr("data-swipe-index"));
                    var swipeLen = parseInt($(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".indicator span").eq(2).html());


                    if(_arrSwipeCon[swipeIndex] != undefined){
                        //console.log("resize gallery popup  ", "swipe index : ", swipeIndex, "swipe len : ", swipeLen)
                        _arrSwipeCon[swipeIndex].setup(swipeLen);
                        //$(".swipe").css("height", "auto")
                    }


                }
            },

            _galleryImageLoad = function(conIndex){
                var con = $(".gallery-popup").eq(conIndex);
                if(con.attr("data-load-complete") == undefined){
                    con.attr("data-load-complete", true);
                    var i = 0;
                    var j = 0;
                    var dividerLen = 3;
                    for(i=0; i<dividerLen; i++){
                        var len =  con.find(".gal-pop-view .pop-view-area").eq(i).find(".pop-swipe li").length
                        for(j=0; j<len; j++){
                            if(con.find(".gal-pop-view .pop-view-area").eq(i).find(".pop-swipe li").eq(j).find(".bg-holder img").attr("data-src") != undefined){
                                con.find(".gal-pop-view .pop-view-area").eq(i).find(".pop-swipe li").eq(j).find(".bg-holder img").attr("data-index", i)
                                var src = con.find(".gal-pop-view .pop-view-area").eq(i).find(".pop-swipe li").eq(j).find(".bg-holder img").attr("data-src");
                                con.find(".gal-pop-view .pop-view-area").eq(i).find(".pop-swipe li").eq(j).find(".bg-holder img").attr("src", src).load(function(){
                                    var imgW = this.naturalWidth;
                                    var imgH = this.naturalHeight;
                                    var dataIndex = parseInt($(this).attr("data-index"));
                                    $(this).attr({"data-natural-width": imgW, "data-natural-height":imgH});
                                    _onResize_galleryPopup($(window).width(), $(window).height(), conIndex, dataIndex);
                                });
                            }
                        }
                    }
                }
            },

        // 갤러리 팝업 보여주기
            _showGalleryPopup = function(conIndex, dividerIndex, galleryIndex){
                $(App.Events).trigger(App.Events.SHOW_POPUP);
                _scrollTop = $(window).scrollTop();
                _isShowGalleryPopup = true;
                $("body").css("overflow", "hidden");
                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_TABLET) $(".wrapper").css({"overflow":"hidden", "height":"100%"});

                _currentGalleryConIndex = conIndex;
                _currentGalleryDividerIndex = dividerIndex;

                $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe li").css("z-index", 0)

                _galleryImageLoad(conIndex);

                _changeGalleryPopupDivider(conIndex, dividerIndex, false)
                $(".gallery-popup").eq(conIndex).removeClass("hide");
                $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).removeClass("hide");
                _onResize_galleryPopup($(window).width(), $(window).height(), _currentGalleryConIndex, _currentGalleryDividerIndex)

                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){
                    _resetGalleryPopupImage(conIndex, dividerIndex);
                    //_resetGalleryPopupVideo(conIndex);

                    $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).attr("data-image-index", galleryIndex);

                    if(dividerIndex < 2){
                        _changeGalleryPopupImage(conIndex, dividerIndex, galleryIndex);
                    }else{
                        //_changeGalleryPopupVideo(conIndex, dividerIndex, galleryIndex);
                    }
                }else{
                    var swipeIndex = parseInt($(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".swipe").attr("data-swipe-index"));

                    //console.log("show gallery popup ", swipeIndex, galleryIndex)
                    _arrSwipeCon[swipeIndex].slide(galleryIndex, 0);
                }




                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_TABLET){
                    _swipeResizeTimerStart(conIndex, dividerIndex)
                }
                _changeGalleryPopupColor(conIndex, dividerIndex, galleryIndex);
            },


            _swipeResizeTimerStart = function(conIndex, dividerIndex){

                _swipeResizeTimer = window.setInterval(function(){
                    if(_swipeResizeCount < 3){
                        _swipeResizeCount++
                        _oldWidth = 0;
                        _onResize();
                        _onResize_galleryPopup($(window).width(), $(window).height(), conIndex, dividerIndex)
                    }else{
                        _swipeResizeTimerStop();
                    }

                },500)
            },

            _swipeResizeTimerStop = function(){
                window.clearInterval(_swipeResizeTimer)
            },




        // 갤러리 팝업 감추기
            _hideGalleryPopup = function(conIndex){

                $(".gallery-popup").eq(conIndex).addClass("hide");
                $("body").css("overflow", "visible");

                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_TABLET)  $(".wrapper").css({"overflow":"visible", "height":"auto"});
                $(window).scrollTop(_scrollTop);
                _isShowGalleryPopup = false;
                $(App.Events).trigger(App.Events.HIDE_POPUP);
            },

        // 갤러리팝업 텍스트 색상 변경(white/black) - black 색상시 .dark
            _changeGalleryPopupColor = function(conIndex, dividerIndex, galleryIndex){
                if(dividerIndex < 2){
                    var color = $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe li").eq(galleryIndex).attr("data-color");

                    var winW = $(window).width();
                    var winH = $(window).height();
                    if(winW>winH){
                        if(color != "white"){
                            $(".gallery-popup").eq(conIndex).addClass("dark");
                        }else{
                            $(".gallery-popup").eq(conIndex).removeClass("dark");
                        }
                    }else{
                        $(".gallery-popup").eq(conIndex).removeClass("dark");
                    }
                }else{
                    $(".gallery-popup").eq(conIndex).removeClass("dark");
                }
            },

        // 갤러리 팝업 닫기 버튼 클릭시
            _onClick_closeGalleryPopup = function(e){
                var conIndex = parseInt($(this).parents(".gallery-popup").attr("data-con-index"));
                //_resetGalleryPopupVideo(conIndex);
                _hideGalleryPopup(conIndex);
                return false;
            },

        // 갤러리 팝업 인디게이터 클릭시
            _onClick_galleryPopupIndicator = function(e){
                var con = $(this).parents(".pop-view-area");
                var conIndex = parseInt($(this).parents(".gallery-popup").attr("data-con-index"));
                var dividerIndex = $(this).parents(".pop-view-area").index();
                var galleryIndex = $(this).parent().index();
                var swipeIndex = parseInt(con.find(".swipe").attr("data-swipe-index"));


                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){
                    if(dividerIndex < 2){
                        _changeGalleryPopupImage(conIndex, dividerIndex, galleryIndex);
                    }else{
                        //_changeGalleryPopupVideo(conIndex, dividerIndex, galleryIndex);
                    }
                }else{
                    _arrSwipeCon[swipeIndex].slide(galleryIndex);
                }

                return false;
            },

        // 갤러리 팝업 인디게이터 변경
            _changeGalleryPopupIndicator = function(conIndex, dividerIndex, galleryIndex){
                _offGalleryPopupIndicator(conIndex, dividerIndex);
                _onGalleryPopupIndicator(conIndex, dividerIndex, galleryIndex)

                $(".gallery-popup").find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".btn-holder .indicator span.current").text(galleryIndex+1)

                var total = $(".gallery-popup").find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe .swipe-wrap>li").length;
                $(".gallery-popup").find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".btn-holder .indicator span.total").text(total)
            },

        // 갤러리 팝업 인디게이터 활성화
            _onGalleryPopupIndicator = function(conIndex, dividerIndex, galleryIndex){
                $(".gallery-popup").eq(conIndex).find(".pop-view-area").eq(dividerIndex).find(".btns-wrap .indicators li").eq(galleryIndex).addClass("on");
            },

        // 갤러리 팝업 인디게이터 비활성화
            _offGalleryPopupIndicator = function(conIndex, dividerIndex){
                $(".gallery-popup").eq(conIndex).find(".pop-view-area").eq(dividerIndex).find(".btns-wrap .indicators li").removeClass("on");
            },

        // 갤러리 팝업 이전 버튼 클릭
            _onClick_galleryPopupPrev = function(e){
                var con = $(this).parents(".pop-view-area");
                var conIndex = parseInt($(this).parents(".gallery-popup").attr("data-con-index"));
                var dividerIndex = $(this).parents(".pop-view-area").index();
                var galleryIndex = parseInt($(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).attr("data-image-index"))-1;
                var len = $(this).parents(".gal-pop-view").find(".pop-view-area").eq(dividerIndex).find(".pop-swipe .swipe-wrap>li").length;
                var swipeIndex = parseInt(con.find(".swipe").attr("data-swipe-index"));

                if(galleryIndex < 0){
                    galleryIndex = len-1;
                }



                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){
                    if(dividerIndex < 2){
                        _changeGalleryPopupImage(conIndex, dividerIndex, galleryIndex);
                    }else{
                        //_changeGalleryPopupVideo(conIndex, dividerIndex, galleryIndex);
                    }
                }else{
                    _arrSwipeCon[swipeIndex].prev();
                }

                return false;
            },

        // 갤러리 팝업 다음 버튼 클릭
            _onClick_galleryPopupNext = function(e){
                var con = $(this).parents(".pop-view-area");
                var conIndex = parseInt($(this).parents(".gallery-popup").attr("data-con-index"));
                var dividerIndex = $(this).parents(".pop-view-area").index();
                var galleryIndex = parseInt($(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).attr("data-image-index"))+1;
                var len = $(this).parents(".gal-pop-view").find(".pop-view-area").eq(dividerIndex).find(".pop-swipe .swipe-wrap>li").length;
                var swipeIndex = parseInt(con.find(".swipe").attr("data-swipe-index"));

                if(galleryIndex > len-1){
                    galleryIndex = 0;
                }

                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){
                    if(dividerIndex < 2){
                        _changeGalleryPopupImage(conIndex, dividerIndex, galleryIndex);
                    }else{
                        //_changeGalleryPopupVideo(conIndex, dividerIndex, galleryIndex);
                    }
                }else{
                    _arrSwipeCon[swipeIndex].next();
                }

                return false;
            },

        // 갤러리 팝업 리셋하기
            _resetGalleryPopupImage = function(conIndex, dividerIndex){
                if(App.GlobalVars.currentDevice == App.GlobalVars.DEVICE_TYPE_PC){
                    var i = 0;
                    var len = 3;

                    for(i=0; i<len; i++){
                        $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(i).attr("data-image-index", 0);
                        $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(i).find(".pop-swipe li").css("opacity", 0);
                        //$(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(i).find(".pop-swipe li").eq(0).find(".bg-holder img").css("opacity", 1);
                    }
                }
            },

        // 갤러리 팝업 이미지 변경
            _changeGalleryPopupImage = function(conIndex, dividerIndex, galleryIndex){
                var oldIndex = parseInt($(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).attr("data-image-index"));
                var newIndex = galleryIndex;
                $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).attr("data-image-index", newIndex);

                _hideGalleryPopupImage(conIndex, dividerIndex, oldIndex);
                _showGalleryPopupImage(conIndex, dividerIndex, newIndex);
                _changeGalleryPopupIndicator(conIndex, dividerIndex, newIndex);
                _changeGalleryPopupColor(conIndex, dividerIndex, newIndex);
            },

        // 갤러리 팝업 이미지 보여주기
            _showGalleryPopupImage = function(conIndex, dividerIndex, galleryIndex){
                var selector = $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe li").eq(galleryIndex);
                TweenLite.killTweensOf(selector);
                selector.css("z-index",1);
                selector.css({"opacity": 1});
            },

        // 갤러리 팝업 이미지 감추기
            _hideGalleryPopupImage = function (conIndex, dividerIndex, galleryIndex) {
                var selector = $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).find(".pop-swipe li").eq(galleryIndex);
                TweenLite.killTweensOf(selector);
                selector.css("z-index", 2);
                //2016.10.24 갤러리 팝업 이미지 드래그 수정
                TweenLite.to(selector, 0.3, {"css": {"opacity": 0},  onComplete:_onComplete_hideGalleryPopup, onCompleteParams:[selector]});
            },

        //2016.10.24 갤러리 팝업 이미지 드래그 수정
            _onComplete_hideGalleryPopup = function (selector) {
                selector.css("z-index", 0);
            },

        // 갤러리 팝업 메뉴 클릭시 (exterior, interior, video)
            _onClick_galleryPopupDivider = function(e){
                var conIndex = parseInt($(this).parents(".gallery-popup").attr("data-con-index"));
                var dividerIndex = $(this).index();

                _changeGalleryPopupDivider(conIndex, dividerIndex);
                return false;
            },


        // 갤러리 팝업 구분 변경
            _changeGalleryPopupDivider = function(conIndex, dividerIndex, isTrans){
                if(isTrans == undefined) isTrans = true;

                if(_currentGalleryPopupDividerIndex < dividerIndex){
                    _onMove_galleryPopupDividerNext(conIndex, _currentGalleryPopupDividerIndex, dividerIndex,isTrans);
                }else{
                    // prev
                    _onMove_galleryPopupDividerPrev(conIndex, _currentGalleryPopupDividerIndex, dividerIndex,isTrans);

                }

                //_changeGalleryPopupImage(conIndex, dividerIndex, 0)

                $(".gallery-popup").eq(conIndex).find(".select-sub .subject-wrap a").removeClass("on");
                _currentGalleryPopupDividerIndex = dividerIndex;
                $(".gallery-popup").eq(conIndex).find(".select-sub .subject-wrap a").eq(dividerIndex).addClass("on");

                var galleryIndex = parseInt($(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).attr("data-image-index"));
                _changeGalleryPopupColor(conIndex, dividerIndex, galleryIndex);
            },

        // 갤러리 팝업 이전 컨텐츠
            _onMove_galleryPopupDividerPrev = function(conIndex, oldDividerIndex, newDividerIndex, isTrans){
                _isGalleryPopupTrans = true;
                var targetX = $(window).width();
                var oldPage = $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(oldDividerIndex);
                var currentPage = $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(newDividerIndex);
                _control_galleryPopupDivider(-targetX, oldPage, currentPage, conIndex, newDividerIndex, isTrans);
            },

        // 갤러리 팝업 다음 컨텐츠
            _onMove_galleryPopupDividerNext = function(conIndex, oldDividerIndex, newDividerIndex, isTrans){
                _isGalleryPopupTrans = true;
                var targetX = $(window).width();
                var oldPage = $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(oldDividerIndex);
                var currentPage = $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(newDividerIndex);
                _control_galleryPopupDivider(targetX, oldPage, currentPage, conIndex, newDividerIndex, isTrans)
            },


            _control_galleryPopupDivider = function(targetX, oldPage, currentPage, conIndex, dividerIndex, isTrans){
                if(dividerIndex == 2) _changeGalleryPopupVideo(conIndex, dividerIndex, _currentGalleryPopupVideoIndex, false);

                TweenLite.killTweensOf(oldPage);
                oldPage.css("z-index", 2);

                TweenLite.killTweensOf(currentPage);
                currentPage.css({"z-index": 1, "left":targetX - (targetX*0.6)}).removeClass("hide");

                if(isTrans){
                    TweenLite.to(oldPage, 1, {"css":{"left":-targetX}, ease:Quart.easeInOut});
                    TweenLite.to(currentPage, 1, {"css":{"left":0}, ease:Quart.easeOut, onComplete:_onComplete_moveGalleryPopup, onCompleteParams:[oldPage, conIndex, dividerIndex]});
                }else{
                    oldPage.css("left", -targetX);
                    currentPage.css("left", 0);
                    _onComplete_moveGalleryPopup(oldPage, dividerIndex);
                }
            },

            _onComplete_moveGalleryPopup = function(oldPage, conIndex, dividerIndex){
                _isGalleryPopupTrans = false
                oldPage.addClass("hide");
                if(dividerIndex < 2) _changeGalleryPopupVideo(conIndex, dividerIndex, _currentGalleryPopupVideoIndex, false);
            },


        ////////////////////////////////////////////
        //  key feature - type-tab-4col
        ////////////////////////////////////////////
            _onClick_keyFeature = function(e){
                var index = $(e.currentTarget).index();

                var con = $(e.currentTarget).parent().parent().parent();
                _control_keyFeature(con, index);

                return false;
            },

            _control_keyFeature = function(con, index){
                var keyList =  con.find(".tab-btn-area ul li");
                var keyImage =  con.find(".tab-view-area img");
                var keyTxt =  con.find(".tab-txt-area p");

                keyList.removeClass("on");
                keyImage.removeClass("shown");
                keyTxt.removeClass("on");

                keyList.eq(index).addClass("on");
                keyImage.eq(index).addClass("shown");
                keyTxt.eq(index).addClass("on");

                _onResize()
            },


        ////////////////////////////////////////////
        //  swipe
        ////////////////////////////////////////////
            _setSwipe = function(){
                var elem = document.querySelectorAll('.swipe');
                for(var i=0; i<elem.length; i++){
                    $('.swipe').eq(i).attr("data-swipe-index", i);
                }
            },

        // 스와이프 만들기
            _makeSwipe = function(){

                $(".gallery-popup").removeClass("hide");
                $(".gallery-popup .pop-view-area").removeClass("hide");

                // css
                //$(".swipe").css({"overflow":"hidden", "visibility":"hidden", "position":"relative"});
                //$(".swipe-wrap").css({"overflow":"hidden", "position":"relative", "padding-top":0});
                //$(".swipe-wrap>li").css({"float":"left", "width":"100%", "position":"relative"});


                var elem = document.querySelectorAll('.swipe');

                for(var i=0; i<elem.length; i++){
                    var con = elem[i];

                    //$(con).css({"overflow":"hidden", "visibility":"hidden", "position":"relative"});
                    //$(con).find(".swipe-wrap").css({"overflow":"hidden", "position":"relative", "padding-top":0});
                    var hasClassHide = $(con).hasClass("hide");
                    if(hasClassHide){
                        $(con).removeClass("hide");;
                    }

                    $(con).css({"overflow":"hidden", "visibility":"hidden"});
                    $(con).find(".swipe-wrap").css({"overflow":"hidden", "padding-top":0, "top":0, "position":"absolute"});


                    $(con).find(".swipe-wrap>li").css({"float":"left", "width":"100%", "position":"relative"}).removeClass("hide");
                    //var total = $(con).eq(i).find(".swipe-wrap>li").length;

                    //console.log(i, total)
                    //$(con).eq(i).parent().parent().find(".indicator span").eq(2).text(total);
                    //$(con).parent().find(".indicator span").eq(2).html($(elem[i]).find(".swipe-wrap>li").length);

                    var total = $(elem[i]).find(".swipe-wrap>li").length;
                    if($(con).closest(".type-gallery").length != 0){
                        $(con).find(".indicator span").eq(2).html(total);
                    }else{
                        $(con).parent().find(".indicator span").eq(2).html(total);
                    }


                    $(con).attr("data-swipe-index", _swipeNum);
                    // 모바일 이전 다음 버튼 클릭시 자기 자신의 swipe 컨테이너를 알기위해서 필요
                    $(con).parent().parent().find(".indicator").attr("data-swipe-index", _swipeNum);

                    //$('.swipe').eq(i).attr("data-swipe-index", i);
                    var swipeCon = Swipe(con, {
                        // startSlide: 4,
                        // auto: 3000,
                        // continuous: true,
                        // disableScroll: true,
                        // stopPropagation: true,
                        callback: function(index, element) {_changeSwiepContents(index, element)},
                        transitionEnd: function(index, element) {}
                    });


                    if(hasClassHide){
                        $(con).addClass("hide");;
                    }
                    _arrSwipeCon[_swipeNum]=swipeCon;
                    _swipeNum++

                }

                $(".gallery-popup").addClass("hide")
                $(".gallery-popup .pop-view-area").addClass("hide")
            },

        // 컨텐츠 변경
            _changeSwiepContents = function(index, element){
                var swipeCon = "";
                if(_isShowGalleryPopup){
                    var conIndex = parseInt($(element).parents(".gallery-popup").attr("data-con-index"));
                    var dividerIndex = $(element).parents(".pop-view-area").index();
                    //swipeCon = $(element).parents(".pop-view-area");
                    swipeCon = $(element).closest(".swipe");
                    _changeGalleryPopupColor(conIndex, dividerIndex, index);
                    $(".gallery-popup").eq(conIndex).find(".gal-pop-view .pop-view-area").eq(dividerIndex).attr("data-image-index", index);
                }else{
                    //swipeCon = $(element).parent().parent().parent().parent().parent();
                    swipeCon = $(element).closest(".swipe");
                }
                _changeSwipeIndicator(swipeCon, index)
            },

        // 스와이프 인디게이터 변경
            _changeSwipeIndicator = function(swipeCon, index){
                if(_isShowGalleryPopup){
                    swipeCon.parent().parent().find(".indicator span").eq(0).html(index+1);
                }else{
                    swipeCon.find(".indicator span").eq(0).html(index+1);
                }
            },

        //메인배너 영상 플레이 버튼
            _onClick_videoPopPlay = function(target){
                var target = $(this);
                var videoUrl = $(target).attr("href");
                _setKeyvisualVideoUrl(videoUrl);
                _showKeyvisualVideoPopup();
                setTimeout($('.video-pop video')[0].play(), 1000);
                return false;
            };




        return {
            init : _init
        };
    })();

    $(function(){
        App.ny_concept = ny_concept;
        App.ny_concept.init();
    });
}(window, jQuery));
