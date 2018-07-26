// LOGOUT FUNCTION
const logout = (element) => {
  element.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem('token');
    localStorage.removeItem('rmwuser');

    window.location.href = 'index.html';
  });
}



(() => {
  const nav = `<li class="nav-item"> <a href="./login.html">LOGIN</a> </li>
               <li class="nav-item"> <a href="./register.html">REGISTER</a> </li>
              `
  const navRight = document.querySelector('nav .navbar .nav-right');
  // LOG USER OUT OF APP
  const logoutBtn = document.querySelector('nav .navbar ul.nav-right li a#logout');
  logout(logoutBtn)
  // REQUEST PARAMETERS
  const baseUrl = 'https://ride-m-way.herokuapp.com/api/v1';
 
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
    const token = localStorage.getItem('token') || 'notoken'
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
      const messageOutput = document.querySelector('#add-offer-modal .modal-content form p.success-message');
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
      messageOutput.style.color = 'gray';
      messageOutput.textContent = 'sending ...';
      
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
        } else if (data.message.includes('token')) {
          navRight.innerHTML = nav;
          messageOutput.innerHTML = '<p>Authentication Failed, Please <a style="text-decoration: none; color: dodgerblue;" href="./login.html">Login</a></p>';
          messageOutput.style.color = 'orangered';
          return;
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

