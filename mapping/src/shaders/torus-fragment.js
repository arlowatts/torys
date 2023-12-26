import { torus } from "../properties.js";

export const source = `#version 300 es
precision mediump float;

in vec4 pointPosition;

out vec4 fragColor;

float largeRadius = float(${torus.largeRadius});
float smallRadius = float(${torus.smallRadius});

void main() {
    fragColor = vec4(0.0);

    vec3 myNormal = normalize(cross(dFdx(pointPosition).xyz, dFdy(pointPosition).xyz));

    float ambience = 0.6;

    float val = 3.0 / 5.0 * myNormal.x + 4.0 / 5.0 * myNormal.y;
    val = ambience + (1.0 - ambience) * val;

    float xyDistance = sqrt(pointPosition.x * pointPosition.x + pointPosition.z * pointPosition.z) - largeRadius;

    float height = sqrt(pointPosition.y * pointPosition.y + xyDistance * xyDistance);

    fragColor.b = val;

    if (height > smallRadius + 0.2) {
        fragColor.g = val;
    }

    if (height > smallRadius + 0.5) {
        fragColor.r = val;
    }

    fragColor.w = 1.0;
}
`;
