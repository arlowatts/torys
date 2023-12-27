import { torus } from "../properties.js";

export const source = `#version 300 es
#define PI 3.1415926538

vec4 toSurface(float, float, float);
float getTerrainHeight(vec4, float, int);
float getNoise(vec4);

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform int uZoomLevel;
uniform float uZoomScale;

uniform float uPhi;
uniform float uTheta;

in vec4 aVertexPosition;

out vec3 pointPosition;
out float height;

float largeRadius = float(${torus.largeRadius});
float smallRadius = float(${torus.smallRadius});

void main() {
    float phi = -uPhi + min(max(aVertexPosition.x * smallRadius * uZoomScale, -PI), PI);
    float theta = uTheta + min(max(aVertexPosition.y * largeRadius * uZoomScale, -PI), PI);

    // get the terrain height
    vec4 surfacePosition = toSurface(phi, theta, 0.0);
    height = max(getTerrainHeight(surfacePosition, 2.0, uZoomLevel), 0.0);

    // get the actual terrain point
    vec4 position = toSurface(phi, theta, height);
    pointPosition = position.xyz;

    // project the terrain point to the screen
    gl_Position = uProjectionMatrix * uViewMatrix * position;
    gl_Position.xy /= uZoomScale;
}

vec4 toSurface(float phi, float theta, float height) {
    float xzOffset = largeRadius + (smallRadius + height) * cos(theta);

    return vec4(
        xzOffset * sin(phi),
        (smallRadius + height) * sin(theta),
        xzOffset * cos(phi),
        1.0
    );
}

// get the height of the terrain at the given 3-dimensional coordinates
// returns a height value balanced around 0
float getTerrainHeight(vec4 position, float intensity, int levels) {
    float height = 0.0;

    for (int i = 0; i < levels; i++) {
        height += (getNoise(position) - 0.5) * intensity;
        position *= 2.0;
        position += 0.5;
        intensity *= 0.5;
    }

    return height;
}

// return a random smooth noise value between 0 and 1
float getNoise(vec4 position) {
    return (sin(position.x) + sin(position.y) + sin(position.z) + 3.0) / 6.0;
}
`;
