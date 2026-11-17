const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseSorNumber, calculateSor } = require('../sor-calculation.js');

test('points are converted to a percentage and grade at each threshold', () => {
    for (const [points, maximum, percentage, grade] of [
        [8, 10, 80, 4], [8, 20, 40, 3], [0, 20, 0, 2], [20, 20, 100, 5],
        [39, 100, 39, 2], [40, 100, 40, 3], [64, 100, 64, 3],
        [65, 100, 65, 4], [84, 100, 84, 4], [85, 100, 85, 5],
        [8.5, 10, 85, 5], [64.999, 100, 64.999, 3],
        [84.999, 100, 84.999, 4], [0.34, 0.4, 85, 5]
    ]) {
        assert.deepEqual(calculateSor(points, maximum), { percentage, grade });
    }
});

test('decimal input supports both comma and dot, never treating blanks as zero', () => {
    assert.equal(parseSorNumber(' 8,5 '), 8.5);
    assert.equal(parseSorNumber('8.5'), 8.5);
    assert.equal(parseSorNumber('0'), 0);
    for (const value of ['', ' ', 'abc', '8,5,1', 'Infinity', '0x10']) {
        assert.ok(Number.isNaN(parseSorNumber(value)));
    }
});

test('invalid maxima and scores are rejected', () => {
    for (const maximum of [0, -1, NaN, Infinity]) {
        assert.throws(() => calculateSor(0, maximum), /больше нуля/);
    }
    for (const points of [-1, 11, NaN, Infinity]) {
        assert.throws(() => calculateSor(points, 10), /от 0 до максимального/);
    }
});
