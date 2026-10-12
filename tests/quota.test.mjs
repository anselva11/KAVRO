import test from "node:test";
import assert from "node:assert/strict";

function evaluateQuota(currentUsage, limit) {
  return {
    allowed: currentUsage < limit,
    remaining: Math.max(0, limit - currentUsage),
    percentUsed: Math.min(100, Math.round((currentUsage / limit) * 100)),
  };
}

test("Quota: Correctly permits requests below limit", () => {
  const result = evaluateQuota(12000, 50000);
  assert.equal(result.allowed, true);
  assert.equal(result.remaining, 38000);
  assert.equal(result.percentUsed, 24);
});

test("Quota: Blocks requests when limit is exhausted", () => {
  const result = evaluateQuota(55000, 50000);
  assert.equal(result.allowed, false);
  assert.equal(result.remaining, 0);
  assert.equal(result.percentUsed, 100);
});
