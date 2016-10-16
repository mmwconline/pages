import $ from 'jQuery';
import toastr from 'toastr';

toastr.options.preventDuplicates = true;

export default class FormSpree {

  constructor() {
    this.options = {
      dataType: 'json',
      success: () => {
        // $(form).find('input.form-control').val('');
        // $(form).find('textarea.form-control').val('');
        toastr.success(this.successMessage);
      },
      clearForm: true
    };
    this.$form = $('form.validate');
    this.successMessage = this.$form.attr('data-success') || 'Thanks! Your message has been successfully sent';
  }

  setOptions(newOptions) {
    this.options = newOptions;
  }

  configure() {
    this.$form.validate({
      submitHandler: (form) => {
        $(form).ajaxSubmit(this.options);
      }
    });
  }
}

