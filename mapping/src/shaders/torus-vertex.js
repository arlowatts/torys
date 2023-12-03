export const source = `#version 300 es
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

in vec4 aVertexPosition;

out vec4 pointPosition;

void main() {
    gl_Position = aVertexPosition + vec4(0.0, 0.0, 0.5, 1.0);
    pointPosition = gl_Position;
}
`;
