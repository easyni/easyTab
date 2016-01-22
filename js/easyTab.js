(function ($) {
  $.fn.easyTab = function (option) {
    var options = {
      tabnav: '.easyTab-nav',
      tabContainer: '.easyTab-container',
      tabs: '.tab',
      navBtnSelector: 'a',
      currentItem: 0,
      defaultOpen: true,
      animTime: 0.5,
      closable: true,
      clickfunction: function () {
      },
      onClose: function () {
      },
      onOpen: function () {
      }
    };
    var timerClose;
    var myOptions;
    if (option)
      myOptions = $.extend(options, option);
    else
      myOptions = options;
    $(this).each(function (i) {
      var disabled = false;
      var scope = $(this);
      var myTabNav = $(this).find(myOptions.tabnav + ' ' + myOptions.navBtnSelector + '[data-tab]');
      var myTabContainer = $(this).find(myOptions.tabContainer);
      var myTabTab = $(this).find(myOptions.tabs);
      var myCurrentItem = $($(this).find(myOptions.tabs)[myOptions.currentItem]);
      var isOpen = false;
      var publicFunction = {
        changeTab: function (index) {
          var tempTime = isOpen ? 0 : myOptions.animTime;
          myTabNav.removeClass('active');
          var tabActive = $($(myTabNav)[index]);
          tabActive.addClass('active');
          myCurrentItem = scope.find('.' + tabActive.data('tab'));
          TweenLite.to(myTabTab, myOptions.animTime, {
            css: { opacity: 0 },
            ease: Power3.easeOut,
            onComplete: function () {
              $(this.target).css({ display: 'none' });
            }
          });
          TweenLite.killTweensOf(myTabTab);
          myCurrentItem.css({ display: 'block' });
          TweenLite.to(myCurrentItem, tempTime, {
            css: { opacity: 1 },
            ease: Power3.easeOut
          });
          isOpen = true;
        },
        closeAll: function (time) {
          myOptions.onClose();
          isOpen = false;
          var myTime = time ? time : 0;
          clearTimeout(timerClose);
          timerClose = setTimeout(function () {
            myTabNav.removeClass('active');
            TweenLite.killTweensOf(myTabTab);
            TweenLite.to(myTabTab, myOptions.animTime, {
              css: { opacity: 0 },
              ease: Power3.easeOut,
              onComplete: function () {
                $(this.target).css({ display: 'none' });
              }
            });
          }, myTime);
        },
        openAll: function () {
          myOptions.onClose();
          isOpen = true;
          myTabNav.removeClass('active');
          TweenLite.killTweensOf(myTabTab);
          myTabTab.attr('style', '');
        },
        init: function () {
          myTabTab.css({ display: 'none' });
          if (myOptions.defaultOpen) {
            $($(myTabNav)[myOptions.currentItem]).addClass('active');
            myCurrentItem.css({ display: 'block' });
          }
        },
        disabled: function () {
          scope.disabled = true;
          myTabNav.removeClass('active');
        },
        enabled: function () {
          scope.disabled = false;
        }
      };
      $(this).data('easyTab', publicFunction);
      myTabNav.click(function (e) {
        if (!scope.disabled) {
          $.proxy(myOptions.clickfunction, this)();
          if ($(this).data('tab')) {
            e.preventDefault();
            myTabContainer.find('.' + $(this).data('tab'));
            if ($(this).hasClass('active') && myOptions.closable === true) {
              publicFunction.closeAll();
              myTabNav.removeClass('active');
            } else {
              var tempTime = isOpen ? 0 : myOptions.animTime;
              myTabNav.removeClass('active');
              $(this).addClass('active');
              myCurrentItem = scope.find('.' + $(this).data('tab'));
              TweenLite.killTweensOf(myTabTab);
              myTabTab.hide();
              myCurrentItem.css({ display: 'block' });
              TweenLite.to(myCurrentItem, tempTime, {
                css: { opacity: 1 },
                ease: Power3.easeOut
              });
              $.proxy(myOptions.onOpen, this)();
              isOpen = true;
            }
          }
        }
      });
      publicFunction.init();
    });
  };
}(jQuery));
