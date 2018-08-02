const baseUrl = 'https://ride-m-way.herokuapp.com/api/v1';


(() => {

  const nav = `<li class="nav-item"> <a href="./login.html">LOGIN</a> </li>
               <li class="nav-item"> <a href="./register.html">REGISTER</a> </li>
              `
  const navRight = document.querySelector('nav .navbar .nav-right');
  // LOAD REQUESTS
  
  const token = localStorage.getItem('token')
  const notificationsDomContainer = document.querySelector('main#notification-loader');
  if (token) {
    fetch(`${baseUrl}/users/me/notifications`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'x-access-token': token,
      }
    })
    .then(response => {
      return response.json();
    }).then(data => {
      let notificationHtml = '';
      if (data.status) {
        const userTimeZone = new Date().getTimezoneOffset();

        data.notifications.forEach(notification => {
          let receivedOn = notification.received_on
          //receivedOn = `${receivedOn.slice(0, receivedOn.length - 1)}+01:00`

          const receivedOnTimeValue = (new Date(receivedOn)).valueOf();

          let currentTimeValue = Date.now();
          currentTimeValue = currentTimeValue + (userTimeZone * 60 * 1000)
          let timeDifference = currentTimeValue - receivedOnTimeValue;

          let ago = '';
          if (Math.floor(timeDifference / (24 * 60 * 60 * 1000) > 1)) {
            ago = `${Math.floor(timeDifference / (24 * 60 * 60 * 1000))} days ago`
          } else if (Math.floor(timeDifference / (60 * 60 * 1000)) > 1) {
            ago = `${Math.floor(timeDifference / (60 * 60 * 1000))} hours ago`
          } else if (Math.floor(timeDifference / (60 * 1000)) >= 1){
            ago = `${Math.floor(timeDifference / (60 * 1000))} mins ago`
          } else {
            ago = `${Math.floor(timeDifference / 1000)} secs ago`
          }

          notificationHtml += `
            <div class="notify-container row">
              <div id="image-container">
                  <img src="${notification.image_url || './images/user.png'}" alt="sender image">
              </div>
              <div id="message-container" class="left-text">
                  <p>${notification.message}</p>
              </div>
              <span id="when" >${ago}</span> <span id="sender-username"> <i class="fas fa-user"></i> <a href="#" >${notification.username} </a></span>
          </div>
          `
        });

        notificationsDomContainer.innerHTML = notificationHtml;
      } else if (data.message.includes('token')) {
        navRight.innerHTML = nav;
        document.querySelector('main #loading').innerHTML = `${data.message}, Please login <br><br><a style="text-decoration: none" class="button button-blue dropdown" href="./login.html">LOGIN</a>`
      } else {
        document.querySelector('main #loading').innerHTML = `${data.message}`
      }
      

    }).catch( error => {
      document.querySelector('main #loading').innerHTML = `Error: ${error.message}`
    })
  } else {
    navRight.innerHTML = nav;
    document.querySelector('main #loading').innerHTML = `You are not logged in, Please login <a href="./login.html">LOGIN</a>`    
  }


})();