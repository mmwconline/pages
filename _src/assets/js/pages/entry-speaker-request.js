import $ from 'jQuery';
import FormSpree from '../forms/FormSpree.js';

$('#eventStartDateTime').datetimepicker({
  ignoreReadonly: true,
  stepping: 30
});

const formSpree = new FormSpree();
formSpree.configure();
$('#formSubmit').click((e) => {
  if (!formSpree.$form.valid())
    e.preventDefault();
});
