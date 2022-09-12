import $ from "jquery";
import Swiper from "swiper/bundle";

function init() {

    if ($(".capribrand_feature").length > 0) {
        var count = 0;

        $(".capribrand_feature .swiper-button-prev").hide();
        $(".capribrand_feature .swiper-button-next").on("click", function() {
            document.querySelector(".capribrand_feature_container_left").style.display =
                "none";
            document.querySelector(".capribrand_feature_container_right").style.width =
                "100%";
            count++;

            $(".capribrand_feature .swiper-button-prev").show();
        });
        $(".capribrand_feature .swiper-button-prev").on("click", function() {
            count--;
            if (count == 0) {
                document.querySelector(
                    ".capribrand_feature_container_right"
                ).style.width = "50%";
                document.querySelector(
                    ".capribrand_feature_container_left"
                ).style.display = "block";
                $(".capribrand_feature .swiper-button-prev").hide();
            }
        });

        var swiper = new Swiper(".swiper-capribrand", {
            slidesPerView: 1.6,

            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });

    }

}
document.addEventListener("DOMContentLoaded", init);