
const loginBtn = document.getElementById("login");

function loginHandler(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  localStorage.setItem("username", username);

  const localUsername = localStorage.getItem("username");
  const hasUsername = !!localUsername;

  const url = hasUsername ? `index.html?username=${localUsername}` : "";

  location.href = url || "index.html";
}

loginBtn.addEventListener("click", loginHandler);
