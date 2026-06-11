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

  const errorContainer = document.getElementById("error-message");
  if (errorContainer) {
    errorContainer.textContent = "";
    errorContainer.style.display = "none";
  }

  if (!parsedUsernames.length) {
    if (errorContainer) {
      errorContainer.textContent =
        "Please enter at least one valid username (> 3 characters).";
      errorContainer.style.display = "block";
    }
    return;
  }

  const fetchPromises = parsedUsernames.map((username) =>
    makeFetchRequest(username).catch((err) => {
      return { _networkError: true, username: username };
    }),
  );

  Promise.all(fetchPromises)
    .then((responses) => {
      const failedUsers = [];

      return Promise.all(
        responses.map(async (response) => {
          if (response && response._networkError) {
            failedUsers.push(
              `Failed to fetch "${response.username}". Check your internet connection.`,
            );
            return null;
          }

          if (response.ok) {
            return await response.json();
          } else {
            const urlParts = response.url.split("/");
            const failedName = urlParts[urlParts.length - 1] || "Unknown User";
            failedUsers.push(`User "${failedName}" not found (404).`);
            return null;
          }
        }),
      ).then((userDataArray) => {
        if (failedUsers.length > 0 && errorContainer) {
          errorContainer.textContent = failedUsers.join(" ");
          errorContainer.style.display = "block";
        }
        return userDataArray;
      });
    })
    .then((userDataArray) => {
      const validUsers = userDataArray.filter((user) => user !== null);
      populateLanguageOptions(validUsers);
      renderLeaderboard(validUsers, "overall");

      const select = document.getElementById("language-select");
      if (select) {
        const newSelect = select.cloneNode(true);
        select.parentNode.replaceChild(newSelect, select);

        newSelect.addEventListener("change", (event) => {
          const selectedValue = event.target.value;
          if (selectedValue === "overall") {
            renderLeaderboard(validUsers, "overall");
          } else {
            renderLeaderboard(validUsers, "language", selectedValue);
          }
        });
      }
    });
}

function setupFormListener() {
  const form = document.getElementById("usernames-form");
  if (form) {
    form.addEventListener("submit", handleUsernameFormSubmit);
  }
}

export function getScore(user, rankingType, language = null) {
  if (rankingType === "overall") {
    return user.ranks?.overall?.score || 0;
  } else if (rankingType === "language" && language) {
    return user.ranks?.languages?.[language]
      ? user.ranks.languages[language].score
      : 0;
  }
  return 0;
}

export function renderLeaderboard(users, rankingType, language = null) {
  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  let displayUsers = [...users];
  if (rankingType === "language" && language) {
    displayUsers = displayUsers.filter(
      (user) => user.ranks?.languages?.[language] !== undefined,
    );
  }

  const sortedUsers = [...displayUsers].sort((a, b) => {
    const scoreA = getScore(a, rankingType, language);
    const scoreB = getScore(b, rankingType, language);
    return scoreB - scoreA;
  });

  sortedUsers.forEach((user, index) => {
    const userRow = document.createElement("tr");
    const usernameCell = document.createElement("td");
    const pointsCell = document.createElement("td");
    const clanCell = document.createElement("td");

    usernameCell.textContent = user.username;
    pointsCell.textContent = getScore(user, rankingType, language);
    clanCell.textContent = user.clan || "N/A";

    if (index === 0) {
      pointsCell.classList.add("leaderboard-top");
    }

    userRow.appendChild(usernameCell);
    userRow.appendChild(pointsCell);
    userRow.appendChild(clanCell);
    tbody.appendChild(userRow);
  });
}

function populateLanguageOptions(users) {
  const select = document.getElementById("language-select");
  if (!select) return;

  select.innerHTML = "";

  const overallOption = document.createElement("option");
  overallOption.value = "overall";
  overallOption.textContent = "Overall";
  overallOption.selected = true;
  select.appendChild(overallOption);

  const languages = new Set();
  users.forEach((user) => {
    if (user.ranks && user.ranks.languages) {
      Object.keys(user.ranks.languages).forEach((lang) => languages.add(lang));
    }
  });

  const sortedLanguages = [...languages].sort();
  sortedLanguages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang;
    select.appendChild(option);
  });

  select.disabled = false;
}

window.onload = function () {
  setupFormListener();
};
