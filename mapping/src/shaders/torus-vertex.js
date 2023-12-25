export const source = `#version 300 es
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform float uZoomLevel;

in vec4 aVertexPosition;
in vec3 aVertexNormal;

out vec4 pointPosition;
out vec3 normal;

void main() {
    vec4 position = uProjectionMatrix * uViewMatrix * aVertexPosition;
    position.x *= uZoomLevel;
    position.y *= uZoomLevel;
    gl_Position = position;
    pointPosition = position;
    normal = aVertexNormal;
}
`;
