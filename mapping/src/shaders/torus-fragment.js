export const source = `#version 300 es
precision mediump float;

in vec4 pointPosition;
in vec3 normal;

out vec4 fragColor;

void main() {
    // fragColor = vec4(normalize(normal), 1.0);
    float val = 3.0 / 5.0 * normal.x + 4.0 / 5.0 * normal.y;
    fragColor = vec4(val, val, val, 1.0);
    fragColor.w = 1.0;
}
`;
