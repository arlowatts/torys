import { torus } from "../properties.js";

export const source = `#version 300 es
precision mediump float;

in vec3 pointPosition;
in vec4 color;
in float height;

out vec4 fragColor;

float largeRadius = float(${torus.largeRadius});
float smallRadius = float(${torus.smallRadius});

void main() {
    vec3 normal = normalize(cross(dFdx(pointPosition), dFdy(pointPosition)));

    float ambience = 0.6;

    float val = 3.0 / 5.0 * normal.x + 4.0 / 5.0 * normal.y;
    val = ambience + (1.0 - ambience) * val;

    fragColor = vec4(height > 0.5 ? val : 0.0, height > 0.2 ? val : 0.0, val, 1.0);
}
`;
