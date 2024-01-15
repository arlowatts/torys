import { gl, programInfo, buffers, torus, view, light } from "./properties.js";

// draw the planet
export function drawTorus() {
    gl.useProgram(programInfo.torus.program);

    setBufferAttribute(buffers.torus, programInfo.torus.attribLocations.vertexPosition);

    // enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // clear the scene
    gl.clearDepth(1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    // set the shader uniforms
    let uniforms = programInfo.torus.uniformLocations;

    gl.uniformMatrix4fv(uniforms.projectionMatrix, false, getProjectionMatrix());
    gl.uniformMatrix4fv(uniforms.viewMatrix, false, getViewMatrix());

    gl.uniform3fv(uniforms.lightDirection, light.direction.slice(0, 3));
    gl.uniform1f(uniforms.lightAmbience, light.ambience);

    gl.uniform1i(uniforms.zoomLevel, Math.max(torus.terrainResolution - view.zoomSemiPrecise, 1));
    gl.uniform1f(uniforms.zoomScale, view.zoom);
    gl.uniform1f(uniforms.inverseZoomScale, view.inverseZoom);

    gl.uniform1f(uniforms.phi, view.phi);
    gl.uniform1f(uniforms.theta, view.theta);

    // set the shapes to draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffers.torus.vertexCount);
}

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
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, view.fov, view.aspect, 1, 100);

    return projectionMatrix;
}

// create a view matrix to rotate the torus after the mesh is deformed
function getViewMatrix() {
    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -torus.smallRadius * view.inverseZoom]);
    mat4.rotate(viewMatrix, viewMatrix, view.theta, [1.0, 0.0, 0.0]);
    mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -torus.largeRadius * view.inverseZoom]);
    mat4.rotate(viewMatrix, viewMatrix, view.phi, [0.0, 1.0, 0.0]);
    // mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -torus.smallRadius]);

    return viewMatrix;
}
