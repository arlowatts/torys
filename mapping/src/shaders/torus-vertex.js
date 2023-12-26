export const source = `#version 300 es
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform float uZoomLevel;

in vec4 aVertexPosition;

out vec4 pointPosition;

void main() {
    vec4 position = uProjectionMatrix * uViewMatrix * aVertexPosition;

    pointPosition = aVertexPosition;

    gl_Position = position;
    gl_Position.xy *= uZoomLevel;
}
`;
