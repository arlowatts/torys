import { torus } from "../properties.js";

export const source = `#version 300 es
#define PI 3.1415926538

vec4 toSurface(float, float, float);
float getTerrainHeight(vec4, int);
float getLayeredNoise(vec4, int);
float noise4(vec4, vec4, uvec4, uint);
float noise3(vec4, vec4, uvec4, uint);
float noise2(vec4, vec4, uvec4, uint);
float noise(float, float, uint, uint);
float hash(uint);
float lerp(float, float, float);

uniform mat4 uProjectionMatrix;

uniform int uZoomLevel;
uniform float uZoomScale;

uniform float uPhi;
uniform float uTheta;

in vec4 aVertexPosition;

out vec3 pointPosition;
out float height;

float largeRadius = float(${torus.largeRadius});
float smallRadius = float(${torus.smallRadius});

float terrainMagnitude = float(${torus.terrainMagnitude});
float waveMagnitude = float(${torus.waveMagnitude});

float seaLevel = float(${torus.waterRatio}) * 2.0 * float(${torus.terrainMagnitude}) - float(${torus.terrainMagnitude});

void main() {
    // get the angular coordinates of the current vertex
    float phi = uPhi - min(max(aVertexPosition.x * smallRadius * uZoomScale, -PI), PI);
    float theta = uTheta + min(max(aVertexPosition.y * largeRadius * uZoomScale, -PI), PI);

    // get the terrain height at the center of the screen
    vec4 centerPosition = toSurface(uPhi, uTheta, 0.0);
    float centerHeight = getTerrainHeight(centerPosition, uZoomLevel);

    // get the terrain height at the current vertex
    vec4 surfacePosition = toSurface(phi, theta, 0.0);
    height = getTerrainHeight(surfacePosition, uZoomLevel);

    // get the actual terrain point
    vec4 position = aVertexPosition;
    position.z = (height - centerHeight) / uZoomScale - 1.0;

    pointPosition = position.xyz;

    // project the terrain point to the screen
    gl_Position = uProjectionMatrix * position;
}

// returns a point on the surface of the torus at the given height above the
// surface and at the given angular coordinates
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
// returns a height value between -magnitude and magnitude
float getTerrainHeight(vec4 position, int layers) {
    return max(
        getLayeredNoise(position, layers) * terrainMagnitude,
        getLayeredNoise(position * 256.0, max(layers - 8, 1)) * waveMagnitude + seaLevel - waveMagnitude
    );
}

// returns layered noise between -1 and 1
float getLayeredNoise(vec4 position, int layers) {
    float value = 0.0;
    float magnitude = 1.0;

    for (int i = 0; i < layers; i++) {
        vec4 positionFloor = floor(position);

        float noise = noise3(
            position,
            position - positionFloor,
            uvec4(ivec4(positionFloor)),
            0u
        );

        value += (noise - 0.5) * magnitude;

        position *= 2.0;
        position += 0.5;
        magnitude *= 0.5;
    }

    return value;
}

// returns a value between 0 and 1
float noise4(vec4 point, vec4 pointFrac, uvec4 pointFloor, uint evalAt) {
    evalAt = evalAt * 0x05555555u + pointFloor.w;

    return lerp(
        noise3(point, pointFrac, pointFloor, evalAt),
        noise3(point, pointFrac, pointFloor, evalAt + 1u),
        pointFrac.w
    );
}

// returns a value between 0 and 1
float noise3(vec4 point, vec4 pointFrac, uvec4 pointFloor, uint evalAt) {
    evalAt = evalAt * 0x05555555u + pointFloor.z;

    return lerp(
        noise2(point, pointFrac, pointFloor, evalAt),
        noise2(point, pointFrac, pointFloor, evalAt + 1u),
        pointFrac.z
    );
}

// returns a value between 0 and 1
float noise2(vec4 point, vec4 pointFrac, uvec4 pointFloor, uint evalAt) {
    evalAt = evalAt * 0x05555555u + pointFloor.y;

    return lerp(
        noise(point.x, pointFrac.x, pointFloor.x, evalAt),
        noise(point.x, pointFrac.x, pointFloor.x, evalAt + 1u),
        pointFrac.y
    );
}

// returns a value between 0 and 1
float noise(float point, float pointFrac, uint pointFloor, uint evalAt) {
    evalAt = evalAt * 0x05555555u + pointFloor;

    return lerp(
        hash(evalAt),
        hash(evalAt + 1u),
        pointFrac
    );
}

// returns a value between 0 and 1
float hash(uint x) {
    x ^= 2747636419u;
    x *= 2654435769u;
    x ^= x >> 16u;
    x *= 2654435769u;
    x ^= x >> 16u;
    x *= 2654435769u;

    // equal to float(x) / (2**32 - 1);
    return float(x) * 2.3283064370807974e-10;
}

float lerp(float a, float b, float t) {
    return a + t * (b - a);
}
`;
