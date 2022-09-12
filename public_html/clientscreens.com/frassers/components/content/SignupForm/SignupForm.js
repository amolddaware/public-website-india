import * as $ from 'jquery';

function init() {
    $('.sign-bg .error').hide();

    $('#signup-form').on('submit', function(e) {
        e.preventDefault();
        //getting the values
        var firstName = $('#firstname').val();
        var lastName = $('#lastname').val();
        var salutationVal = $('#salutation').val();

        var dob = $('#dob').val();
        var residencyVal = $('#residency').val();
        var sourceVal = $('#source').val();
        var emailVal = $('#email').val();
        var password = $('#passwordd').val();
        var confirmPass = $('#confirmpass').val();

        //starting validation
       $('.sign-bg .error').hide();

        let validationErrors = false;

        // Validate salutation
        if (salutationVal == "") {
            $('.salutation-error').show();
            validationErrors = true;
        }

        // Validate name
        if (firstName == "") {
            $('.firstname-empty-error').show();
            validationErrors = true;
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(firstName) === false) {
                $('.firstname-empty-error').hide();
                $('.firstname-validation-error').show();
                validationErrors = true;
            }
        }

        //validate lastname
        if (lastName == "") {
            $('.lastname-empty-error').show();
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(lastName) === false) {
                $('.lastname-empty-error').hide();
                $('.lastname-validation-error').show();
                validationErrors = true;
            } 
        }

        // Validate DOB
        if (dob == "") {
            $('.dob-error').show();
            validationErrors = true;
        } 

        // Validate residency
        if (residencyVal == "") {
            $('.residency-error').show();
            validationErrors = true;
        }

        // Validate source
        if (sourceVal == "") {
            $('.source-error').show();
            validationErrors = true;
        } 

        // Validate email address
        if (emailVal == "") {
            $('.email-empty-error').show();
            validationErrors = true;
        } else {
            // Regular expression for basic email validation
            var regex = /^\S+@\S+\.\S+$/;
            if (regex.test(emailVal) === false) {
                $('.email-empty-error').hide();
                $('.email-validation-error').show();
                validationErrors = true;
            } 
        }

        // Validate Password field
        if (password == "") {
            $('.password-empty-error').show();
            validationErrors = true;
        } else {
            var passregex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

            if (passregex.test(password) === false) {
                $('.password-empty-error').hide();
                $('.password-validation-error').show();
                validationErrors = true;
            } 
        }

        // Validate confirmPassword field
        if (confirmPass == "") {
            $('.confirmpass-empty-error').show();
            validationErrors = true;
        } else {

            if (password != confirmPass) {
                $('.confirmpass-empty-error').hide();
                $('.confirmpass-validation-error').show();
                validationErrors = true;
            }
        }

        if (!$('#terms').prop('checked')) {
            $('.terms-checked-error').show();
            validationErrors = true;
        }

        if (validationErrors) {            
            return;
        } else {
            $('#sign-up-btn').prop('disabled', true);
        }

        //send data to API
        $.ajax({
            'url': 'https://109859-fraserpoc.adobeioruntime.net/api/v1/web/fraserpoc-0.0.1/member-signup',
            'data': {
                "firstName" : firstName,
                "lastName" : lastName,
                "email" : emailVal,
                "loginId" : emailVal,
                "password" : password
            },
            'datatype' : 'json',

            'success' : function(response) {
                if(response.success) {
                    $(".signup_info").hide();
                    $(".confirmation-view").show();
                    $('.progress-tracker li:nth-child(2)').addClass('active');
                    $(".confirmation-view .member-profile-id").text(response.data.profile.member_id);
                }
            }
        })
    });

    if ($('.sign-bg').length) {
        $('.sign-bg #viewicon').on('click', function(e) {
            e.preventDefault();

            if ($(this).hasClass('fh-icon-invisible')) {

                $(this).removeClass('fh-icon-invisible');

                $(this).addClass('fh-icon-visibility');

                $('#passwordd').attr('type', 'text');

            } else {

                $(this).removeClass('fh-icon-visibility');

                $(this).addClass('fh-icon-invisible');

                $('#passwordd').attr('type', 'password');
            }
        });

        $('.sign-bg #viewiconcon').click(function(e) {
            e.preventDefault();

            if ($(this).hasClass('fh-icon-invisible')) {

                $(this).removeClass('fh-icon-invisible');

                $(this).addClass('fh-icon-visibility');

                $('#confirmpass').attr('type', 'text');

            } else {

                $(this).removeClass('fh-icon-visibility');

                $(this).addClass('fh-icon-invisible');

                $('#confirmpass').attr('type', 'password');
            }
        });
    }

    //
}

document.addEventListener("DOMContentLoaded", init);