import { torus } from "../properties.js";

export const source = `#version 300 es
precision mediump float;

uniform vec3 uLightDirection;
uniform float uLightAmbience;

in vec3 pointPosition;
in float height;

out vec4 fragColor;

float largeRadius = float(${torus.largeRadius});
float smallRadius = float(${torus.smallRadius});

float maxTerrainMagnitude = float(${torus.maxTerrainMagnitude});

float seaLevel = float(${torus.waterRatio}) * 2.0 * float(${torus.maxTerrainMagnitude}) - float(${torus.maxTerrainMagnitude});
float snowLevel = float(${torus.snowRatio}) * 2.0 * float(${torus.maxTerrainMagnitude}) - float(${torus.maxTerrainMagnitude});

void main() {
    vec3 normal = normalize(cross(dFdx(pointPosition), dFdy(pointPosition)));

    float shade = uLightAmbience + (1.0 - uLightAmbience) * dot(normal, uLightDirection);

    fragColor = vec4(
        height > snowLevel ? shade : 0.0,
        height > seaLevel ? shade : 0.0,
        shade,
        1.0
    );
}
`;
