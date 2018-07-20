
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
                    <button data-ride-info="${ride}" class="button button-blue view">VIEW</button>
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
})();