import * as $ from "jquery";
import _, { map } from 'underscore';
import moment from 'moment';
import '../../../resources/vendor/js/daterangepicker.min.js';

function init() {
    let offerList;
    if ($(".offer_listing").length > 0) {
        let cmp = $(".offer_listing");
        let offerServletURL = cmp.data("offerList");
        let offerApi = cmp.data("offerApi");
        let searchPlaceholder = cmp.data("searchPlaceholder");
        let offerChildClass = ".offer_listing__grid-container_column";
        let template = _.template($(".template_offer_info").html());

        retrieveOfferList();
        function retrieveOfferList() {
            $.ajax({
                type: 'GET',
                dataType: "json",
                url: offerServletURL,
                success: function(data, status, xhr) {
                    offerList = data;
                    constructorOfferList()
                }
            });
        }

        function constructorOfferList() {
            var mapList = mapSearchList();
            var offerType = [];

            for (var i = 0; i < mapList.length; i++) {
                var offerObj = mapList[i];
                offerType.indexOf(offerObj.offerType) === -1 && offerType.push(offerObj.offerType);
                $('.offer_listing .offer-binding').append(template(offerObj));
            }

            for (var j = 0; j < offerType.length; j++) {
                $("#offer-type").append("<option value='" +
                    offerType[j] + "'>" +
                    offerType[j] + "</option>");
            }

            $(offerChildClass).each(function () {
                let hotelId = $(this).data("hotelId");
                let memberRateCode = $(this).data("memberRateCode");
                let rateCode = $(this).data("rateCode");
                let offerStartDate = $(this).data("offerStartDate");
                let offerEndDate = $(this).data("offerEndDate");

                let overrideRegularPrice = $(this).data("overrideRegularPrice");
                let overrideRegularPriceValue = $(this).data("overrideRegularPriceValue");
                let hideRegularPrice = $(this).data("hideRegularPrice");
                let overrideMemberPrice = $(this).data("overrideMemberPrice");
                let overrideMemberPriceValue = $(this).data("overrideMemberPriceValue");
                let hideMemberPrice = $(this).data("hideMemberPrice");

                if (hotelId) {
                    if (hideRegularPrice) {
                        $(this).find(".normal-price").addClass("invisibility");
                    } else {
                        if (overrideRegularPrice) {
                            $(this).find(".normal-price-text").html(overrideRegularPrice);
                        }
                        if (overrideRegularPriceValue) {
                            $(this).find(".normal-price-display").html(overrideRegularPriceValue);
                        } else {
                            constructOfferTable(hotelId, '', rateCode, '', '', false, $(this));
                        }
                    }

                    $(this).find(".member-price").addClass("invisibility");
                    if (!hideMemberPrice) {
                        if (overrideMemberPrice) {
                            $(this).find(".member-price-text").html(overrideMemberPrice);
                        }
                        if (overrideMemberPriceValue) {
                            $(this).find(".member-price").removeClass("invisibility");
                            $(this).find(".member-price-display").html(overrideMemberPriceValue);
                        } else if (memberRateCode) {
                            constructOfferTable(hotelId, memberRateCode, '', '', '', true, $(this));
                        }
                    }
                } else {
                    $(this).find(".normal-price").addClass("invisibility");
                    $(this).find(".member-price").addClass("invisibility");
                }
            });

            initOfferTypeDropdown();
            initMemberExclusiveCheckbox();
            initCalendar();
            initSearchLocation();
            initOfferButton();
        }

        function constructOfferTable (hotelId, memberRateCode, rateCode, offerStartDate, offerEndDate, isMember, _this) {
            const replacements = {
              0: hotelId, //hotelId
              1: 'SGD', //currencyCode
              2: memberRateCode, //memberRateCode
              3: rateCode, //rateCode
              4: offerStartDate, //offerStartDate
              5: offerEndDate, //offerEndDate
            };

            const ajaxUrl = offerApi.replace(
              /{(\w+)}/g,
              (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
                replacements[placeholderWithoutDelimiters]
            );
            $.ajax({
                type: 'GET',
                dataType:"json",
                url: ajaxUrl,
                success: function (data, status, xhr) {
                    if(isMember) {
                        if(data.success) {
                            $(_this).find(".member-price").removeClass("invisibility");
                            $(_this).find(".member-price-display").html("S&#36; "+data.data.price);
                        } else {
                            $(_this).find(".member-price").addClass("invisibility");
                        }
                    } else {
                        if(data.success) {
                            $(_this).find(".normal-price-display").html("S&#36; "+data.data.price);
                        } else {
                            $(_this).find(".normal-price").addClass("invisibility");
                        }
                    }
                },
                error: function() {
                    if(isMember) {
                        $(_this).find(".member-price").addClass("invisibility");
                    } else {
                        $(_this).find(".normal-price").addClass("invisibility");
                    }
                }
            });
        }

        function mapSearchList() {
            var countryMap = [];
            var propertyMap = [];
            var countryWiseList = [];

            offerList.map(countryItem => { if (!countryMap.includes(countryItem.country)) { countryMap.push(countryItem.country) } });
            offerList.map(propertyItem => { if (!propertyMap.includes(propertyItem.hotelID)) { propertyMap.push(propertyItem.hotelID) } });

            /*for (var countryCount = 0; countryCount < countryMap.length; countryCount++) {
                var tempObj = offerList.filter(x => x.country == countryMap[countryCount])
                countryWiseList.push(...tempObj)
            }*/
            for (var propertyCount = 0; propertyCount < propertyMap.length; propertyCount++) {
                var tempObj = offerList.filter(x => x.hotelID == propertyMap[propertyCount])
                countryWiseList.push(...tempObj)
            }

            return countryWiseList;
        }

        function initOfferTypeDropdown() {
            $("#offer-type").on("change", function(){
                var selected = $(this).val();
                if(selected == '') {
                    $(offerChildClass).show();
                } else {
                    $(offerChildClass).hide();
                    $(offerChildClass).each(function() {
                        if ($(this).hasClass(selected)) {
                            $(this).show();
                        }
                    })
                }
            });
        }

        function initMemberExclusiveCheckbox() {
            $(".switch input:checkbox").change(function() {
                if(this.checked) {
                    $(offerChildClass).hide();
                    $(offerChildClass).each(function() {
                        if ($(this).data("memberexclusive") == true) {
                            $(this).show();
                        }
                    })
                } else {
                    $(offerChildClass).show();
                }
            });
        }

        function initCalendar() {
            let calYesterday = moment().add(-1, 'days');
            let calToday = moment();
            let calTomorrow = moment().add(1, 'days');
            $('#home_booking_calendar').daterangepicker(
                {
                    locale: {
                        format: 'ddd, MMM DD',
                    },
                    minDate: calToday,
                    endDate: calTomorrow,
                    startDate: calToday,
                    autoApply: true,
                },
                cb
            );
        }

        function cb(start, end) {
            if (start && end) {
                $(offerChildClass).hide();
                $(offerChildClass).each(function() {
                    var offerStartDate = moment($(this).data("offerStartDate"));
                    var offerEndDate = moment($(this).data("offerEndDate"));
                    if(offerStartDate.isValid() && offerEndDate.isValid()) {
                        if (start > offerStartDate && end < offerEndDate) {
                            $(this).show();
                        }
                    }
                })

                let formatArrivalDate = moment(start).format('YYYY-MM-DD');
                let formatDepartDate = moment(end).format('YYYY-MM-DD');
                $('#booking-form #arrive').val(formatArrivalDate);
                $('#booking-form #depart').val(formatDepartDate);
            }
        }

        function initSearchLocation() {
            $('.auto-search-panel').hide();
            $('#search-booking').on('click', function () {
                $(this).attr('placeholder', searchPlaceholder);
                $(this).val('');
                $(offerChildClass).show();
            });
            $('#search-booking').keyup(function () {
                var currentValue = $(this).val();
                if (currentValue.length > 0) {
                    showSearchResult(offerList, currentValue);
                }

                if (
                    currentValue == '' ||
                    currentValue == null ||
                    currentValue == undefined
                ) {
                    $('.auto-search-panel').hide();
                    $(this).attr('placeholder', searchPlaceholder);
                    $(offerChildClass).show();
                }
            });
        }

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
            var showPropertyList = mapList.filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
            );

            var prevCountry = '';
            var prevCity = '';
            var prevProperty = '';
            for (var listCount = 0; listCount < filterList.length; listCount++) {
                if (prevCountry != filterList[listCount].country) {
                    $('.auto-search-panel ul').append(
                        "<li class='country-name'" +
                        +"' data-name='" +
                        filterList[listCount].country +
                        "' data-country='" +
                        filterList[listCount].country +
                        "'>" +
                        filterList[listCount].country +
                        '</li>'
                    );
                }

                if (
                    checkIfCityExist(showCityList, filterList[listCount].city) &&
                    prevCity != filterList[listCount].city
                ) {
                    // console.log(filterList[listCount].city)
                    $('.auto-search-panel ul').append(
                        "<li class='city-name'" +
                        +"' data-name='" +
                        filterList[listCount].city +
                        "' data-country='" +
                        filterList[listCount].country +
                        "' data-city='" +
                        filterList[listCount].city +
                        "'>" +
                        filterList[listCount].city +
                        '</li>'
                    );
                }

                if (
                    prevProperty != filterList[listCount].name
                ) {
                    $('.auto-search-panel ul').append(
                        "<li data-name='" +
                        filterList[listCount].name +
                        "' data-hotelID='" +
                        filterList[listCount].hotelID +
                        "' data-country='" +
                        filterList[listCount].country +
                        "' data-city='" +
                        filterList[listCount].city +
                        "'>" +
                        filterList[listCount].name +
                        '</li>'
                    );
                }
                prevCountry = filterList[listCount].country;
                prevCity = filterList[listCount].city;
                prevProperty = filterList[listCount].name;
            }

            $(".auto-search-panel ul li").on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('.auto-search-panel').hide();
                $('#search-booking').val($(this).text());

                var hotelID = $(this).attr('data-hotelid');
                var country = $(this).attr('data-country');
                var city = $(this).attr('data-city');

                $(offerChildClass).hide();
                $(offerChildClass).each(function() {
                    var oCountry = $(this).data("country");
                    var oCity = $(this).data("city");
                    var oHotelId = $(this).data("hotelId");

                    if (hotelID) {
                        if(hotelID == oHotelId) {
                            $(this).show();
                        }
                    } else if (city) {
                        if(city == oCity) {
                            $(this).show();
                        }
                    } else if (country) {
                        if(country == oCountry) {
                            $(this).show();
                        }
                    }
                })

            });
        }

        function checkIfCityExist(list, city) {
            var cityCheckMap = list.map((item) => item.city);
            var uniqueCityArray = cityCheckMap.filter(function (item, pos) {
                return cityCheckMap.indexOf(item) == pos;
            });
            return uniqueCityArray.includes(city);
        }

        function checkIfPropertyExist(list, property) {
            var propertyCheckMap = list.map((item) => item.name);
            var uniquePropertyArray = propertyCheckMap.filter(function (item, pos) {
                return propertyCheckMap.indexOf(item) == pos;
            });
            return uniquePropertyArray.includes(property);
        }

        function initOfferButton() {
            $(offerChildClass + " .btn-secondary").on('click', function (e) {
                let _this = $(this).closest(offerChildClass);
                let hotelId = _this.data("hotelId");
                let promoCode = _this.data("promoCode");

                let finalUrl = _this.data("offerDetailsPath");
                if (hotelId) {
                    $('#booking-form #hotel').val('');
                    $('#booking-form #Promo').val('');
                    $('#booking-form #hotel').val(hotelId);
                    $('#booking-form #Promo').val(promoCode);

                    var url = $('#booking-form').attr('action');
                    var resultData = $('#booking-form').serialize();
                    finalUrl = url + '?' + resultData;
                }

                document.getElementById("booking-form").reset();
                window.open(finalUrl, '_self');
                window.focus();

            });
        }
    }
}

document.addEventListener("DOMContentLoaded", init);