import { describe, expect, it } from "vitest";

import { advanceBestOfThree, advanceSuperTiebreak } from ".";

describe("tennis feature public API", () => {
  it("exposes the pure match rules to feature consumers", () => {
    expect(advanceSuperTiebreak).toBeTypeOf("function");
    expect(advanceBestOfThree).toBeTypeOf("function");
  });
});
