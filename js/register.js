
const baseUrl = 'https://ride-m-way.herokuapp.com/api/v1';
const registerForm = document.querySelector('main.content .wrapper form');


registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  let errorOutput = document.querySelector('.content .wrapper form p.error-message');
  let successMessageOutput = document.querySelector('.content .wrapper form p.success-message');
  errorOutput.textContent = '';
  errorOutput.style.color = 'orangered';

  const firstname = document.querySelector('.content .wrapper form input[name=firstname]');
  const lastname = document.querySelector('.content .wrapper form input[name=lastname]');
  const email = document.querySelector('.content .wrapper form input[name=email]');
  const username = document.querySelector('.content .wrapper form input[name=username]');
  const password = document.querySelector('.content .wrapper form input[name=password]');

  const fields = [firstname, lastname, email, username, password];
  let isValidData = true;

  fields.forEach((field) => {
    if (!field.value) {
      field.previousElementSibling.firstElementChild.textContent = ' * required!';
      isValidData = false;
    } else if(field.getAttribute('name') === 'password'){
        if(!(field.value.length >= 6)){
            field.previousElementSibling.firstElementChild.textContent = 'Password must be at least 6 characters!';
            isValidData = false;
        } else {
          field.previousElementSibling.firstElementChild.textContent = '';
        }
    } else if (field.getAttribute('name') === 'email') {
      const regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regEx.test(field.value)) {
        field.previousElementSibling.firstElementChild.textContent = 'email address is invalid';
        isValidData = false;
      } else {
        field.previousElementSibling.firstElementChild.textContent = '';
      }
    } else {
      field.previousElementSibling.firstElementChild.textContent = '';
    }
  });

  if (isValidData) {
    const formData = {
      username : username.value,
      password : password.value,
      firstname : firstname.value,
      lastname : lastname.value,
      email : email.value,
    }

    errorOutput.style.color = 'dodgerblue';
    errorOutput.textContent = 'Registering ...';
    
    fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then( data => {
      if (data.status) {
        errorOutput.textContent = '';
        successMessageOutput.textContent = data.message;
        localStorage.setItem('token', data.token);
        localStorage.setItem('rmwuser', JSON.stringify(data.user));
        setTimeout(() => {
          window.location.href = 'home.html'
        }, 2000)
      } else {
        errorOutput.style.color = 'orangered';
        errorOutput.textContent = data.message;
      }
    }).catch((error) => {
      errorOutput.style.color = 'orangered';
      errorOutput.textContent = error.message;
    })
  }
});

