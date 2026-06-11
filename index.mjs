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
    .map((username) => username.trim())
    .filter((username) => username.length > 3);

  return [...new Set(usernameArray)];
}

function handleUsernameFormSubmit(event) {
  event.preventDefault();

  const textarea = document.getElementById("usernames");
  const usernames = textarea.value;
  const parsedUsernames = parseUsernames(usernames);

  const fetchPromises = parsedUsernames.map((username) =>
    makeFetchRequest(username),
  );

  Promise.all(fetchPromises)
    .then((responses) => {
      return Promise.all(
        responses.map(async (response) => {
          if (response.ok) {
            return await response.json();
          } else {
            console.log(`User not found: ${response.url}`);
            return null;
          }
        }),
      );
    })
    .then((userDataArray) => {
      const validUsers = userDataArray.filter((user) => user !== null);
      console.log("Valid users:", validUsers);
    });
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
