import test from "node:test";
import assert from "node:assert/strict";

function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 3.8);
}

function estimateCost(inputTokens, outputTokens, model = "gpt-4o-mini") {
  const inputRate = 0.00015 / 1000;
  const outputRate = 0.00060 / 1000;
  return Number((inputTokens * inputRate + outputTokens * outputRate).toFixed(6));
}

test("AI Adapter: Token estimator outputs deterministic token approximations", () => {
  assert.equal(estimateTokens(""), 0);
  assert.equal(estimateTokens("Hello World"), Math.ceil(11 / 3.8));
  assert.ok(estimateTokens("A long prompt with detailed business context") > 10);
});

test("AI Adapter: Cost calculator calculates fractions of a cent accurately", () => {
  const cost = estimateCost(1000, 1000);
  // (1000 * 0.00015 / 1000) + (1000 * 0.00060 / 1000) = 0.00075
  assert.equal(cost, 0.00075);
});
