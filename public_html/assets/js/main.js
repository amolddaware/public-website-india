(function ($) {
"use strict";


$('.main-menu nav > ul > li').slice(-2).addClass('last-elements');

/* meanmenu */
$('.main-menu nav').meanmenu({
	 meanMenuContainer: '.mobile-menu-area',
	 meanScreenWidth: "767"
});
 
/* slider-active  */
$('.slider-active').owlCarousel({
    loop:true,
    nav:true,
	navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
    responsive:{
        0:{
            items:1,
			nav:false,
        },
        767:{
            items:1,
			nav:false,
        },
        1000:{
            items:1
        }
    },
    onChange: owlCarouselInit
})

function owlCarouselInit(e){
    console.log(this._items.length);
    var carousel_items = this._items.length;
    if (carousel_items <= 1) {
        console.log(this);
        this.settings.loop = false;
        this.options.loop = false;
        this.settings.mouseDrag = false;
        this.options.mouseDrag = false;
        this.settings.touchDrag = false;
        this.options.touchDrag = false;
        this.settings.pullDrag = false;
        this.options.pullDrag = false;
        this.settings.freeDrag = false;
        this.options.freeDrag = false;
        $(this).trigger('initialize.owl.carousel');
    }
}

/* counter */
$('.counter').counterUp(900);

/* mixItUp */
$('#Container').mixItUp();

/* image-link */
$('.image-link').magnificPopup({
  type: 'image',
  gallery:{
    enabled:true
  }
});

/* inline-popup */
$('.inline-popup').magnificPopup({
    type: 'inline',
  });
  
  $('.inline-popup').on("click", function(){
      console.log($(".mfp-content"));
      $(".mfp-content").find(".popup-content").attr("style", "display:block");
  });

/* video-popup */
$('.video-popup').magnificPopup({
  type: 'iframe'
});

/* testimonial-active */
$('.testimonial-active').owlCarousel({
    loop:true,
    nav:false,
	autoplay:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
})


/* brand-active */
$('.brand-active').owlCarousel({
    loop:true,
    nav:false,
	dots:false,
    autoplay:true,
    autoplayTimeout:1000,
    autoplayHoverPause:true,
	navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
    responsive:{
        0:{
            items:2
        },
        45:{
            items:3
        },
        768:{
            items:4
        },
        1000:{
            items:6
        }
    }
})

$(".service-text p .read-more").on("click", function(){
    if($(this).text() === "Read more") {
        $(this).parent().find(".hidden").attr("class","visible");
        $(this).text("Show less");
    } else {
        $(this).parent().find(".visible").attr("class","hidden");
        $(this).text("Read more");
    }
});

if ( $(".bg-opacity").length ) {
    if ( window.screen.width <= 768 && window.screen.width > 500 ) {
        $(".bg-opacity").height("60vh");
    } else if ( window.screen.width <= 500 ) {
        $(".bg-opacity").height($(".bg-opacity").find(".banner-image").find("img").height());
    }
}

})(jQuery);	