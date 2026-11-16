// A small Rust bridge: JavaScript -> Tauri command -> C++ calculator.
unsafe extern "C" {
    fn calculate_soch_cpp(grade: i32, fo: f64, sor: f64, soch_max: i64) -> i64;
}

#[tauri::command]
fn calculate_soch(grade: u8, fo: f64, sor: f64, soch_max: i64) -> Result<Option<i64>, String> {
    if (grade != 4 && grade != 5)
        || !fo.is_finite() || !sor.is_finite()
        || !(0.0..=25.0).contains(&fo)
        || !(0.0..=25.0).contains(&sor)
        || soch_max <= 0
    {
        return Err("Некорректные данные для расчёта".into());
    }

    let needed = unsafe { calculate_soch_cpp(i32::from(grade), fo, sor, soch_max) };
    match needed {
        -2 => Err("Некорректные данные для расчёта".into()),
        -1 => Ok(None), // Target grade cannot be reached.
        number => Ok(Some(number)),
    }
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![calculate_soch])
        .run(tauri::generate_context!())
        .expect("failed to run SOCH calculator");
}
