const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

loginForm.onsubmit = login;
registerForm.onsubmit = register;

function login(event) {
  event.preventDefault();

  const loginData = {
    email: loginForm.querySelector("#email").value,
    password: loginForm.querySelector("#password").value,
  };

  fetch("https://ets-pemrograman-web-f.cyclic.app/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error("Login Failed");
      }
      return response.json();
    })
    .then((response) => {
      alert("Login Success");
      localStorage.setItem("auth", response.data.access_token);
    })
    .catch((error) => {
      alert(error);
    });
}

function register(event) {
  event.preventDefault();

  const registerData = {
    nama: registerForm.querySelector("#nama").value,
    email: registerForm.querySelector("#email").value,
    password: registerForm.querySelector("#password").value,
  };

  fetch("https://ets-pemrograman-web-f.cyclic.app/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  })
    .then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error("Register Failed");
      }
      return response.json();
    })
    .then(() => {
      alert("Register Success");
      showMenu(loginMenu);
    })
    .catch((error) => {
      alert(error);
    });
}
