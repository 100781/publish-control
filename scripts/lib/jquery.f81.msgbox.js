;( function( $, window, document, undefined ) {

    "use strict";

    /**
     * Plugin name.
     * @type {string}
     */
    var pluginName = "f81msgBox";

    /**
     * Plugin default settings.
     * @type {object}
     */
    var defaults = {
        title: "Message Title",
        message: "This is the default message",
        buttons: [{value: "OK", class: "ok"}],
        success: function (result) {
        },
        beforeShow: function () {
        },
        afterShow: function () {
        },
        beforeClose: function () {
        },
        afterClose: function () {
        },
        opacity: .5,
        modal: false
    };

    /**
     * Plugin constructor.
     * @param options
     * @constructor
     */
    function Plugin ( options ) {

        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.isShown = false;
        this.target = "msgbox" + new Date().getTime();
        this.mask = this.target + "-mask";
        this.firstButtonId = this.target+"FirstButton";
        this.buttons = "";
        var self = this;
        
        // Create message box buttons.
        $(this.settings.buttons).each(function (index, button) {
            var buttonClass = "";
            if (button.classname){
                buttonClass = button.classname;
            }
            self.buttons += "<button data-value=\"" + button.value + "\" class=\"msg-button " + buttonClass +  "\">" + button.prefix + button.value + "</button>";
        });

        this.msgmask = "<div id=\"" + this.mask + "\" class=\"f81-msgbox-mask\"></div>";
        this.msgtitle = "<div class=\"msgbox-title\">" + this.settings.title + "</div>";
        this.msgmessage = "<div class=\"msgbox-message\">" + this.settings.message + "</div>";
        this.msgbuttons ="<div class=\"msgbox-buttons\">" + self.buttons + "</div>";

        $("body").append(this.msgmask + "<div id=\"" + this.target + "\" class=\"f81-msgbox\"><div class=\"messagebox-container\">" + this.msgtitle + this.msgmessage +  this.msgbuttons + "</div></div>");
        this.divbox= $("#"+this.target);
        this.divboxbg = $("#"+this.mask);

        /**
         * Event: message box mask is clicked.
         */
        if(this.settings.modal !== true){
            this.divbox.click(function () {
                self.hide();
            });
        }

        /**
         * Event: message box button is clicked.
         */
        $("button.msg-button").click(function (e) {
            e.preventDefault();
            var value = $(this).attr("data-value");
            self.settings.success(value);
            self.hide();
        });

        this.show();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {
        init: function() {
        },
        show: function(){
            if (this.isShown) {
                return false;
            }
            this.settings.beforeShow();
            var targetObject = this;
            setTimeout(function(){
                targetObject.divboxbg.addClass("active");
                targetObject.divbox.addClass("active");
            },100);
            setTimeout(this.settings.afterShow, 200);
            this.isShown = true;
        },
        hide: function() {
        if (!this.isShown) {
            return false;
        }
        // Execute beforeClose callback.
        this.settings.beforeClose();
            var targetObject = this;
            setTimeout(function(){
                targetObject.divboxbg.removeClass("active");
                targetObject.divbox.removeClass("active");
            },100);
            var instance = this;
        // Close message box, execute afterClose callback.
        setTimeout(function () { instance.divbox.remove(); instance.divboxbg.remove(); }, 300);
        setTimeout(instance.settings.afterClose, 300);
        this.isShown = false;
    }
    });

    $[ pluginName ] = function ( options ) {
        return new Plugin( options );
    };

} )( jQuery, window, document );
