import * as $ from 'jquery';
import moment from 'moment';
import '../../../resources/vendor/js/daterangepicker.min.js';

function init() {
  if ($('.cmp-single-offer-details').length > 0) {
    let _offer = $('.cmp-single-offer-details');
    let offerCalendarAvailabilityApi = _offer.data('offerCalendarAvailability');
    let hotelId = _offer.data('hotelId');
    let promoCode = _offer.data('promoCode');
    let memberRateCode = _offer.data('memberRateCode');
    let rateCode = _offer.data('rateCode');
    let minDays = _offer.data('minDays');
    let maxDate = _offer.data('maxDate');
    let date = new Date();
    let today = date.setDate(date.getDate() + -1);
    let calYesterday = moment().add(-1, 'days');
    let calToday = moment();
    let endToday = moment().add(6, 'days');
    let calTomorrow = moment().add(100, 'days');
    let childAge;
    let dates = {};
    let invalidDates = [];
    // var invalidDates = ['2021-08-12'];
    $('#booking-form #hotel').val(hotelId);
    $('#booking-form #Promo').val(promoCode);
    $('.multi__calendar__footer--btn').attr('disabled', true);

    function constructOfferPrice(args1, args2, args3, args4, args5) {
      var memberRateCode = '';
      var rateCode = '';

      if (args4) {
        memberRateCode = args4;
      } else {
        rateCode = args5;
      }
      const replacements = {
        0: args1, //hotelId
        1: args2, //startDate
        2: args3, //endDate
        3: 'SGD', //currencyCode
        4: '0', //bufferDays
        5: rateCode, //rateCode
        6: memberRateCode, //rateCode
      };

      const ajaxUrl = offerCalendarAvailabilityApi.replace(
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
            dates[new Date(res[i].date.replace('-', '/'))] =
              'S$ ' + res[i].price;
            if (!res[i].available) {
              invalidDates.push(new Date(res[i].date.replace('-', '/')));
            }
          }
        },
      });
    }
    //API call function
    constructOfferPrice(
      hotelId,
      // moment().format('YYYY-MM-DD'),
      moment().add(1, 'days').format('YYYY-MM-DD'),
      moment().add(90, 'days').format('YYYY-MM-DD'),
      memberRateCode,
      rateCode
    );

    //Booking Button url redirect
    $('.multi__calendar__footer--btn').on('click', function (e) {
      e.stopImmediatePropagation();
      let url = $('#booking-form').attr('action');
      let resultData = $('#booking-form').serialize();
      let finalUrl;

      const formatArrivalDate = $('#booking-form #arrive').val();
      const formatDepartDate = $('#booking-form #depart').val();
      const departDate = moment(formatArrivalDate, 'DD-MM-YYYY');
      const arrivalDate = moment(formatDepartDate, 'DD-MM-YYYY');
      const check = arrivalDate.diff(departDate, 'days') < minDays - 1;
      if (check) {
        return;
      }

      finalUrl = url + '?' + resultData;
      document.getElementById('booking-form').reset();
      window.open(finalUrl, '_self');
      window.focus();
    });

    //Default Calendar
    $('#single__calendar').daterangepicker({
      locale: {
        format: 'ddd, MMM DD',
      },
      singleDatePicker: true,
      minDate: calYesterday,
      endDate: calTomorrow,
      // maxDate: maxDate,
      startDate: calToday,
      autoApply: true,
      opens: 'right',
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
    });
    $('.daterangepicker.single.opensright')
      .removeAttr('style')
      .addClass('single-calc')
      .detach()
      .appendTo('.single__calendar');
    $('#single__calendar').trigger('click');

    //Price updates in calendar dates
    function showCalendar() {
      if (jQuery.isEmptyObject(dates)) {
        return;
      }

      $('.calendar-table .table-condensed tbody td').each(function () {
        if ($(this).find('p').hasClass('price-value')) {
          return;
        } else {
          if ($(this).attr('class') != null) {
            var priceTempArr = $(this).attr('class').split('price');
            if (priceTempArr.length > 1 && priceTempArr[1] != 'undefined') {
              $("<p class='price-value'>" + priceTempArr[1] + '</p>').appendTo(
                $(this)
              );
            }
          }
        }
      });
    }

    const ele = document.querySelector('#single__calendar');
    if (ele) {
      ele.onclick = () => {
        showCalendar();
      };
    }
    const multiCal = document.querySelector('#multi__calendar');
    if (multiCal) {
      multiCal.onclick = () => {
        showCalendar();
      };
    }

    const device = window.innerWidth <= 768;

    // multi calendar starts
    $('#multi__calendar').daterangepicker(
      {
        locale: {
          format: 'ddd, MMM DD',
        },
        minDate: calYesterday,
        endDate: calTomorrow,
        // maxDate: maxDate,
        startDate: calToday,
        endDate: endToday,
        singleDatePickerWithMulti: device,
        opens: 'left',
        singleDatePicker: device,
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

    $('.daterangepicker.opensleft')
      .removeAttr('style')
      .addClass('multi-calc')
      .detach()
      .appendTo('.multi__calendar');
    $('#multi__calendar').trigger('click');
    $('#multi__calendar').on('showCalendar.daterangepicker', function () {
      showCalendar();
    });
    $('#single__calendar').on('showCalendar.daterangepicker', function () {
      showCalendar();
    });

    //open/close
    window.addEventListener('click', function (e) {
      if (!e.target) {
        return;
      }
      if (
        $('.multi__calendar').is(':visible') &&
        !document.querySelector('.multi__calendar').contains(e.target) &&
        !document
          .querySelector('.single__calendar__wrapper')
          .contains(e.target) &&
        !$(e.target).is('span') &&
        !$(e.target).is('th')
      ) {
        $('.multi__calendar').hide();
        $('.single__calendar').show();
      }

      if (
        $('.single__calendar__wrapper').is(':visible') &&
        !document.querySelector('.multi__calendar').contains(e.target)
        // !document
        //   .querySelector('.daterangepicker.show-calendar')
        //   .contains(e.target)
      ) {
        $('.multi__calendar').hide();
        $('.single__calendar').show();
      }
    });
    $('.single__calendar__wrapper').on('click', () => {
      $('.multi__calendar').show();
      $('.single__calendar').hide();
    });

    //callback function for calendar
    function cb(start, end) {
      console.log(start, end);
      showCalendar();
      $('.multi__calendar__header--error').css('display', 'none');
      $('.multi__calendar__footer--btn').css({
        opacity: 0.5,
        cursor: 'default',
      });

      // convert date format
      const formatArrivalDate = moment(start).format('YYYY-MM-DD');
      const formatDepartDate = moment(end).format('YYYY-MM-DD');

      if (!moment(start).isValid() || !moment(end).isValid()) {
        return;
      }
      const departDate = moment(start, 'DD-MM-YYYY');
      const arrivalDate = moment(end, 'DD-MM-YYYY');

      const check = arrivalDate.diff(departDate, 'days') < minDays - 1;
      if (check) {
        $('.multi__calendar__header--error').css({
          display: 'block',
        });
        $('.multi__calendar__footer--btn').css({
          opacity: 0.5,
          cursor: 'default',
        });
        $('.multi__calendar__footer--btn').attr('disabled', true);
      } else {
        $('.multi__calendar__footer--btn').css({
          opacity: 1,
          cursor: 'pointer',
        });
        $('.multi__calendar__footer--btn').attr('disabled', false);
        $('.multi__calendar__header--error').css({
          display: 'none',
        });
      }
      $('#booking-form #arrive').val(formatArrivalDate);
      $('#booking-form #depart').val(formatDepartDate);
      if (end) {
        $('.calendar-table .table-condensed tbody td.in-range').each(
          function () {
            var isDiabled = $(this).hasClass('disabled');
            if (isDiabled) {
              $('.multi__calendar__header--error').css({
                display: 'block',
              });
              $('.multi__calendar__footer--btn').css({
                opacity: 0.5,
                cursor: 'default',
              });
              $('.multi__calendar__footer--btn').attr('disabled', true);
            }
          }
        );
      }
    }

    //Adult/Child text function
    function setAdultText() {
      var adult = $('.pax-details__row.adult').find('p').html();
      var children = $('.pax-details__row.children').find('p').html();
      var adultText = '';
      if (+adult <= 1) {
        adultText = 'Adult';
        $('.pax-details__row.adult').find('span').html('Adult');
      } else {
        adultText = 'Adults';
        $('.pax-details__row.adult').find('span').html('Adults');
      }
      var inputValue = `${adult} ${adultText}, ${children} Children`;
      $('#booking-form #adult').val(adult);
      $('#booking-form #child').val(children);
      $('.home-booking-widget_section-top__pax_selector-input').text(
        inputValue
      );
      $('.home-booking-widget_section-top__pax_selector-input').text(
        inputValue
      );
    }

    setAdultText();
    $('.home-booking-widget_section-top__pax_selector-input').on(
      'click',
      function (e) {
        if ($('#booking-form #adult').val() == '1') {
          $('.pax-details__row.adult .remove_btn').css('opacity', 0.5);
          $('.pax-details__row.adult .remove_btn').css('cursor', 'default');
        }
        if ($('#booking-form #child').val() == '0') {
          $('.pax-details__row.children .remove_btn').css('opacity', 0.5);
          $('.pax-details__row.children .remove_btn').css('cursor', 'default');
        }
        e.preventDefault();
        $('.pax-details').show();
      }
    );

    window.addEventListener('click', function (e) {
      if (
        document
          .querySelector('.home-booking-widget_section-top__pax_selector')
          .contains(e.target)
      ) {
        $('.pax-details').show();
      } else {
        $('.pax-details').hide();
      }
    });

    let counter = 1;
    $('.pax-details__row.adult a')
      .unbind('click')
      .bind('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if ($(this).hasClass('add_btn')) {
          if (counter === 10) {
            $(this).css('opacity', 0.5);
            $(this).css('cursor', 'default');
            return;
          }
          counter = counter + 1;
          if (counter < 11) {
            $(this).css('opacity', 1);
            $(this).css('cursor', 'pointer');
            $(this).parent().find('.remove_btn').css('opacity', 1);
            $(this).parent().find('.remove_btn').css('cursor', 'pointer');
            $(this).parent().siblings().find('p').html(counter);
          }
        } else {
          if (counter == 1) {
            $(this).css('opacity', 0.5);
            $(this).css('cursor', 'default');
            return;
          }
          if (counter > 1) {
            $(this).css('opacity', 1);
            $(this).css('cursor', 'pointer');
            $(this).parent().find('.add_btn').css('opacity', 1);
            $(this).parent().find('.add_btn').css('cursor', 'pointer');
          }

          counter = counter - 1;
          $(this).parent().siblings().find('p').html(counter);
        }

        setAdultText();
      });

    let counterChild = 0;
    $('.pax-details__row.children a')
      .unbind('click')
      .bind('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if ($(this).hasClass('add_btn')) {
          if (counterChild === 10) {
            $(this).css('opacity', 0.5);
            $(this).css('cursor', 'default');
            return;
          }
          counterChild = counterChild + 1;
          $(this).parent().siblings().find('p').html(counterChild);
          if (counterChild < 11) {
            $(this).css('opacity', 1);
            $(this).css('cursor', 'pointer');
            $(this).parent().find('.remove_btn').css('opacity', 1);
            $(this).parent().find('.remove_btn').css('cursor', 'pointer');
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
            $(this).css('opacity', 1);
            $(this).css('cursor', 'pointer');
            $(this).parent().find('.add_btn').css('opacity', 1);
            $(this).parent().find('.add_btn').css('cursor', 'pointer');
          }
          $('.child-age-group .pax-details__row').last().remove();
          if (counterChild == 0) {
            $(this).css('opacity', 0.5);
            $(this).css('cursor', 'default');
            $('#booking-form #childages').val('');
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
            $(this).css('opacity', 0.5);
            $(this).css('cursor', 'default');
            return true;
          }
          if (ageCounter >= 0) {
            $(this).css('opacity', 1);
            $(this).css('cursor', 'pointer');
            $(this).parent().find('.add_btn').css('opacity', 1);
            $(this).parent().find('.add_btn').css('cursor', 'pointer');
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
            $(this).css('opacity', 0.5);
            $(this).css('cursor', 'default');
            return;
          }
          if (ageCounter <= 12) {
            $(this).css('opacity', 1);
            $(this).css('cursor', 'pointer');
            $(this).parent().find('.remove_btn').css('opacity', 1);
            $(this).parent().find('.remove_btn').css('cursor', 'pointer');
          }
          closest.find('p').text(ageCounter + 1);
          calAgeCount();
        });
      });

    function calAgeCount() {
      var column1RelArray = $('.child-age-group .childage').map(function () {
        return $(this).text();
      });
      if (typeof column1RelArray && column1RelArray.length > 0) {
        childAge = column1RelArray.toArray().join('|');
        $('#booking-form #childages').val(childAge);
      }
    }

    $('.accordion-wrapper__head').unbind();
    $('.accordion-wrapper__head').click(function () {
      $(this).next().slideToggle(500);
      $(this).toggleClass('active');
      var p = $(this).parent().is(':last-child');
      if ($(this).hasClass('active') && p === false) {
        $(this).css('border-bottom', 'none');
        $(this).next().css('border-bottom', '1px solid #866D4B');
      }
      if (!$(this).hasClass('active') && p == false) {
        $(this).css('border-bottom', '1px solid #866D4B');
        $(this).next().css('border-bottom', 'none');
      }
      if ($(this).hasClass('active') && p == true) {
        $(this).css('border-bottom', 'none');
        $(this).next().css('border-bottom', 'none');
      }
      if (p == true) {
        $(this).css('border-bottom', 'none');
        $(this).next().css('border-bottom', 'none');
      }
    });

    $('.readmoreless').unbind();
    $('.readmoreless').click(function () {
      $('.single-offer__details__para__moretext').slideToggle();
      if ($('.readmoreless').text() == 'Read more') {
        $(this).text('Read less');
      } else {
        $(this).text('Read more');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
