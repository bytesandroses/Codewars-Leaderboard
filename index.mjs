export function makeFetchRequest() {
  return fetch("https://example.com/test");
}

export function parseUsernames(usernames) {
  const usernameArray = usernames
    .split(",")
    .map((username) => username.trim())
    .filter((username) => username.length > 0);

  return [...new Set(usernameArray)];
}

function handleUsernameFormSubmit(event) {
  event.preventDefault();

  const textarea = document.getElementById("usernames");
  const usernames = textarea.value;
  const parsedUsernames = parseUsernames(usernames);

  console.log("Parsed Usernames:", parsedUsernames);
}

function setupFormListener() {
  const form = document.getElementById("usernames-form");
  if (form) {
    form.addEventListener("submit", handleUsernameFormSubmit);
  }
}

window.onload = function () {
  setupFormListener();
};
