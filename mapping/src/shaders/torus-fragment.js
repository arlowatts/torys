export const source = `#version 300 es
precision mediump float;

in vec4 pointPosition;
in vec3 normal;

out vec4 fragColor;

void main() {
    // fragColor = vec4(normalize(normal), 1.0);
    fragColor = vec4(abs(normalize(normal)), 1.0);
    fragColor.w = 1.0;
}
`;
