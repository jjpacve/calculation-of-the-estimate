fn main() {
    cc::Build::new()
        .cpp(true)
        .file("cpp/calculator.cpp")
        .flag_if_supported("-std=c++17")
        .compile("soch_calculator_cpp");

    println!("cargo:rerun-if-changed=cpp/calculator.cpp");
    println!("cargo:rerun-if-changed=cpp/calculator.h");
    tauri_build::build();
}
