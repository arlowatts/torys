#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <time.h>

// approximates (a*b) >> 32
// maximum absolute error: 1
// approximate error ratio: 0.25
unsigned int imultiply(unsigned int a, unsigned int b) {
    unsigned int a1 = a >> 16;
    unsigned int b1 = b >> 16;

    unsigned int a2 = a & 0xffff;
    unsigned int b2 = b & 0xffff;

    return (a1*b1) + ((((a2*b1) >> 1) + ((a1*b2) >> 1)) >> 15);
}

// approximates (x^n) / (2^(32*(n-1)))
unsigned int ipower(unsigned int x, int n) {
    unsigned int w = x;

    while (n-- > 1)
        w = imultiply(w, x);

    return w;
}

// approximates (2^32) * sin(x / (2^32))
unsigned int isin(unsigned int x) {
    return x - ipower(x, 3) / 6 + ipower(x, 5) / 120 - ipower(x, 7) / 5040 + ipower(x, 9) / 362880;
}

// approximates (2^32) * cos(x / (2^32))
unsigned int icos(unsigned int x) {
    return 1 - ipower(x, 2) / 2 + ipower(x, 4) / 24 - ipower(x, 6) / 720 + ipower(x, 8) / 40320;
}

// converts an unsigned int to a float between 0.0 and 1.0
float ifloat(unsigned int x) {
    int leading_zeros = __builtin_clz(x) + 1;

    // isolate the mantissa, dropping any leading zeros
    x = (x >> (9 - leading_zeros)) & 0x7fffff;

    // fill in the exponent, adjusting for the dropped zeros
    x = x | ((127 - leading_zeros) << 23);

    // forcefully cast into a float
    return *(float*)(&x);
}

int main() {
    srand(time(NULL));

    float average_error = 0.0;

    int iters = 1e2;

    for (int i = 0; i < iters; i++) {
        unsigned int arg = (unsigned int)rand() + (unsigned int)rand();

        unsigned int estimate = isin(arg);
        float float_estimate = ifloat(estimate);

        float float_arg = ifloat(arg);
        float actual_value = sin(float_arg);

        float error = float_estimate - actual_value;

        // printf("sin(%f) = %f        error = %.10f\n", float_arg, float_estimate, error);
        // printf("sin(%u) = %u\n", arg, estimate);

        average_error += error < 0 ? -error : error;
    }

    printf("sin(pi/4) = %.15f\n", ifloat(isin(3373259426)));

    printf("average error: %.15f\n", average_error / iters);
}
