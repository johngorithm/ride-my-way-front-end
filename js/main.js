$(document).ready(function () {
  // TOGGLING NAVBAR ON SMALL SCREENS
  $('nav .navbar > p.navbar-toggle').on('click', function () {
    $('nav.navigation .navbar .nav-right').addClass('animate').toggle();
  });

  // RESPONSIVE NAV BAR FUNCTIONALITY
  $(window).on('resize', function () {
    if ($(this).width() > 700) {
      $('nav.navigation .navbar .nav-right').css('display', 'block');
    } else if( $('nav.navigation .navbar .nav-right').css('display') == 'block') {
                $('nav.navigation .navbar .nav-right').css('display', 'none');
            }
  });

  // ADD OFFER FORM MODAL JS
  $('nav.navigation .navbar ul li.nav-item a[href="#"]').on('click', function (event) {
    event.preventDefault();
    $('.modal#add-offer-modal').css('display', 'block');
  });

  // ADD OFFER MODAL .close button
  $('.modal#add-offer-modal button.close').on('click', function (event) {
    event.preventDefault();
    $('.modal#add-offer-modal').css('display', 'none');
  });

  // ADD OFFER MODAL .create button
  $('.modal#add-offer-modal button.create').on('click', function (event) {
    event.preventDefault();
    // form validate
    let inputError = '';
    let destination = $('#add-offer-modal .modal-content form input[name=destination]');
    let time = $('#add-offer-modal .modal-content form input[name=time]');
    let date = $('#add-offer-modal .modal-content form input[name=date]');
    let takeOffVenue = $('#add-offer-modal .modal-content form input[name=takeoff_venue]');

    let formFields = [destination, time, date, takeOffVenue];
    let isAllProvided = true;
    formFields.forEach(function (field) {
      if (!field.val()) {
        if (field.attr('name') == 'destination') {
          inputError = 'destination is required!';
          field.prev().find('span').text(inputError);
        } else if (field.attr('name') == 'time') {
          inputError = 'time is required!';
          field.prev().find('span').text(inputError);
        } else if (field.attr('name') == 'date') {
          inputError = 'date is required!';
          field.prev().find('span').text(inputError);
        } else if (field.attr('name') == 'takeoff_venue') {
          inputError = 'takeoff venue is required!';
          field.prev().find('span').text(inputError);
        }
        isAllProvided = false;
      }else {
        field.prev().find('span').text('');
      }
    });

    if (isAllProvided) {
      $('#add-offer-modal .modal-content form p.success-message').text('YOUR RIDE OFFER IS SUCCESSFULLY CREATED!');
      return false;
    }
  });

  // LOGIN


  // REGISTER

  // SHOW SINGLE RIDE DETAILS

  // REQUESTS : ACCEPT
  $('.inner-container div button.accept-btn').on('click', function () {
    $(this).text('ACCEPTED').attr('disabled', 'disabled').css({
    	'background':'rgb(7, 199, 7)',
    	'cursor': 'default',
    	'color': 'white',
    }).removeClass('button-blue').on('hover', function() {
    	this.css('border', '1px solid transparent');
    });
  });


  // USING THE REJECT BUTTON FOR REQUESTS
  $('.inner-container div button.reject-btn').on('click', function (event) {
    let passenger = $(this).parent().prev().children().children().html();

    let status = $(this).prev().text();

    if (status == 'ACCEPTED') {
      var responseHtml = '<p class="error-message">Sorry, You have already accepted this ride';
      $('#reject-ride-request-modal .modal-content .tile .tile-body').html(responseHtml);
      $('#reject-ride-request-modal .modal-content .tile .tile-footer button.reject-btn').hide();
      $('#reject-ride-request-modal').css('display', 'block');
    }else {
      let requestId = $(this).parent().parent().attr('id');
      var responseHtml = '<p class="confirm-msg small">Are you sure you want to REJECT a ride request from <span>John</span> </p> <p class="error-message smaller"></p>';
      $('#reject-ride-request-modal .modal-content .tile .tile-body').html(responseHtml);
      $('#reject-ride-request-modal .modal-content .tile .tile-footer button.reject-btn').show().data('request_id', requestId);
      $('#reject-ride-request-modal .modal-content .tile .tile-body p span').text(passenger);
      $('#reject-ride-request-modal').css('display', 'block');
    }
  });

  // REMOVING THE REJECT MODAL POP ON WINDOW CLICK
  $(window).click(function (event) {
    let target = $(event.target);

    if (target.is('#reject-ride-request-modal')) {
      $('#reject-ride-request-modal').css('display', 'none');
    }
  });

  // close button for #reject-ride-request-modal
  $('.modal#reject-ride-request-modal .modal-content .tile .tile-footer button.close').on('click', function (event) {
    $('.modal#reject-ride-request-modal').css('display', 'none');
  });

  // CONFIRMED REJECTION ACTION
  $('.modal#reject-ride-request-modal .modal-content .tile .tile-footer button.reject-btn').on('click', function () {
    let requestId = $(this).data('request_id');
    $(`.inner-container#${requestId}`).css('display', 'none');
    $('.modal#reject-ride-request-modal .modal-content .tile .tile-body p.error-message').text('RIDE REJECTED');
    setTimeout(function () {
      $('.modal#reject-ride-request-modal').css('display', 'none');
    }, 2000);
  });
});
