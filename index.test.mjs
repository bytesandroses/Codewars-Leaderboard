import { describe, test } from "node:test";
import assert from "node:assert";
import nock from "nock";
import {
  makeFetchRequest,
  parseUsernames,
  getScore,
  sortUsersByScore,
} from "./index.mjs";

test("mocks a fetch function successfully", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/testuser")
    .reply(200, { username: "testuser", ranks: { overall: { score: 100 } } });

  const response = await makeFetchRequest("testuser");

  assert.strictEqual(response.ok, true);
  assert.strictEqual(response.status, 200);

  const data = await response.json();
  assert.strictEqual(data.username, "testuser");
  assert.strictEqual(data.ranks.overall.score, 100);
  assert.strictEqual(scope.isDone(), true);
});

describe("parseUsernames", () => {
  test("parses a comma-separated string of usernames", () => {
    const input = "alice, bobb, charlie";
    const expectedOutput = ["alice", "bobb", "charlie"];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });

  test("filters out empty entries", () => {
    const input = "alice, , bob, charlie, ";
    const expectedOutput = ["alice", "bob", "charlie"];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });

  test("handles extra spaces around usernames", () => {
    const input = " alice , bob , charlie ";
    const expectedOutput = ["alice", "bob", "charlie"];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });

  test("returns an empty array for an empty string", () => {
    assert.deepStrictEqual(parseUsernames(""), []);
  });

  test("removes duplicate usernames", () => {
    const input = "alice, charlie, alice, charlie";
    const expectedOutput = ["alice", "charlie"];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });
});

describe("getScore", () => {
  test("returns overall score", () => {
    const user = {
      username: "alice",
      ranks: { overall: { score: 500 } },
    };
    assert.strictEqual(getScore(user, "overall"), 500);
  });

  test("returns language score when language exists", () => {
    const user = {
      username: "alice",
      ranks: {
        overall: { score: 500 },
        languages: { javascript: { score: 750 } },
      },
    };
    assert.strictEqual(getScore(user, "language", "javascript"), 750);
  });

  test("returns 0 when language does not exist", () => {
    const user = {
      username: "alice",
      ranks: {
        overall: { score: 500 },
        languages: { python: { score: 300 } },
      },
    };
    assert.strictEqual(getScore(user, "language", "javascript"), 0);
  });

  test("returns 0 when ranks are missing", () => {
    const user = { username: "alice" };
    assert.strictEqual(getScore(user, "overall"), 0);
  });
});

describe("sortUsersByScore", () => {
  test("sorts users from highest to lowest score", () => {
    const users = [
      { username: "charlie", ranks: { overall: { score: 100 } } },
      { username: "alice", ranks: { overall: { score: 500 } } },
      { username: "bob", ranks: { overall: { score: 300 } } },
    ];

    const sorted = sortUsersByScore(users, "overall");

    assert.deepStrictEqual(
      sorted.map((u) => u.username),
      ["alice", "bob", "charlie"],
    );
  });

  test("sorts by language score when specified", () => {
    const users = [
      {
        username: "charlie",
        ranks: {
          overall: { score: 100 },
          languages: { javascript: { score: 900 } },
        },
      },
      {
        username: "alice",
        ranks: {
          overall: { score: 500 },
          languages: { javascript: { score: 200 } },
        },
      },
      {
        username: "bob",
        ranks: {
          overall: { score: 300 },
          languages: { javascript: { score: 500 } },
        },
      },
    ];

    const sorted = sortUsersByScore(users, "language", "javascript");

    assert.deepStrictEqual(
      sorted.map((u) => u.username),
      ["charlie", "bob", "alice"],
    );
  });

  test("does not mutate original array", () => {
    const users = [
      { username: "bob", ranks: { overall: { score: 200 } } },
      { username: "alice", ranks: { overall: { score: 500 } } },
    ];

    const originalOrder = users.map((u) => u.username);
    sortUsersByScore(users, "overall");

    assert.deepStrictEqual(
      users.map((u) => u.username),
      originalOrder,
    );
  });
});
