#include "calculator.h"
#include <cmath>
#include <limits>

extern "C" std::int64_t calculate_soch_cpp(
    int grade, double fo, double sor, std::int64_t soch_max
) {
    if ((grade != 4 && grade != 5) ||
        !std::isfinite(fo) || !std::isfinite(sor) ||
        fo < 0 || fo > 25 || sor < 0 || sor > 25 || soch_max <= 0) {
        return -2;
    }

    const double target = (grade == 5) ? 85.0 : 65.0;
    const double missing = target - fo - sor;

    if (missing > 50.0) return -1;
    if (missing <= 0.0) return 0;

    const double raw = missing * static_cast<double>(soch_max) / 50.0;
    // Ignore tiny floating point errors close to integer boundaries.
    const double nearest = std::round(raw);
    const double adjusted = (std::abs(raw - nearest) < 1e-9) ? nearest : raw;
    const double needed = std::ceil(adjusted);
    if (needed > static_cast<double>(soch_max)) return -1;
    return static_cast<std::int64_t>(needed);
}
