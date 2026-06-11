export function makeFetchRequest(username) {
  try {
    return fetch(`https://www.codewars.com/api/v1/users/${username}`);
  } catch (error) {
    console.error("Fetch request failed:", error);
    throw error;
  }
}

export function parseUsernames(usernames) {
  const usernameArray = usernames
    .split(",")
    .map((username) => username.trim().toLowerCase())
    .filter((username) => username.length > 3);

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
