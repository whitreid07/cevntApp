//Object array
eventsApp = {};

eventsApp.url = "https://app.ticketmaster.com/discovery/v2/events.json";
eventsApp.apiKey = "ftYfSGG92vqF6hHoXIE25YwqEXwj0jhe";

eventsApp.userPickDate = '',
  eventsApp.userPickCity = '',
  eventsApp.userPickEvents = '',

  eventsApp.eventsArray = [],

  eventsApp.dropdownContent = {
    city: ['Toronto', 'Montreal', 'Vancouver', 'Calgary'],
    event: ['Music', 'Sports']
  },

  //Function to make API call to Ticketmaster
  eventsApp.getEvents = () => {
    $.ajax({
      method: "GET",
      url: eventsApp.url,
      dataType: "json",
      data: {
        apikey: eventsApp.apiKey,
        startDateTime: `${eventsApp.userPickDate}T00:00:00Z`,
        endDateTime: `${eventsApp.userPickDate}T23:00:00Z`,
        city: eventsApp.userPickCity,
        segmentName: eventsApp.userPickEvents
      }
    }).then((res) => {
      eventsApp.displayEvents(res._embedded.events);
    }).catch(() => {
      swal("Soorrryyyy...", "NO EVENTS THIS DAY!!", "error");
      $('section').hide();
    })
  },

  //Function to  display dropdown menu
  eventsApp.displayDropdown = () => {
    //Display the dropdown menu for city selection
    $('.dropBtn1').one('mouseover', function () {
      eventsApp.dropdownContent.city.forEach(function (city) {
        $('.dropdownCityContent').append(`<li>${city}</li>`);
      })
    })

    //Display the dropdown menu for type of event selection
    $('.dropBtn2').one('mouseover', function () {
      eventsApp.dropdownContent.event.forEach(function (event) {
        $('.dropdownEventContent').append(`<li>${event}</li>`);
      })
    })
  },

  //Function to display the calendar plugin 
  eventsApp.calendar = () => {
    $('.myCalendar').empty();

    $('.myCalendar').calendar({
      date: new Date(),
      autoSelect: false, // false by default
      select: function (date) {

        //Change of date format to yyyy-mm-dd
        const formatPickDate = new Date(date);
        const selectedDate = new Date(formatPickDate.getTime() - (formatPickDate.getTimezoneOffset() * 60000))
          .toISOString()
          .split("T")[0];

        const formatTodayDate = new Date();
        const todayDate = new Date(formatTodayDate.getTime() - (formatTodayDate.getTimezoneOffset() * 60000))
          .toISOString()
          .split("T")[0];

        //Condition statements to make sure user pick a city, type of event and specific date
        if (todayDate > selectedDate) {
          swal("Oops...", "Event already passed, pick another day!", "error");
        } else if (eventsApp.userPickCity === '' && eventsApp.userPickEvents === '') {
          swal("Oops...", "Pick a city and event!", "warning");
        } else if (eventsApp.userPickCity === '') {
          swal("Oops...", "Pick a city!", "warning");
        } else if (eventsApp.userPickEvents === '') {
          swal("Oops...", "Pick an event!", "warning");
        } else {
          eventsApp.userPickDate = selectedDate;
          $('td').on('click', function () {
            $('html, body').animate({
              scrollTop: $('.displayEvents').offset().top
            }, 1000);
          });

          eventsApp.getEvents();

        }
      },
      toggle: function (y, m) { }
    })
  },

  //Function to get user selection of city and date     
  eventsApp.getUserInput = () => {
    //Gets the value of selected city
    $('.dropdownCityContent').on('click', 'li', function (e) {
      e.stopPropagation();
      eventsApp.userPickCity = $(this).text();
      $('.dropBtn1').text(eventsApp.userPickCity);
    });

    //Gets the value of selected event
    $('.dropdownEventContent').on('click', 'li', function (e) {
      e.stopPropagation();
      eventsApp.userPickEvents = $(this).text();
      $('.dropBtn2').text(eventsApp.userPickEvents);
    });
    eventsApp.calendar();
  },

  //Function to display the events 
  eventsApp.displayEvents = (result) => {
    $('section').show();
    $('.shareButton').show();
    $('.displayEvents').empty();
    $('.shareEvents').empty();

    //Stores the API data into an array
    result.forEach(function (events) {
      eventsApp.eventsArray.push(events);
    });

    if (eventsApp.eventsArray.length < 3) {
      //Display all  3 events when there is only 3 events
      eventsApp.eventsArray.forEach(function (events) {

        const imageSize = events.images.find(image => image.width === 1024);
        $('.displayEvents')
          .append(`<div class="displayContents">
                        <div class="displayContentsImage">
                          <img class="displayContentsImage"src="${imageSize.url} " alt="${events.name} "/>
                        </div >
                        <div class="displayContentsName">
                            <h2>${events.name}</h2>
                        </div>
                        <div className="eventContent">
                          <div class="displayContentsVenue">
                            <p>${events._embedded.venues[0].name}</p>
                          </div>
                          <div class="displayContentsTime">
                            <p>${events.dates.start.localTime}</p>
                          </div>
                          <div class="displayContentsTickets">
                            <a href="${events.url}">get tickets</a>
                          </div>
                          
                        </div>
                    </div >`);
      })
    } else {
      //Display the first 3 events when there are more than 3 events
      for (let i = 0; i < 3; i++) {
        // const index = eventsApp.getRandomEvents();
        const imageSize = eventsApp.eventsArray[i].images.find(image => image.width === 1024);

        $('.displayEvents')
          .append(`<div class="displayContents">
                    <div class="displayContentsImage">
                      <img class="displayContentsImage"src="${imageSize.url} " alt="${eventsApp.eventsArray[i].name} "/>
                    </div >
                    <div class="displayContentsName">
                      <h2>${eventsApp.eventsArray[i].name}</h2>
                    </div>
                    <div class="displayContentsVenue">
                      <p>${eventsApp.eventsArray[i]._embedded.venues[0].name}</p>
                    </div>
                    <div class="displayContentsTime">
                      <p>${eventsApp.eventsArray[i].dates.start.localTime}</p>
                    </div>
                    <div class="displayContentsTickets">
                      <a target="_blank" href="${eventsApp.eventsArray[i].url}">get tickets</a>
                    </div>
                  </div >`);
      }
    }
    $('.shareEvents').append(`<button class="button" data-sharer="facebook">Share on Facebook <i class="fab fa-facebook"></i></button>
    <button class="button" data-sharer="twitter">Share on Twitter <i class="fab fa-twitter"></i></button>`);

    //Empty the events array
    eventsApp.eventsArray = [];
    eventsApp.selectEvent();
  },

  //Function to select an event
  eventsApp.selectEvent = () => {
    $('.displayContents').on('click', function () {
      $(this).toggleClass('animated')
        .toggleClass('pulse')
        .toggleClass('displayContentsSelected');
    })
    eventsApp.shareEvent();
  },

  eventsApp.shareEvent = () => {
    $('.displayContents').on('click', function () {
      const shareThisEvent = this;
      $('.button').attr(`data-url`, `${shareThisEvent.children[4].firstElementChild.href}`);
      $('.button').attr(`data-hashtags`, `goingtoanevent, getyourticketstoo`);

      window.Sharer.init(); //Manual event binding for share social media from sharer.js
    });
  }

eventsApp.init = () => {
  $('section').hide();
  $('.shareButton').hide();
  $('.myCalendar').calendar(); //Loads the calendar

  eventsApp.displayDropdown();
  eventsApp.getUserInput();

  //When button is click move 100vh to next question; do this for each button
  $('ripple-element').on('click', function () {
    $('html, body').animate({
      scrollTop: $('.displayEvents').offset().top
    }, 1000);
  });

  //When button is click move 100vh to next question; do this for each button
  $('.backToTop').on('click', function () {
    $('html, body').animate({
      scrollTop: $('.mainHeader').offset().top
    }, 1000);
  });
},

  //Start of doc ready
  $(document).ready(function () {
    eventsApp.init();
  });

