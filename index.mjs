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
