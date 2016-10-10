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
	var $expandedNode = $('.shouldExpandTreeForThisNode');
	var $postList = $('#' + $expandedNode.data('postListId'));
	var $monthList = $('#' + $expandedNode.data('monthListId'));

	$postList.addClass('in');
	var $monthSpan = $postList.parent().children('a').find('span:first-child');
	$monthSpan.removeClass('collapsed');
	$monthSpan.find('i').addClass('in');

	$monthList.addClass('in');
	var $yearSpan = $monthList.parent().children('a').find('span:first-child');
	$yearSpan.removeClass('collapsed');
	$yearSpan.find('i').addClass('in');
})(jQuery);

