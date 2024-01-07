import { hexBuffer } from "./hex-buffer.js";
import { gl, buffers, torus, view } from "./properties.js";

// creates a vertex buffer for a screen-filling triangular mesh
export function initSurfaceBuffer() {
    // define the data as an array
    const positions = hexBuffer(torus.surfaceMesh.edgeLength, view.aspect);

    // create and bind the buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // convert the array to a Float32Array, then populate the buffer with the position data
    const floatArray = new Float32Array(positions);
    gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);

    buffers.torus.data = positions;
    buffers.torus.floatArray = floatArray;
    buffers.torus.buffer = positionBuffer;
    buffers.torus.numComponents = 3;
    buffers.torus.vertexCount = positions.length / buffers.torus.numComponents;
    buffers.torus.type = gl.FLOAT;
}
