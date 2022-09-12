import $ from "jquery";

function init() {
    $(window).scroll(function() {
        var sticky = $(".primary-nav"),
            scroll = $(window).scrollTop();

        if (scroll == 44) {
            //adding this line for AEM, no idea why AEM will get 44 on page load
            window.scrollTo({ top: 0 });
        } else if (scroll >= 40) {
            sticky.addClass("fixed_nav");
        } else {
            sticky.removeClass("fixed_nav");
        }
        // return scrollFunction();
    });

    if ($('nav.primary-nav').length && !$('section.hero-image-carousel').length && !$('.js-banner-check').length) {
        $('nav.primary-nav').addClass('dark');
    }

    $('#hamsBurger').click(function(e) {

        let primary = $('.primary-nav');
        primary.removeClass('primary-nav');
        primary.addClass('primary-navs');
        $("#overlay").css({ 'display': 'block' });
        $(".humburger").css({ 'display': 'block' })
        document.documentElement.style.overflow = 'hidden';
        document.body.scroll = "no";


    });
    $('.cancelHumburger').click(function(e) {
        let primary = $('#primary-nav');
        primary.removeClass('primary-navs');
        primary.addClass('primary-nav');
        $("#overlay").css({ 'display': 'none' });
        $(".humburger").css({ 'display': 'none' })
        document.documentElement.style.overflow = 'scroll';
        document.body.scroll = "yes";
    });

    $('.humburger-wrapper__head').unbind();
    $('.humburger-wrapper__head').click(function() {
        $(this).next().slideToggle(500);
        $(this).toggleClass('active');
    });


    $('.main-menu').unbind();
    $('.main-menu').click(function() {
        $(this).next().slideToggle(500);
        $(this).toggleClass('active');

        if ($(this).hasClass('active')) {
            $(this).css("padding-bottom", "0px");
            $(this).css("border-bottom", "none");
            $(this).next().children().last().css("border-bottom", "1px solid rgba(134, 109, 75, 0.6)");
            $(this).next().children().last().css("padding-bottom", "10px");
        } else {
            $(this).css("border-bottom", "1px solid rgba(134, 109, 75, 0.6)");
            $(this).css("padding-bottom", "10px");
        }
    });


    $(function() {

        var lastScrollTop = 0,
            delta = 5;
        $(window).scroll(function() {
            var nowScrollTop = $(this).scrollTop();
            if (Math.abs(lastScrollTop - nowScrollTop) >= delta) {
                var navbar = document.getElementById("primary-nav");
                if (!navbar) return;
                if (nowScrollTop > lastScrollTop) {
                    $(".global-header").css({
                        'position': 'relative'
                    });
                    navbar.classList.remove("fixed_nav_with_global");
                } else {
                    if ($('window').width() > 768) {
                        navbar.classList.add("fixed_nav_with_global");
                        $(".global-header").css({
                            'position': 'fixed',
                            'top': 0,
                            'left': 0,
                            'right': 0,
                            'z-index': 49
                        });
                    }
                }
                lastScrollTop = nowScrollTop;
            }
        });

    });
}

document.addEventListener("DOMContentLoaded", init);