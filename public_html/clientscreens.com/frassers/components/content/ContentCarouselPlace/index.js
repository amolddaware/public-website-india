import $ from "jquery";
import Swiper from "swiper/bundle";
// import Swiper styles
import "swiper/swiper-bundle.css";

export default class ContentCarouselPlaceDetail {
    constructor() {
        $(".place__readtext").click(function(e) {
            e.preventDefault();
            $(this).hide();
            $(this).prev(".place__hide").slideDown();
        });

        var swiperplace = new Swiper(".placeswiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            slidesPerGroup: 1,
            effect: 'slide',
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    slidesPerGroup: 1,
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                    slidesPerGroup: 2,
                },
            },
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    new ContentCarouselPlaceDetail();
});