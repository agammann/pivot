import test from 'node:test';
import assert from 'node:assert/strict';
import { assess } from '../geometry.mjs';
const base = {length:200,width:80,door:90,corridorA:100,corridorB:100,uncertainty:2,margin:0};
test('plausible example stays unknown', () => assert.equal(assess(base).result, 'unknown'));
test('door failure survives uncertainty', () => assert.match(assess({...base,door:70}).reasons[0], /door/));
test('uncertainty prevents marginal door rejection', () => assert.equal(assess({...base,door:77}).result, 'unknown'));
test('long item exceeds ideal turn bound', () => assert.match(assess({...base,length:400}).reasons[0], /L-turn/));
test('swapping corridor widths preserves result', () => assert.equal(assess({...base,corridorA:80,corridorB:120}).optimisticLineLimit, assess({...base,corridorA:120,corridorB:80}).optimisticLineLimit));
test('rejects invalid and missing measurements', () => { for (const v of [NaN, Infinity, 0, -1, undefined]) assert.throws(() => assess({...base,door:v})); });
test('rejects uncertainty that consumes the item', () => assert.throws(() => assess({...base,uncertainty:80})));

test('margin can rule out a marginal opening', () => assert.match(assess({...base,margin:8}).reasons[0], /doorway/));
test('rejects negative margin', () => assert.throws(() => assess({...base,margin:-1})));

test('floating-point rounding cannot rule out a case at either model bound', () => {
  const turn = {...base, length:125, width:12, corridorA:27, corridorB:64, uncertainty:0};
  assert.equal(assess(turn).result, 'unknown');
  assert.match(assess({...turn, length:125.01}).reasons[0], /L-turn/);

  const door = {...base, length:1, width:0.1, door:0.3, margin:0.1, uncertainty:0};
  assert.equal(assess(door).result, 'unknown');
  assert.match(assess({...door, door:0.299}).reasons[0], /doorway/);
});

test('unrepresentable calculation ranges are rejected instead of producing a result', () => {
  assert.throws(() => assess({...base, corridorA:1e308, corridorB:1e308}), /finite calculation range/);
});

