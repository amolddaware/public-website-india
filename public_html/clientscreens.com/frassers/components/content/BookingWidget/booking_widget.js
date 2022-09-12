import * as $ from 'jquery';
import moment from 'moment';
//import '../../../resources/vendor/css/daterangepicker.css';
import '../../../resources/vendor/js/daterangepicker.min.js';

function init() {
    if ($('.home-booking-widget').length > 0) {

        let hotelsArrList;
        var promoCodeValid = true;
        let boolCountryCity = true;
        let _this = $('.home-booking-widget');
        let hotelListAPI = _this.data("hotellist");
        let countryCityPath = _this.data("countryCityPath");
        let promoCodeText = _this.data("promoCodeText");
        let errorMessage = _this.data("errorMessage");
        let promoCodeErrorMessage = _this.data("promoCodeErrorMessage");
        let calendarErrorMessage = _this.data("calendarErrorMessage");

        retrieveHotelList();

        function retrieveHotelList() {
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: hotelListAPI,
                success: function (data, status, xhr) {
                    hotelsArrList = data;
                },
                error: function (data) {
                    // console.log("error data" + JSON.stringify(data));
                },
            });
        }

        $('.auto-search-panel').hide();

        $('#search-booking').keyup(function () {
            $('.bw-error-message').removeClass('class-visibility');
            var currentValue = $(this).val();
            if (currentValue.length > 0) {
                showSearchResult(hotelsArrList, currentValue);
            }

            if (
                currentValue == '' ||
                currentValue == null ||
                currentValue == undefined
            ) {
                $('.auto-search-panel').hide();
                $(this).attr('placeholder', $('.home-booking-widget').data('propertyPlaceholder'));
                $('#hotel').val('');
            }
        });


        $('#search-booking').on('click', function () {
            $(this).attr('placeholder', $('.home-booking-widget').data('propertyPlaceholder'));
            $(this).val('');
            $('#hotel').val('');
        });

        function showSearchResult(resultData, searchValue) {
            var mapList = mapSearchList(resultData);
            // globalSearchList = resultData;
            $('.auto-search-panel ul').html('');
            $('.auto-search-panel').show();
            var filterList = mapList.filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            var showCityList = mapList.filter((item) =>
                item.city.toLowerCase().includes(searchValue.toLowerCase())
            );
            // console.log("city list==",showCityList);
            var prevCountry = '';
            var prevCity = '';
            for (var listCount = 0; listCount < filterList.length; listCount++) {
                if (prevCountry != filterList[listCount].country) {
                    $('.auto-search-panel ul').append(
                        "<li class='country-name'" +
                        +"' data-name='" +
                        filterList[listCount].country +
                        "' data-hotelID='" +
                        filterList[listCount].country +
                        "'>" +
                        filterList[listCount].country +
                        '</li>'
                    );
                }

                // checkIfCityExist(showCityList, filterList[listCount].city)
                if (
                    checkIfCityExist(showCityList, filterList[listCount].city) &&
                    prevCity != filterList[listCount].city
                ) {
                    // console.log(filterList[listCount].city)
                    $('.auto-search-panel ul').append(
                        "<li class='city-name'" +
                        +"' data-name='" +
                        filterList[listCount].city +
                        "' data-hotelID='" +
                        filterList[listCount].city +
                        "'>" +
                        filterList[listCount].city +
                        '</li>'
                    );
                }

                $('.auto-search-panel ul').append(
                    "<li data-brand='" +
                    filterList[listCount].brand +
                    "' data-name='" +
                    filterList[listCount].name +
                    "' data-hotelID='" +
                    filterList[listCount].hotelID +
                    "' data-status='" +
                    filterList[listCount].status +
                    "' data-region='" +
                    filterList[listCount].region +
                    "' data-country='" +
                    filterList[listCount].country +
                    "' data-city='" +
                    filterList[listCount].city +
                    "' data-property='" +
                    filterList[listCount].property +
                    "'>" +
                    filterList[listCount].name +
                    '</li>'
                );
                prevCountry = filterList[listCount].country;
                prevCity = filterList[listCount].city;
            }

            $(".auto-search-panel ul li").on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                if ($(this).hasClass('country-name') || $(this).hasClass('city-name')) {
                    boolCountryCity = true;
                } else {
                    boolCountryCity = false;
                }

                $('.auto-search-panel').hide();
                name = $('#search-booking').val($(this).text());
                brand = $(this).attr('data-brand');
                hotelID = $(this).attr('data-hotelid');
                status = $(this).attr('data-status');
                region = $(this).attr('data-region');
                country = $(this).attr('data-country');
                city = $(this).attr('data-city');
                property = $(this).attr('data-property');

                // $("#booking-form #level").val();
                if(!boolCountryCity) {
                    $('#booking-form #hotel').val(hotelID);
                } else {
                    $('#booking-form #hotel').val("false"); //boolCountryCity is not working somehow
                }

                constructorAvailability()
            });
        }

        function constructorAvailability() {
            var hotelID = $('#hotel').val();
            dates = {}; //reset value
            invalidDates = []; //reset value
            //No need call getAvailability function when selected country or city
            if (hotelID && hotelID != 'false') {
                getAvailability(
                    moment().format('YYYY-MM-DD'),
                    moment().add(60, 'days').format('YYYY-MM-DD')
                );
                getAvailability(
                    moment().add(60, 'days').format('YYYY-MM-DD'),
                    moment().add(120, 'days').format('YYYY-MM-DD')
                );
                getAvailability(
                    moment().add(120, 'days').format('YYYY-MM-DD'),
                    moment().add(180, 'days').format('YYYY-MM-DD')
                );
                getAvailability(
                    moment().add(180, 'days').format('YYYY-MM-DD'),
                    moment().add(240, 'days').format('YYYY-MM-DD')
                );
                getAvailability(
                    moment().add(240, 'days').format('YYYY-MM-DD'),
                    moment().add(300, 'days').format('YYYY-MM-DD')
                );
                getAvailability(
                    moment().add(360, 'days').format('YYYY-MM-DD'),
                    moment().add(420, 'days').format('YYYY-MM-DD')
                );
                getAvailability(
                    moment().add(420, 'days').format('YYYY-MM-DD'),
                    moment().add(480, 'days').format('YYYY-MM-DD')
                );
                getAvailability(
                    moment().add(480, 'days').format('YYYY-MM-DD'),
                    moment().add(540, 'days').format('YYYY-MM-DD')
                );

            }
        }

        function mapSearchList(resultData) {
            var countryMap = [];
            var countryWiseList = [];

            hotelsArrList.map((countryItem) => {
                if (!countryMap.includes(countryItem.country)) {
                    countryMap.push(countryItem.country);
                }
            });

            for (
                var countryCount = 0;
                countryCount < countryMap.length;
                countryCount++
            ) {
                var tempObj = hotelsArrList.filter(
                    (x) => x.country == countryMap[countryCount]
                );
                countryWiseList.push(...tempObj);
            }
            return countryWiseList;
        }

        function checkIfCityExist(list, city) {
            var cityCheckMap = list.map((item) => item.city);
            var uniqueCityArray = cityCheckMap.filter(function (item, pos) {
                return cityCheckMap.indexOf(item) == pos;
            });
            return uniqueCityArray.includes(city);
        }

        var name;
        var brand;
        var hotelID;
        var status;
        var region;
        var country;
        var city;
        var property;

        var arrival;
        var depart;
        var childAge;

        $('.check-rate-be').on('click', function (e) {
            e.stopImmediatePropagation();

            var hotelID = $('#hotel').val();
            if (hotelID == '') {
                $('.bw-error-message').addClass('class-visibility');
                $('.bw-error-message').html(errorMessage);
                return;
            }

            if (!promoCodeValid) {
                $('.bw-error-message').addClass('class-visibility');
                $('.bw-error-message').html(promoCodeErrorMessage);
                return;
            }

            var checkinDate = $("#depart").val();
            var checkoutDate = $("#arrive").val();
            if (!checkinDate && !checkoutDate) {
                $('.bw-error-message').addClass('class-visibility');
                $('.bw-error-message').html(calendarErrorMessage);
                return;
            }

            var url = $('#booking-form').attr('action');
            var resultData = $('#booking-form').serialize();
            var finalUrl;

            if (hotelID != 'false') {
                finalUrl = url + '?' + resultData;
            } else {
                finalUrl = countryCityPath;
            }

            document.getElementById("booking-form").reset();
            $('#promo-code').val('');
            window.open(finalUrl, '_self');
            window.focus();
        });
        // search ends

        var dates = {};
        var invalidDates = ["2021-08-12"];

        function getAvailability(startDate, endDate) {
            var calendarApi = $('.home-booking-widget').data('calendarAvailability');
            const replacements = {
                0: $('#hotel').val(), //hotelId
                1: $('#currency').val(), //currencyCode
                2: '0', //bufferDays
                3: '1', //roomCount
                4: $('#adult').val(), //adults
                5: startDate, //startDate
                6: endDate, //endDate
                7: $('#Promo').val(), //rateCode
            };

            const ajaxUrl = calendarApi.replace(
                /{(\w+)}/g,
                (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
                    replacements[placeholderWithoutDelimiters]
            );

            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: ajaxUrl,
                success: function (data, status, xhr) {
                    const res = data.data;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].available) {
                            dates[new Date(res[i].date.replace('-', '/'))] =
                                'S$ ' + res[i].price;
                        } else {
                            dates[new Date(res[i].date.replace('-', '/'))];
                        }
                        if (!res[i].available) {
                            invalidDates.push(new Date(res[i].date.replace('-', '/')));
                        }
                    }
                },
                error: function (data) {
                    // do nothing
                },
            });
        }

        let date = new Date();
        let today = date.setDate(date.getDate() + -1);
        let calYesterday = moment().add(-1, 'days');
        let calToday = moment();
        let calTomorrow = moment().add(1, 'days');

        cb(calToday, calTomorrow);

        $('#home_booking_calendar').daterangepicker(
            {
                locale: {
                    format: 'ddd, MMM DD',
                },
                minDate: calYesterday,
                endDate: calTomorrow,
                startDate: calToday,
                autoApply: true,
                isCustomDate: function (date) {
                    if (dates[date._d] != undefined) {
                        return 'date-cell price' + dates[date._d] + 'price';
                    } else {
                        return 'date-cell';
                    }
                },
                isInvalidDate: function (date) {
                    for (var i = 0; i < invalidDates.length; i++) {
                        var invalidDateTime = new Date(invalidDates[i]).getTime();
                        if (invalidDateTime == date._d.getTime()) {
                            return true;
                        }
                    }
                    if (today >= date._d.getTime()) {
                        return true;
                    }
                },
            },
            cb
        );

        function showCalendar() {
            $('.calendar-table .table-condensed tbody td').each(function (i, e) {
                if ($(this).find('p').hasClass('price-value')) {
                    return;
                }
                if ($(this).attr('class') != null) {
                    var priceTempArr = $(this).attr('class').split('price');
                    if (priceTempArr.length > 1 && priceTempArr[1] != 'undefined') {
                        $("<p class='price-value'>" + priceTempArr[1] + '</p>').appendTo(
                            $(this)
                        );
                    }
                }
            });
        }

        const ele = document.querySelector('#home_booking_calendar');
        if (ele) {
            ele.onclick = () => {
                showCalendar();
            };
        }

        function cb(start, end) {
            $(".drp-buttons .calendar-error").remove();
            $(".drp-buttons").css("display", "none");

            // convert date format
            let formatArrivalDate = moment(start).format('YYYY-MM-DD');
            let formatDepartDate = moment(end).format('YYYY-MM-DD');
            $('#booking-form #arrive').val(formatArrivalDate);
            $('#booking-form #depart').val(formatDepartDate);

            $('.calendar-table .table-condensed tbody td').each(function (i, e) {
                if ($(this).attr('class') != null) {
                    var priceTempArr = $(this).attr('class').split('price');
                    if (priceTempArr.length > 1 && priceTempArr[1] != 'undefined') {
                        $(
                            "<span class='price-value'>" + priceTempArr[1] + '</span>'
                        ).appendTo($(this));
                    }
                }
            });

            if (end) {

                $('.calendar-table .table-condensed tbody td.in-range').each(function (i, e) {
                    var isDiabled = $(this).hasClass("disabled");
                    if (isDiabled) {
                        $(".drp-buttons").css("display", "block");
                        $(".drp-buttons").append(
                            '<p class="calendar-error">'+calendarErrorMessage+'</p>'
                        );
                        $("#depart").val("");
                        $("#arrive").val("");
                    }
                });
            }


        }

        $('#home_booking_calendar').on('showCalendar.daterangepicker', function () {
            showCalendar();
        });


        //Adult test function
        function setAdultText() {
          const adult = $('.pax-details__row.adult').find('p').html();
          const children = $('.pax-details__row.children').find('p').html();
        
          let adultText = '';
          let childrenText = '';
          if (+adult <= 1) {
            adultText = 'Adult';
            $('.pax-details__row.adult').find('span').html(adultText);
          }
          if (+adult > 1) {
            adultText = 'Adults';
            $('.pax-details__row.adult').find('span').html(adultText);
          }
          if (+children <= 1) {
            childrenText = 'Child';
            const childList = Array.from(
              document.querySelectorAll('.pax-details__row.children')
            );
            if (childList.length > 0) {
              const newArry = Array.from(childList[0].querySelectorAll('span'));
              newArry.forEach((child) => {
                child.innerHTML = childrenText;
              });
            }
          }
          if (+children > 1) {
            childrenText = 'Children';
            const childList = Array.from(
              document.querySelectorAll('.pax-details__row.children')
            );
            if (childList.length > 0) {
              const newArry = Array.from(childList[0].querySelectorAll('span'));
              console.log(childList);
              newArry.forEach((child) => {
                child.innerHTML = childrenText;
              });
            }
          }
          var inputValue = `${adult} ${adultText}, ${children} ${childrenText}`;
          $('#booking-form #adult').val(adult);
          $('#booking-form #child').val(children);
          $('.home-booking-widget_section-top__pax_selector-input').text(inputValue);
        }

        setAdultText();
        $('.home-booking-widget_section-top__pax_selector-input').on(
          'click',
          function (e) {
            if ($("#booking-form #adult").val() == "1") {
              $(".pax-details__row.adult .remove_btn").css("opacity", 0.5);
              $(".pax-details__row.adult .remove_btn").css("cursor", "default");
            }
            if ($("#booking-form #child").val() == "0") {
              $(".pax-details__row.children .remove_btn").css("opacity", 0.5);
              $(".pax-details__row.children .remove_btn").css("cursor", "default");
            }
            e.preventDefault();
            $('.pax-details').show();
          }
        );

        let counter = 1;
        $('.pax-details__row.adult a')
        .unbind('click')
        .bind('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if ($(this).hasClass('add_btn')) {
            if (counter === 20) {
              $(this).css("opacity", 0.50);
              $(this).css("cursor", "default");
              return;
            }
            counter = counter + 1;
            if (counter < 21) {
              $(this).css("opacity", 1);
              $(this).css("cursor", "pointer");
              $(this).parent().find(".remove_btn").css("opacity", 1);
              $(this).parent().find(".remove_btn").css("cursor", "pointer");
              $(this).parent().siblings().find('p').html(counter);
            }
          } 
          else {
            if (counter == 1) {
              $(this).css("opacity", 0.50);
              $(this).css("cursor", "default");
              return;
            }
            if (counter > 1) {
              $(this).css("opacity", 1);
              $(this).css("cursor", "pointer");
              $(this).parent().find(".add_btn").css("opacity", 1);
              $(this).parent().find(".add_btn").css("cursor", "pointer");
            }
            counter = counter - 1;
            $(this).parent().siblings().find('p').html(counter);
          }

          setAdultText();

          //   var adult = $('.pax-details__row.adult').find('p').html(),
          //     children = $('.pax-details__row.children').find('p').html();
          //   console.log('adult', adult);
          //   var adultText = '';
          //   if (+adult <= 1) {
          //     adultText = 'Adult';
          //     $('.pax-details__row.adult').find('span').html('Adult');
          //   } else {
          //     adultText = 'Adults';
          //     $('.pax-details__row.adult').find('span').html('Adults');
          //   }

          //   var inputValue = `${adult} ${adultText}, ${children} Children`;
          //   $('#booking-form #adult').val(adult);
          //   $('#booking-form #child').val(children);
          //   $('.home-booking-widget_section-top__pax_selector-input').text(
          //     inputValue
          //   );
        });

        let counterChild = 0;
        $('.pax-details__row.children a')
            .unbind('click')
            .bind('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(this).hasClass('add_btn')) {
                    if (counterChild === 20) {
                        $(this).css("opacity", 0.50);
                        $(this).css("cursor", "default");
                        return;
                    }
                    counterChild = counterChild + 1;
                    $(this).parent().siblings().find('p').html(counterChild);
                    if (counterChild < 21) {
                        $(this).css("opacity", 1);
                        $(this).css("cursor", "pointer");
                        $(this).parent().find(".remove_btn").css("opacity", 1);
                        $(this).parent().find(".remove_btn").css("cursor", "pointer");
                    }

                    $('.child-age-group').append(
                        '<div class="pax-details__row children">' +
                        '<div class="pax-details__row_container children">' +
                        '<span class="pax-details__row_container--title">Child ' +
                        counterChild +
                        ': Age </span>' +
                        '</div>' +
                        '<div class="pax-details__row--content">' +
                        '<div class="pax-details__row--content__item">' +
                        '<div class="pax-details__row--content__item--number">' +
                        '<p class="childage">0</p>' +
                        '<span></span></div>' +
                        '</div>' +
                        '<div class="pax-details__row--content__item">' +
                        '<a class="pax-details__row--content__item--minus remove_btn"><i class="fa fa-minus"></i></a>' +
                        '<a class="pax-details__row--content__item--plus add_btn"><i class="fa fa-plus"></i></a>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    );

                } else {

                    if (counterChild == 0) {
                        return;
                    }

                    counterChild = counterChild - 1;
                    $(this).parent().siblings().find('p').html(counterChild);
                    if (counterChild > 1) {
                        $(this).css("opacity", 1);
                        $(this).css("cursor", "pointer");
                        $(this).parent().find(".add_btn").css("opacity", 1);
                        $(this).parent().find(".add_btn").css("cursor", "pointer");
                    }
                    $('.child-age-group .pax-details__row').last().remove();
                    if (counterChild == 0) {
                        $(this).css("opacity", 0.50);
                        $(this).css("cursor", "default");
                        $('#booking-form #childages').val("");
                    }
                }
                setAdultText();
                calAgeCount();
                $(document).on('click', '.remove_btn', function (e) {
                    e.stopImmediatePropagation();
                    var _this = $(this);
                    var closest = _this.closest('.pax-details__row--content');
                    var ageCounter = parseInt(closest.find('p').text());
                    if (ageCounter == 0) {
                        $(this).css("opacity", 0.50);
                        $(this).css("cursor", "default");
                        return true;
                    }
                    if (ageCounter >= 0) {
                        $(this).css("opacity", 1);
                        $(this).css("cursor", "pointer");
                        $(this).parent().find(".add_btn").css("opacity", 1);
                        $(this).parent().find(".add_btn").css("cursor", "pointer");
                    }
                    closest.find('p').text(ageCounter - 1);

                    calAgeCount();
                });

                $(document).on('click', '.child-age-group .add_btn', function (e) {
                    e.stopImmediatePropagation();
                    var _this = $(this);
                    var closest = _this.closest('.pax-details__row--content');
                    var ageCounter = parseInt(closest.find('p').text());

                    if (ageCounter === 12) {
                        $(this).css("opacity", 0.50);
                        $(this).css("cursor", "default");
                        return;
                    }
                    if (ageCounter <= 12) {
                        $(this).css("opacity", 1);
                        $(this).css("cursor", "pointer");
                        $(this).parent().find(".remove_btn").css("opacity", 1);
                        $(this).parent().find(".remove_btn").css("cursor", "pointer");

                    }
                    closest.find('p').text(ageCounter + 1);
                    calAgeCount();
                });
            });

        function calAgeCount() {


            var column1RelArray = $('.child-age-group .childage').map(function () {
                return $(this).text();
            });
            if (typeof (column1RelArray) && column1RelArray.length > 0) {
                childAge = column1RelArray.toArray().join("|");
                $('#booking-form #childages').val(childAge);
            }
        }

        $('.swiper-wrapper, .column-control').on('click', function () {
            $('.pax-details').hide();
        });

        // PromoCode Section
        $('#promo-code')
            .focus(function () {
                $(this).removeAttr('placeholder');
            })
            .blur(function () {
                $(this).attr('placeholder', promoCodeText);
            });

        //API request on focus-out
        $('#promo-code').focusout(function () {
            const promoCode = $('#promo-code').val();

            function validatePromoCode(code) {
                var promo_code_url = $('.home-booking-widget').data(
                    'validatePromocode'
                );

                var ajaxUrl = promo_code_url.replace("{0}", code)

                $('.bw-error-message').removeClass('class-visibility');
                $('#Promo').val("");
                promoCodeValid = false;
                $.ajax({
                    url: ajaxUrl,
                    dataType: 'json',
                    type: 'GET',
                    success: function (data, status, xhr) {
                        if (data.success) {
                            $('#Promo').val(code);
                            promoCodeValid = true;
                            $('.bw-error-message').removeClass('class-visibility');
                            constructorAvailability()
                        } else {
                            $('.bw-error-message').addClass('class-visibility');
                            $('.bw-error-message').html(promoCodeErrorMessage);
                        }
                    },
                    error: function (err) {
                        /*console.log('err', err, err);*/
                        $('.bw-error-message').addClass('class-visibility');
                        $('.bw-error-message').html(promoCodeErrorMessage);
                    },
                });
            }

            //call API function if promo code is not empty
            if (promoCode) {
                validatePromoCode(promoCode.toUpperCase());
            } else {
                $('#Promo').val("");
                constructorAvailability()
                promoCodeValid = true;
                $('.bw-error-message').removeClass('class-visibility');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', init);
