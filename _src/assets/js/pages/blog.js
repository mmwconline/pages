(function($) {
	$(document).ready(function() {
		var $blogArrow = $('.blog-archive-item-arrow');
		$blogArrow.on('hide.bs.collapse', function() {
			$(this).parent().addClass('collapsed');
		});

		$blogArrow.on('show.bs.collapse', function() {
			$(this).parent().removeClass('collapsed');
		});
	});
})(jQuery);
