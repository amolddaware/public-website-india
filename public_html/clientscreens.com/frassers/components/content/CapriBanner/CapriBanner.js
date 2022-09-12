function init() {


    if ($('.capri-banner').length) {
        let imgSlideIndex = 0,
            slideIndex = 0;
        let slideInterval = $('.capri-banner').data('slideInterval');
        textSliders();
        imgSlides();

        function imgSlides() {
            let i;
            var imgslides = document.getElementsByClassName("imgSlides");

            for (i = 0; i < imgslides.length; i++) {
                imgslides[i].style.display = "none";
            }
            imgSlideIndex++;
            if (imgSlideIndex > imgslides.length) { imgSlideIndex = 1 }

            imgslides[imgSlideIndex - 1].style.display = "block";

            setTimeout(imgSlides, slideInterval);
        }

        function textSliders() {
            let i;
            var slides = document.getElementsByClassName("text-image-slider");
            var dots = document.getElementsByClassName("dot");
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slideIndex++;
            if (slideIndex > slides.length) { slideIndex = 1 }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[slideIndex - 1].style.display = "block";
            dots[slideIndex - 1].className += " active";
            setTimeout(textSliders, slideInterval);


        }
    }
}
document.addEventListener("DOMContentLoaded", init);
