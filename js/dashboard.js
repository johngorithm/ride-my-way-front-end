//VIEW SINGLE RIDE FUNCTION
let viewRide;
let joinRide;
let ownership = '';
let viewRequests;
const convertTimeTo12HoursFormat = (time)  => {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

(() => {
  const nav = `<li class="nav-item"> <a href="./login.html">LOGIN</a> </li>
               <li class="nav-item"> <a href="./register.html">REGISTER</a> </li>
              `
  const navRight = document.querySelector('nav .navbar .nav-right');
  const baseUrl = 'https://ride-m-way.herokuapp.com/api/v1';
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('rmwuser'))
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

      if (data.status) {
        data.rides.forEach(ride => {
        let date = new Date(ride.date);
        
        if (ride.creator_id === user.user_id ) {
          ownership = 'yours';
        } else {
          ownership = '';
        }

        rideHtml += `
          <div class="co-xl-3 co-lg-4 co-md-6 co-sm-6">
            <div class="tile">
                <div class="tile-heading center-text">
                    <p class="${(ownership ? 'tag' : '')}">${ownership}</p>
                    <h4>RIDE TO<br><span>${ride.destination}</span></h4>
                </div>

                <div class="tile-body">
                    <div class="row">
                        <div class="co-xl-6 co-lg-6 co-md-6 co-sm-6 co-xs-6 center-text border">
                            <p class="data-heading small">Date</p>
                            <p class="small info">${date.toDateString().slice(4, 15)}</p>
                        </div>
                        <div class="co-xl-6 co-lg-6 co-md-6 co-sm-6 co-xs-6 center-text">
                            <p class="data-heading small">Time</p>
                            <p class="small info">${convertTimeTo12HoursFormat(ride.time.slice(0,5))}</p>
                        </div>
                    </div>
                </div>
                <div class="tile-body not-first left-text">
                  <p class="left"><span class="badge">${ride.capacity}</span>capacity</p>
                  <p class="right"><span class="badge">${ride.space_occupied}</span>occupied</p> 
                </div>

                <div class="tile-footer center-text">
                    <button data-ownership="${(ownership === 'yours') ? 'true' : 'false'}" data-ride='${JSON.stringify(ride)}' onClick="viewRide(this)" class="button button-blue view">VIEW</button>
                </div>
              </div>
            </div>
          `
        });

        ridesDomContainer.innerHTML = rideHtml;  
      } else if (data.message.includes('token')) {
        navRight.innerHTML = nav;
        document.querySelector('main #rides-loader #loading').innerHTML = `<p> ${data.message}, Please login </p> <br><a style="text-decoration: none;" class="button button-blue" href="./login.html">LOGIN</a>`
      } else {
        document.querySelector('main #rides-loader #loading').innerHTML = `<p> ${data.message}</p>`
      }
    }).catch( error => {
      document.querySelector('main #rides-loader #loading').innerHTML = `<p>ERROR : ${error.message}</p>`
    })
  } else {
    navRight.innerHTML = nav;
    document.querySelector('main #rides-loader #loading').innerHTML = `<p> Authentication Failed, Please login </p> <br><a style="text-decoration: none;" class="button button-blue" href="./login.html">LOGIN</a>`
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

  // SEND REQUEST TO JOIN A RIDE OFFER
  const joinRideBtn = document.querySelector('.modal#detail-modal .modal-content .tile .tile-footer button.join');
  joinRide = (self) => {
    const messageOutput = document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading span.message');
    messageOutput.style.color = 'gray';
    messageOutput.textContent = 'sending ...';
  

    const url = `${baseUrl}/rides/${self.getAttribute('rideId')}/requests`;
    const token = localStorage.getItem('token');
    
    
    if (token) {
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
        } else if (data.message.includes('token')) {
          navRight.innerHTML = nav;
          document.querySelector('main #rides-loader #loading').innerHTML = `<p style="margin-top: 50px;"> ${data.message}, Please login </p> <br><a style="text-decoration: none;" class="button button-blue" href="./login.html">LOGIN</a>`      
          rideDetailModal.style.display = 'none';
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
    } else {
      navRight.innerHTML = nav;
      document.querySelector('main #rides-loader #loading').innerHTML = `<p style="margin-top: 50px;"> Authentication Failed, Please login </p> <br><a style="text-decoration: none;" class="button button-blue" href="./login.html">LOGIN</a>`      
      rideDetailModal.style.display = 'none';
    }
    
  }; //END OF JOIN RIDE

  // DISPLAY SINGLE RIDE INFO
  viewRide = (self) => {
    const info = JSON.parse(self.getAttribute('data-ride'));
    const ownership = JSON.parse(self.getAttribute('data-ownership'));

    const rideHeader = document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading h4 span')
    rideHeader.textContent = info.destination
    rideHeader.style.textTransform = 'uppercase';
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading p span').textContent = info.take_off_venue;
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body .row p.date').textContent = (new Date(info.date)).toDateString().slice(4, 15);
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body .row p.time').textContent = convertTimeTo12HoursFormat(info.time.slice(0,5));
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body p.driver').textContent = info.creator;
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body.not-first span#capacity').textContent = info.capacity;
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-body.not-first span#space-occupied').textContent = info.space_occupied;
    if (ownership) {
      joinRideBtn.setAttribute('data-ride-id', info.ride_id)
      joinRideBtn.setAttribute('data-ride-destination', info.destination)
      joinRideBtn.textContent = 'REQUESTS';
      joinRideBtn.setAttribute('onClick', 'viewRequests(this)')
    } else {
      joinRideBtn.setAttribute('rideId', info.ride_id);
      joinRideBtn.textContent = 'JOIN';
      joinRideBtn.setAttribute('onClick', 'joinRide(this)')
    }

    // clear old message
    document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading span.message').textContent = '';
    rideDetailModal.style.display = 'block';
  }

  
  //VIEW REQUESTS FOR USER`S OWN RIDES
  viewRequests = (self) => {
    const rmwRide = {
      rideId : self.getAttribute('data-ride-id'),
      destination: self.getAttribute('data-ride-destination'),
    }
    localStorage.setItem('rmwRide', JSON.stringify(rmwRide));
    window.location.href = './ride_requests.html';
  }


  

  // LOG USER OUT OF APP
  const logoutBtn = document.querySelector('nav .navbar ul.nav-right li a#logout');
  logoutBtn.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem('token');
    localStorage.removeItem('rmwuser');

    window.location.href = 'index.html';
  });



})();


