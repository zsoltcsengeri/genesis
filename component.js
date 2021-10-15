//------------------------------------------------------------------
//  last update: 2020.07.24 - ver 1.0
//------------------------------------------------------------------

/*
* "GreenSock | TweenMax"(http://greensock.com/tweenmax) with jQuery.
* by @psyonline (http://www.psyonline.kr/, majorartist@gmail.com)
* https://github.com/psyonline/jquery-with-gsap
* License - http://creativecommons.org/licenses/by-sa/2.0/kr/
*/
;(function(h){function g(d,b){return function(c){b.call(d,c)}}var l=h.isPlainObject,m=CSSPlugin._internals.getTransform,k=["{self}"];h.fn._css=function(d,b){var c;if(l(d))TweenMax.set(this,d);else if(void 0!==b)c={},c[d]=b,TweenMax.set(this,c);else{if(-1!=="scale,scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,rotationZ,perspective,xPercent,yPercent,zOrigin,".indexOf(d+",")){var e=this[0];c=d;e=e._gsTransform||m(e);"rotationZ"==c?c="rotation":"scale"==c&&(c="scaleX");return e[c]}return this.css(d)}return this};
h.fn._animate=function(d,b,c,e){var a={},f;for(f in d)a[f]=d[f];if(l(b))for(f in b)a[f]=b[f];else"function"==typeof e?(a.duration=b,a.easing=c,a.complete=e):"function"==typeof c?("number"==typeof b?a.duration=b:a.easing=b,a.complete=c):"number"==typeof b?a.duration=b:"string"==typeof b?a.easing=b:"function"==typeof b&&(a.complete=b);a.duration=(void 0!==a.duration?a.duration:400)/1E3;void 0!==a.delay&&(a.delay/=1E3);void 0!==a.repeatDelay&&(a.repeatDelay/=1E3);a.start&&(a.onStart=g(this,a.start),
a.onStartParams=k,delete a.start);if(a.step||a.progress)a.onUpdate=g(this,a.step||a.progress),a.onUpdateParams=k,delete a.step,delete a.progress;a.repeatStep&&(a.onRepeat=g(this,a.repeatStep),a.onRepeatParams=k,delete a.repeatStep);a.complete&&(a.onComplete=g(this,a.complete),a.onCompleteParams=k,delete a.complete);a.easing&&(a.ease=a.easing,delete a.easing);delete a.queue;d=a.duration;delete a.duration;this.data("TweenMax",TweenMax.to(this,d,a));return this};h.fn._stop=function(d,b){var c=this.data("TweenMax");
c&&c.kill(d,b);return this};(function(){function d(a){return function(b){return a.getRatio(b)}}var b,c,e,a,f,g;if(h.easing&&window.GreenSockGlobals&&window.GreenSockGlobals.Ease&&window.GreenSockGlobals.Ease.map)for(b="Quad Cubic Quart Quint Sine Expo Circ Elastic Back Bounce".split(" "),c=["In","Out","InOut"],e=window.GreenSockGlobals.Ease.map,f=0;f<b.length;f++)for(g=0;g<c.length;g++)a="ease"+c[g]+b[f],e[a]&&!h.easing[a]&&(h.easing[a]=d(e[a]))})()})(window.jQuery);

// handle multiple browsers for requestAnimationFrame()
window.raf = (function () {return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {return window.setTimeout(callback, 1000 / 60); }; })();

// handle multiple browsers for cancelAnimationFrame()
window.caf = (function () {return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {window.clearTimeout(id); }; })();

window.Selectbox = function(el) {
	if ( el.Selectbox ) return false;
	var _this = this;
	var $element = $(el);
	var isVisible = false;

	var _init = function() {
			_asset();
			_addEvent();
			el.Selectbox = true;
			$element.find('.select-lst a:first').trigger('click.selectbox');
		},
		_asset = function() {
			isVisible = $element.hasClass('open');
		},
		_addEvent = function() {
			var _this = this;
			$element.on('click.selectbox', 'label>a', _click);
			$element.on('click.selectbox', '.select-lst a', _select);
			$element.on('focus.selectbox','a, button', _focus);
			$element.on('blur.selectbox','a, button',_blur);
		},
		_click = function(e) {
			var $select = $element.find('.select-lst');

			if ( !$element.hasClass('open') ) {
				$element.addClass('open');
				$select.stop().slideDown();
			} else {
				$element.removeClass('open');
				$select.stop().slideUp();
			}
			if (e) e.preventDefault();
		},
		_select = function(e) {
			var $label  = $element.find('>label>a');
			var $select = $element.find('.select-lst');
			var selectText = $(this).text();

			$label.text( selectText );
			$element.removeClass('open');
			$select.stop().slideUp();
			if (e) e.preventDefault();
		},
		_focus = function() {
			isVisible = true;
		},
		_blur = function() {
			var _this = this;
			var $select = $element.find('.select-lst');

			isVisible = false;
			setTimeout(function() {
				if ( !isVisible ) {
					$element.removeClass('open');
					$select.stop().slideUp();
				}
			},150);
		};
	_init();
};


/*! component.js */
(function (window, $, undefined) {
	$.fn.extend({
		decideClass : function(classname, condition) {
			return this[condition ? 'addClass' : 'removeClass'](classname);
		},
		transitionEnd : function(callback, isRepet) {
			var transitionendEvent = 'webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd transitionend';

			return this.each(function() {
				var $target = $(this);
				if (Modernizr.csstransitions) {
					$target[isRepet?'on':'one'](transitionendEvent, function(e) {
						if (e.target == this) {
							callback.call(this);
						}
					});
				} else {
					callback.call( this );
				}
			})
		},
		animationEnd: function(callback) {
			var animationendEvent = 'webkitAnimationEnd mozAnimationEnd oAnimationEnd msAnimationEnd animationend';

			return this.each(function() {
				var $target = $(this);
				if (Modernizr.cssanimations) {
					$target.one(animationendEvent, function(e) {
						if (e.target == this) {
							callback.call(this);
						}
					});
				} else {
					callback.call( this );
				}
			});
		},
        Selectbox : function() {
			return this.each(function() {
				$(this).data('Selectbox', new Selectbox(this));
			});
		}
	});

	//
	App.Events.SHOW_POPUP_BEFORE = 'showpopup_before';
	App.Events.SHOW_POPUP_AFTER  = 'showpopup_after';

	window.show_popup = function(targetName) {
		var $target  = $(targetName);
		var $overlay = $("#overlay");
		var MARGIN_SIZE = 60; // 여백

		if ( !$target.length ) return false;
		if ( !$overlay.lnegth ) {
			$overlay = $('<div id="overlay"></div>').appendTo('body');
		}

		// before Event
		$(App.Events).trigger(App.Events.SHOW_POPUP_BEFORE, $target);

		$target.data('saveScroll', $(window).scrollTop());

		$target.css('position','fixed').removeClass('hide');
		$('body').css('overflow', 'hidden');

		var contWidth  = $target.data('oriWidth')  || $target.innerWidth();
		var contHeight = $target.data('oriHeight') || $target.innerHeight();

		if ( !$target.data('oriWidth') ) {
			$target.data({
				'oriWidth': contWidth,
				'oriHeight': contHeight
			});
		}

		var _setupSize = function() {
			var screenWidth  = $(window).width();
			var screenHeight = $(window).height();

			var cssValue = {
				width: '',
				left : '',
				right: '',
				marginTop: '',
				marginLeft: '',
				overflow: 'auto'
			};

			if  (contWidth > screenWidth) {
				cssValue.width = 'auto';
				cssValue.left  = MARGIN_SIZE/2;
				cssValue.right = MARGIN_SIZE/2;
			} else {
				cssValue.marginLeft = (contWidth+MARGIN_SIZE) / 2;
			}

			if (contHeight > screenHeight) {
				$target.css({

				});
				$target.css({
					width      : contWidth + MARGIN_SIZE,
					height     : browserH - MARGIN_SIZE,
					marginLeft : -(contWidth + MARGIN_SIZE)/2 ,
					marginTop  : -(browserH-MARGIN_SIZE)/2,
					overflowY  : 'scroll'
				});
			}

		};

		$overlay.removeClass("hide")._animate({'opacity': '0.8'}, {duration: 300});
		$target._animate({'opacity': '1'}, {duration: 500, complete: function() {
			$(App.Events).trigger(App.Events.SHOW_POPUP_COMPLETE);
		}});

		if ( $target.attr("tabindex") && $target.attr("tabindex") == "-1" ) {
			$target.attr("tabindex", "0");
		}
		$target.focus();
		$target.removeAttr("tabindex");

		return false;


		$(App.Events).trigger(App.Events.SHOW_POPUP, $target);
	};

	var $window   = $(window);
	var $document = $(document);
	var $HTML = $('html, body');

	App.GlobalVars.WIN_MIN_HEIGHT = 768;
	App.GlobalVars.WIN_MAX_HEIGHT = 1200;
	App.GlobalVars.scrollTop = $window.scrollTop();

	var barnd = (function() {
		var _this = this;
		var resizeInterval;
		var _init = function() {
			_addEvent();
			_resize();
		};
		var _addEvent = function() {
			$window.on({
				'scroll.barnd': _scroll,
				'resize.barnd': _resize
			});
		};
		var _load = function() {
			$(App.Events).trigger(App.Events.LOAD_COMPLETE);
			$('html').addClass('load');
		};
		var _scroll = function(func) {
			if (func instanceof Function) {
				$(App.Events).on( App.Events.SCROLL_MOVE, func );
			} else {
				App.GlobalVars.scrollTop = $window.scrollTop();
				App.GlobalVars.scrollLeft = $window.scrollLeft();

				$(App.Events).trigger( App.Events.SCROLL_MOVE );
				if ( $('header, .sub-navi').length) {
					$('header, .sub-navi').css('left', -App.GlobalVars.scrollLeft);
				}
			}
		};
		var _resize = function(func) {
			if (func instanceof Function) {
				$(App.Events).on( App.Events.RESIZE_BROWSER, func );
			} else {
				App.GlobalVars.windowWidth = $window.width();
				App.GlobalVars.windowHeight = $window.height();
				App.GlobalVars.windowInnerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
				App.GlobalVars.windowInnerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

				$(App.Events).trigger( App.Events.RESIZE_BROWSER );

				clearTimeout( resizeInterval );
				resizeInterval = setTimeout(function() {
					clearTimeout( resizeInterval );
					App.GlobalVars.windowWidth = $window.width();
					App.GlobalVars.windowInnerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
					$(App.Events).trigger( App.Events.RESIZE_COMPLETE );
				}, 1000 / 60);
			}
		};

		var _documentLock = function() {
			$('html').css('overflow', 'hidden');
			$('html, body').on('scroll.disabledScroll mousewheel.disabledScroll DOMMouseScroll.disabledScroll keydown.disabledScroll', function (e) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			});
		};
		var _documentUnLock = function() {
			$('html').css('overflow', '');
			$('html, body').off('.disabledScroll');
		};
		return {
			init   : _init,
			resize : _resize,
			scroll : _scroll,
			pageMoveLock : _documentLock,
			pageMoveUnLock : _documentUnLock
		}
	})(); //brand

	var section = (function() {
		var _this = this;

		var $elements;
		var $container;
		var $sections = [];
		var sections  = [];
		var _$bannerSection;
		var _$btnDown;
		var _$btnDownWrap;

		var MOUSEWHEEL_EVENT       = true; 				// {Boolean} - 마우스 휠 모드사용여부 체크.
		var MOUSEWHEEL_MIN_TIME    = 1000;              // {Number} - 마우스 휠 타이밍 최소 시간. (중첩방지) 170927 / wheel 속도 조정
		var CURRENT_SECTION_CLASS  = 'current-section';	// {String} - 선택영역 Classname
		var BANNER_SECTION_CLASS   = '.eq-banner';      // {String} - 하단배너 영역 Classname
		var BTN_SECTION_DOWN_CLASS = '.btn-down';
		var BTN_SECTION_DOWN_CLASS2 = '.btn-scroll';
		var HIGHLIGHTS_SKIN_CLASS  = 'module-skin3';    // {Strong} - 하이라이트에서 서브에서만 사용되는 skin Class
		var HIGHLIGHTS_INTRO_SKIN_CLASS  = 'module-intro-mov';    // {Strong} - 하이라이트에서 서브에서만 사용되는 skin Class
		var SUPPORT_TRANSITION     = Modernizr.csstransitions;
		var SUPPORT_TRANSFORM = (function(div) {
				var props = ['transform','WebkitTrnasform','MozTransform','OTransform','msTransform'];
				for ( var i in props ) if (div.style[props[i]] !== undefined) return props[i];
			return false;
		})(document.createElement('div'));

		var _sectionLength; 					// {Number} - feature Langth.
		var _currentSectionIndex = 0; 			// {Number} - 현재 선택된 영역 Index
		var _mouseWheelTime = +new Date; 		// {Number} - 휠 스크롤 타이밍을 위한 변수.
		var _scrollMotionAnimation = false; 	// {Boolean} - 화면 전환중인경우 true.
		var _screen_mode = MOUSEWHEEL_EVENT ? 'fixed' : 'normal'; // {String} - [fixed or normal]

		var _hasClass = function(o, c) {
			return !!(o[0].className.indexOf(c)>-1);
		};

		var _init = function(el) {
			_asset(el);
			_addEvnet();
			_resizeEndEvent();
		};

		var _asset = function(el) {
			var thisClassName;
			$container = $('.inner-container');
			$elements = $('section.section');

			var hashName = window.location.href.slice(location.href).split('#')[1];

			$elements.each(function(i) {
				$this = $(this);
				$sections[i] = $this;
				$sections[i].type = 'skin';

				// hash 체크.
				if (hashName && hashName == $sections[i].data('hash')) {
					_currentSectionIndex = i;
				}

				// thisClassName = this.className;
				if ( _hasClass($this, 'module-skin1') || _hasClass($this, 'gallery-') ) {
					$sections[i].fullSizeMode = true;
					$sections[i].type = 'highlight';

					if ( _hasClass($this, 'gallery-') ) {
						$sections[i].type = 'gallery';
						_currentSectionIndex = 1;
					}
				}
				if ( _hasClass($this, 'specs') ) {
					$container.specs = true;
					MOUSEWHEEL_EVENT = false;
					_screen_mode = 'normal';
				}

				sections[i]  = _setParallax($this);
				$this.off('onVisible').on('onVisible', _setVisible);
				$this.data('hello', '');

			}).eq(_currentSectionIndex).addClass(CURRENT_SECTION_CLASS);

			$elements.find('[data-hello]').each(function() {
				var i=0, dataArr, opt;

				dataArr = $(this).data('hello').split(',');
				for (; i<dataArr.length;i++) {
					dataArr[i] = dataArr[i].replace(/\s/i,'');
				}
				opt = {
					css: dataArr[0],
					baseLine: dataArr[1] || ''
				};
				_setHello(this, opt);
			});

			_sectionLength = sections.length-1;

			_$bannerSection = $(BANNER_SECTION_CLASS);
			_$btnDown       = $(BTN_SECTION_DOWN_CLASS).length ? $(BTN_SECTION_DOWN_CLASS) : $(BTN_SECTION_DOWN_CLASS2);
			_$btnDownWrap   = $('.btn-down-wrap');

			_footerBanner.length = _$bannerSection.length;
			_btnDownArrow.length    = _$btnDown.length;

			_secIndicator.asset();

			_subNav.init();

			_$btnDownWrap.addClass('visible');

			// Only HIGHLIGHTS down button style.
			_highlightScrollDown();
			// --Only HIGHLIGHTS down button style.

			if ( _currentSectionIndex == _sectionLength && !_footerBanner.length ) {
				_btnDownArrow.hide();
			}
		};

		var _addEvnet = function() {
			$(App.Events).on( App.Events.RESIZE_BROWSER, _resizeEvent);
			$(App.Events).on( App.Events.RESIZE_COMPLETE, _resizeEndEvent);
			$(App.Events).on( App.Events.SCROLL_MOVE, _scrollEvent);
			$document.on('keydown', _keydownEvent);
            console.log("MOUSEWHEEL_EVENT", MOUSEWHEEL_EVENT);
			if ( MOUSEWHEEL_EVENT ) {
                // fixed chrome issue
                if (fnGetBrowserType() === "Chrome") {
                    document.addEventListener("wheel", _mouseWheelEventVanila, {passive: false});
                    console.log("VANILA");
                } else {
                    $(document).on("mousewheel.barndWheel", _mouseWheelEvent);
                    console.log("JQUERY");
                }
			}

			_btnDownArrow.length && _$btnDown.on('click', _btnDownArrow.click);

			// 360 inView
			$('.module-vr360').on({
				inView: function() {
					$('.sub-navi .pages li').removeClass('curr').eq(1).addClass('curr');
				},
				outView: function() {
					$('.sub-navi .pages li').removeClass('curr').eq(0).addClass('curr');
				}
			});

			// highlight Learn more button
			// $('.module-skin3 .btn-area').each(function() {
			// 	new _setLearnMoreButton(this);
			// }); // 2020 models : modify

			// module  learn more button
            $('[class*="module-"].section .btn-area').each(function() {
                new _setLearnMoreButton(this);
            }); // 2020 models : New

			// inView Event;
			_addInViewEvent();
		};

		var _setLearnMoreButton = function(el) {
			var _this = this;
			this.$area = $(el),
			this.$btn  = this.$area.find('>.btn-more');
			this.$btns = this.$area.find('a');
			this.isOver = false;

			var _overs = function() {
				_this.$area.addClass('over');
				_this.isOver = true;
			};
			var _outs = function() {
				_this.isOver = false;
				setTimeout(function() {
					if ( !_this.isOver ) {
						_this.$area.removeClass('over');
					}
				},150);
			};

			this.$btns.on('focus.learnMoreEvent', _overs);
			this.$btns.on('blur.learnMoreEvent ', _outs);
			this.$area.on('mouseenter.learnMoreEvent', _overs);
			this.$area.on('mouseleave.learnMoreEvent', _outs);
		};

		var _addInViewEvent = function() {
			var $this;
			$elements.each(function(i) {
				$this = $(this);

				// [2018-09-08 add]
				if ( _hasClass($this, 'module-intro-mov') && $sections[i].find('video').length ) {
					$sections[i].data('kv-video', false);
					$sections[i].on({
						inView : function() {
							if ( $sections[i].data('kv-video') == true ) {
								var oVideo = $sections[i].find('video')[0];
								oVideo.play();
							}
						},
						outView : function() {
							if ( $sections[i].data('kv-video') == true ) {
								var oVideo = $sections[i].find('video')[0];
								$('.btn-down-wrap').css('opacity',1);
								oVideo.pause();
								oVideo.currentTime = -1;
							}
						}
					});
					$sections[i].find('video').on({
						loadeddata: function(e) {
							$sections[i].data('kv-video', true);
							$sections[i].trigger('inView');
						},
						timeupdate: function() {
							var oVideo = $sections[i].find('video')[0];
							if (oVideo.currentTime >= oVideo.duration-2) {
								$sections[i].find('.brand-header').fadeIn(1200);
								$('.btn-down-wrap').css('opacity',1);
							} else {
								$sections[i].find('.brand-header').hide();
								$('.btn-down-wrap').css('opacity',0);
							}
						}
					}).trigger('load');
				}

				if ( _hasClass($this, 'opacity-on') ) {
					$this.on({
						inView : function(){
							$('.layer-box figure .on', this).addClass('active');
						},
						outView : function() {
							$('.layer-box figure .on.active', this).removeClass('active');
						}
					});
				}

				/* 2019-09-25 IWCa - G70 module - start */
				if ( _hasClass($this, 'motion-type8') ) {
					_dragMotion2(this);
				}
				/* 2019-09-25 IWCa - G70 module - end */

				// compare type
				if ( _hasClass($this, 'motion-type4') ) {
					_dragMotion(this);
				}

				// car wheel move motion
				if ( _hasClass($this, 'motion-type6') ) {
					$this.on({
						inView : function() {
							var that = this;
							if (_screen_mode == 'fixed') {
								$('.line', that).stop()._animate({'width' : '490px'}, 2300);
							}else {
								$('.line', that).stop()._animate({'width' : '360px'}, 2300);
							}
							$('.car', that).stop()._animate({'left' : '50%'}, { duration : 2300 });
							$('.number span', that).stop()._animate({'top' : '0'}, 1800);
							$('.car span', that).stop()._animate({rotation : -150}, { duration : 2300 });
						},
						outView : function() {
							var that = this;
							if (_screen_mode == 'fixed') {
								$('.line', that).stop()._animate({'width' : '50%'}, 20);
							}else {
								$('.line', that).stop()._animate({'width' : '620px'}, 20);
							}
							$('.number span', that).stop()._animate({'top' : '-1600%'}, 1800);
							$('.car',that).stop()._animate({'left' : '75%'}, { duration : 20 });
							$('.car span', that).stop()._animate({rotation : 0}, { duration : 20 });
						}
					});
				}

				// change layer tab
				if ( _hasClass($this, 'motion-type7') ) {
					$this.find('.tab-indicator a').on('click', function(e) {
						if ( !$(this).hasClass('on') ) {
							var $this = $(this);
							var thisIndex = $this.index();
							var $tabWrap  = $this.closest('.tab-wrap');
							var $tabConts = $tabWrap.find('>.tab-content');
							var $tabAnchors = $tabWrap.find('>.tab-indicator>a');
							var $tabHeader = $tabWrap.find('.tab-header');

							$tabConts.removeClass('on').eq(thisIndex).addClass('on');
							$tabAnchors.removeClass('on').eq(thisIndex).addClass('on');
							if ( $tabHeader.length == $tabConts.length ) {
								$tabHeader.removeClass('on').eq(thisIndex).addClass('on');
							}
						}
						e.preventDefault();
					});
				}

				// zoom buttn type
				if ( _hasClass($this, 'zoom-type1')
					|| _hasClass($this, 'zoom-type2') ) {
					(function () {
						var $self = $this;
						var $btnZoom = $self.find('.btn-zoom');
						var $btnClose = $self.find('.btn-zoom-close');
						var $zoomImage = $self.find('figure.on');

						$btnZoom.on('click', function() {
							$zoomImage.show().animate({'opacity':1}, 500);
							$btnClose.show().focus();
							$btnZoom.hide();
						});
						$btnClose.on('click', function() {
							$zoomImage.animate({'opacity':0}, 500, function() {
								$zoomImage.hide();
							});
							$btnClose.hide();
							$btnZoom.show().focus();
						});
					})();
				}

				// zoom-type3
				if ( _hasClass($this, 'zoom-type3')) {
					(function () {
						var $self = $this;
						var $btnZoom = $('.btn-zoom-area button')
						var $btnClose = $self.find('.btn-zoom-close');
						var $zoomImage1 = $self.find('figure.on');
						var $zoomImage2 = $self.find('figure.add');

						$btnZoom.on('click', function() {
							var idx = $(this).index();
							if(idx != 0){
								$zoomImage2.show().animate({'opacity':1}, 500);
								$zoomImage1.show().animate({'opacity':0}, 500);
								$btnClose.show().focus();
								$btnZoom.hide();
							}else if(idx != 1){
								$zoomImage1.show().animate({'opacity':1}, 500);
								$zoomImage2.show().animate({'opacity':0}, 500);
								$btnClose.show().focus();
								$btnZoom.hide();
							}
						});
						$btnClose.on('click', function() {
							$zoomImage1.animate({'opacity':0}, 500, function() {
								$zoomImage1.hide();
							});
							$zoomImage2.animate({'opacity':0}, 500, function() {
								$zoomImage2.hide();
							});
							$btnClose.hide();
							$btnZoom.show().focus();
						});
					})();
				}

				// kv-area swiper-area
				if ( _hasClass($this, 'kv-area swiper-area') ) {
					(function () {
						var $kvSlideWrap = $(".kv-area.swiper-area .swiper-container");
						var $kvSlideList = $kvSlideWrap.find(".swiper-slide");
						var slideLength = $kvSlideList.length;
	
						if(slideLength <= 1) {
							$kvSlideWrap.addClass("none-slide");
						} else {
							var swiper1 = new Swiper(".kv-area.swiper-area .swiper-container", {
								speed: 500,
								pagination: true, 
								nextButton: '.swiper-button-next', 
								prevButton: '.swiper-button-prev', 
								slidesPerView: 1, 
								paginationClickable: true, 
								pagination: '.swiper-pagination',
								//effect: 'fade',
								loop: true,
								observer: true,
								observeParents: true,
								onSlideChangeStart  : function() {
									
								}
							});
						}
					})();
				} // 2020 models : New

				if (_hasClass($this, 'module-image-text')) {
					// video autoplay
					var videoAutoPlayer = $this.find('.video-player-area:not(.none-auto)');
					var videoAuto = videoAutoPlayer.find('.video-player');

					// video click
					var videoPlayer = $this.find('.video-player-area.none-auto');
					var video = videoPlayer.find('.video-player');
					var btnVideoPlay = videoPlayer.find('.btn-player');

					// youtube click			
					var youtubePlayer = $this.find('.youtube-player-area');
					var youtube = youtubePlayer.find('.youtube-player');
					var btnYoutubePlay = youtubePlayer.find('.btn-player');

					$this.on({
						inView: function() {
							// video autoplay
							if(videoAuto.length) {								
								videoAuto[0].currentTime = 0;
                                videoAuto[0].play();
							}

							// video click
							video.removeAttr('autoplay');
							btnVideoPlay.on('click', function(e){
								e.preventDefault();
								e.stopImmediatePropagation();
								$(this).parent().removeClass('none-auto');
								video[0].currentTime = 0;
                                video[0].play();
							});

							// youtube click
							btnYoutubePlay.on('click', function(e){
								e.preventDefault();
								e.stopImmediatePropagation();								
								$(this).parent().removeClass('none-auto');
								youtubeFrame.idx = youtube.attr('id').replace('player','');
								youtubeFrame.onPlayStart();
							});
						},
						outView: function() {
							// video autoplay
							if(videoAuto.length) {								
								videoAuto[0].currentTime = 0;
                                videoAuto[0].play();
							}

							// video click
							if(video.length) {
								videoPlayer.addClass('none-auto');
								video[0].currentTime = 0;
                                video[0].pause();
							}
							
							// youtube click
							if(youtube.length) {
								youtubePlayer.addClass('none-auto');
								youtubeFrame.idx = youtube.attr('id').replace('player','');								
								setTimeout(function(){
									youtubeFrame.onPlayStop();
								},100);							
							}
						}
					});
				} // 2020 models : New

				// SUPPORT OLD BROWSER ( < IE10 )
				if ( !SUPPORT_TRANSITION )  {
					// section text
					if ( _hasClass($this, 'title-type1')
						|| _hasClass($this, 'title-type2')
						|| _hasClass($this, 'title-type5') ) {
						$this.on({
							inView: function() {
								$(this).find('.brand-header').stop().animate({'margin-top' : 0},1000);
							},
							outView: function() {
								$(this).find('.brand-header').css('margin-top', 30);
							}
						});
					}

					if ( _hasClass($this, 'title-type3')
						|| _hasClass($this, 'title-type4') ) {
						$this.on({
							inView: function() {
								$(this).find('.brand-header').stop().animate({'margin-bottom' : 0},1000);
							},
							outView: function() {
								$(this).find('.brand-header').css('margin-bottom', -30);
							}
						});
					}

					// fade type
					if ( _hasClass($this, 'fade-type') ) {
						$this.on({
							inView: function() {
								$(this).find('figure.feature.on').stop().animate({'opacity' : 1}, 500);
							},
							outView: function() {
								$(this).find('figure.feature.on').css('opacity', 0);
							}
						})
					}

					// interval type
					if ( _hasClass($this, 'interval-type') ) {
						$this.on({
							inView: function() {
								var $this = $(this);
								$this.find('figure.feature img.step2').stop().animate({'opacity' : 1}, 500, function () {
									$this.find('figure.feature img.step3').stop().animate({'opacity' : 1}, 500);
								});
							},
							outView: function() {
								var $this = $(this);
								$this.find('figure.feature img.step2').css('opacity', 0);
								$this.find('figure.feature img.step3').css('opacity', 0);
							}
						})
					}
				}
			})
		};

		// IWCA - content compare slider
		// modified version of _dragMotion
		/* Original: 2019-09-25 */
		/* Updated: 2019-10-28 IWCa - G70 module - start */
		var _dragMotion2 = function(el) {
			var element = el;
			var _$container;
			var _$box;
			var _$featureInside;
			var _$btnDrgabar;
			var _isMoving = false;
			var _viewMargin = 100;
			var _offsetX, _imageOffsetX, _offset;
			var _halfWay;

			var _boxSize = {max: 0, min: 0};
			var _init = function() {
				_asset();
				_addEvnet();
				_resizeComplete();
			};
			var _asset = function() {
				 _$container = $(element);
				 _$btnDrgabar = _$container.find('a.btn-control');
				 _$drgaLine = _$container.find('.control-line');

				 _$box = _$container.find('.feature-box.outside');
				 _$box2 = _$container.find('.feature-box.inside');

				 _$featureInside = _$container.find('.inside .feature-content');
				 _$featureOutside = _$container.find('.outside .feature-content');

				 _$callout1 = _$container.find('.callout1');
				 _$callout2 = _$container.find('.callout2');
			};
			var _addEvnet = function() {
				$(App.Events).on( App.Events.RESIZE_COMPLETE, _resizeComplete );

				_$container.on({inView: _inView, outView: _outView });
				_$btnDrgabar.on('mousedown.dragbar touchstart.dragbar', _dragStart);

			};
			var _setStyle = function(w,h) {
				var h = h || _$box.height();
				_$box.data('offsetX', w);
				return {'clip': 'rect(0px '+ w +'px '+ h +'px 0px)'};
			};
			var _getTouchPoint = function(e) {
				e = e.originalEvent;
				if (e.touches || e.changedTouches) {
					return {
						x:e.touches[0] ? e.touches[0].pageX : e.changedTouches[0].pageX,
						y:e.touches[0] ? e.touches[0].pageY : e.changedTouches[0].pageY,
						t:+new Date
					};
				}
				return {x:e.pageX, y:e.pageY, t:+new Date};
			};
			var _dragStart = function(e) {
				if ( !_isMoving ) {
					_isMoving = true;
					_offset   = _getTouchPoint(e);
					_offsetX  = _$btnDrgabar.offset().left - $('#container').offset().left;
					_imageOffsetX = _$box.data('offsetX');

					var maxWindowView = Math.max(App.GlobalVars.windowWidth, 1024);

					var maxWidth = Math.min(maxWindowView, App.GlobalVars.WIN_MAX_WIDTH);

					var viewportMargin = (_$box.width()-maxWidth)/2;
					_boxSize.max = maxWidth+viewportMargin - _viewMargin;
					_boxSize.min = viewportMargin + _viewMargin;

					$(document).on({
						'mousemove.dragbar touchmove.dragbar' : _dragMove,
						'mouseup.dragbar touchend.dragbar'    : _dragEnd
					});
				}
				e.preventDefault();
			};
			var _dragMove = function(e) {
				if ( _isMoving ) {
					var offset, offsetX, imageOffsetX, masWidth, innerThreshold, outerThreshold, halfWay;
					offset = _getTouchPoint(e);
					offset.x -= _offset.x;
					offset.y -= _offset.y;
					offsetX = offset.x + _offsetX + _$btnDrgabar.width()/2;

					var maxWindowView = Math.max(App.GlobalVars.windowWidth, 1024);

					maxWidth = Math.min(maxWindowView, App.GlobalVars.WIN_MAX_WIDTH);
					maxWidth -= _viewMargin;

					if ( Math.abs(offset.x) > Math.abs(offset.y) ) {

						imageOffsetX = offset.x +_imageOffsetX;
						imageOffsetX = Math.max( Math.min(_boxSize.max, imageOffsetX), _boxSize.min);

						offsetX = Math.max( Math.min(offsetX, maxWidth), _viewMargin );

						_$btnDrgabar.css('left', offsetX);
						_$drgaLine.css('left', offsetX);
						_$box.css( _setStyle(imageOffsetX) );

						outerThreshold = Math.floor(maxWidth * 0.45);
						halfWay = Math.floor(maxWidth * 0.5);
						innerThreshold = Math.floor(maxWidth * 0.55);

							if (offsetX < outerThreshold) {
								_$featureOutside.css('opacity', 0);
								_$featureInside.css('opacity', 1);
								_$callout1.css('opacity', 0);
								_$callout2.css('opacity', 1);

							} else if (offsetX > innerThreshold) {
								_$featureOutside.css('opacity', 1);
								_$featureInside.css('opacity', 0);
								_$callout1.css('opacity', 1);
								_$callout2.css('opacity', 0);

							} else {
								_$featureOutside.css('opacity', 0);
								_$featureInside.css('opacity', 1);
								_$callout1.css('opacity', 1);
								_$callout2.css('opacity', 0);

							}

					}
					e.preventDefault();
				}
			};

			var _dragEnd = function(e) {
				if ( _isMoving ) {
					_isMoving = false;
					$(document).off({
						'mousemove.dragbar touchmove.dragbar' : _dragMove,
						'mouseup.dragbar touchend.dragbar'    : _dragEnd
					});

					e.preventDefault();
				}
			};

			var _inView = function() {

				var maxWindowView = Math.max(App.GlobalVars.windowWidth, 1024);
				var maxWidth = Math.min(maxWindowView, App.GlobalVars.WIN_MAX_WIDTH);

				if ( _$box.width() != 0 ) {
					_imageOffsetX = _$box.width()/2;
					_$box.css( _setStyle(_imageOffsetX) );
				}

				_$btnDrgabar.css('left', maxWidth/2 );
				_$drgaLine.css('left', maxWidth/2 );

				_$callout1.css('opacity', 1);
				_$callout2.css('opacity', 0);

				_$featureOutside.css('opacity', 0);
				_$featureInside.css('opacity', 1);

				if (App.GlobalVars.windowWidth < 1024) {
					$('.btn-scroll').css('opacity', 0);
				} else {
					$('.btn-scroll').css('opacity', 1);
				}

			};

			var _outView = function() {
				if (App.GlobalVars.windowWidth < 1024) {
					$('.btn-scroll').css('opacity', 1);
				}
				_resizeComplete();
			};

			var _resizeComplete = function() {
					_inView();
			};

			_init();
		};
		/* 2019-10-28 IWCa - G70 module - end */

		var _dragMotion = function(el) {
			var element = el;
			var _$container;
			var _$image;
			var _$btnDrgabar;
			var _isMoving = false;
			var _viewMargin = 100;
			var _offsetX, _imageOffsetX, _offset;

			var _imageSize = {max: 0, min: 0};
			var _init = function() {
				_asset();
				_addEvnet();
				_resizeComplete();
			};
			var _asset = function() {
				 _$container = $(element);
				 _$btnDrgabar = _$container.find('a.btn-control');
				 _$drgaLine = _$container.find('.control-line');
				 _$image = _$container.find('figure.outside>img');
			};
			var _addEvnet = function() {
				$(App.Events).on( App.Events.RESIZE_COMPLETE, _resizeComplete );

				_$container.on({inView: _inView, outView: _outView });
				_$btnDrgabar.on('mousedown.dragbar touchstart.dragbar', _dragStart);

			};
			var _setStyle = function(w,h) {
				var h = h || _$image.height();
				_$image.data('offsetX', w);
				return {'clip': 'rect(0px '+ w +'px '+ h +'px 0px)'};
			};
			var _getTouchPoint = function(e) {
				e = e.originalEvent;
				if (e.touches || e.changedTouches) {
					return {
						x:e.touches[0] ? e.touches[0].pageX : e.changedTouches[0].pageX,
						y:e.touches[0] ? e.touches[0].pageY : e.changedTouches[0].pageY,
						t:+new Date
					};
				}
				return {x:e.pageX, y:e.pageY, t:+new Date};
			};
			var _dragStart = function(e) {
				if ( !_isMoving ) {
					_isMoving = true;
					_offset   = _getTouchPoint(e);
					_offsetX  = _$btnDrgabar.offset().left - $('#container').offset().left;
					_imageOffsetX = _$image.data('offsetX');

					var maxWidth = Math.min(App.GlobalVars.windowWidth, App.GlobalVars.WIN_MAX_WIDTH);
					var viewportMargin = (_$image.width()-maxWidth)/2;
					_imageSize.max = maxWidth+viewportMargin - _viewMargin;
					_imageSize.min = viewportMargin + _viewMargin;

					$(document).on({
						'mousemove.dragbar touchmove.dragbar' : _dragMove,
						'mouseup.dragbar touchend.dragbar'    : _dragEnd
					});
				}
				e.preventDefault();
			};
			var _dragMove = function(e) {
				if ( _isMoving ) {
					var offset, offsetX, imageOffsetX, masWidth;
					offset = _getTouchPoint(e);
					offset.x -= _offset.x;
					offset.y -= _offset.y;
					offsetX = offset.x + _offsetX + _$btnDrgabar.width()/2;

					maxWidth = Math.min(App.GlobalVars.windowWidth, App.GlobalVars.WIN_MAX_WIDTH);
					maxWidth -= _viewMargin;

					if ( Math.abs(offset.x) > Math.abs(offset.y) ) {

						imageOffsetX = offset.x +_imageOffsetX;
						imageOffsetX = Math.max( Math.min(_imageSize.max, imageOffsetX), _imageSize.min);

						offsetX = Math.max( Math.min(offsetX, maxWidth), _viewMargin );

						_$btnDrgabar.css('left', offsetX);
						_$drgaLine.css('left', offsetX);
						_$image.css( _setStyle(imageOffsetX) );
					}
					e.preventDefault();
				}
			};
			var _dragEnd = function(e) {
				if ( _isMoving ) {
					_isMoving = false;
					$(document).off({
						'mousemove.dragbar touchmove.dragbar' : _dragMove,
						'mouseup.dragbar touchend.dragbar'    : _dragEnd
					});
					e.preventDefault();
				}
			};
			var _inView = function() {
				_imageOffsetX = _$image.width()/2;
				_$image.css( _setStyle(_imageOffsetX) );
			};
			var _outView = function() {
				_resizeComplete();
			};
			var _resizeComplete = function() {
				if ( _$image.width() != 0 ) {
					_inView();
				}
				var maxWidth = Math.min(App.GlobalVars.windowWidth, App.GlobalVars.WIN_MAX_WIDTH);
				_$btnDrgabar.css('left', maxWidth/2 );
				_$drgaLine.css('left', maxWidth/2 );
			};

			_init();
		};

		var _setParallax = function($section) {
			var $parallaxer = $({p: 0});
			var $parallaxs;
			var parallaxAbleTypes = /^(x|y|s|a|c|r)$/;
			var parallaxFloatTypes = /^(s|a)$/;

			$parallaxs = $section.find('[data-parallax]');

			// x,y,c,a,s
			var _setting = function() {
				$parallaxs.each(function(i) {
					var $this = $(this), dataArr = [];

					dataArr = $this.data('parallax').replace(/\s/g,'').split('|');

					for (j=0;j<dataArr.length;j++) {
						dataArr[j] = dataArr[j].split(',');

						dataArr[j]['type'] = 'y';

						if (parallaxAbleTypes.test( dataArr[j][0] )) {
							dataArr[j]['type'] = dataArr[j][0].toLowerCase();
							dataArr[j].shift();
						}

						if (dataArr[j]['type'] != 'c') {

							dataArr[j]['from'] = parseFloat(dataArr[j][0]);
							dataArr[j]['to'] = dataArr[j]['from'] - parseFloat(dataArr[j][1]);

							if (dataArr[j]['type'] == 's') {
								dataArr[j][2] = dataArr[j][0];
							}
							dataArr[j][2] = 0;
							dataArr[j][3] = 0;
							dataArr[j][4] = 0;
						}
					}

					$this.data('parallaxData', dataArr);
				});

				$section.data('parallax', $parallaxs);
			};

			var _stepAnimation = function() {
				var self, properties, value, result = [], dataArr, j;

				$parallaxs.each(function() {
					self = this;
					dataArr = $(this).data('parallaxData');
					properties = {};
					result = [];
					value = '';
					len = dataArr.length;

					for (j=0; j<len; j++) {
						if ( dataArr[j]['type'] == 'c' ) continue;
						value = dataArr[j][3]+(dataArr[j]['valueTo']-dataArr[j][3]) * $parallaxer[0].p;
						properties[dataArr[j]['type']] = dataArr[j][2] = value;
					}

					if ( SUPPORT_TRANSFORM ) {
						if ( Modernizr.csstransforms3d ) {
							result.push('translate3d('+(properties.x||0)+'px,'+(properties.y||0)+'px,0)');
							if (properties.r) result.push(' rotateZ('+properties.r+'deg)');
						} else {
							result.push('translate('+(properties.x||0)+'px,'+(properties.y||0)+'px)');
							if (properties.r) result.push(' rotate('+properties.r+'deg)');
						}

						if (properties.s) result.push(' scale('+properties.s+')');

						self.style[SUPPORT_TRANSFORM] = result.join('');
						if (properties.a !== undefined) {
							self.style.opacity = properties.a;
						}
					}
				});

			};

			var _parallaxAni = function(per) {
				var j, max, valueTo;
				var parallaxAnimateOption = {queue: false, duration: 850, rounding: false, easing: 'easeOutQuint', step: _stepAnimation};
				per = Math.max(0, per, Math.min(1, per));

				$parallaxer._stop();

				$parallaxs.each(function(i) {
					var dataArr = $(this).data('parallaxData');
					var parallaxType;
					for (j=0; j<dataArr.length; j++) {
							parallaxType = dataArr[j]['type'];
						if ( parallaxType == 'c' ) {
							window[dataArr[0]] && window[dataArr[0]](per);
						} else {
							dataArr[j][3] = dataArr[j][2];
							valueTo = dataArr[j]['from'] - dataArr[j]['to'] * per;
							if (_sizeWidth <= 1440 && parallaxType != 's' && parallaxType != 'a') {
								valueTo *= 0.75;
							}
							if ( !parallaxFloatTypes.test(parallaxType) ) {
								valueTo = Math.round(valueTo);
							}
							dataArr[j]['valueTo'] = valueTo;
						}
					}
				});

				$parallaxer[0].p = 0;
				$parallaxer._animate({p: 1}, parallaxAnimateOption);
			};

			_setting();

			return {
				parallaxAni : _parallaxAni
			}
		};

		var _setVisible = function(e, isVisible) {
			var $this = $(this),
				scrollTop = App.GlobalVars.scrollTop;

			if ( isVisible ) {
				if ( !$this.data('show') ) {
					$this.data('show', true).addClass('show');
				}

				if ( !$this.data('visible') ) {
					$this.data('visible', true).addClass('visible').trigger('visible');
				}
			} else {
				if ( $this.data('visible') ) {
					$this.data('visible', false).removeClass('visible').trigger('invisible');
				}
			}
		};

		var _setHello = function(element, options) {
			var $el = $(element),
				helloArr,
				$section;
				opt = options || {};

			if ( !$el.length ) return false;

			$section = $el.closest('.section');

			if ( $section.length ) {
				helloArr = $section.data('hello') || [];
				opt.css  = opt.css ? opt.css : (helloArr.length) ? helloArr+1 : 'hello';
				opt.$element = $el;
				opt.element  = $el[0];
				opt.baseLine = opt.baseLine ? opt.baseLine : 3;

				$el.transitionEnd(function() {
					$section.addClass(opt.css+'-end');
				}, true);
				helloArr.push( opt );
				$section.data('hello', helloArr);
			}
		};

		var _footerBanner = {
			isVisible : false,
			animEnd : function() {
				_scrollMotionAnimation = false;
			},
			show : function() {
				var _this = this;
				var scrollMaxTop = $document.height()-$window.height();

				_this.isVisible = true;
				$('html, body')._stop(true)._animate({'scrollTop' :scrollMaxTop}, {duration:500, complete: _this.animEnd});

				// btn down show
				_btnDownArrow.hide();
			},
			hide : function() {
				var _this = this;

				_this.isVisible = false;
				$('html, body')._stop(true)._animate({'scrollTop' :0}, {duration:500, complete: _this.animEnd});

				// btn down show
				_footerBanner.length && _btnDownArrow.show();
			},
			length : 0
		};

		var _btnDownArrow = {
			show : function() {
				if ( _btnDownArrow.length ) {
					_$btnDownWrap.show().stop(true).animate({'opacity': 1}, 500);
				}

			},
			hide : function() {
				if ( _btnDownArrow.length ) {
					_$btnDownWrap.stop(true).animate({'opacity': 0}, 500, function() {
						_$btnDownWrap.hide();
					});
				}
			},
			click : function(e) {
				_currentSectionIndex += 1;

				if ( _currentSectionIndex > _sectionLength ) {
					_currentSectionIndex = _sectionLength;
					_footerBanner.show();
					return false;
				} else {
					if (_screen_mode == 'fixed') {
						// if ( !_scrollMotionAnimation ) {
						// 	_scrollMotionAnimation = true;
							_scrollSectionMotion();
						// }
					} else {
						$('html, body')._stop(true)._animate({'scrollTop' : $sections[_currentSectionIndex].offset().top }, {duration:500});
					}
				}
				return false;
			},
			length : 0
		};

		var _subNav = (function() {
			var _this = this;

			var _$header;
			var _$suvNav;
			var _$btnArea;
			var _$btnCtrl;
			var _$btnTools;
			var _headerHeight;

			this.isVisible = false;
			this.isToolsVisible = false;

			this.init = function() {
				_this.asset();
				_this.addEvent();
			};
			this.asset = function() {
				_$header = $('header');
				_$suvNav = $('.sub-navi');
				_$btnArea = _$suvNav.find('.nav');
				_$btnIntro = _$btnArea.find('> a');
				_$btnCtrl = _$btnArea.find('> .gnb-ctrl > button');
				_$btnTools = _$suvNav.find('.cta-area .btn');
				_headerHeight = _$header.height();

				_this.scroll();
			};
			this.addEvent = function() {
				_$btnCtrl.on('click', _this.click);
				_$btnTools.on('click', _this.toolClick);
				// _$btnIntro.on('click', _this.gotoIntro);
			};
			this.gotoIntro = function() {
				_setSectionMove(0);
			};
			this.click = function(e) {
				if ( !_this.isVisible ) {
					_this.viewSubNavOn();
				} else {
					_this.viewSubNav();
				}
				if (e) e.preventDefault();
			};
			this.toolClick = function(e) {
				if ( !_this.isToolsVisible ) {
					_this.viewToolsOn();
				} else {
					_this.viewTools();
				}
				if (e) e.preventDefault();
			};
			this.viewHeader = function() {
				_$header._animate({'top' : 0});
				_$suvNav._animate({'top' : 0}).removeClass('on');
				_$btnArea.removeClass('on');
			};
			this.viewSubNav = function() {
				_$header._animate({'top': -_headerHeight});
				_$suvNav._animate({'top': 0}).addClass('on');
				_$btnArea.addClass('on');

				_this.isVisible = false;
			};
			this.viewSubNavOn = function() {
				_$header._animate({'top' : 0});
				_$suvNav._animate({'top' : _headerHeight});
				_$btnArea.removeClass('on');

				_this.isVisible = true;
			};
			this.viewTools = function() {
				_$suvNav.find('.lst').stop().slideUp();
				_$btnTools.removeClass('on');
				_this.isToolsVisible = false;
			};
			this.viewToolsOn = function() {
				_$suvNav.find('.lst').stop().slideDown();
				_$btnTools.addClass('on');
				_this.isToolsVisible = true;
			};

			this.scroll = function() {
				if ( $sections[_currentSectionIndex].hasClass('module-intro-mov') ) {
					_this.viewHeader();
				} else {
					_this.viewSubNav();
				}
			};
			return this;
		})();

		/*!
		 * _secIndicator : section indicator
		 */
		var _secIndicator = {
			asset : function() {
				this.container = $('.sec-indicator');
				this.area = this.container.find('.gnb-area');
            this.navBar = this.area.find("ul"); // 2021-05-11 GV70 VLP Updates
            this.navHeight = this.navBar.height(); // 2021-05-11 GV70 VLP Updates
            this.item = this.navBar.find("li"); // 2021-05-11 GV70 VLP Updates
				this.anchors = this.area.find('li>a');
				this.anchorLine = this.area.find('span.line');

				this.select_class = 'over';
				this.isOver = false;

				this.length = this.area.length;

				if ( this.length ) this.addEvent();
			},
			addEvent : function() {
				var _this = this;

				this.area.on({'mouseenter': _this.over, 'mouseleave': _this.out});
				this.anchors.on({'focus': _this.over, 'blur': _this.out, 'click': _this.click });
				this.resize();

			},
			over : function() {
				if ( !_footerBanner.isVisible ) {
					var _this = _secIndicator;
					_this.isOver = true;
					_this.container.addClass(_this.select_class);
				}
			},
			out  : function() {
				var _this = _secIndicator;
				_this.isOver = false;
				setTimeout(function() {
					if ( !_this.isOver ) {
						_this.container.removeClass( _this.select_class );
						_this.select();
					}
				},250);
			},
			select : function() {
				var _this = _secIndicator;

				if ( !_this.length ) return false;

				// intro section visible check
				var isIntroSection = $sections[_currentSectionIndex].hasClass(HIGHLIGHTS_INTRO_SKIN_CLASS);
				_this.area.decideClass('off', isIntroSection);

				var $target = _this.anchors.eq( _currentSectionIndex );
				$target = $target.parent('li');

				var offsetTop = $target.position().top;
				var targetHeight = $target.height();
				var value = {'top':offsetTop,'height':targetHeight};

				if ( SUPPORT_TRANSITION ) {
					_this.anchorLine.css(value);
				} else {
					_this.anchorLine.stop(true).animate(value, 400);
				}
				_this.anchors.removeClass('cur').eq(_currentSectionIndex).addClass('cur')
			},
			resize: function() {
				var _this = _secIndicator;
				if ( !_this.length ) return false;

            // 2021-05-11 #52363 GV70 VLP Updates Start
            if(_this.item.length >= 12){
               if($(window).height() <= _this.navHeight + 120){
                  _this.item.height(($(window).height() - 150) / _this.item.length);
               }
               else{
                  _this.item.removeAttr('style');
               };
            }else{
               _this.item.removeAttr('style');
            };
            // 2021-05-11 #52363 GV70 VLP Updates End

				_this.container.css({
					'top': '50%',
					'marginTop': -(_this.area.height()/2)
				});
				_this.select();
			},
			click: function() {
				if ( !_footerBanner.isVisible ) {
					var index = $(this).parent().index();
					_setSectionMove(index);
				}
				return false;
			},
			scroll: function() {
				var _this = _secIndicator;
				_this.container._css('y', -App.GlobalVars.scrollTop);
			}
		};

		var _highlightScrollDown = function() {
			var $curSection = $sections[_currentSectionIndex];
			var $btnDownCtrl = $('a.btn-scroll');
			var $btnDownWrap = $('.btn-down-wrap');
			var btnDownClassName;

            var scrollName = "SCROLL";
            var nextName = "NEXT";
            if (location.href.toLowerCase().indexOf("/fr/") > 0) {
                scrollName = "DÉFILER";
                nextName = "SUIVANT";
            }

			if ( $curSection.hasClass(HIGHLIGHTS_SKIN_CLASS) && $btnDownCtrl && $sections[_currentSectionIndex+1] != null) {
				btnDownClassName = BTN_SECTION_DOWN_CLASS.replace('.','');
				/*$btnDownCtrl.addClass(btnDownClassName)
					.find('.title').text( $sections[_currentSectionIndex+1].find('.brand-header .title').text() );
				$btnDownCtrl.find('.next').text(nextName);
				$btnDownWrap.addClass('visible');*/
				$btnDownCtrl.removeClass(btnDownClassName)
					.find('.title').text('');
				$btnDownCtrl.find('.next').text(scrollName);
				$btnDownWrap.removeClass('visible');
			} // 2020-07-24
			else if ( $curSection.hasClass(HIGHLIGHTS_INTRO_SKIN_CLASS) && $btnDownCtrl ) {
				btnDownClassName = BTN_SECTION_DOWN_CLASS.replace('.','');
				$btnDownCtrl.removeClass(btnDownClassName)
					.find('.title').text('');
				$btnDownCtrl.find('.next').text(scrollName);
				$btnDownWrap.removeClass('visible');
			}
			else if ( $curSection.hasClass("module-skin1") && $btnDownCtrl ) {
                btnDownClassName = BTN_SECTION_DOWN_CLASS.replace('.','');
                $btnDownCtrl.removeClass(btnDownClassName)
                    .find('.title').text('');
                $btnDownCtrl.find('.next').text(scrollName);
                $btnDownWrap.removeClass('visible');
			}
		};

		// 스크롤시 피처 이동 모션
		var _scrollSectionMotion = function() {
			var $oldSection = $elements.filter('.'+CURRENT_SECTION_CLASS);
			var $curSection = $sections[_currentSectionIndex];

			var $oldSecFeature = $oldSection.find('>.feature');

			var directionDelta = ($elements.index($oldSection) > $elements.index($curSection)) ? -1 : 1;

			var startPosition = _sizeHeight * directionDelta;
			var startDelay    = 200 * directionDelta;

			var hash = '';//($curSection.data('hash') || '');
			var href = location.href.split('#')[0];

			if ( $curSection.type == 'gallery' ) {
				_scrollMotionAnimation = false;
				return;
			}

			if ( $elements.index($oldSection) == $elements.index($curSection) ) {
				_scrollMotionAnimation = false;
				return;
			}

			var motionEnd = function() {
				$oldSection._css({'y': 0});
				$oldSecFeature._css({'y': 0});

				$oldSection.removeClass(CURRENT_SECTION_CLASS).trigger('outView');
				$curSection.removeClass('motion').addClass(CURRENT_SECTION_CLASS).trigger('inView');

				if ( hash ) {
					location.href = href + '#!/' + hash;
				}
				if ( _currentSectionIndex == _sectionLength && !_footerBanner.length ) {
					_btnDownArrow.hide();
				}

				_subNav.scroll();
				_secIndicator.select();

				App.GlobalVars.isMSIE && $('.layer-box:visible').each( layerBoxResize );


				_scrollMotionAnimation = false;
			};

			// Only HIGHLIGHTS down button style.
			_highlightScrollDown();
			// --Only HIGHLIGHTS down button style.

			$curSection.addClass('motion');
			//170927 scroll wheel 속도 조절
			$('html, body').stop(true)._animate({'scrollTop': 0}, {duration: 450});
			$oldSection._animate({'y': -startPosition}, {duration: 450, ease:'easeInQuart'});
			$oldSecFeature._animate({'y': startPosition-startDelay}, {duration: 450, ease:'easeInQuart'});
			$curSection._css({'y': startDelay})._animate({'y': 0}, {duration: 450, ease:'easeInQuart', complete: motionEnd});

			_changeColorTheme();
		};

		// 피처에 따른 색상 변경.
		var _changeColorTheme = function() {
			var $curSection = $sections[_currentSectionIndex];
			var colorTheme = $curSection.hasClass('color-type1') && !$curSection.hasClass('color-type2');
		};

		/*!
		 * _setSectionMove : 스크린모드에 따라 화면 전환.
		 * index : {Number} - 전환하고자 하는 화면 index.
		 */
		var _setSectionMove = function(index, flag) {
			if ( index != _currentSectionIndex || flag) {
				if ( flag ) {
					index = _currentSectionIndex;
				}
				_currentSectionIndex = index;

				if (_screen_mode == 'fixed') {
					_scrollSectionMotion();
				} else if (_screen_mode == 'normal') {
					var thisScrollTop = $sections[_currentSectionIndex].offset().top;
					$('html,body')._animate({'scrollTop': thisScrollTop},{queue:false, duration:500, easing:'easeInOutQuart'});
				}
			}
		};

		var _mouseWheelEvent = function(event) {
			var deltaY       = event.deltaY*-1;
			var nowTime      = +new Date;
			var timeCheck    = ((nowTime-_mouseWheelTime) > MOUSEWHEEL_MIN_TIME);
			var moveUpCheck  = (deltaY<0) ? 1 : 0;
			var moveDownCheck = !moveUpCheck;
			var isVertically = (Math.abs(deltaY) > Math.abs(event.deltaX));
			var $lastSection = $elements.eq(_sectionLength);

			// debugger;
			if ( _scrollMotionAnimation ) {
				event.preventDefault();
				return;
			}

			if ( isVertically ) {
				if ( timeCheck && !_scrollMotionAnimation ) {
					_mouseWheelTime = nowTime;
					_scrollMotionAnimation = true;

					// next url 넘어가기
					if ( _footerBanner.isVisible && moveDownCheck && _footerBanner.length) {
						window.location.href = _$bannerSection.find('>a').attr('href');
						return false;
					}

					// footer영역 (배너 포함) 체크.
					if ( $lastSection.hasClass(CURRENT_SECTION_CLASS) ) {
						if ( (_footerBanner.isVisible && moveUpCheck) || moveDownCheck) {
							_footerBanner[moveDownCheck?'show':'hide']();
							return false;
						}
					}

					// prev
					if ( moveUpCheck && _currentSectionIndex > 0) {
						 _currentSectionIndex = Math.max(_currentSectionIndex-1, 0);
						 _btnDownArrow.show();
						_scrollSectionMotion();
					}
					// next
					else if ( moveDownCheck && _currentSectionIndex < _sectionLength ) {
						_currentSectionIndex = Math.min(_currentSectionIndex+1, _sectionLength);

						if ( !_footerBanner.length && _currentSectionIndex == _sectionLength ) {
							_btnDownArrow.hide();
						}
						_scrollSectionMotion();
					} else {
						_scrollMotionAnimation = false;
					}
				}
				event.preventDefault();
			}
		};

		var _mouseWheelEventVanila = function(event) {
            var deltaY       = event.deltaY / Math.abs(event.deltaY);
            var nowTime      = +new Date;
            var timeCheck    = ((nowTime-_mouseWheelTime) > MOUSEWHEEL_MIN_TIME);
            var moveUpCheck  = (deltaY<0) ? 1 : 0;
            var moveDownCheck = !moveUpCheck;
            var isVertically = (Math.abs(deltaY) > Math.abs(event.deltaX));
            var $lastSection = $elements.eq(_sectionLength);

            // debugger;
            if ( _scrollMotionAnimation ) {
                event.preventDefault();
                return;
            }

            if ( isVertically ) {
                if ( timeCheck && !_scrollMotionAnimation ) {
                    _mouseWheelTime = nowTime;
                    _scrollMotionAnimation = true;

                    // next url 넘어가기
                    if ( _footerBanner.isVisible && moveDownCheck && _footerBanner.length) {
                        window.location.href = _$bannerSection.find('>a').attr('href');
                        return false;
                    }

                    // footer영역 (배너 포함) 체크.
                    if ( $lastSection.hasClass(CURRENT_SECTION_CLASS) ) {
                        if ( (_footerBanner.isVisible && moveUpCheck) || moveDownCheck) {
                            _footerBanner[moveDownCheck?'show':'hide']();
                            return false;
                        }
                    }

                    // prev
                    if ( moveUpCheck && _currentSectionIndex > 0) {
                         _currentSectionIndex = Math.max(_currentSectionIndex-1, 0);
                         _btnDownArrow.show();
                        _scrollSectionMotion();
                    }
                    // next
                    else if ( moveDownCheck && _currentSectionIndex < _sectionLength ) {
                        _currentSectionIndex = Math.min(_currentSectionIndex+1, _sectionLength);

                        if ( !_footerBanner.length && _currentSectionIndex == _sectionLength ) {
                            _btnDownArrow.hide();
                        }
                        _scrollSectionMotion();
                    } else {
                        _scrollMotionAnimation = false;
                    }
                }
                event.preventDefault();
            }
        };

		var _keydownEvent = function(e) {
			if ( !_scrollMotionAnimation && _screen_mode == 'fixed' ) {
				var keyCode = e.keyCode;
				var moveUpCheck   = (keyCode == 38);
				var moveDownCheck = (keyCode == 40);

				if ( moveUpCheck || moveDownCheck ) {
					_scrollMotionAnimation = true;
					// next url 넘어가기
					if ( _footerBanner.isVisible && moveDownCheck && _footerBanner.length) {
						window.location.href = _$bannerSection.find('>a').attr('href');
						return false;
					}

					// footer영역 (배너 포함) 체크.
					if ( $sections[_sectionLength].hasClass(CURRENT_SECTION_CLASS) ) {
						if ( (_footerBanner.isVisible && moveUpCheck) || moveDownCheck) {
							_footerBanner[moveDownCheck?'show':'hide']();
							return false;
						}
					}

					// prev
					if ( moveUpCheck && _currentSectionIndex > 0) {
						 _currentSectionIndex = Math.max(_currentSectionIndex-1, 0);
						 _btnDownArrow.show();
						_scrollSectionMotion();
					}
					// next
					else if ( moveDownCheck && _currentSectionIndex < _sectionLength ) {
						_currentSectionIndex = Math.min(_currentSectionIndex+1, _sectionLength);

						if ( !_footerBanner.length && _currentSectionIndex == _sectionLength ) {
							_btnDownArrow.hide();
						}
						_scrollSectionMotion();
					} else {
						_scrollMotionAnimation = false;
					}
					return false;
				}
			}
		};

		var _scrollEvent = function() {
			var windowHeight = App.GlobalVars.windowHeight,
				scrollTop = App.GlobalVars.scrollTop,

				currentSectionCheck,

				sectionTop, sectionHeight,
				visibleVal, visibleCheck,

				$fixSubSection,
				fixSubSectionHeight,
				fixSubSectionTop,

				hello = [],

				i = 0;

			for (; i<=_sectionLength; i++) {
				sectionTop = Math.floor( $sections[i][0].getBoundingClientRect().top );
				sectionHeight = $sections[i][0].offsetHeight;

				currentSectionCheck = (sectionTop<=0 && -sectionTop<sectionHeight);
				if ( currentSectionCheck && _screen_mode == 'normal' ) _currentSectionIndex = i;

				if ( _screen_mode == 'normal' ) {
					if ( currentSectionCheck && !$sections[i].hasClass(CURRENT_SECTION_CLASS) ) {
						$sections[i].trigger('inView').addClass(CURRENT_SECTION_CLASS);
					} else if ( !currentSectionCheck && $sections[i].hasClass(CURRENT_SECTION_CLASS) ) {
						$sections[i].trigger('outView').removeClass(CURRENT_SECTION_CLASS);
					}
				}

				if ( sectionTop > 0 || $sections[i].is(':visible') ) {
					if (i == 0) {
						visibleVal = 1-((sectionHeight+sectionTop)/sectionHeight);
					} else {
						visibleVal = -(sectionTop-windowHeight)/(windowHeight+sectionHeight);
					}
					if ( SUPPORT_TRANSFORM ) {
						if (visibleVal >= -0.15 && 1.15 >= visibleVal) {
							sections[i].parallaxAni(visibleVal);
						}
					}

					visibleCheck = ((sectionTop-windowHeight)<0 && sectionHeight>=-sectionTop);
					$sections[i].trigger('onVisible', visibleCheck);

					hello = $sections[i].data('hello') || [];

					if (hello.length) {
						if ( visibleCheck ) {
							$.each(hello, function() {
								var baseLineIsPixel = ((''+this.baseLine).toLowerCase().indexOf('px')>-1);
								var baseLine = baseLineIsPixel ? parseInt(this.baseLine) : windowHeight/parseInt(this.baseLine,10);

								if ( (this.element.getBoundingClientRect().top-windowHeight+baseLine)<0 ) {
									if (!$sections[i].hasClass(this.css)) {
										$sections[i].addClass(this.css);
										if (typeof(this.on)=='function') {
											this.on(this.$element);
										}
									}
								}
							});
						} else {
							$.each(hello, function() {
								if ( $sections[i].hasClass(this.css) ) {
									if (typeof(this.off)=='function') {
										this.off(this.$element);
									}
									$sections[i].removeClass(this.css + ' '+this.css+'-end');
								}
							});
						}
					}
				}
			}

			_secIndicator.scroll();

			if (_screen_mode == 'normal') {
				_subNav.scroll();
				_changeColorTheme();
				_secIndicator.select();
			}
		};

		var _setupSize = function() {
			var setHeight;
			_sizeWidth = Math.max( Math.min( App.GlobalVars.WIN_MAX_WIDTH, App.GlobalVars.windowWidth ), App.GlobalVars.WIN_MIN_WIDTH );
			_sizeHeight = Math.max( $window.height(), App.GlobalVars.windowHeight, App.GlobalVars.WIN_MIN_HEIGHT );

			if (_sizeWidth < _sizeHeight) {
				_sizeHeight = App.GlobalVars.WIN_MIN_HEIGHT;
			}

			// 최소높이 지정시.
			// _sizeHeight = Math.max( Math.min(App.GlobalVars.windowHeight, App.GlobalVars.WIN_MAX_HEIGHT) , App.GlobalVars.WIN_MIN_HEIGHT );
			$elements.each(function(i){
				if ( $sections[i].fullSizeMode == true ) {
					$sections[i].css({'width': _sizeWidth, 'height': App.GlobalVars.windowHeight});

					// 171107 / lhj highlight slide size
                    if($sections[i].hasClass('module-intro-slide')) {
                        $sections[i].css({'width': '', 'height': App.GlobalVars.windowHeight});
                        $('.module-intro-slide .swiper-container .feature').css({'width': _sizeWidth, 'height': App.GlobalVars.windowHeight});
                    }
				} else {
					$sections[i].css({'width': _sizeWidth, 'height': _sizeHeight});

					// 171107 / lhj highlight slide size
                    if($sections[i].hasClass('module-intro-slide')) {
                        $sections[i].css({'width': '', 'height': _sizeHeight});
                        $('.module-intro-slide .swiper-container .feature').css({'width': _sizeWidth, 'height': _sizeHeight});
                    }
				}
			});

			if ( !$container.specs && _screen_mode == 'fixed') {
				$container.height( _sizeHeight + _$bannerSection.height() );
			}


			// page footer banner section
			_$bannerSection.css('marginTop', _sizeHeight).removeClass('show');

			if ( MOUSEWHEEL_EVENT ) {
				// set screen mode
				var $brandHeader = $elements.find('.brand-header');
				var currentScrollTop = $sections[_currentSectionIndex].offset().top;

				if ( _sizeHeight > App.GlobalVars.WIN_MIN_HEIGHT && _screen_mode == 'normal' && !$container.specs ) {
					_screen_mode = 'fixed';
                    if (fnGetBrowserType() === "Chrome") {
                        document.addEventListener("wheel", _mouseWheelEventVanila, {passive: false});
                    } else {
                        $(document).on("mousewheel.barndWheel", _mouseWheelEvent);
                    }
					$('html').removeClass('normal').addClass(_screen_mode);
					$container.height( _sizeHeight + _$bannerSection.height() );
					_setSectionMove(null, true);
				} else if ( _sizeHeight <= App.GlobalVars.WIN_MIN_HEIGHT && _screen_mode == 'fixed') {
					_screen_mode = 'normal';
                    if (fnGetBrowserType() === "Chrome") {
                        document.removeEventListener("wheel", _mouseWheelEventVanila, {passive: false});
                    } else {
                        $document.off('mousewheel.barndWheel', _mouseWheelEvent);
                    }
					$container.css('height', 'auto');
					$('html').removeClass('fixed').addClass(_screen_mode);
					// $('html, body')._animate({'scrollTop': currentScrollTop}, {duration:750, easing:Quart.easeInOut});
				}
			} else {
				$('html').addClass('normal');
			}
		};

		var layerBoxResize = function(i, el) {
			var $this = $(el);
			var $section = $this.closest('.section');
			var $list = $this.find('>li');
			var $cont = $list.find('div.brand-header');

			var setSize = function(isOnView) {
				var resetCss = {height:''};
				var ListMaxHeight = 0;
				if (isOnView) {
					resetCss.opacity = 0
				}
				$list.css(resetCss);
				$cont.height('');

				$list.each(function() {
					ListMaxHeight = Math.max( ListMaxHeight, $(this).height(), $(this).innerHeight() );
				});
				ListMaxHeight = Math.floor(ListMaxHeight);

				$list.css({height: ListMaxHeight});
				ListMaxHeight -= $list.find('figure').height();
				ListMaxHeight -= parseInt($cont.css('paddingTop'),10)*2;
				$cont.height( ListMaxHeight );
				$list.css({opacity: 1});
			};
			setSize();
		};

		var _resizeEvent = function() {
			// indicator resize
			_secIndicator.resize();
		};

		var _resizeEndEvent = function() {
			_scrollMotionAnimation = false;

			// resize
			_setupSize();

			App.GlobalVars.isMSIE && $('.layer-box:visible').each( layerBoxResize );
		};

		var _checkHashIndex = function(hashName) {
			var i=0, number = undefined;
			var hashName = hashName.replace(/\#/,'');
			for (i=0; i<=_sectionLength; i++) {
				if ($sections[i].data('hash') == hashName) {
					number = i;
				}
			}
			return number;
		};

		var _hash = function(hashName) {
			var hashIndex = _checkHashIndex(hashName);
			if ( hashIndex !== undefined ) {
				_setSectionMove(hashIndex);
			} else if ( event.target.tagName.toLowerCase() == 'a') {
				if ( event.target.getAttribute('href').charAt(0) != '#' ) {
					window.location.href = event.target.getAttribute('href');
				}
			}
			return false;
		};

		return {
			init     : _init,
			hello    : _setHello,
			element  : $sections,
			scroll   : _scrollEvent,
			goto     : _setSectionMove,
			sethash  : _hash
		}
	})(); //section

	$(function() {
		App.brand = barnd;
		App.brand.section = section;

		App.brand.init();
		App.brand.section.init();

		// set selectbox
		$('span.select-box').Selectbox();
	});
}(window, jQuery));
