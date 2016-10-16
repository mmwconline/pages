/* eslint-disable */
function _form() {

  /** Form Validate
   ************************ **/
  var $formValidate = jQuery('form.validate');
  if($formValidate.length > 0) {
    if(jQuery().validate) {
      $formValidate.each(function() {

        var _t 			= jQuery(this),
          _Smessage 	= _t.attr('data-success') 			|| "Successfully! Thank you!",
          _Cmessage 	= _t.attr('data-captcha') 			|| "Invalid Captcha!",
          _Tposition 	= _t.attr('data-toastr-position') 	|| "top-right",
          _Ttype	 	= _t.attr('data-toastr-type') 		|| "success";
        _Turl	 	= _t.attr('data-toastr-url') 		|| false;

        // Append 'is_ajax' hidden input field!
        _t.append('<input type="hidden" name="is_ajax" value="true" />');

        _t.validate({
          submitHandler: function(form) {

            // Show spin icon
            jQuery(form).find('.input-group-addon').find('.fa-envelope').removeClass('fa-envelope').addClass('fa-refresh fa-spin');

            jQuery(form).ajaxSubmit({

              target: 	jQuery(form).find('.validate-result').length > 0 ? jQuery(form).find('.validate-result') : '',

              error: 		function(data) {
                _toastr("Sent Failed!",_Tposition,"error",false);
              },

              success: 	function(data) {
                data = data.trim();

                // CAPTCHA ERROR
                if(data == '_captcha_') {
                  _toastr("Invalid Captcha!",_Tposition,"error",false);


                  // SUCCESS
                } else {

                  // Remove spin icon
                  jQuery(form).find('.input-group-addon').find('.fa-refresh').removeClass('fa-refresh fa-spin').addClass('fa-envelope');

                  // Clear the form
                  jQuery(form).find('input.form-control').val('');

                  // Toastr Message
                  _toastr(_Smessage,_Tposition,_Ttype,_Turl);

                }
              }
            });

          }
        });

      });
    }
    else {
      alert('NOT VALID!');
    }
  }
}