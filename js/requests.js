const logout = (element) => {
  element.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem('token');
    localStorage.removeItem('rmwuser');

    window.location.href = 'index.html';
  });
}

document.body.onload = () => {
   // LOG USER OUT OF APP
  const logoutBtn = document.querySelector('nav .navbar ul.nav-right li a#logout');
  logout(logoutBtn)

  // LOAD REQUESTS
  const baseUrl = 'http://localhost:9000/api/v1';
  const token = localStorage.getItem('token');
  const requestsDomContainer = document.querySelector('main#request-loader');
  if (token) {
    fetch(`${baseUrl}/users/rides/requests`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'x-access-token': token,
      }
    })
    .then(response => {
      return response.json();
    }).then(data => {
      let requestHtml = '';
      if (data.requests) {
        console.log(data.requests);
        data.requests.forEach(request => {
        requestHtml += `
          <div id="${request.request_id}" class="row request">
            
            <div class="request-msg  co-xl-7 co-lg-7 co-md-12 co-sm-12">
                <p class="small"> <strong>${request.sender}</strong> want to ride with you to <strong>${request.destination}</strong></p>
            </div>
            <div class="request-btns co-xl-5 co-lg-5 co-md-12 co-sm-12">
                <button class="button button-white reject-btn">REJECT</button>
                <button class="button button-blue accept-btn">ACCEPT</button>
            </div>
        </div>
        `
      });

      requestsDomContainer.innerHTML = requestHtml;  
      } else {
        document.querySelector('main #loading').innerHTML = `${data.message}, Please login <p><a href="./login.html">LOGIN</a><p>`
      }
      

    }).catch( error => {
      document.querySelector('main #loading').innerHTML = `Error: ${error.message}`
      throw new Error(error.message);
    })
  } else {
    document.querySelector('main #loading').innerHTML = `You are not logged in, Please login <a href="./login.html">LOGIN</a>`    
  }
}