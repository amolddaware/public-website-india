import * as $ from 'jquery';

function init() {
    //1. scope this to your component
    //2. on global header click of member sign up/sign in, open the login nudge
    //3. Add AJAX call on sign up. Refer https://documenter.getpostman.com/view/16388348/Tzm3nwtc#21dacff5-3233-4484-b1cb-0265799aa56a
    //4. On success, show the alert message

    $("#loginNudge").on('click', function(e) {
        e.preventDefault();
        $(".login-nudge").addClass("active");

    });

    $("#loginclose").on('click', function(e) {
        e.preventDefault();
        $(".login-nudge").removeClass("active");

    });

    $('#viewpass').on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('fh-icon-invisible')) {
            $(this).removeClass('fh-icon-invisible');
            $(this).addClass('fh-icon-visibility');
            $('#loginpass').attr('type', 'text');
        } else {
            $(this).removeClass('fh-icon-visibility');
            $(this).addClass('fh-icon-invisible');
            $('#loginpass').attr('type', 'password');
        }
    });
}
document.addEventListener("DOMContentLoaded", init);