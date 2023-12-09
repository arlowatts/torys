import { gl, buffers, torus, view } from "./properties.js";

// creates a vertex buffer for a screen-filling hexagonal mesh
export function initSurfaceBuffer() {
    // define the data as an array
    const positions = [];

    // compute parameters for the spacing between points
    const edgeLength = torus.surfaceMesh.edgeLength;

    const halfRowHeight = edgeLength * 0.5;
    const columnWidth = edgeLength * Math.cos(Math.PI / 6);

    const verticalResolution = Math.ceil(1 / edgeLength) + 1;
    const horizontalResolution = Math.ceil(view.aspect / columnWidth);

    let x = -horizontalResolution * columnWidth;
    let y = -(verticalResolution - 1) * edgeLength;// + halfRowHeight;

    // fill the array of positions following a pattern
    for (let i = 0; i < horizontalResolution; i++) {
        // go down the first column
        for (let j = 0; j < verticalResolution + 1; j++) {
            positions.push(x);
            positions.push(y + edgeLength * j);
            positions.push(0);

            positions.push(x + columnWidth);
            positions.push(y + edgeLength * j + halfRowHeight);
            positions.push(0);
        }

        // step into the second column
        x += columnWidth;

        // go up the second column
        for (let j = 0; j < verticalResolution + 1; j++) {
            positions.push(x);
            positions.push(y + edgeLength * (verticalResolution - j) + halfRowHeight);
            positions.push(0);

            positions.push(x + columnWidth);
            positions.push(y + edgeLength * (verticalResolution - j));
            positions.push(0);
        }

        // step into the next column for the next iteration
        x += columnWidth;
    }

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
