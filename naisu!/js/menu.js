const mainMenu = document.getElementById("menu-container");
const startMenu = document.getElementById("start-menu");
const loginMenu = document.getElementById("login-menu");
const registerMenu = document.getElementById("register-menu");
const leaderboardMenu = document.getElementById("leaderboard-menu");

const menuButton = document.getElementById("menu-button");
const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");
const leaderboardButton = document.getElementById("leaderboard-button");

const menus = [startMenu, loginMenu, registerMenu, leaderboardMenu];

function showMenu(menu) {
  for (let i = 0; i < menus.length; i++) {
    menus[i].style.display = "none";
  }
  menu.style.display = "flex";
}

menuButton.onclick = () => {
  showMenu(startMenu);
};

loginButton.onclick = () => {
  showMenu(loginMenu);
};

registerButton.onclick = () => {
  showMenu(registerMenu);
};
