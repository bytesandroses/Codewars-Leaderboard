import { describe, test } from "node:test";
import assert from "node:assert";
import nock from "nock";
import { makeFetchRequest, parseUsernames } from "./index.mjs";

test("mocks a fetch function", async () => {
  const scope = nock("https://example.com")
    .get("/test")
    .reply(200, JSON.stringify({ user: "someone" }));

  const response = await makeFetchRequest();
  const parsedResponse = await response.json();
  assert(parsedResponse.user === "someone");

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

describe("parseUsernames", () => {
  test("parses a comma-separated string of usernames", () => {
    const input = "alice, bob, charlie";
    const expectedOutput = ["alice", "bob", "charlie"];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });

  test("filters out usernames shorter than 5 characters", () => {
    const input = "al, bob, charlie, dave";
    const expectedOutput = ["charlie"];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });

  test("handles extra spaces and empty entries", () => {
    const input = " alice , , bob , charlie , ";
    const expectedOutput = ["alice", "bob", "charlie"];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });

  test("returns an empty array for an empty string", () => {
    const input = "";
    const expectedOutput = [];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });

  test("removes duplicate usernames", () => {
    const input = "alice, bob, alice, charlie";
    const expectedOutput = ["alice", "bob", "charlie"];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });

  test("returns usernames in lowercase", () => {
    const input = "Alice, Bob, Charlie";
    const expectedOutput = ["alice", "bob", "charlie"];
    assert.deepStrictEqual(parseUsernames(input), expectedOutput);
  });
});
