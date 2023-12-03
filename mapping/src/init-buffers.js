import { gl, buffers, torus, view } from "./properties.js";

// creates a vertex buffer for a screen-filling hexagonal mesh
export function initSurfaceBuffer() {
    // create the buffer
    const positionBuffer = gl.createBuffer();

    // select the position buffer as the buffer to apply operations on
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // define the data as an array
    const positions = [];

    let verticalResolution = Math.ceil(torus.surfaceMesh.verticalResolution);

    let edgeLength = 2 / (verticalResolution - 1);

    let halfRowHeight = edgeLength * 0.5;
    let columnWidth = edgeLength * Math.cos(Math.PI / 6) / view.aspect;

    let horizontalResolution = Math.ceil(2 / columnWidth);

    let x = -horizontalResolution * columnWidth / 2;
    let y = -0.75 * edgeLength - 1;

    while (x < 1) {

        for (let i = 0; i < verticalResolution + 1; i++) {
            positions.push(x);
            positions.push(y + edgeLength * i);

            positions.push(x + columnWidth);
            positions.push(y + edgeLength * i + halfRowHeight);
        }

        x += columnWidth;

        if (x >= 1) {
            break;
        }

        for (let i = 0; i < verticalResolution + 1; i++) {
            positions.push(x);
            positions.push(y + edgeLength * (verticalResolution - i) + halfRowHeight);

            positions.push(x + columnWidth);
            positions.push(y + edgeLength * (verticalResolution - i));
        }

        x += columnWidth;

    }

    // convert the array to a Float32Array, then populate the buffer with the position data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    buffers.torus.data = positionBuffer;
    buffers.torus.vertexCount = positions.length / 2;
    buffers.torus.numComponents = 2;
    buffers.torus.type = gl.FLOAT;
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
