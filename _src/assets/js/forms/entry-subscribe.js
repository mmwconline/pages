import $ from 'jQuery';

$('.subscribeForm').submit(function(e) {
  e.preventDefault();

  let $subscribeButton = $(this).find('.subscribeButton'),
      $subscribeEmail = $(this).find('.subscriberEmail');

  //only gets disabled after a successful message sent
  if ($subscribeEmail.is(':disabled'))
    return false;

  if (isNullOrWhitespaces($subscribeEmail.val()))
    return false;

  let $this = $(this);
  console.log(`${$this.attr('action')}&c=?`);
  $.ajax({
    type: 'GET',
    url: `http://mmwconline.us3.list-manage.com/subscribe/post-json?u=63d144864f5fd557a761d89cb&id=792c8836f1&c=?`,
    data: $this.serialize(),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    error: () => handleError($subscribeButton, $subscribeEmail),
    success: (data) => {
      if (data.result === "success") {
        $subscribeButton.removeClass('btn-red').removeClass('btn-primary').html('Subscribed!').addClass('btn-success');
        disableEmailField($subscribeEmail);
      }
      else if (data.msg.indexOf("0 - ") > -1) {
        $subscribeEmail.addClass('error');
      }
      else
        handleError($subscribeButton, $subscribeEmail);

    }
  });

});

function handleError($subscribeButton, $subscribeEmail) {
  $subscribeButton.removeClass('btn-primary').removeClass('btn-red').html('Try Again Later').addClass('btn-danger');
  disableEmailField($subscribeEmail);
}

function disableEmailField($field) {
  $field.val('').attr('disabled', 'disabled');
}
function isNullOrWhitespaces(str) {
  return str == null || str.match(/^ *$/) !== null;
}