/* eslint-disable */
function _toastr(_message,_position,_notifyType,_onclick) {
	var _btn 	= jQuery(".toastr-notify");
	if(_btn.length > 0) {

	}

}

// toastr.clear();
var _btn 	= jQuery(".toastr-notify");
/** BUTTON CLICK
 ********************* **/
_btn.bind("click", function(e) {
	e.preventDefault();

	var _message 			= jQuery(this).attr('data-message'),
		_notifyType 		= jQuery(this).attr('data-notifyType')			|| "default",
		_position	 		= jQuery(this).attr('data-position')			|| "top-right",
		_progressBar 		= jQuery(this).attr('data-progressBar') == "true",
		_closeButton		= jQuery(this).attr('data-closeButton') == "true",
		_debug		 		= jQuery(this).attr('data-debug') == "true",
		_newestOnTop 		= jQuery(this).attr('data-newestOnTop') == "true",
		_preventDuplicates	= jQuery(this).attr('data-preventDuplicates') == "true",
		_showDuration 		= jQuery(this).attr('data-showDuration') 		|| "300",
		_hideDuration 		= jQuery(this).attr('data-hideDuration') 		|| "1000",
		_timeOut 			= jQuery(this).attr('data-timeOut') 			|| "5000",
		_extendedTimeOut	= jQuery(this).attr('data-extendedTimeOut')		|| "1000",
		_showEasing 		= jQuery(this).attr('data-showEasing') 			|| "swing",
		_hideEasing 		= jQuery(this).attr('data-hideEasing') 			|| "linear",
		_showMethod 		= jQuery(this).attr('data-showMethod') 			|| "fadeIn",
		_hideMethod 		= jQuery(this).attr('data-hideMethod') 			|| "fadeOut";

	toastr.options = {
		"closeButton": 			_closeButton,
		"debug": 				_debug,
		"newestOnTop": 			_newestOnTop,
		"progressBar": 			_progressBar,
		"positionClass": 		"toast-" + _position,
		"preventDuplicates": 	_preventDuplicates,
		"onclick": 				null,
		"showDuration": 		_showDuration,
		"hideDuration": 		_hideDuration,
		"timeOut": 				_timeOut,
		"extendedTimeOut": 		_extendedTimeOut,
		"showEasing": 			_showEasing,
		"hideEasing": 			_hideEasing,
		"showMethod": 			_showMethod,
		"hideMethod": 			_hideMethod
	};

	toastr[_notifyType](_message);
});