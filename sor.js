const sorResult = document.getElementById('sor-result');
const percentageFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 10 });

document.getElementById('sor-form').addEventListener('submit', event => {
    event.preventDefault();
    const points = parseSorNumber(document.getElementById('sor-points').value);
    const maximum = parseSorNumber(document.getElementById('sor-max').value);
    try {
        const { percentage, grade } = calculateSor(points, maximum);
        sorResult.textContent = `Результат: ${percentageFormat.format(percentage)}%. Оценка за СОР: ${grade}.`;
    } catch (error) {
        sorResult.textContent = error.message;
    }
});
