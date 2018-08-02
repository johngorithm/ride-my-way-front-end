
const loginBtn = document.querySelector('main.content .wrapper form button#login-btn');
const baseUrl = 'https://ride-m-way.herokuapp.com/api/v1';

loginBtn.addEventListener('click', (event) => {
  event.preventDefault();
    let err = '';
    let errorOutput = document.querySelector('.content .wrapper form p.error-message');
    let successMessageOutput = document.querySelector('.content .wrapper form p.success-message');
    let username = document.querySelector('.content .wrapper form input[name=username]').value;
    let password = document.querySelector('.content .wrapper form input[name=password]').value;

    errorOutput.style.color = 'orangered';

    if (!username && !password) {
      err = 'Username and Password are both required!';
      errorOutput.innerHTML = err;
    } else if (!username && password) {
      err = 'Username is required!';
      if (!(password.length >= 6)) {
        err = 'Username is required and Password is less than 6 characters';
      }
      errorOutput.innerHTML = err;
    } else if (!password && username) {
      err = 'Password is required!';
      errorOutput.innerHTML = err;
    } else if (username && password) {
      if (!(password.length >= 6)) {
        err = 'Password is less than 6 characters';
        errorOutput.innerHTML = err;
      }else {
        errorOutput.style.color = 'dodgerblue';
        errorOutput.textContent = 'Logging In ...';
        loginBtn.style.cursor = 'progress';
        loginBtn.setAttribute('readonly', 'readonly')
        fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({
            username: username,
            password: password,
          }),
          headers: {
            'Content-type': 'application/json'
          }
        }).then((response) => {
          return response.json();
        }).then( data => {
          loginBtn.style.cursor = 'initial';
          if (data.status) {
            errorOutput.innerHTML = '';
            successMessageOutput.innerHTML = data.message;
            localStorage.setItem('token', data.token)
            localStorage.setItem('rmwuser', JSON.stringify(data.user));
            setTimeout(() => {
              window.location.href = 'home.html'
            }, 2000)
          }else{
            loginBtn.removeAttribute('readonly');
            errorOutput.style.color = 'orangered';
            errorOutput.innerHTML = data.message;
          }
        }).catch((error) => {
          loginBtn.removeAttribute('readonly');
          loginBtn.style.cursor = 'initial';
          errorOutput.style.color = 'orangered';
          errorOutput.innerHTML = error.message;
        })
        
      }
    }
})