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

