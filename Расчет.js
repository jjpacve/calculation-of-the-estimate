const result = document.getElementById("result");
const button = document.getElementById("calculate");

function readNumber(id) {
    const text = document.getElementById(id).value.trim();
    return text === "" ? NaN : Number(text.replace(",", "."));
}

button.addEventListener("click", function () {
    const grade = document.getElementById("grade").value;
    const fo = readNumber("fo");
    const sor = readNumber("sor");
    const sochMax = readNumber("soch-max");

    if (!Number.isFinite(fo) || !Number.isFinite(sor) ||
        fo < 0 || fo > 25 || sor < 0 || sor > 25) {
        result.textContent = "Введи ФО и СОР числами от 0 до 25.";
        return;
    }

    if (!Number.isSafeInteger(sochMax) || sochMax <= 0) {
        result.textContent = "Введи максимум СОЧ целым числом больше нуля.";
        return;
    }

    const target = grade === "5" ? 85 : 65;
    const missing = target - (fo + sor);

    if (missing > 50) {
        result.textContent = `На ${grade} не хватит даже максимума за СОЧ.`;
        return;
    }

    const exactPoints = (missing * sochMax) / 50;
    const needed = Math.ceil(Number(exactPoints.toFixed(10)));

    result.textContent = `На ${grade} нужно набрать минимум ${needed} из ${sochMax} баллов.`;
});