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

// update the surface normals based on a given buffer of vertices
export function setNormals(normalBuffer, meshBuffer) {
    for (let i = 0; i < meshBuffer.vertexCount; i += 3) {
        let a = vec3.fromValues(
            meshBuffer.data[3 * (i + 1)] - meshBuffer.data[3 * i],
            meshBuffer.data[3 * (i + 1) + 1] - meshBuffer.data[3 * i + 1],
            meshBuffer.data[3 * (i + 1) + 2] - meshBuffer.data[3 * i + 2]
        );

        let b = vec3.fromValues(
            meshBuffer.data[3 * (i + 2)] - meshBuffer.data[3 * i],
            meshBuffer.data[3 * (i + 2) + 1] - meshBuffer.data[3 * i + 1],
            meshBuffer.data[3 * (i + 2) + 2] - meshBuffer.data[3 * i + 2]
        );

        let normal = vec3.cross(vec3.create(), a, b);

        // console.log(normal);

        for (let j = 0; j < 3; j++) {
            normalBuffer.data[3 * (i + j)] = normal[0];
            normalBuffer.data[3 * (i + j) + 1] = normal[1];
            normalBuffer.data[3 * (i + j) + 2] = normal[2];
        }
    }

    // console.log(normalBuffer.data);

    // update the float array with the adjusted vertices
    normalBuffer.floatArray.set(normalBuffer.data);

    // update the vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, normalBuffer.floatArray, gl.STATIC_DRAW);
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
