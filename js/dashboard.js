//VIEW SINGLE RIDE FUNCTION
let viewRide;

(() => {
  const baseUrl = 'http://localhost:9000/api/v1';
  const token = localStorage.getItem('token') || 'no-token';
  const ridesDomContainer = document.querySelector('main.wrapper .row#rides-loader');
  if (token) {
    fetch(`${baseUrl}/rides`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'x-access-token': token,
      }
    })
    .then(response => {
      return response.json();
    }).then(data => {
      let rideHtml = '';
      if (data.rides) {
        data.rides.forEach(ride => {
        let date = new Date(ride.date);
        rideHtml += `
          <div class="co-xl-3 co-lg-4 co-md-6 co-sm-6">
            <div class="tile">
                <div class="tile-heading center-text">
                    <h4>RIDE TO<br><span>${ride.destination}</span></h4>
                </div>

                <div class="tile-body">
                    <div class="row">
                        <div class="co-xl-6 co-lg-6 co-md-6 co-sm-6 co-xs-6 center-text border">
                            <p class="data-heading small">Date</p>
                            <p class="small">${date.toDateString().slice(4, 15)}</p>
                        </div>
                        <div class="co-xl-6 co-lg-6 co-md-6 co-sm-6 co-xs-6 center-text">
                            <p class="data-heading small">Time</p>
                            <p class="small">${ride.time.slice(0,5)}</p>
                        </div>
                    </div>
                </div>
                <div class="tile-body not-first left-text">
                  <p class="left"><span class="badge">${ride.capacity}</span>capacity</p>
                  <p class="right"><span class="badge">${ride.space_occupied}</span>occupied</p> 
                </div>

                <div class="tile-footer center-text">
                    <button data-ride='${JSON.stringify(ride)}' onClick="viewRide(this)" class="button button-blue view">VIEW</button>
                </div>
            </div>
          </div>
        `
      });

      ridesDomContainer.innerHTML = rideHtml;  
      } else {
        document.querySelector('main #rides-loader #loading').innerHTML = `${data.message}, Please login <a href="./login.html">LOGIN</a,>`
      }
      

    }).catch( error => {
      console.log(error.message);
    })
  }

    
  const rideDetailModal = document.querySelector('.modal#detail-modal');
  // closing the ride detail modal on clicking the modal overlay
  window.addEventListener( 'click', (event) => {
    if (event.target == rideDetailModal) {
      rideDetailModal.style.display = 'none';
    }
  });

  // closing the modal with the .close button
  const modalCloseBtn = document.querySelector('.modal#detail-modal .modal-content .tile .tile-footer button.close');
  modalCloseBtn.addEventListener('click', (event) => {
    rideDetailModal.style.display = 'none';
  });

  // RESPONSE INFO
  const joinRideBtn = document.querySelector('.modal#detail-modal .modal-content .tile .tile-footer button.join');
  joinRideBtn.addEventListener('click', function () {
    const messageOutput = document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading span.message');
    messageOutput.style.color = 'gray';
    messageOutput.textContent = 'sending ...';
    
    const url = `${baseUrl}/rides/${this.getAttribute('rideId')}/requests`;
    
    fetch(url, {
      method: 'POST',
      headers: {
        'x-access-token': token,
      }
    }).then( response => {
        return response.json();
    }).then(data => {
      if (data.status) {
        messageOutput.textContent = data.message;
        messageOutput.style.color = 'rgb(10, 200, 32)';
      } else {
        messageOutput.textContent = data.message;
        messageOutput.style.color = 'orangered';
        return;
      }
    }).catch( error => {
      messageOutput.textContent = error.message;
      messageOutput.style.color = 'orangered';
      return
    })
  });

  // DISPLAY SINGLE RIDE INFO
  viewRide = (self) => {
    const info = JSON.parse(self.getAttribute('data-ride'))

    const rideHeader = document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading h4 span')
    rideHeader.textContent = info.destination
    rideHeader.style.textTransform = 'uppercase';
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading p span').textContent = info.take_off_venue;
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body .row p.date').textContent = (new Date(info.date)).toDateString().slice(4, 15);
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body .row p.time').textContent = info.time.slice(0,5);
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body p.driver').textContent = info.creator;
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body.not-first span#capacity').textContent = info.capacity;
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body.not-first span#space-occupied').textContent = info.space_occupied;
    joinRideBtn.setAttribute('rideId', info.ride_id)

    // clear old message
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading span.message').textContent = '';
    rideDetailModal.style.display = 'block';
  }


  // ADD OFFER FORM MODAL JS
  const addRideModal = document.querySelector('.modal#add-offer-modal');
  document.querySelector('nav.navigation .navbar ul li.nav-item a[href="#"]').addEventListener('click', (event) => {
    event.preventDefault();
    addRideModal.style.display = 'block';
  });

  // ADD OFFER MODAL .close button
  document.querySelector('.modal#add-offer-modal button.close').addEventListener('click', (event) => {
    event.preventDefault();
    addRideModal.style.display = 'none';
  });

  // ADD OFFER MODAL .create button
  document.querySelector('.modal#add-offer-modal #create-offer-form').addEventListener('submit', (event) => {
    event.preventDefault();
    // form validate
    let inputError = '';
    const destination = document.querySelector('#add-offer-modal .modal-content form input[name=destination]');
    const time = document.querySelector('#add-offer-modal .modal-content form input[name=time]');
    const date = document.querySelector('#add-offer-modal .modal-content form input[name=date]');
    const capacity = document.querySelector('#add-offer-modal .modal-content form input[name=capacity]');
    const takeOffVenue = document.querySelector('#add-offer-modal .modal-content form input[name=takeoff_venue]');

    const formFields = [destination, time, date, capacity, takeOffVenue];
    let isAllProvided = true;
    formFields.forEach((field) => {
      if (!field.value) {
        inputError = '* required!';
        field.previousElementSibling.firstElementChild.textContent = inputError;
        isAllProvided = false;
      } else {
        field.previousElementSibling.firstElementChild.textContent = '';
      }
    });

    if (isAllProvided) {
      document.querySelector('#add-offer-modal .modal-content form p.success-message').textContent = 'OFFER SUCCESSFUL';
      const messageOutput = document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading span.message');
      messageOutput.style.color = 'gray';
      messageOutput.textContent = 'sending ...';
      
      const url = `${baseUrl}/users/rides`;

      const formData = {
        destination: destination.value,
        time: time.value,
        date: date.value,
        capacity: capacity.value,
        takeOffVenue: takeOffVenue.value,
      }
      
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'x-access-token': token,
          'Content-type': 'application/json'
        }
      }).then( response => {
          return response.json();
      }).then(data => {
        if (data.status) {
          messageOutput.textContent = data.message;
          messageOutput.style.color = 'rgb(10, 200, 32)';
          setTimeout(() => {
            window.location.href = 'home.html'
          }, 2000)
        } else {
          messageOutput.textContent = data.message;
          messageOutput.style.color = 'orangered';
          return;
        }
      }).catch( error => {
        messageOutput.textContent = error.message;
        messageOutput.style.color = 'orangered';
        return
      });
    }
  });


})();


