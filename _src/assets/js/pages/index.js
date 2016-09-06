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
          console.log('found big image');
          _bigImageNo 	= Number(_bigImageNo) - 1;
          _container.find('a:eq('+_bigImageNo+')').css({ width: _firstElemWidth*2 + 'px'});

          setTimeout( function() {
            console.log('time is up. running isotope...');
            _container.isotope({
              masonry: {
                columnWidth: _firstElemWidth
              }
            });
            _container.isotope('layout');
          }, 500);
        }
      });
    }
  }
  function _lightbox() {
    var _el = jQuery(".lightbox");

    if(_el.length > 0) {
      if(typeof(jQuery.magnificPopup) == "undefined") {
        console.log('magnificPopup undefined');
        return false;
      }

      jQuery.extend(true, jQuery.magnificPopup.defaults, {
        tClose: 		'Close',
        tLoading: 		'Loading...',

        gallery: {
          tPrev: 		'Previous',
          tNext: 		'Next',
          tCounter: 	'%curr% / %total%'
        },

        image: 	{
          tError: 	'Image not loaded!'
        },

        ajax: 	{
          tError: 	'Content not loaded!'
        }
      });

      _el.each(function() {

        var _t 			= jQuery(this),
          options 	= _t.attr('data-plugin-options'),
          config		= {},
          defaults 	= {
            type: 				'image',
            fixedContentPos: 	false,
            fixedBgPos: 		false,
            mainClass: 			'mfp-no-margins mfp-with-zoom',
            closeOnContentClick: true,
            closeOnBgClick: 	true,
            image: {
              verticalFit: 	true
            },

            zoom: {
              enabled: 		false,
              duration: 		300
            },

            gallery: {
              enabled: false,
              navigateByImgClick: true,
              preload: 			[0,1],
              arrowMarkup: 		'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
              tPrev: 				'Previous',
              tNext: 				'Next',
              tCounter: 			'<span class="mfp-counter">%curr% / %total%</span>'
            }
          };

        if(_t.data("plugin-options")) {
          config = jQuery.extend({}, defaults, options, _t.data("plugin-options"));
        }

        jQuery(this).magnificPopup(config);

      });
    }
  }
  $(document).ready(function() {
    $('.masonry-gallery').imagesLoaded()
      .always(function() {
        _masonryGallery();
      });
    _lightbox();
  });
})(jQuery);