import { drawTorus } from "./draw-scene.js";
import { initSurfaceBuffer } from "./init-buffers.js";
import { gl, programInfo, torus, view, light } from "./properties.js";
import * as properties from "./properties.js";
import * as torusFragment from "./shaders/torus-fragment.js";
import * as torusVertex from "./shaders/torus-vertex.js";

main();

function main() {
    // initialize the shader programs
    const torusProgram = initShaderProgram(torusVertex.source, torusFragment.source);

    // collect information about the shader programs
    programInfo.torus.program = torusProgram;

    programInfo.torus.attribLocations = {
        vertexPosition: gl.getAttribLocation(torusProgram, "aVertexPosition")
    };

    programInfo.torus.uniformLocations = {
        projectionMatrix: gl.getUniformLocation(torusProgram, "uProjectionMatrix"),

        lightDirection: gl.getUniformLocation(torusProgram, "uLightDirection"),
        lightAmbience: gl.getUniformLocation(torusProgram, "uLightAmbience"),

        zoomLevel: gl.getUniformLocation(torusProgram, "uZoomLevel"),
        zoomScale: gl.getUniformLocation(torusProgram, "uZoomScale"),

        phi: gl.getUniformLocation(torusProgram, "uPhi"),
        theta: gl.getUniformLocation(torusProgram, "uTheta")
    };

    // initialize the data buffers for the scene
    initSurfaceBuffer();

    // ensure that the zoom and pan values are correct
    onMouseMove({buttons: 1, movementX: 0.0, movementY: 0.0});
    onWheel({wheelDelta: 0.0});

    // create the event listeners for pan and zoom
    addEventListener("mousemove", onMouseMove);
    addEventListener("wheel", onWheel);

    // draw the scene and update it each frame
    requestAnimationFrame(render);
}

function render(now) {
    vec4.copy(light.direction, light.baseDirection);

    drawTorus();

    requestAnimationFrame(render);
}

// adjust the view location when the mouse is dragged
function onMouseMove(event) {
    if (event.buttons == 1 && view.allowPanning) {
        // track the precise angle values as integers to avoid loss of precision
        view.phiPrecise += event.movementX * view.panSensitivity / torus.largeRadius;
        view.thetaPrecise += event.movementY * view.panSensitivity / torus.smallRadius;

        // wrap the values past a full rotation to avoid overflow
        view.phiPrecise %= properties.PAN_LIMIT;
        view.thetaPrecise %= properties.PAN_LIMIT;

        // compute the actual angles as Numbers
        view.phi = view.phiPrecise * properties.PRECISE_PAN_TO_RADIANS;
        view.theta = view.thetaPrecise * properties.PRECISE_PAN_TO_RADIANS;
    }
}

// zoom when the scroll wheel is used
function onWheel(event) {
    // track the precise zoom value to avoid loss of precision
    view.zoomPrecise -= event.wheelDelta;
    view.zoomPrecise = Math.min(Math.max(view.zoomPrecise, properties.MIN_ZOOM_PRECISE), properties.MAX_ZOOM_PRECISE);
    view.zoomSemiPrecise = view.zoomPrecise * properties.SCROLL_SENSITIVITY;

    // compute the exponential zoom value and the updated pan sensitivity
    view.zoom = 2 ** view.zoomSemiPrecise;
    view.panSensitivity =
        2 ** (Math.min(view.zoomSemiPrecise, properties.MAX_PAN_SENSITIVITY) - properties.MIN_ZOOM)
        * properties.BASE_PAN_SENSITIVITY / view.cameraDistance;
}

// initialize the shader program with a vertex shader and a fragment shader
// vsSource defines the source code for the vertex shader
// fsSource defines the source code for the fragment shader
// returns a shader program object
function initShaderProgram(vsSource, fsSource) {
    // compile the shaders
    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

    // create the shader program and link the shaders
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // check that the shader program compiled correctly
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram,)}`);
        return null;
    }

    return shaderProgram;
}

// type defines the type of shader
// source defines the source code of the shader
// returns a compiled shader object
function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // check that the shader compiled properly
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
