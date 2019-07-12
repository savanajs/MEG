Prism.highlightAll();

(function ($) {

  const Code = {
    "selector": ".dinamic",
    "definedCode": function (code) {

      if (!code) {

        return;

      }

      code = code.replace(/</g, "&lt;");
      code = code.replace(/>/g, "&gt");

      const lines = code.split("\n");
      const line = lines[1];
      let leadingSpaces = 1;

      while (line.charAt(leadingSpaces) == " ") {

        leadingSpaces++;

      }

      for (let i = 1, len = lines.length; i < len; i++) {

        lines[i] = lines[i].slice(leadingSpaces);

      }

      lines.splice(0, 1);

      return code = lines.join("\n");

    },
    "getCodePreviews": function () {

      const _this = this;
      let target;

      $(this.selector).each(function () {

        target = $(this).parents(".l-section__main").find(".code pre code");
        target.html(_this.definedCode($(this).html()));

      });

    },
    "init": function () {

      this.getCodePreviews();

    }
  };

  const Tpl = {
    "data": {
      "dark": "dark.min.css",
      "light": "meg.min.css",
    },
    "link": function (file) {

      if (!file) {

        return;

      }

      const date = new Date();

      $("head > link[rel=stylesheet]").attr("href", file + "?v=" + date.getTime());

      return true;

    },
    "events": function () {

      const self = this;

      $("#switch-tpl").on("change", function () {

        if ($(this).is(":checked")) {

          self.link(self.data.light);

        } else {

          self.link(self.data.dark);

        }

      });

      return true;

    },
    "init": function () {

      this.events();

      return true;

    }
  };

  Code.init();
  Tpl.init();

})($);
