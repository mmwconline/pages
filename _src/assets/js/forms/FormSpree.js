import $ from 'jQuery';
import toastr from 'toastr';

toastr.options.preventDuplicates = true;

export default class FormSpree {

  constructor() {
    this.options = {
      dataType: 'json',
      success: () => {
        this.$preloader.addClass('hide');
        toastr.success(this.successMessage)
      },
      error: () => {
        this.$preloader.addClass('hide');
        toastr.error(this.errorMessage)
      },
      clearForm: true
    };
    this.$form = $('form.validate');
    this.$preloader = this.$form.find('#preloader');

    this.successMessage = this.$form.attr('data-success') || 'Thanks! Your message has been successfully sent';
    this.errorMessage = this.$form.attr('data-error') || 'There was an error. Please try again later';
  }

  setOptions(newOptions) {
    this.options = newOptions;
  }

  configure() {
    this.$form.validate({
      submitHandler: (form) => {
        this.$preloader.removeClass('hide');
        $(form).ajaxSubmit(this.options);
      }
    });
  }
}

