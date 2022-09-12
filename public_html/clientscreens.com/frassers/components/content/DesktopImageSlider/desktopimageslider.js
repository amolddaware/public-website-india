import $ from 'jquery';
import Swiper from "swiper";  
// import Swiper styles
import 'swiper/swiper-bundle.css';

export default class ImageSlider {
  constructor() {
   let autoPlayDelay = 4000;
  let options = {
    init: true,
    // Optional parameters
    slidesPerView: 'auto',
    spaceBetween: 110,
    centeredSlides: true,
    autoplay: {
      delay: autoPlayDelay,
    },
    disableOnInteraction: false,
  };
  
  let iSwiper = new Swiper ('.banner-swiper-container', options);
    let slidersCount = iSwiper.params.loop ? iSwiper.slides.length - 2 : iSwiper.slides.length;
    let widthParts = 100 / slidersCount;
    $('.swiper-counter .total').html(slidersCount);
    for(let i=0; i<slidersCount; i++){
      $('.swiper-progress-bar .progress-sections').append('<span></span>');
    }
    function initProgressBar(){
      let calcProgress = (slidersCount-1) * (autoPlayDelay + iSwiper.params.speed);
      calcProgress += autoPlayDelay;
      $('.swiper-progress-bar .progress').animate({
        width: '100%'
      }, calcProgress, 'linear');
    }
  
    initProgressBar();
    iSwiper.on('slideChange', function () {
      let progress = $('.swiper-progress-bar .progress');
      $('.swiper-counter .current').html(this.activeIndex + 1);
      if( ( this.progress == -0 || (this.progress == 1 && this.params.loop) ) && !progress.parent().is('.stopped')){
        progress.css('width', '0');
        if(this.activeIndex == 0){
          initProgressBar();
        }
      }
  
      if(progress.parent().is('.stopped')){		   
        progress.animate({
          'width': Math.round(widthParts * (this.activeIndex + 1)) + '%'
        }, this.params.speed, 'linear');
      }
    });
  
    iSwiper.on('touchMove', function () {
      $('.swiper-progress-bar .progress').stop().parent().addClass('stopped');
    });
 }
}

document.addEventListener("DOMContentLoaded", function() {
  new ImageSlider();
});
