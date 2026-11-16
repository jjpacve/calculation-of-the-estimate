const result = document.getElementById("result");
const button = document.getElementById("calculate");

function readNumber(id) {
    const text = document.getElementById(id).value.trim();
    return text === "" ? NaN : Number(text.replace(",", "."));
}

// The same HTML works on the website and in the Tauri desktop app.
button.addEventListener("click", async function () {
    const grade = Number(document.getElementById("grade").value.trim());
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

    let needed;
    if (window.__TAURI__?.core?.invoke) {
        // Desktop: real C++ calculation through the Rust/Tauri bridge.
        try {
            needed = await window.__TAURI__.core.invoke("calculate_soch", {
                grade, fo, sor, sochMax
            });
        } catch (error) {
            result.textContent = "Ошибка расчёта: " + String(error);
            return;
        }
    } else {
        // GitHub Pages: keep the original JavaScript calculation working.
        const target = grade === 5 ? 85 : 65;
        const missing = target - (fo + sor);
        if (missing > 50) {
            needed = null;
        } else if (missing <= 0) {
            needed = 0;
        } else {
            const exactPoints = (missing * sochMax) / 50;
            needed = Math.ceil(Number(exactPoints.toFixed(10)));
        }
    }

    result.textContent = needed === null
        ? `На ${grade} не хватит даже максимума за СОЧ.`
        : `На ${grade} нужно набрать минимум ${needed} из ${sochMax} баллов.`;
});
