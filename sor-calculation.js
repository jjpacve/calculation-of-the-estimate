function parseSorNumber(value) {
    const text = value.trim();
    if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text)) return NaN;
    return Number(text.replace(',', '.'));
}

function calculateSor(points, maximum) {
    if (!Number.isFinite(maximum) || maximum <= 0) {
        throw new Error('Введи максимальный балл за СОР числом больше нуля.');
    }
    if (!Number.isFinite(points) || points < 0 || points > maximum) {
        throw new Error('Введи набранный балл числом от 0 до максимального балла.');
    }
    // Убираем погрешность двоичной арифметики на границах шкалы.
    const percentage = Number(((points / maximum) * 100).toFixed(10));
    const grade = percentage >= 85 ? 5 : percentage >= 65 ? 4 : percentage >= 40 ? 3 : 2;
    return { percentage, grade };
}

if (typeof module !== 'undefined') module.exports = { parseSorNumber, calculateSor };
