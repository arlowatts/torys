export const source = `#version 300 es
precision mediump float;

in vec4 pointPosition;

out vec4 fragColor;

void main() {
    fragColor = vec4(0.0, 0.0, pointPosition.z - 1.5, 1.0);
}
`;
