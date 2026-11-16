#pragma once

#include <cstdint>

// Returns the required points, -1 when the grade is impossible,
// -2 for invalid input. Edit this function to change the calculator logic.
extern "C" std::int64_t calculate_soch_cpp(
    int grade,
    double fo,
    double sor,
    std::int64_t soch_max
);
