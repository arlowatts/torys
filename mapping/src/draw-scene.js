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
    setPositionAttribute(buffers.torus, programInfo.torus);

    // enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // clear the scene
    gl.clearDepth(1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    for (let i = 2; i < buffers.torus.data.length; i += 3) {
        // buffers.torus.data[i] = -3 + (Math.sin(buffers.torus.data[i - 2] * 10) + Math.sin(buffers.torus.data[i - 1] * 10)) / 10;
        buffers.torus.data[i] = -3;
    }

    buffers.torus.floatArray.set(buffers.torus.data);

    // update the vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.torus.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffers.torus.floatArray, gl.STATIC_DRAW);

    let uniforms = programInfo.torus.uniformLocations;

    // set the shader uniforms
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
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffers.torus.vertexCount);
}

// define the mapping from the buffers to the attributes
function setPositionAttribute(buffer, program) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);

    gl.vertexAttribPointer(
        program.attribLocations.vertexPosition,
        buffer.numComponents,
        buffer.type,
        buffer.normalize,
        buffer.stride,
        buffer.offset
    );

    gl.enableVertexAttribArray(program.attribLocations.vertexPosition);
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
