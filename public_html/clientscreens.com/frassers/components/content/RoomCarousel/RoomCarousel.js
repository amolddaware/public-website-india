import $ from "jquery";
import Swiper from "swiper/bundle";
// import Swiper styles
import 'swiper/swiper-bundle.css';
export default class RoomCarousel {
    constructor() {

        const roomTypeContainers = $(".cmp-room-type");

        roomTypeContainers.each(function(idx, element) {
            if ($(element).hasClass('cmp-room-carousel')) {
                $(element).find('.swiper-container').addClass('room-carousel-swiper');
            } else {
                $(element).find('.swiper-container').addClass('template-container');
            }
        });

        if ($(".cmp-room-type.cmp-room-carousel").length > 0) {
            var swiper = new Swiper(".room-carousel-swiper", {
                spaceBetween: 10,
                slidesPerView: 3.2,
                freeMode: false,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                breakpoints: {
                    320: {
                        slidesPerView: 1.1,
                    },
                    768: {
                        slidesPerView: 3.2,
                    }
                }
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    new RoomCarousel();
});