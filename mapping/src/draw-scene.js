import { getNeighbors } from "./hex-buffer.js";
import { gl, programInfo, buffers, torus, view, light } from "./properties.js";
import * as properties from "./properties.js";

// draw the starry background
// export function drawStars() {
//     gl.useProgram(programInfo.stars.program);
//     setPositionAttribute(buffers.stars, programInfo.stars);

//     // disable depth testing
//     gl.disable(gl.DEPTH_TEST);

//     let uniforms = programInfo.stars.uniformLocations;

//     // set the shader uniforms
//     gl.uniformMatrix4fv(uniforms.viewDirectionMatrix, false, getViewDirectionMatrix());
//     gl.uniformMatrix4fv(uniforms.lightDirectionMatrix, false, light.directionMatrix);

//     // set the shapes to draw
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffers.stars.vertexCount);
// }

// draw the planet
export function drawTorus() {
    gl.useProgram(programInfo.torus.program);
    setBufferAttribute(buffers.torus, programInfo.torus.attribLocations.vertexPosition);
    setBufferAttribute(buffers.normals, programInfo.torus.attribLocations.vertexNormal);

    // enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // clear the scene
    gl.clearDepth(1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    setVertices(buffers.torus);
    setNormals(buffers.normals, buffers.torus);

    // set the shader uniforms
    let uniforms = programInfo.torus.uniformLocations;
    gl.uniformMatrix4fv(uniforms.projectionMatrix, false, getProjectionMatrix());
    // gl.uniformMatrix4fv(uniforms.viewMatrix, false, getViewMatrix());

    // gl.uniform4fv(uniforms.lightDirection, light.direction);

    // gl.uniform1f(uniforms.lightAmbience, light.ambience);
    // gl.uniform1f(uniforms.zoomLevel, view.zoom);
    // gl.uniform1f(uniforms.terrainResolution, view.zoom * torus.terrainResolution);
    // gl.uniform1f(uniforms.terrainHeightScale, getTerrainHeightScale());
    // gl.uniform1f(uniforms.terrainNormalResolution, view.zoom * torus.terrainNormalResolution);
    // gl.uniform1f(uniforms.time, view.time);
    // gl.uniform1i(uniforms.showClouds, view.zoomPrecise > 1 ? 1 : 0);

    // set the shapes to draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices.buffer);
    gl.drawElements(gl.TRIANGLES, buffers.indices.vertexCount, buffers.indices.type, buffers.indices.offset);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffers.torus.vertexCount);
}

// update the vertex coordinates and send the new values to the shaders
function setVertices(buffer) {
    for (let i = 2; i < buffer.data.length; i += 3) {
        buffer.data[i] = -3;
        buffer.data[i] += (Math.sin(buffer.data[i - 2] * 10) + Math.sin(buffer.data[i - 1] * 10)) / 5;
        buffer.data[i] *= view.zoom;
    }

    // update the float array with the adjusted vertices
    buffer.floatArray.set(buffer.data);

    // update the vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffer.floatArray, gl.STATIC_DRAW);
}

// update the surface normals based on a given buffer of vertices
function setNormals(normalBuffer, meshBuffer) {
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

        let normal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), a, b));

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
// function setNormals(normalBuffer, meshBuffer) {
//     for (let i = 0; i < meshBuffer.vertexCount; i++) {
//         let count = 0;

//         normalBuffer.data[i * 3] = 0;
//         normalBuffer.data[i * 3 + 1] = 0;
//         normalBuffer.data[i * 3 + 2] = 0;

//         const neighbors = getNeighbors(i);

//         let message = i + "=";
        
//         for (let j = 0; j < neighbors.length; j++) {
//             let index = neighbors[j];

//             if (index != -1) {
//                 normalBuffer.data[i * 3] += meshBuffer.data[index * 3];
//                 normalBuffer.data[i * 3 + 1] += meshBuffer.data[index * 3 + 1];
//                 normalBuffer.data[i * 3 + 2] += meshBuffer.data[index * 3 + 2];

//                 count++;

//                 message += index + ":"
//             }
//         }

//         if (count > 0) {
//             normalBuffer.data[i * 3] = normalBuffer.data[i * 3] / count - meshBuffer.data[i * 3];
//             normalBuffer.data[i * 3 + 1] = normalBuffer.data[i * 3 + 1] / count - meshBuffer.data[i * 3 + 1];
//             normalBuffer.data[i * 3 + 2] = normalBuffer.data[i * 3 + 2] / count - meshBuffer.data[i * 3 + 2];
//         }

//         console.log(message + "{" + count + "} " + normalBuffer.data[i * 3] + ", " + normalBuffer.data[i * 3 + 1] + ", " + normalBuffer.data[i * 3 + 2]);
//     }

//     // update the float array with the adjusted vertices
//     normalBuffer.floatArray.set(normalBuffer.data);

//     // update the vertex buffer
//     gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer.buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, normalBuffer.floatArray, gl.STATIC_DRAW);
// }

// define the mapping from the buffers to the attributes
function setBufferAttribute(buffer, attribLocation) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);

    gl.vertexAttribPointer(
        attribLocation,
        buffer.numComponents,
        buffer.type,
        buffer.normalize,
        buffer.stride,
        buffer.offset
    );

    gl.enableVertexAttribArray(attribLocation);
}

// create a projection matrix to render the torus with a 3D perspective
function getProjectionMatrix() {
    let zNear = 1, zFar = 5;

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, view.fov, view.aspect, zNear, zFar);

    return projectionMatrix;
}

// create a view matrix to define the camera's position and angle
function getViewMatrix() {
    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -torus.smallRadius - Math.max(view.zoom, properties.MIN_CAMERA_DISTANCE)]);
    mat4.rotate(viewMatrix, viewMatrix, view.theta, [1.0, 0.0, 0.0]);
    mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -torus.largeRadius]);
    mat4.rotate(viewMatrix, viewMatrix, view.phi, [0.0, 1.0, 0.0]);

    return viewMatrix;
}

// create a view matrix to define only the camera's angle for the stars
function getViewDirectionMatrix() {
    const viewDirectionMatrix = mat4.create();
    mat4.rotate(viewDirectionMatrix, viewDirectionMatrix, view.theta, [1.0, 0.0, 0.0]);
    mat4.rotate(viewDirectionMatrix, viewDirectionMatrix, view.phi, [0.0, 1.0, 0.0]);

    return viewDirectionMatrix;
}

function getTerrainHeightScale() {
    let scale = 0.0;
    let height = 0.5;

    do {
        scale += height;
        height *= 0.5;
    }
    while (height >= view.zoom * torus.terrainResolution);

    return 1.0 / scale;
}
