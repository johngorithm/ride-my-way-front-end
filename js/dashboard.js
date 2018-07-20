//VIEW SINGLE RIDE FUNCTION
let viewRide;

(() => {
  const baseUrl = 'http://localhost:9000/api/v1';
  const token = localStorage.getItem('token');
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

    }).catch( error => {
      console.log(error.message);
    })
  }

    
    const rideDetailModal = document.querySelector('.modal#detail-modal');
    // closing the ride detail modal on clicking the modal overlay
    $(window).click = (event) => {
      if (event.target === '#detail-modal') {
        rideDetailModal.style.display = 'none';
      }
    };

    // closing the modal with the .close button
    const modalCloseBtn = document.querySelector('.modal#detail-modal .modal-content .tile .tile-footer button.close');
    modalCloseBtn.addEventListener('click', (event) => {
      rideDetailModal.style.display = 'none';
    });

    // RESPONSE INFO
    const joinRideBtn = document.querySelector('.modal#detail-modal .modal-content .tile .tile-footer button.join');
    joinRideBtn.addEventListener('click', function () {
      document.querySelector('.modal#detail-modal .modal-content .tile .tile-heading span.message').textContent = 'REQUEST SENT';
      
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
})();

