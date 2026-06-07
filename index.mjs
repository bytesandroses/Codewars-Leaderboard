export function makeFetchRequest() {
  return fetch("https://example.com/test");
}

const USERNAME_PATTERN = /^[a-z0-9-]+$/i;
let submittedUsernames = [];

export function isValidUsername(username) {
  return USERNAME_PATTERN.test(username);
}

export function parseUsernames(input) {
  const usernames = input
    .split(",")
    .map((username) => username.trim())
    .filter(Boolean);

  const invalidUsernames = usernames.filter((username) => !isValidUsername(username));

  return { usernames, invalidUsernames };
}

export function submitUsernames(input) {
  const { usernames, invalidUsernames } = parseUsernames(input);

  if (usernames.length === 0) {
    return { success: false, error: "Please enter at least one username.", invalidUsernames };
  }

  if (invalidUsernames.length > 0) {
    return {
      success: false,
      error: "Usernames can only include letters, numbers and hyphens.",
      invalidUsernames,
    };
  }

  submittedUsernames = usernames;
  return { success: true, usernames: [...submittedUsernames], invalidUsernames: [] };
}

export function getSubmittedUsernames() {
  return [...submittedUsernames];
}

export function resetSubmittedUsernames() {
  submittedUsernames = [];
}

export function setupUsernameInput(rootDocument = document) {
  const form = rootDocument.getElementById("username-form");
  const input = rootDocument.getElementById("username-input");
  const error = rootDocument.getElementById("username-error");
  const list = rootDocument.getElementById("username-list");

  if (!form || !input || !error || !list) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = submitUsernames(input.value);

    if (!result.success) {
      error.textContent = result.error;
      return;
    }

    error.textContent = "";
    list.innerHTML = "";

    result.usernames.forEach((username) => {
      const item = rootDocument.createElement("li");
      item.textContent = username;
      list.appendChild(item);
    });
  });
}

if (typeof document !== "undefined") {
  setupUsernameInput();
}
