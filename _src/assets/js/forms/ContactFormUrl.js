import $ from 'jQuery';

export default class ContactFormUrl {

  constructor(selectInputId) {
    this.selectInputId = selectInputId;
  }

  isValidSelection() {
    return !ContactFormUrl.isNullOrWhitespaces(this.getEmail());
  }
  getEmail() {
    return $(`#${this.selectInputId}`).find(':selected').data('email');
  }
  getUrl() {
    if (!this.isValidSelection())
      throw 'No valid department selected';
    return `https://formspree.io/${this.getEmail()}`;
  }

  static isNullOrWhitespaces(str) {
    return str == null || str.match(/^ *$/) !== null;
  }
}