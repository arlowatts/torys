export const source = `#version 300 es
precision mediump float;

in vec4 pointPosition;

out vec4 fragColor;

void main() {
    fragColor = floor(abs(pointPosition));
}
`;
