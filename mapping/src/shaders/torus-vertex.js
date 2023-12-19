export const source = `#version 300 es
uniform mat4 uProjectionMatrix;

in vec4 aVertexPosition;
in vec3 aVertexNormal;

out vec4 pointPosition;
out vec3 normal;

void main() {
    gl_Position = uProjectionMatrix * aVertexPosition;
    pointPosition = gl_Position;
    normal = aVertexNormal;
}
`;
