// BASE URL
const baseUrl = 'https://ride-m-way.herokuapp.com/api/v1';
const token = localStorage.getItem('token');
let displayUserInfo;
let fetchRidesTaken;
let fetchRidesOffered;
let viewRide;
let viewRequests;


(() => {
  //  MAIN OUTPUT CONTAINER
  const mainContainer = document.querySelector('main');
  const viewRequestsBtn = document.querySelector('.modal#detail-modal .modal-content .tile .tile-footer button.join');
  const rideDetailModal = document.querySelector('.modal#detail-modal');
  const modalCloseBtn = document.querySelector('.modal#detail-modal .modal-content .tile .tile-footer button.close');

  displayUserInfo = () => {
    // GET USER DATA
    fetch(`${baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'x-access-token': token,
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json();
      }
    }).then( data => {
      
      if (data.status) {
        const  userTemplate = `
          <div class="co-xl-12 co-lg-12 co-md-12 co-sm-12 co-xs-12">
              <img src="./images/johngorithm.jpeg" alt="${data.user.username} image">

              <h4 id="fullname">${data.user.firstname} ${data.user.lastname}</h4>
              <p class="small"><span id="phone"><span class="bullet"></span > @${data.user.username}</span></p>
              <p class="small"> <span id="email">${data.user.email}</span> </p>
              
          </div>
        `;
        document.querySelector('main header #user-info').innerHTML = userTemplate;
        fetchRidesTaken();
        fetchRidesOffered();
      } else if (data.message.includes('token')) {
        mainContainer.innerHTML = `<p class="auth-failure"> Authentication Failed, Please login <br><br> <a style="text-decoration: none" class="button button-blue" href="./login.html">LOGIN</a></p>`;
      } else {
        mainContainer.textContent = data.message;
      }
    }).catch(error => {
      mainContainer.style.color = 'orangered'
      mainContainer.textContent = error.message;
      mainContainer.style.paddingTop = '100px';
      mainContainer.style.textAlign = 'center';
    });
  }

  fetchRidesOffered = () => {
    const url = `${baseUrl}/users/rides/offered`;
    fetch(url, {
      method: 'GET',
      headers: {
        'x-access-token': token,
      }
    }).then(response => response.json()).then(data => {
      let ridesOfferedHtml = '';
      const offeredRidesContainer = document.querySelector('section#rides-offered .wrapper .container');
      const totalRidesOfferedDom = document.querySelector('main section#ride-details .square h1#offered');


      if (data.status) {
        // UPDATE RIDES TAKEN TOTAL
        totalRidesOfferedDom.textContent = data.total;
        // RENDER RIDES OFFERED
        data.rides.forEach(ride => {
          let date = new Date(ride.date);
          ridesOfferedHtml += `
            <div class="item">
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


                <div class="tile-footer center-text">
                    <button data-ride='${JSON.stringify(ride)}' onClick="viewRide(this, 'offered')" class="button button-blue view">VIEW</button>
                </div>
              </div>
            </div>
          `
        });

        offeredRidesContainer.innerHTML = ridesOfferedHtml;
      } else {
        totalRidesOfferedDom.textContent = -1;
        offeredRidesContainer.firstElementChild.textContent = data.message
      }
    }).catch( error => {
      totalRidesOfferedDom.textContent = -1;
      offeredRidesContainer.firstElementChild.textContent = error.message
    });
  }

  fetchRidesTaken = () => {
    const url = `${baseUrl}/users/rides/taken`;

    fetch(url, {
      method: 'GET',
      headers: {
        'x-access-token': token,
      }
    }).then(response => response.json())
      .then(data => {
      let ridesTakenHtml = '';
      const ridesTakenContainer = document.querySelector('section#rides-taken .wrapper .container');
      const totalRidesTakenDom = document.querySelector('main section#ride-details .square h1#taken');

      if (data.status) {
        // UPDATE RIDES TAKEN TOTAL
        totalRidesTakenDom.textContent = data.total;
        // RENDER RIDES OFFERED
        data.rides.forEach(ride => {
          let date = new Date(ride.date);
          ridesTakenHtml += `
            <div class="item">
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


                <div class="tile-footer center-text">
                    <button data-ride='${JSON.stringify(ride)}' onClick="viewRide(this, 'taken')" class="button button-blue view">VIEW</button>
                </div>
              </div>
            </div>
          `
        });

        ridesTakenContainer.innerHTML = ridesTakenHtml;
      } else {
        totalRidesTakenDom.textContent = -1;
        ridesTakenContainer.firstElementChild.textContent = data.message
      }
    }).catch( error => {
      totalRidesTakenDom.textContent = -1;
      ridesTakenContainer.firstElementChild.textContent = error.message
    });
  }

  // FETCH USER DATA
  if (token) {
    displayUserInfo();
  } else {
    document.querySelector('main').innerHTML = `<p class="auth-failure">Authentication Failed, Please login<br><br><a style="text-decoration: none" class="button button-blue" href="./login.html">LOGIN</a></p>`
  }

  // DISPLAY SINGLE RIDE INFO
  viewRide = (self, category) => {
    const info = JSON.parse(self.getAttribute('data-ride'))
    if (category === 'offered') {
      viewRequestsBtn.textContent = 'REQUESTS';
      viewRequestsBtn.setAttribute('onClick', 'viewRequests(this)');
      viewRequestsBtn.style.display = 'inline-block';
    } else {
      viewRequestsBtn.setAttribute('readonly', 'readonly')
      viewRequestsBtn.style.display = 'none';
    }

    const rideHeader = document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading h4 span')
    rideHeader.textContent = info.destination
    rideHeader.style.textTransform = 'uppercase';
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading p span').textContent = info.take_off_venue;
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body .row p.date').textContent = (new Date(info.date)).toDateString().slice(4, 15);
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body .row p.time').textContent = info.time.slice(0,5);
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body p.driver').textContent = info.creator;
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body.not-first span#capacity').textContent = info.capacity;
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body.not-first span#space-occupied').textContent = info.space_occupied;
    viewRequestsBtn.setAttribute('data-ride-id', info.ride_id)
    viewRequestsBtn.setAttribute('data-ride-destination', info.destination)

    // clear old message
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading span.message').textContent = '';
    rideDetailModal.style.display = 'block';
  }

  // closing the ride detail modal on clicking the modal overlay
  window.addEventListener( 'click', (event) => {
    if (event.target == rideDetailModal) {
      rideDetailModal.style.display = 'none';
    }
  });

  // closing the modal with the .close button
  modalCloseBtn.addEventListener('click', (event) => {
    rideDetailModal.style.display = 'none';
  });


  viewRequests = (self) => {
    const rmwRide = {
      rideId : self.getAttribute('data-ride-id'),
      destination: self.getAttribute('data-ride-destination'),
    }
    localStorage.setItem('rmwRide', JSON.stringify(rmwRide));
    window.location.href = './ride_requests.html';
  }


})();