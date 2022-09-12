function init() {

    if ($('.modena-brand-feature-container').length) {
        let slideInterval = $('.modena-brand-feature-container').data('slideInterval');
        let modenaSlideIndex = 0;
        let modenaBottomSlideIndex = 0;
        showSlides();
        showImageSlides();

        function showSlides() {
            let i;
            let slides = document.getElementsByClassName("mbf-slide");

            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            modenaSlideIndex++;
            if (modenaSlideIndex > slides.length) { modenaSlideIndex = 1 }

            slides[modenaSlideIndex - 1].style.display = "block";

            setTimeout(showSlides, slideInterval);
        }

        function showImageSlides() {
            let i;
            let slides = $('.modena-brand-feature-container .image-slider > img');

            $('.modena-brand-feature-container .image-slider > img').hide();

            modenaBottomSlideIndex++;
            if (modenaBottomSlideIndex > slides.length) { modenaBottomSlideIndex = 1 }

            slides[modenaBottomSlideIndex - 1].style.display = "block";

            setTimeout(showImageSlides, slideInterval);
        }
    }
}


document.addEventListener("DOMContentLoaded", init);