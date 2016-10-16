(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContactFormUrl = function () {
  function ContactFormUrl(selectInputId) {
    _classCallCheck(this, ContactFormUrl);

    this.selectInputId = selectInputId;
  }

  _createClass(ContactFormUrl, [{
    key: 'isValidSelection',
    value: function isValidSelection() {
      return !ContactFormUrl.isNullOrWhitespaces(this.getEmail());
    }
  }, {
    key: 'getEmail',
    value: function getEmail() {
      return (0, _jQuery2.default)('#' + this.selectInputId).find(':selected').data('email');
    }
  }, {
    key: 'getUrl',
    value: function getUrl() {
      if (!this.isValidSelection()) throw 'No valid department selected';
      return 'https://formspree.io/' + this.getEmail();
    }
  }], [{
    key: 'isNullOrWhitespaces',
    value: function isNullOrWhitespaces(str) {
      return str == null || str.match(/^ *$/) !== null;
    }
  }]);

  return ContactFormUrl;
}();

exports.default = ContactFormUrl;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _toastr = (typeof window !== "undefined" ? window['toastr'] : typeof global !== "undefined" ? global['toastr'] : null);

var _toastr2 = _interopRequireDefault(_toastr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_toastr2.default.options.preventDuplicates = true;

var FormSpree = function () {
  function FormSpree() {
    var _this = this;

    _classCallCheck(this, FormSpree);

    this.options = {
      dataType: 'json',
      success: function success() {
        _this.$preloader.addClass('hide');
        _toastr2.default.success(_this.successMessage);
      },
      error: function error() {
        _this.$preloader.addClass('hide');
        _toastr2.default.error(_this.errorMessage);
      },
      clearForm: true
    };
    this.$form = (0, _jQuery2.default)('form.validate');
    this.$preloader = this.$form.find('#preloader');

    this.successMessage = this.$form.attr('data-success') || 'Thanks! Your message has been successfully sent';
    this.errorMessage = this.$form.attr('data-error') || 'There was an error. Please try again later';
  }

  _createClass(FormSpree, [{
    key: 'setOptions',
    value: function setOptions(newOptions) {
      this.options = newOptions;
    }
  }, {
    key: 'configure',
    value: function configure() {
      var _this2 = this;

      this.$form.validate({
        submitHandler: function submitHandler(form) {
          _this2.$preloader.removeClass('hide');
          (0, _jQuery2.default)(form).ajaxSubmit(_this2.options);
        }
      });
    }
  }]);

  return FormSpree;
}();

exports.default = FormSpree;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var _FormSpree = require('../forms/FormSpree.js');

var _FormSpree2 = _interopRequireDefault(_FormSpree);

var _ContactFormUrl = require('../forms/ContactFormUrl.js');

var _ContactFormUrl2 = _interopRequireDefault(_ContactFormUrl);

var _jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formSpree = new _FormSpree2.default();
var contactFormUrl = new _ContactFormUrl2.default('contactDept');
var options = formSpree.options;

options.beforeSerialize = function ($form, options) {
  if (!contactFormUrl.isValidSelection()) return false;

  options.url = contactFormUrl.getUrl();
  console.log(options);
  return true;
};
formSpree.setOptions(options);
formSpree.configure();

(0, _jQuery2.default)('#formSubmit').click(function (e) {
  if (!formSpree.$form.valid()) e.preventDefault();
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../forms/ContactFormUrl.js":1,"../forms/FormSpree.js":2}]},{},[3]);
