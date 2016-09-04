(function($) {
  function _masonryGallery() {
    var $masonryGallery = jQuery(".masonry-gallery");
    if($masonryGallery.length > 0) {

      $masonryGallery.each(function() {
        var _container = jQuery(this),
          columns		= 4;

        if(_container.hasClass('columns-2')) 	columns = 2;
        else if(_container.hasClass('columns-3')) 	columns = 3;
        else if(_container.hasClass('columns-4')) 	columns = 4;
        else if(_container.hasClass('columns-5')) 	columns = 5;
        else if(_container.hasClass('columns-6')) 	columns = 6;

        var _firstElemWidth 	= _container.find('a:eq(0)').outerWidth(),
          _bigImageNo 		= _container.attr('data-img-big'),
          _containerWidth		= _container.width();


        // Fix margins & Width
        var postWidth = (_containerWidth/columns);
        postWidth = Math.floor(postWidth);
        if((postWidth * columns) >= _containerWidth) {
          _container.css({ 'margin-right': '-1px' });
        }
        if(columns < 6) {
          _container.children('a').css({"width":postWidth+"px"});
        }


        // Set Big Image
        if(parseInt(_bigImageNo) > 0) {

          _bigImageNo 	= Number(_bigImageNo) - 1;
          _container.find('a:eq('+_bigImageNo+')').css({ width: _firstElemWidth*2 + 'px'});

          setTimeout( function() {
            _container.isotope({
              masonry: {
                columnWidth: _firstElemWidth
              }
            });
            _container.isotope('layout');
          }, 1000);
        }
      });
    }
  }
  $(document).ready(function() {
    _masonryGallery();
  });
})(jQuery);