(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jQuery2.default)('#subscribeForm').submit(function (e) {
  e.preventDefault();

  var $subscribeButton = (0, _jQuery2.default)('#subscribeButton'),
      $subscribeEmail = (0, _jQuery2.default)('#subscriberEmail');

  //only gets disabled after a successful message sent
  if ($subscribeEmail.is(':disabled')) return false;

  if (isNullOrWhitespaces($subscribeEmail.val())) return false;

  var $this = (0, _jQuery2.default)(this);
  console.log($this.attr('action') + '&c=?');
  _jQuery2.default.ajax({
    type: 'GET',
    url: 'http://mmwconline.us3.list-manage.com/subscribe/post-json?u=63d144864f5fd557a761d89cb&id=792c8836f1&c=?',
    data: $this.serialize(),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    error: function error() {
      return handleError($subscribeButton, $subscribeEmail);
    },
    success: function success(data) {
      if (data.result === "success") {
        $subscribeButton.removeClass('btn-primary').html('Subscribed!').addClass('btn-success');
        disableEmailField($subscribeEmail);
      } else if (data.msg.indexOf("0 - ") > -1) {
        $subscribeEmail.addClass('error');
      } else handleError($subscribeButton, $subscribeEmail);
    }
  });
});

function handleError($subscribeButton, $subscribeEmail) {
  $subscribeButton.removeClass('btn-primary').html('Try Again Later').addClass('btn-danger');
  disableEmailField($subscribeEmail);
}

function disableEmailField($field) {
  $field.val('').attr('disabled', 'disabled');
}
function isNullOrWhitespaces(str) {
  return str == null || str.match(/^ *$/) !== null;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
