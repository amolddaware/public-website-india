import Swiper from "swiper/bundle";

export default class ContentCaruselGrid {
  constructor() {
  
   
    var swiper = new Swiper(".swiper-content-carousel-grid-view",{
        slidesPerView:1,
        loop:true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          breakpoints: {
            640:{
              slidesPerView:1,
            },
            // 768: {
            //   slidesPerView: 1,
            //   spaceBetween: 30,
            // }
         
          }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new ContentCaruselGrid();
});
