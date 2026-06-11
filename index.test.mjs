import { describe, test } from "node:test";
import assert from "node:assert";
import nock from "nock";
import { makeFetchRequest, parseUsernames } from "./index.mjs";

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

  test("filters out usernames equal to or shorter than 3 characters", () => {
    const input = "al, bob, charlie, dave";
    const expectedOutput = ["charlie", "dave"];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });

  test("handles extra spaces and empty entries gracefully", () => {
    const input = " alice , , bob , charlie , ";
    const expectedOutput = ["alice", "charlie"];
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
