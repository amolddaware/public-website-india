import * as $ from 'jquery';


function init() {
    if (!$('.breadcrumb').length) return;

    if (!$('.hero-image-carousel').length) {
        $('.cmp-breadcrumb').addClass('top-padded');
    }
}

document.addEventListener("DOMContentLoaded", init);