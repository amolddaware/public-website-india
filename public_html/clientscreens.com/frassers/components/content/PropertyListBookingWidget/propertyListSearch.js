//import $ from 'jquery';
import * as $ from 'jquery';

/*export default class BannerCarousel {
  constructor() {

  }
}*/
(function($) {

  function propinit() {
    
      retrieveHotelList();
      var hotelsArrList;
      function retrieveHotelList() {
          $.ajax({
            type: 'GET',
            dataType:"json",
            url: $(".property-booking-widget").data("hotellist"),
            success: function (data, status, xhr) {
              hotelsArrList = data;
            },
            error: function(data){
              // console.log("error data" + JSON.stringify(data));
            }
          });
      }
  
      $(".auto-search-panel").hide();
      $("#search-booking-input").keyup(function() {
          $(".bw-error-message").removeClass("class-visibility")
          var currentValue = $(this).val();
          if(currentValue.length > 0){
            showSearchResult(hotelsArrList, currentValue);
          }
  
          if(currentValue == "" || currentValue == null || currentValue == undefined){
            $(".auto-search-panel").hide();
          }
       })
  
       function showSearchResult(resultData, searchValue){
         var mapList = mapSearchList(resultData);
         // globalSearchList = resultData;
         $(".auto-search-panel ul").html("");
         $(".auto-search-panel").show();
         var filterList = mapList.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
         var showCityList = mapList.filter(item => item.city.toLowerCase().includes(searchValue.toLowerCase()));
         // console.log("city list==",showCityList);
         var prevCountry = "";
         var prevCity = "";
         for(var listCount = 0; listCount < filterList.length; listCount++){
           if(prevCountry != filterList[listCount].country){
             $(".auto-search-panel ul").append("<li class='country-name'"+
             +"' data-name='"+filterList[listCount].country
             +"' data-hotelID='"+filterList[listCount].country+"'>"
             + filterList[listCount].country +"</li>")
           }
  
           // checkIfCityExist(showCityList, filterList[listCount].city)
  
           if(checkIfCityExist(showCityList, filterList[listCount].city) && prevCity != filterList[listCount].city){
             // console.log(filterList[listCount].city)
             $(".auto-search-panel ul").append("<li class='city-name'"+
             +"' data-name='"+filterList[listCount].city
             +"' data-hotelID='"+filterList[listCount].city+"'>"
             + filterList[listCount].city +"</li>")
           }
  
           $(".auto-search-panel ul").append("<li data-brand='"+filterList[listCount].brand
           +"' data-name='"+filterList[listCount].name
           +"' data-hotelID='"+filterList[listCount].hotelID
           +"' data-status='"+filterList[listCount].status
           +"' data-region='"+filterList[listCount].region
           +"' data-country='"+filterList[listCount].country
           +"' data-city='"+filterList[listCount].city
           +"' data-property='"+filterList[listCount].property+"'>"
           + filterList[listCount].name
           +"</li>")
           prevCountry = filterList[listCount].country;
           prevCity = filterList[listCount].city;
         }
       }
  
  
       function mapSearchList(resultData){
         var countryMap = []
         var countryWiseList = []
  
         resultData.map(countryItem => {if(!countryMap.includes(countryItem.country)){countryMap.push(countryItem.country)}});
  
         for(var countryCount = 0; countryCount < countryMap.length; countryCount++){
           var tempObj = hotelsArrList.filter(x => x.country == countryMap[countryCount])
           countryWiseList.push(...tempObj)
         }
         // console.log(countryWiseList)
         return countryWiseList;
       }
  
       function checkIfCityExist(list, city){
           var cityCheckMap = list.map(item => item.city)
           var uniqueCityArray = cityCheckMap.filter(function(item, pos) {
             return cityCheckMap.indexOf(item) == pos;
            })
            return uniqueCityArray.includes(city)
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
    var boolCountryCity = false;
  
    $(document).on("click", ".auto-search-panel ul li", function(){
      // debugger;
      console.log('clicked');
      if($(this).hasClass('country-name') || $(this).hasClass('city-name')){
        boolCountryCity = true;
      }
  
      $(".auto-search-panel").hide();
      name = $("#search-booking-input").val($(this).text());
      brand = $(this).attr('data-brand');
      hotelID = $(this).attr('data-hotelid');
      status = $(this).attr('data-status');
      region = $(this).attr('data-region');
      country = $(this).attr('data-country');
      city = $(this).attr('data-city');
      property = $(this).attr('data-property');
      
  
      // $("#booking-form #level").val();
      $("#booking-form #hotel").val(hotelID);
      // $("#booking-form #depart").val();
      // $("#booking-form #arrive").val();
      // $("#booking-form #chain").val();
      // $("#booking-form #adult").val();
      // $("#booking-form #child").val();
      // $("#booking-form #currency").val();
      // $("#booking-form #locale").val();
      // $("#booking-form #rooms").val();
      // $("#booking-form #childages").val();
      // 
      // getAvailability();
    })
  
  
    $(".check-rate-be").on("click", function(e){
      e.stopImmediatePropagation();
  
      var hotelID = $("#hotel").val();
  
      if (hotelID == '') {
        $(".bw-error-message").addClass("class-visibility")
        $(".bw-error-message").html($(".home-booking-widget").data("errorMessage"));
        return
      }
      
      $("#booking-form #Promo").val($("#promo-code").val());
  
      var url;
      if(!boolCountryCity){
        url = "https://be-cuat.synxis.com/?level=hotel&hotel="+hotelID+"&depart=" + $("#booking-form #depart").val() + "&arrive=" + $("#booking-form #arrive").val() + "&chain=10322&adult="+ $("#booking-form #adult").val() +"&child="+ $("#booking-form #child").val() +"&currency=SGD&locale=en-US&rooms=1&childages="+childAge;
        console.log(url)
      }else{
        url = $(".home-booking-widget").attr("data-country-city-path");
      }
        // console.log(url)
      window.open(url, '_newtab');
      window.focus();
      
  });
    // search ends
  
  }
  document.addEventListener("DOMContentLoaded", propinit);
})($);