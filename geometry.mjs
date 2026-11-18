// Avoid ruling out cases where only floating-point rounding separates the values.
function exceedsBound(value, bound) {
  const tolerance = 8 * Math.max(Number.MIN_VALUE, Number.EPSILON * Math.max(value, bound));
  return value - bound > tolerance;
}

/** Necessary conditions only; dimensions share a unit, uncertainty is absolute per measurement. */
export function assess(p) {
  const fields = ['length','width','door','corridorA','corridorB','uncertainty','margin'];
  if (!p || fields.some(k => typeof p[k] !== 'number' || !Number.isFinite(p[k])) || fields.some(k => !['uncertainty','margin'].includes(k) && p[k] <= 0) || p.uncertainty < 0 || p.margin < 0 || p.length <= p.uncertainty || p.width <= p.uncertainty) throw new Error('Enter positive measurements and non-negative uncertainty and margin. Uncertainty must be smaller than both item dimensions.');
  const u = p.uncertainty, m = p.margin;
  const short = Math.min(p.length, p.width) - u + 2*m;
  const long = Math.max(p.length, p.width) - u + 2*m;
  const a = p.corridorA + u, b = p.corridorB + u;
  const door = p.door + u;
  const scale = Math.max(a, b);
  const ratio = Math.min(a, b) / scale;
  const limit = scale * (1 + ratio ** (2/3)) ** (3/2);
  if (![short, long, door, limit].every(Number.isFinite)) throw new Error('Measurements exceed the finite calculation range.');
  const reasons = [];
  if (exceedsBound(short, door)) reasons.push('Even the smallest item plus margin exceeds the widest possible doorway.');
  if (exceedsBound(long, limit)) reasons.push('Even a zero-thickness line as long as the item plus margin exceeds the ideal L-turn bound.');
  return {result: reasons.length ? 'ruled out in the ideal 2D model' : 'unknown', reasons, optimisticLineLimit: limit};
}
