// LOGOUT FUNCTION
const logout = (element) => {
  element.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.clear();

    window.location.href = 'index.html';
  });
}

// INDEX PAGE
const indexRequest = () => {
  const user = JSON.parse(localStorage.getItem('rmwuser'));
  if (user.username) {
    window.location.href = './home.html';
  } else {
    window.location.href = './index.html';
  }
}

(() => {
  

  const nav = `
    <li class="nav-item"> <a href="./login.html">LOGIN</a> </li>
    <li class="nav-item"> <a href="./register.html">REGISTER</a> </li>
  `;
  const navRight = document.querySelector('nav .navbar .nav-right');
  // LOG USER OUT OF APP
  const logoutBtn = document.querySelector('nav .navbar ul.nav-right li a#logout');
  if (logoutBtn) {
    logout(logoutBtn);
  }

  // INDEX REQUEST
  const indexNav = document.querySelector('nav .navbar .nav-left li a');
  indexNav.addEventListener('click', (event) => {
    event.preventDefault();

    indexRequest();
  })

  // DROPDOWN MENU
  const usernameNavBtn = document.querySelector('nav .navbar .nav-right li#dropdown-nav > a');
  let clickCounter = 0
  if (usernameNavBtn) {
    usernameNavBtn.addEventListener('click', (event) => {
      event.preventDefault();
      if (clickCounter > 0) {
        document.querySelector('nav .navbar .nav-right li#dropdown-nav div.droppy').style.display = 'none';
        clickCounter -= 1;
      } else {
        document.querySelector('nav .navbar .nav-right li#dropdown-nav div.droppy').style.display = 'block'; 
        clickCounter += 1;     
      }
    });
  }

  // SHOW USER NAME ON NAV BAR
  if (usernameNavBtn) {
    usernameNavBtn.firstElementChild.textContent = JSON.parse(localStorage.getItem('rmwuser')).username;
  }
  

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
    const now = new Date();

    formFields.forEach((field) => {
      if (!field.value) {
        inputError = '* required!';
        field.previousElementSibling.firstElementChild.textContent = inputError;
        isAllProvided = false;
      } else if (field === date) {
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        let currentDate = '';

        if (month < 10 && day < 10) {
          currentDate = `${year}-0${month}-0${day}`;
        } else if (month < 10 && day > 9) {
          currentDate = `${year}-0${month}-${day}`;
        } else if (month > 9 && day < 10) {
          currentDate = `${year}-${month}-0${day}`;
        } else {
          currentDate = `${year}-${month}-${day}`;
        }
        
        if (currentDate > field.value ) {
          inputError = 'date is past';
          field.previousElementSibling.firstElementChild.textContent = inputError;
          isAllProvided = false;
          return true;
        } else if (currentDate === field.value) {
          field.previousElementSibling.firstElementChild.textContent = '';
          if (time.value.length > 1) {
            const currentHour = now.getHours();
            const userInputedHour = parseInt(time.value);
            if (currentHour > userInputedHour) {
              time.previousElementSibling.firstElementChild.textContent = 'time is past';
              isAllProvided = false;
            } else if (currentHour === userInputedHour) {
              const userInputedMinutes = Number(time.value.split(':')[1]);
              const currentMinutes = (new Date()).getMinutes();
              if (currentMinutes > userInputedMinutes) {
                time.previousElementSibling.firstElementChild.textContent = 'time is past';
                isAllProvided = false;
              } else if (!(userInputedMinutes - currentMinutes > 20)) {
                time.previousElementSibling.firstElementChild.textContent = 'take off time is less than 20 mins';
                isAllProvided = false;
              } else {
                time.previousElementSibling.firstElementChild.textContent = '';
              }
            } else {
              time.previousElementSibling.firstElementChild.textContent = '';
            }
          } else {
            time.previousElementSibling.firstElementChild.textContent = '* required!';
            isAllProvided = false;
          }
        } else {
          field.previousElementSibling.firstElementChild.textContent = '';
        }
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
          }, 1000)
        } else if (data.message.includes('token')) {
          navRight.innerHTML = nav;
          messageOutput.innerHTML = '<p>Authentication Failed, Please <a style="text-decoration: none; color: dodgerblue;" href="./login.html">Login</a></p>';
          messageOutput.style.color = 'orangered';
          localStorage.clear();
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

