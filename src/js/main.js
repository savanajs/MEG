import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/themes/prism-okaidia.css";

Prism.highlightAll();

(function ($) {

  var Code = {
    "selector": ".dinamic",
    "definedCode": function (code) {

        if (!code) {

            return;

        }

        code = code.replace(/</g, "&lt;");
        code = code.replace(/>/g, "&gt");

        var lines = code.split("\n");
        var line = lines[1];
        var leadingSpaces = 1;

        while (line.charAt(leadingSpaces) == " ") {

            leadingSpaces++;

        }

        for (var i = 1, len = lines.length; i < len; i++) {

            lines[i] = lines[i].slice(leadingSpaces);

        }

        lines.splice(0, 1);

        return code = lines.join("\n");

    },
    "getCodePreviews": function () {

        var _this = this;
        var target;

        $(this.selector).each(function () {

            target = $(this).parents(".meg-lt-section__main").find(".code pre code");
            target.html(_this.definedCode($(this).html()));

        });

    },
    "init": function () {

        this.getCodePreviews();

    }
  };

  Code.init();

})($);