

let confirmRequest;
let acceptOrRejectRequest;
let rejectRequest;
const baseUrl = 'https://ride-m-way.herokuapp.com/api/v1/';

document.body.onload = () => {
  const nav = `<li class="nav-item"> <a href="./login.html">LOGIN</a> </li>
               <li class="nav-item"> <a href="./register.html">REGISTER</a> </li>
              `
  const navRight = document.querySelector('nav .navbar .nav-right');
  // LOAD REQUESTS
  
  const token = localStorage.getItem('token') || 'no-token';
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
      if (data.status) {
        data.requests.forEach(request => {
        let tagColor;
        let disableThis = false;
        if (request.status == 'accepted') {
          tagColor = 'rgb(65, 220, 65)';
          disableThis = true;
        } else if (request.status == 'rejected') {
          tagColor = 'orangered';
          disableThis = true;
        } else {
          tagColor = 'dodgerblue';
        }
        requestHtml += `
          <div id="${request.request_id}" class="row request">
            
            <div class="request-msg  co-xl-7 co-lg-7 co-md-12 co-sm-12">
                <span style="background : ${tagColor}" class="tag">${request.status}</span>
                <p class="small"> <strong>${request.sender}</strong> want to ride with you to <strong>${request.destination}</strong></p>
            </div>
            <div class="request-btns co-xl-5 co-lg-5 co-md-12 co-sm-12">
                <button ${(disableThis) ? 'disabled style="cursor:not-allowed"' : ''} onClick="confirmRequest(this, 'reject')" data-identities = '${JSON.stringify({ requestId: request.request_id, rideId: request.ride_id})}' data-sender="${request.sender}" class="button button-white reject-btn">REJECT</button>
                <button ${(disableThis) ? 'disabled style="cursor:not-allowed"' : ''} onClick="confirmRequest(this, 'accept')" data-identities = '${JSON.stringify({ requestId: request.request_id, rideId: request.ride_id})}' data-sender="${request.sender}" class="button button-blue accept-btn">ACCEPT</button>
            </div>
          </div>
          `
        });

        requestsDomContainer.innerHTML = requestHtml;
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

  // DISPLAY REJECT OR ACCEPT REQUEST ACTION MODAL
  confirmRequest= (self, action) => {
    const identities = self.getAttribute('data-identities');
    const sender = self.getAttribute('data-sender');
    const yesBtn = document.querySelector('.modal#reject-ride-request-modal .modal-content .tile .tile-footer button.yes-btn');
    yesBtn.setAttribute('data-request', identities);
    yesBtn.setAttribute('data-action', action);
    yesBtn.style.cursor = 'pointer';
    yesBtn.removeAttribute('disabled');
    document.querySelector('#reject-ride-request-modal .modal-content .tile .tile-body p span').textContent = sender;
    document.querySelector('#reject-ride-request-modal .modal-content .tile .tile-body p strong').textContent = action.toUpperCase();
    document.querySelector('.modal#reject-ride-request-modal .modal-content .tile .tile-body p.error-message').textContent = '';
    
    document.querySelector('#reject-ride-request-modal').style.display = 'block';
  }

  acceptOrRejectRequest = (self) => {
    // CONFIRMED REJECTION/ACCEPTANCE ACTION
    const token = localStorage.getItem('token');
    const messageOutput = document.querySelector('.modal#reject-ride-request-modal .modal-content .tile .tile-body p.error-message');
    const requestData = JSON.parse(self.getAttribute('data-request'));
    const action = self.getAttribute('data-action');
    messageOutput.textContent = ''
    

    if (token) {
      messageOutput.textContent = (`${action}ing ...`).toUpperCase()
      messageOutput.style.color = 'dodgerblue';
      fetch(`${baseUrl}/users/rides/${requestData.rideId}/requests/${requestData.requestId}?action=${action}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'x-access-token': token,
        }
      })
      .then(response => {
        return response.json();
      }).then(data => {
        if (data.status){
          const requestTag = document.getElementById(requestData.requestId).firstElementChild.firstElementChild;
          const actionBtns = document.getElementById(requestData.requestId).firstElementChild.nextElementSibling.children;
          messageOutput.textContent = data.message;
          self.setAttribute('disabled', 'disabled');
          self.style.cursor = 'not-allowed';
          for ( let btn of actionBtns) {
            btn.setAttribute('disabled', 'disabled');
            btn.style.cursor = 'not-allowed';
          }

          if (data.request.status === 'accepted') {
            requestTag.style.backgroundColor = 'rgb(65, 220, 65)';
            requestTag.textContent = 'accepted';
            messageOutput.style.color = 'rgb(65, 220, 65)';
          } else {
            requestTag.style.backgroundColor = 'orangered';
            requestTag.textContent = 'rejected';
            messageOutput.style.color = 'rgb(65, 220, 65)';
          }
        } else if (data.message.includes('token')) {
          navRight.innerHTML = nav;
          requestsDomContainer.innerHTML = `${data.message}, Please login<br><br><a style="text-decoration: none" class="button button-blue dropdown" href="./login.html">LOGIN</a>`
          document.querySelector('.modal#reject-ride-request-modal').style.display = 'none'
        } else {
          messageOutput.textContent = `${data.message}`
          messageOutput.style.color = 'orangered';
        }
      }).catch( error => {
        messageOutput.textContent = `Error: ${error.message}`
      })
    } else {
      navRight.innerHTML = nav;
      requestsDomContainer.innerHTML = `${data.message}, Please login <br><br><a style="text-decoration: none" class="button button-blue dropdown" href="./login.html">LOGIN</a>`
      document.querySelector('.modal#reject-ride-request-modal').style.display = 'none'
    } 
  }

  const requestActionConfirmationModal = document.querySelector('.modal#reject-ride-request-modal');
  // close button for #reject-ride-request-modal
  document.querySelector('.modal#reject-ride-request-modal .modal-content .tile .tile-footer button.close').addEventListener('click', (event) => {
    requestActionConfirmationModal.style.display = 'none';
  });

  // REMOVING THE REQUEST ACTION MODAL POP ON WINDOW CLICK
  window.addEventListener( 'click', (event) => {
    if (event.target == requestActionConfirmationModal) {
      requestActionConfirmationModal.style.display = 'none';
    }
  });


  

}


