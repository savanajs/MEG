(function ($) {

  const $win = $(window);
  const $doc = $(document);

  const Meg = function () {

    console.info("%cMEG CSS Framework - You are working on your project! Thanks:) | See documentation: http://savanajs.github.io/meg", "color:#00cc99;font-weight:bold;font-size:11px");

  };

  Meg.prototype.accessibility = function () {

    return {
      "checkboxAndLabelOpen": function () {

        $("body").on("keypress", "input:checkbox, label", function (e) {

          if ((e.keyCode ? e.keyCode : e.which) == 13) {

            $(this).trigger("click");

          }

        });

      },
      "init": function () {

        this.checkboxAndLabelOpen();

      }

    };

  };

  Meg.prototype.lazyLoad = function () {

    return {
      "selector": ".js-lazy-img",
      "isOnScreen": function (element) {

        const win = $(window);
        const screenTop = win.scrollTop();
        const screenBottom = screenTop + win.height();
        const elementTop = element.offset().top;
        const elementBottom = elementTop + element.height();

        return elementBottom > screenTop && elementTop < screenBottom;

      },
      "loadImages": function () {

        const _self = this;

        $.each($(this.selector), function () {

          const block = $(this);
          const image = block.find("img");

          if (_self.isOnScreen(block)) {

            const url = image.attr("url");

            if (image.attr("src") != url) {

              image.attr("src", url);

            }

          }

        });

      },
      "events": function () {

        const _self = this;

        $(document).on("scroll", function () {

          _self.loadImages();

        });

      },
      "load": function () {

        const selector = $(this.selector);

        selector.find("img").on("load", function () {

          $(this).addClass("js-loaded");

        });

      },
      "init": function () {

        this.loadImages();
        this.events();
        this.load();

      }

    };

  };

  Meg.prototype.scrolling = function () {

    return {
      "selector_scrolling_to": ".js-scrolling-to",
      "selector_return_top": ".js-return-top",
      "scrollingTo": function (target) {

        if (!target) {

          return;

        }

        $("body, html").animate({
          "scrollTop": $(target).offset().top
        }, 500);

      },
      "events": function () {

        const _self = this;

        $("body").on("click", this.selector_scrolling_to, function (e) {

          e.preventDefault();

          const goto = $(this).attr("data-to");

          _self.scrollingTo(goto);

        });

        $(window).on("scroll", function () {

          const scrollTop = $(window).scrollTop();

          if (scrollTop > 100) {

            $(_self.selector_return_top).fadeIn(500);

          } else {

            $(_self.selector_return_top).fadeOut();

          }

        });

      },
      "init": function () {

        $(this.selector_return_top).hide();
        this.events();

      }
    };

  };

  Meg.prototype.alert = {
    "selector_modal": ".js-modal--alert",
    "selector_modal_trigger": ".js-modal--alert-trigger",
    "setHmlt": function () {

      const html = `<div class="c-modal js-modal js-modal--alert" role="dialog" aria-modal="true" tabindex="-1">
                              <div class="c-modal__wrap" aria-hidden="true" role="dialog">
                                  <div class="c-modal__overlay" for="c-alert__1"></div>
                                  <div class="c-modal__dialog u-box-shadow">
                                      <div class="c-modal__header u-font-size-xx">
                                      <span class="c-modal__header--title"></span>
                                      <a href="#" class="c-modal__btn-close js-modal--close" title="Close">×</a>
                                      </div>
                                      <div class="c-modal__body">
                                      </div>
                                      <div class="c-modal__footer">
                                      <a href="#" title="Close" class="el-btn js-modal--close el-btn--sized u-color-white u-bg-success">
                                          OK
                                      </a>
                                      </div>
                                  </div>
                              </div>
                      </div>`;

      if (!$(".js-modal--alert").length) {

        $("body").append(html);

      }

    },
    "setInfosAlert": function (data) {

      if (!data || !data.title || !data.body) {

        return;

      }

      $(this.selector_modal).find(".c-modal__header--title").text(data.title);
      $(this.selector_modal).find(".c-modal__body").html(data.body);
      $(this.selector_modal).find(".el-btn--success").text(data.button_text);

    },
    "open": function (data) {

      this.setHmlt();

      this.setInfosAlert(data);
      $(this.selector_modal).addClass("actived");

    },
    "close": function () {

      scope.modal().closeModal();

    },
    "events": function () {

      const _self = this;

      $(this.selector_modal_trigger).on("click", function (e) {

        e.preventDefault();

        _self.open({
          "title": "Title of exemple",
          "body": "Cool....",
          "button_text": "Continue"
        });

      });

    },
    "init": function () {

      this.events();

    }

  };

  Meg.prototype.modal = function () {

    return {
      "selector_modal": ".js-modal",
      "selector_open_modal": ".js-modal--open",
      "selector_close_modal": ".js-modal--close",
      "openModal": function ($this) {

        if (!$this) {

          return;

        }

        const target = $this.attr("href");

        if (!target) {

          $this.addClass("actived");

          return;

        }

        $(target).addClass("actived");

      },
      "closeModal": function () {

        $(this.selector_modal).removeClass("actived");

      },
      "events": function () {

        const _self = this;

        $(this.selector_open_modal).on("click", function (e) {

          e.preventDefault();

          _self.openModal($(this));

        });

        $("body").on("click", this.selector_close_modal, function (e) {

          e.preventDefault();

          _self.closeModal();

        });

      },
      "show": function (element_modal) {

        if (!element_modal) {

          return;

        }

        this.openModal($(element_modal));

        return true;

      },
      "hide": function () {

        this.closeModal();

        return true;

      },
      "init": function () {

        this.events();

      }

    };

  };

  Meg.prototype.tab = function () {

    return {
      "selector_link": ".js-tab",
      "selector_wrap": ".js-tab__inner",
      "setClassActiveTab": function ($this) {

        if (!$this) {

          return;

        }

        $this.addClass("actived");

      },
      "removeClassActiveTab": function () {

        $(this.selector_link).removeClass("actived");

      },
      "setClassActiveWrap": function ($this) {

        if (!$this) {

          return;

        }

        const target = $this.attr("href");

        $(target).addClass("actived");

      },
      "removeClassActiveWrap": function () {

        $(this.selector_wrap).removeClass("actived");

      },
      "events": function () {

        const _self = this;

        $(this.selector_link).on("click", function (e) {

          e.preventDefault();

          _self.removeClassActiveTab();
          _self.removeClassActiveWrap();
          _self.setClassActiveTab($(this));

          _self.setClassActiveWrap($(this));

        });

      },
      "init": function () {

        this.events();

      }

    };

  };

  Meg.prototype.loading = function () {

    return {
      "setHtmlLoading": function () {

        const html = `<div class="c-loader__overlay c-loader__overlay--open c-loader__overlay--absolute">
                  <div class="c-loader c-loader--medium c-loader--primary"></div>
              </div>`;

        if (!$(".c-loader").length) {

          $("body").append(html);

        }

      },
      "setHtmlWaitLoading": function () {

        const html = `<div class="c-loader__waiting-overlay c-loader__waiting-overlay--open c-loader__waiting-overlay--absolute">
                  <div class="c-loader__waiting">
                      <div class="c-waiting__warp-loader">
                          <div class="c-loader c-loader--medium c-loader--primary"></div>
                      </div>
                      <div class="c-waiting__content">
                          <span class="c-waiting__title">Please wait...</span>
                      </div>
                  </div>
              </div>`;

        if (!$(".c-loader__waiting").length) {

          $("body").append(html);

        }

      },
      "showLoading": function () {

        this.setHtmlLoading();

        $("body").addClass("loading");

        return true;

      },
      "hideLoading": function () {

        $("body").removeClass("loading");

        return true;

      },
      "setTitleWaitLoading": function (title) {

        if (!title) {

          return;

        }

        $(".c-loader__waiting .c-waiting__title").text(title);

        return true;

      },
      "showWaitLoading": function (title) {

        this.setHtmlWaitLoading();

        this.setTitleWaitLoading(title);

        $("body").addClass("wait-loading");

        return true;

      },
      "hideWaitLoading": function () {

        $("body").removeClass("wait-loading");

        return true;

      },
      "showBeforeLoading": function (element_target) {

        const el = (!element_target) ? $("body") : $(element_target);

        el.addClass("before-loading");

        return true;

      },
      "hideBeforeLoading": function (element_target) {

        const el = (!element_target) ? $("body") : $(element_target);

        el.removeClass("before-loading");

        return true;

      },
      "events": function () {

        const _self = this;

        $(".trigger-showWaitLoading").on("click", function (e) {

          e.preventDefault();

          _self.showWaitLoading();

        });

        $(".trigger-showBeforeLoading").on("click", function (e) {

          e.preventDefault();

          _self.showBeforeLoading();

        });

      },
      "init": function () {

        this.events();

      }

    };

  };

  Meg.prototype.notify = function () {

    return {

      "getMessage": function (text, type) {

        let msg_html;

        switch (type) {

        case "success":
          msg_html = `<div class="c-message c-message--success">
            <i class="fa fa-check-circle" aria-hidden="true"></i>
            ${text}
            </div>`;
          break;

        case "warning":
          msg_html = `<div class="c-message c-message--warning">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
            ${text}
            </div>`;
          break;

        case "cancel":
          msg_html = `<div class="c-message c-message--cancel">
            <i class="fa fa-ban" aria-hidden="true"></i>
            ${text}
            </div>`;
          break;

        case "info":
          msg_html = `<div class="c-message c-message--info">
            '<i class="fa fa-info-circle" aria-hidden="true"></i>
            ${text}
            </div>`;
          break;

        }

        return msg_html;

      },

      "hide": function () {

        $(".o-notify").removeClass("o-notify--open");

      },

      "showed": function () {

        this.add();

        $(".o-notify").addClass("o-notify--open");

      },

      "removeAfterTime": function () {

        this.hide();

      },

      "insertText": function (text, type) {

        if (!type || !text) {

          return;

        }

        return this.getMessage(text, type);

      },

      "show": function (text, type, callback, time) {

        if (!type || !text) {

          return;

        }

        const cb = (typeof callback === "function");
        const _this = this;

        time = time || 5000;

        $(".o-notify").html(this.insertText(text, type));

        setTimeout(function () {

          _this.showed();

        }, 100);

        setTimeout(function () {

          _this.removeAfterTime();

          if (cb) {

            callback();

          }

        }, time);

        return true;

      },

      "add": function () {

        if (!$(".o-notify").length) {

          $("body").append("<div class='o-notify'></div>");

        }

        return true;

      }

    };

  };

  Meg.prototype.init = function () {

    this.accessibility().init();
    this.tab().init();
    this.modal().init();
    this.alert.init();
    this.loading().init();
    this.scrolling().init();

  };

  $doc.ready(function () {

    window.meg = new Meg();

    $("body").on("click", ".trigger-notify", function (e) {

      e.preventDefault();

      meg.notify().show("Ola", "cancel");

    });

    $("body").on("click", "a.js-redirect", function () {

      $("body").removeClass("js-visibled");

    });

  });

  $win.load(function () {

    meg.init();

    setTimeout(() => {

      $("body").addClass("js-visibled");

      meg.lazyLoad().init();

    }, 500);

  });

  // Usando na função "require" do NODEJS
  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {

    module.exports = Meg;

  }

})($);
