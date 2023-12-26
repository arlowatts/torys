import { gl, torus, view } from "./properties.js";
import * as properties from "./properties.js";

// update the vertex coordinates and send the new values to the shaders
export function setVertices(buffer) {
    for (let i = 0; i < buffer.vertexCount; i++) {
        buffer.data[3 * i] = buffer.originalData[3 * i];
        buffer.data[3 * i + 1] = buffer.originalData[3 * i + 1];
        buffer.data[3 * i + 2] = buffer.originalData[3 * i + 2];

        // transform the points to the surface of the torus
        let actualPhi = -view.phi + Math.min(Math.max(view.zoom * buffer.data[3 * i] / torus.largeRadius * 20, -Math.PI), Math.PI);
        let actualTheta = view.theta + Math.min(Math.max(view.zoom * buffer.data[3 * i + 1] / torus.smallRadius * 20, -Math.PI), Math.PI);

        let xzOffset = torus.largeRadius + torus.smallRadius * Math.cos(actualTheta);

        let y = torus.smallRadius * Math.sin(actualTheta);

        let z = Math.cos(actualPhi) * xzOffset;
        let x = Math.sin(actualPhi) * xzOffset;

        let height = getTerrainHeight(x, y, z, -view.zoomSemiPrecise - properties.MIN_ZOOM);

        xzOffset = torus.largeRadius + (torus.smallRadius + height) * Math.cos(actualTheta);

        y = (torus.smallRadius + height) * Math.sin(actualTheta);

        z = Math.cos(actualPhi) * xzOffset;
        x = Math.sin(actualPhi) * xzOffset;

        buffer.data[3 * i] = x;
        buffer.data[3 * i + 1] = y;
        buffer.data[3 * i + 2] = z;
    }

    // update the float array with the adjusted vertices
    buffer.floatArray.set(buffer.data);

    // update the vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffer.floatArray, gl.STATIC_DRAW);
}

// get the height of the terrain at the given 3-dimensional coordinates
// returns a height value balanced around 0
function getTerrainHeight(x, y, z, levels) {
    let intensity = 1;
    let height = 0;

    for (let i = 0; i < levels; i++) {
        height += (getNoise(x, y, z) - 0.5) * intensity;
        x *= 2;
        y *= 2;
        z *= 2;
        intensity /= 2;
    }

    return height;
}

// return a random smooth noise value between 0 and 1
function getNoise(x, y, z) {
    return (Math.sin(x) + Math.sin(y) + Math.sin(z) + 3) / 6;
}
