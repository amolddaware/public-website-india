import * as $ from 'jquery';
import _, { map } from 'underscore';
import '../../../resources/vendor/js/daterangepicker.min.js';
import moment from 'moment';

function init() {
    let chainOfferList;
    let offerCalendarAvailabilityApi = $(".js-chain-offer-details").data("offerCalendarAvailability");
    if ($(".js-chain-offer-details").length > 0) {
        console.log('initializing chain offer list JS...');
        let chainOfferUrl = $(".js-chain-offer-details").data("chainOfferList");
        let chainOfferApi = $(".js-chain-offer-details").data("chainOfferApi");

        retrieveChainOfferList();

        function retrieveChainOfferList() {
            $.ajax({
                type: 'GET',
                dataType: "json",
                url: chainOfferUrl,
                success: function(data, status, xhr) {
                    chainOfferList = data;
                    constructorOfferList()
                }
            });
        }

        function constructorOfferList() {
            var mapList = mapSearchList();
            var countryList = [];
            var cityList = [];

            //Filter with Country List and City List
            for (var i = 0; i < mapList.length; i++) {
                var offerObj = mapList[i];
                countryList.indexOf(offerObj.country) === -1 && countryList.push(offerObj.country);
                cityList.indexOf(offerObj.country + "|" + offerObj.city) === -1 && cityList.push(offerObj.country + "|" + offerObj.city);
                constructOfferTable(offerObj);
            }

            //replace {count}
            var firstTitle = $(".cmp-chain-offer-accordion .accordion-wrapper__head").eq(0).html();
            firstTitle = firstTitle.replace("{count}", mapList.length);
            $(".cmp-chain-offer-accordion .accordion-wrapper__head").eq(0).html(firstTitle);

            //<option value="india">India</option>
            $(".cmp-chain-offer-accordion select.country").html($(".cmp-chain-offer-accordion select.country option").eq(0));
            for (var j = 0; j < countryList.length; j++) {
                $(".cmp-chain-offer-accordion select.country").append("<option value='" +
                    countryList[j] + "'>" +
                    countryList[j] + "</option>");
            }
            $(".cmp-chain-offer-accordion select.city").hide();
            $(".cmp-chain-offer-accordion select.city").html($(".cmp-chain-offer-accordion select.city option").eq(0));
            for (var k = 0; k < cityList.length; k++) {
                var split = cityList[k].split("|");
                $(".cmp-chain-offer-accordion select.city").append("<option value='" +
                    split[1] + "' class='" +
                    split[0].replace(/\s/g, '') + "'>" +
                    split[1] + "</option>");
            }
        }

        function constructOfferTable(propertyObj) {
            var memberRateCode = "";
            var rateCode = "";
            var template = _.template($(".template_property_info").html());

            if (propertyObj.memberRateCode) {
                memberRateCode = propertyObj.memberRateCode;
            } else {
                rateCode = propertyObj.rateCode;
            }
            const replacements = {
                0: propertyObj.hotelID, //hotelId
                1: 'SGD', //currencyCode
                2: memberRateCode, //memberRateCode
                3: rateCode, //rateCode
                4: '', //offerStartDate
                5: '', //offerEndDate
            };

            const ajaxUrl = chainOfferApi.replace(
                /{(\w+)}/g,
                (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
                replacements[placeholderWithoutDelimiters]
            );
            $.ajax({
                type: 'GET',
                dataType: "json",
                url: ajaxUrl,
                success: function(data, status, xhr) {
                    if (data.success) {
                        propertyObj.price = data.data.currencyCode + " " + data.data.price
                        $('.cmp-chain-offer-accordion .offer-table').append(template(propertyObj));
                        bindCheckbox();
                    }
                }
            });
        }

        function mapSearchList() {
            var countryMap = []
            var countryWiseList = []

            chainOfferList.map(countryItem => { if (!countryMap.includes(countryItem.country)) { countryMap.push(countryItem.country) } });

            for (var countryCount = 0; countryCount < countryMap.length; countryCount++) {
                var tempObj = chainOfferList.filter(x => x.country == countryMap[countryCount])
                countryWiseList.push(...tempObj)
            }
            return countryWiseList;
        }

        //filter - country selector
        $(".cmp-chain-offer-accordion select.country").on("change", function() {
            $(".cmp-chain-offer-accordion select.city").show();
            var country = $(this).val().replace(/\s/g, '');
            if (country == '') {
                $(".cmp-chain-offer-accordion select.city").hide();
                $('.cmp-chain-offer-accordion .offer-table tr').show();
            } else {
                $(".cmp-chain-offer-accordion select.city option").show();
                $(".cmp-chain-offer-accordion select.city option").not("." + country + "").hide();
                $(".cmp-chain-offer-accordion select.city option").eq(0).show();
                $(".cmp-chain-offer-accordion select.city").val($(".cmp-chain-offer-accordion select.city option:first").val());

                $('.cmp-chain-offer-accordion .offer-table tr').hide();
                $('.cmp-chain-offer-accordion .offer-table tr').each(function() {
                    if ($(this).hasClass(country)) {
                        $(this).show();
                    }
                })
            }
        })

        //filter - city selector
        $(".cmp-chain-offer-accordion select.city").on("change", function() {
            var city = $(this).val().replace(/\s/g, '');
            if (city == '') {
                var selectedCountry = $(".cmp-chain-offer-accordion select.country").val().replace(/\s/g, '');
                $('.cmp-chain-offer-accordion .offer-table tr').hide();
                $('.cmp-chain-offer-accordion .offer-table tr').each(function() {
                    if ($(this).hasClass(selectedCountry)) {
                        $(this).show();
                    }
                })
            } else {
                $('.cmp-chain-offer-accordion .offer-table tr').hide();
                $('.cmp-chain-offer-accordion .offer-table tr').each(function() {
                    if ($(this).hasClass(city)) {
                        $(this).show();
                    }
                })
            }
        })

        $(".cmp-chain-offer-accordion .accordion-wrapper__head:not(:eq(0))").addClass("disabled");
        $(".cmp-chain-offer-accordion .accordion-wrapper__head").on("click", function() {
            if ($(this).hasClass("disabled")) {
                return false;
            }
            $(this).next().slideToggle(500);
            $(this).toggleClass('active');
        });

        $('.js-chain-offer-details a.readmoreless').on('click', function() {
            $('.single-offer__details__para__moretext').slideToggle();
            if ($('.readmoreless').text() == "Read more") {
                $(this).text("Read less")
            } else {
                $(this).text("Read more")
            }
        });
    }

    function bindCheckbox() {
        $('input[type="checkbox"]').unbind();
        $('input[type="checkbox"]').on("click", function() {
            var hotelID = $(this).attr("id");
            $(this).parents("tr").toggleClass("active");
            $(this).parents("table").toggleClass("active");
            $(".accordion-wrapper__head .available-property").toggleClass("hidden");
            $(".accordion-wrapper__head .selected-property").toggleClass("hidden");
            $(".cmp-chain-offer-accordion .accordion-wrapper__head:not(:eq(0))").toggleClass("disabled");
            if ($(this).is(':checked')) {
                $('.cmp-chain-offer-accordion .offer-table tr:not(.active)').addClass('hidden');
                $('.cmp-chain-offer-accordion .chain-offer-filter-container').hide();

                var selectedProperty = chainOfferList.filter(function(item) {
                    return item.hotelID == hotelID;
                })
                $(".accordion-wrapper__body .accordion-wrapper__body__inclusions__left").html(selectedProperty[0].inclusions);
                $(".accordion-wrapper__body .accordion-wrapper__body__terms").html(selectedProperty[0].tnc);
                $('.accordion-wrapper__head:not(".active")').trigger('click');
                constructCalendar(selectedProperty[0]);
            } else {
                $('.cmp-chain-offer-accordion .offer-table tr').removeClass('hidden');
                $('.cmp-chain-offer-accordion .chain-offer-filter-container').show();
                $(".cmp-chain-offer-accordion .accordion-wrapper__head:not(:eq(0))").removeClass("active");
                $(".cmp-chain-offer-accordion .accordion-wrapper__body:not(:eq(0))").hide();
            }

        });
    }

    let date = new Date();
    let today = date.setDate(date.getDate() + -1);
    let calYesterday = moment().add(-1, 'days');
    let calToday = moment();
    let calTomorrow = moment().add(1, 'days');

    function constructCalendar(selectedProperty) {
        var dates = {}
        var invalidDates = [];
        constructOfferPrice(selectedProperty.hotelID, moment().format('YYYY-MM-DD'), moment().add(90, 'days').format('YYYY-MM-DD'), selectedProperty.memberRateCode, selectedProperty.rateCode, dates, invalidDates);
        constructOfferPrice(selectedProperty.hotelID, moment().add(90, 'days').format('YYYY-MM-DD'), moment().add(180, 'days').format('YYYY-MM-DD'), selectedProperty.memberRateCode, selectedProperty.rateCode, dates, invalidDates);
        constructOfferPrice(selectedProperty.hotelID, moment().add(180, 'days').format('YYYY-MM-DD'), moment().add(270, 'days').format('YYYY-MM-DD'), selectedProperty.memberRateCode, selectedProperty.rateCode, dates, invalidDates);
        constructOfferPrice(selectedProperty.hotelID, moment().add(270, 'days').format('YYYY-MM-DD'), moment().add(360, 'days').format('YYYY-MM-DD'), selectedProperty.memberRateCode, selectedProperty.rateCode, dates, invalidDates);
        constructOfferPrice(selectedProperty.hotelID, moment().add(360, 'days').format('YYYY-MM-DD'), moment().add(450, 'days').format('YYYY-MM-DD'), selectedProperty.memberRateCode, selectedProperty.rateCode, dates, invalidDates);
        constructOfferPrice(selectedProperty.hotelID, moment().add(450, 'days').format('YYYY-MM-DD'), moment().add(540, 'days').format('YYYY-MM-DD'), selectedProperty.memberRateCode, selectedProperty.rateCode, dates, invalidDates);
        cb(calToday, calTomorrow);
        $("#chain_offer_booking_calendar").daterangepicker({
            locale: {
                format: 'ddd, MMM DD'
            },
            "minDate": calYesterday,
            "endDate": calTomorrow,
            "startDate": calToday,
            isCustomDate: function(date) {
                if (dates[date._d] != undefined) {
                    return 'date-cell price' + dates[date._d] + 'price';
                } else {
                    return 'date-cell'
                }
            },
            isInvalidDate: function(date) {
                for (var i = 0; i < invalidDates.length; i++) {
                    var invalidDateTime = new Date(invalidDates[i]).getTime();
                    if (invalidDateTime == date._d.getTime()) {
                        return true;
                    }
                }
                if (today >= date._d.getTime()) {
                    return true;
                }
            }
        }, cb);
    }

    function constructOfferPrice(args1, args2, args3, args4, args5, args6, args7) {
        //
        var memberRateCode = "";
        var rateCode = "";

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
            dataType: "json",
            url: ajaxUrl,
            success: function(data, status, xhr) {
                const res = data.data;
                for (var i = 0; i < res.length; i++) {
                    args6[new Date(res[i].date.replace("-", '/'))] = 'S$ ' + res[i].price;
                    if (!res[i].available) {
                        args7.push(new Date(res[i].date.replace("-", '/')))
                    }
                }
            }
        });
    }

    //function copy from booking widget
    function cb(start, end) {
        // convert date format
        let formatArrivalDate = moment(start).format('YYYY-MM-DD');
        let formatDepartDate = moment(end).format('YYYY-MM-DD');

        $("#booking-form #arrive").val(formatArrivalDate);
        $("#booking-form #depart").val(formatDepartDate);

        $('.calendar-table .table-condensed tbody td').each(function(i, e) {
            if ($(this).attr('class') != null) {
                var priceTempArr = $(this).attr('class').split('price');
                if (priceTempArr.length > 1 && priceTempArr[1] != "undefined") {
                    $("<span class='price-value'>" + priceTempArr[1] + "</span>").appendTo($(this));
                }
                
            }
        });

        $('.readmoreless').unbind();
        $('.readmoreless').click(function() {
            $('.single-offer__details__para__moretext').slideToggle();
            if ($('.readmoreless').text() == "Read more") {
              $(this).text("Read less")
            } else {
              $(this).text("Read more")
            }
        });
    }
}


document.addEventListener("DOMContentLoaded", init);