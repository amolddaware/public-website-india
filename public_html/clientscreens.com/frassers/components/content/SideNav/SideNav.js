import $ from "jquery";

function init() {
    //TODO: Slide out function is not working
    if ($('section.cmp-side-nav').length) {
        $(window).on('scroll', hideOnScroll);
        $("body").off("click").on("click", resetToDefault);
        console.log("Register scroll handler for sideNav");
    }
    //Hide dive on body click

    $(".cmp-side-nav__link__left").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetToDefault();
        LeftSlideBoxOpen();
        return false;
    });

    $(".cmp-side-nav__link__right").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetToDefault();
        RightSlideBoxOpen();
        return false;
    });

    $(".cmp-side-nav__left-desc__link").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetToDefault();
        return false;
    });

    $(".cmp-side-nav__right-desc__link").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetToDefault();
        return false;
    });
}

function hideOnBodyClick(side) {
    $("body").off("click");
    $("body").on("click", function(evt) {
        var hiddenBox = $(".hidden-box");
        if (!hiddenBox.is(evt.target) && hiddenBox.has(evt.target).length === 0) {
            hiddenBox.hide();
        }
        resetToDefault();
    });
}

function resetToDefault() {
    $(".hidden-box").hide();
    //slide out the right side container
    if ($(".notification-container-right").hasClass("selected-slide-in-rl")) {
        $(".notification-container-right")
            .removeClass("selected-slide-in-rl")
            .addClass("dismiss-slide-in-rl")
            .hide();
    } else {
        $(".notification-container-right").addClass('dismiss-slide-in-rl');
    }

    //slide out the left side container
    if ($(".notification-container-left").hasClass("selected-slide-in-lr")) {
        $(".cmp-side-nav__link__left").show();
        $(".notification-container-left")
            .removeClass("selected-slide-in-lr")
            .addClass("dismiss-slide-in-lr")
            .hide();
    } else {
        $(".notification-container-left").addClass('dismiss-slide-in-lr');
    }
    $(".cmp-side-nav__link__left").show();
    $(".cmp-side-nav__link__right").show();
}

// Hide previous and next link on scroll
function hideOnScroll() {
    if (!$(".footer__top").length) {
        //do not run this function if the footer component is not present on the page
        return;
    }
    var currPos = $(window).scrollTop();

    var footerPosition = $(".footer__top").offset().top;

    if (footerPosition - currPos < 500) {
        $(".cmp-side-nav__link__left,  .cmp-side-nav__link__right").hide();
    } else {
        $(".cmp-side-nav__link__left,  .cmp-side-nav__link__right").show();
    }

    $(".hidden-box").hide();
}

// Function For slide from right to left
function RightSlideBoxOpen() {
    if ($(".notification-container-right").hasClass("dismiss-slide-in-rl")) {
        $(".cmp-side-nav__link__right").hide();
        $(".notification-container-right")
            .removeClass("dismiss-slide-in-rl")
            .addClass("selected-slide-in-rl")
            .show();
    }
}

// Function for slide from left to right
function LeftSlideBoxOpen() {
    if ($(".notification-container-left").hasClass("dismiss-slide-in-lr")) {
        $(".cmp-side-nav__link__left").hide();
        $(".notification-container-left")
            .removeClass("dismiss-slide-in-lr")
            .addClass("selected-slide-in-lr")
            .show();
    }
}

document.addEventListener("DOMContentLoaded", init);