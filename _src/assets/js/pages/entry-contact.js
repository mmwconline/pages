import FormSpree from '../forms/FormSpree.js';
import ContactFormUrl from '../forms/ContactFormUrl.js';
import $ from 'jQuery';

const formSpree = new FormSpree();
const contactFormUrl = new ContactFormUrl('contactDept');
const options = formSpree.options;

options.beforeSerialize = ($form, options) => {
  if (!contactFormUrl.isValidSelection())
    return false;

  options.url = contactFormUrl.getUrl();
  console.log(options);
  return true;
};
formSpree.setOptions(options);
formSpree.configure();

$('#formSubmit').click((e) => {
  if (!formSpree.$form.valid())
    e.preventDefault();
});
