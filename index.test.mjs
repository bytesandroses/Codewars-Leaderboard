import { describe, test } from "node:test";
import assert from "node:assert";
import nock from "nock";
import { makeFetchRequest, handleUsernameFormSubmit } from "./index.mjs";

test("mocks a fetch function", async () => {
  const scope = nock("https://example.com")
    .get("/test")
    .reply(200, JSON.stringify({ user: "someone" }));

  const response = await makeFetchRequest();
  const parsedResponse = await response.json();
  assert(parsedResponse.user === "someone");

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

describe("handleUsernameFormSubmit", () => {
  test("prevents the default form submission behaviour", () => {
    const event = {
      preventDefault: () => {
        event.preventDefaultCalled = true;
      },
    };

    handleUsernameFormSubmit(event);
    assert(
      event.preventDefaultCalled === true,
      "preventDefault was not called",
    );
  });
});
