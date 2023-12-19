import { hexBuffer } from "./hex-buffer.js";
import { gl, buffers, torus, view } from "./properties.js";

// creates a vertex buffer for a screen-filling hexagonal mesh
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

// creates a normal buffer for the surface normals of each triangle in the surface mesh
export function initNormalBuffer(vertexCount) {
    // define the data as an array
    const positions = [];

    // push a normal vector for each vertex in the mesh
    for (let i = 0; i < vertexCount; i++) {
        positions.push(0);
        positions.push(0);
        positions.push(1);
    }

    // create and bind the buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // convert the array to a Float32Array, then populate the buffer with the position data
    const floatArray = new Float32Array(positions);
    gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);

    buffers.normals.data = positions;
    buffers.normals.floatArray = floatArray;
    buffers.normals.buffer = positionBuffer;
    buffers.normals.numComponents = 3;
    buffers.normals.vertexCount = positions.length / buffers.normals.numComponents;
    buffers.normals.type = gl.FLOAT;
    buffers.normals.normalize = true;
}

// creates a vertex buffer for a torus
// export function initTorusBuffer() {
//     // create the buffer
//     const positionBuffer = gl.createBuffer();

//     // select the position buffer as the buffer to apply operations on
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//     // define the data as an array
//     const positions = [];

//     const degToRad = Math.PI / 180;

//     let x, y, z, xzOffset;

//     // step around the torus, placing points to define triangles on the surface
//     // steps are taken by degrees to maintain maximal precision
//     // each iteration pushes two new vertices with the same y value
//     for (let phi = 0; phi < 360; phi += torus.phiDegreeStep) {
//         for (let theta = 0; theta <= 360; theta += torus.thetaDegreeStep) {
//             xzOffset = torus.largeRadius + torus.smallRadius * Math.cos(theta * degToRad);

//             y = torus.smallRadius * Math.sin(theta * degToRad);

//             z = Math.cos(phi * degToRad) * xzOffset;
//             x = Math.sin(phi * degToRad) * xzOffset;

//             positions.push(x, y, z);

//             z = Math.cos((phi + torus.phiDegreeStep) * degToRad) * xzOffset;
//             x = Math.sin((phi + torus.phiDegreeStep) * degToRad) * xzOffset;

//             positions.push(x, y, z);
//         }
//     }

//     // convert the array to a Float32Array, then populate the buffer with the position data
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//     buffers.torus.data = positionBuffer;
//     buffers.torus.vertexCount = positions.length / 3;
//     buffers.torus.numComponents = 3;
//     buffers.torus.type = gl.FLOAT;
// }

// creates a vertex buffer for the background panel
// export function initBackgroundBuffer() {
//     // create the buffer
//     const positionBuffer = gl.createBuffer();

//     // select the position buffer as the buffer to apply operations on
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//     // define the data as an array
//     const positions = [
//         -1.0, 1.0,
//         -1.0, -1.0,
//         1.0, 1.0,
//         1.0, -1.0
//     ];

//     // convert the array to a Float32Array, then populate the buffer with the position data
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

//     buffers.stars.data = positionBuffer;
//     buffers.stars.vertexCount = positions.length / 2;
//     buffers.stars.numComponents = 2;
//     buffers.stars.type = gl.FLOAT;
// }
