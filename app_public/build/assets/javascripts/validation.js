$('#addReview').submit(function (e) {
  $('.alert.alert-default').hide();
  if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
    if ($('.alert.alert-default').length) {
      $('.alert.alert-default').show();
    } else {
      $(this).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
	}
    return false;
  }
});


  $('.alert.alert-default').show();