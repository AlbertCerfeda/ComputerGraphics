
// ----------------- Assignment ------------------
// Modify the vertex and the fragment shaders such that:
// (1) The vertex shader accepts a new attribute a_color of type vec3
// (2) The vertex shader copy the value of a_color to a new output variable v_color of type vec3
// (3) The fragment shader accepts as an input the additional variable v_color and uses it to color the fragment
//------------------------------------------------
var vertexShaderCode =
    `#version 300 es
                in vec3 a_position;
                in vec3 a_color;
                out vec3 v_color;

                uniform mat4 rotationMatrix;
                void main(){
                    gl_Position = rotationMatrix * vec4(a_position,1.0); // extra code for interactive rotation, it does need to be modified
                    v_color = a_color;
                }`;

var fragmentShaderCode =
    `#version 300 es
                precision mediump float;

                in vec3 v_color;
                out vec4 out_color;
                void main(){
                    out_color = vec4(v_color,1.0);
                    // out_color = vec4(0.0, 0.61, 0.87, 1.0);
                }`;

// vertices of our traingle
var triangle_vertices = [
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
];

//---------------- Assignment -------------------
// Define color for each vertex of a triangle.
// The vertices should have different colors, e.g., reg, green, blue.
// The colors within the triangle will be interpolated automaticaly.
//----------------------------------------------
var triangle_colors = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
];


var gl; // WebGL context
var shaderProgram; // the GLSL program we will use for rendering
var triangle_vao; // the vertex array object for the triangle

// The function initilize the WebGL canvas
function initWebGL() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    //keep the size of the canvas for leter rendering
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    //check for errors
    if (gl) {
        console.log("WebGL succesfully initialized.");
    } else {
        console.log("Failed to initialize WebGL.")
    }
}

// This function compiles a shader
function compileShader(shader, source, type, name = "") {
    // link the source of the shader to the shader object
    gl.shaderSource(shader, source);
    // compile the shader
    gl.compileShader(shader);
    // check for success and errors
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(name + " shader compiled succesfully.");
    } else {
        console.log(name + " vertex shader error.")
        console.log(gl.getShaderInfoLog(shader));
    }
}

// This function links the GLSL program by combining different shaders
function linkProgram(program, vertShader, fragShader) {
    // attach vertex shader to the program
    gl.attachShader(program, vertShader);
    // attach fragment shader to the program
    gl.attachShader(program, fragShader);
    // link the program
    gl.linkProgram(program);
    // check for success and errors
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("The shaders are initialized.");
    } else {
        console.log("Could not initialize shaders.");
    }
}

function createGLSLPrograms() {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    compileShader(vertexShader, vertexShaderCode, gl.VERTEX_SHADER, "Vertex shader");
    // Creating fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    compileShader(fragmentShader, fragmentShaderCode, gl.VERTEX_SHADER, "Fragment shader");
    // Creating and linking the program
    shaderProgram = gl.createProgram();
    linkProgram(shaderProgram, vertexShader, fragmentShader);

    shaderProgram.rotationMatrix = gl.getUniformLocation(shaderProgram, "rotationMatrix"); // extra code for interactive rotation, it does need to be modified
}

function initBuffers() {
    let dcube = cube(0, 0, 0, 1);
    // debugger
    //----------------------------------------------------------------------------
    // First we need to create buffers on the GPU and copy there our data
    //----------------------------------------------------------------------------
    // create a buffer for vertices
    var triangleVertexBuffer = gl.createBuffer();
    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    // copy the data from the CPU to the buffer (GPU)
    // 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dcube.vertices), gl.STATIC_DRAW);


    //------------- Assignment: Create a buffer for color --------------
    // In similar way (see above):
    // (1) create a buffer for color,
    // (2) bind the buffer, and
    // (3) fill the buffer with the color data
    //------------------------------------------------------------------
    //...
    var triangleColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_colors), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dcube.colors), gl.STATIC_DRAW);

    //----------------------------------------------------------------------------
    // At this point our vertices are already on the GPU.
    // We have to specify how the data will flow through the graphics pipeline.
    // We do it by setting up the vertex array objects which sotre information about buffers and how the connect to attributes.
    //----------------------------------------------------------------------------

    // create a vertex array object (VAO) to store information about buffers and attributes
    triangle_vao = gl.createVertexArray();
    // bind the VAO
    gl.bindVertexArray(triangle_vao);

    //----------------------------------------------------------------------------
    // Now we need to set up all the buffers and attributes for rendering
    //----------------------------------------------------------------------------
    // bind the buffer with vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    // get position of the attribute in the vertex shader
    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    // enable attribute for the positions
    gl.enableVertexAttribArray(positionAttributeLocation);
    // bining the vertex buffer with positions to the correct attribute
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    //--------- Assignment: Configure the attributes for color ----------
    // Similarly to the code above:
    // (1) bind the color buffer,
    // (2) get the color attribute location,
    // (3) enable the color attribute,
    // (4) bind the buffer to the attribute
    //-------------------------------------------------------------------
    //...
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
    var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "a_color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
}

function draw() {
    // extra code for interactive rotation, it does need to be modified
    var rotation = document.getElementById("rotation");
    var rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, -(rotation.value - 100) / 100 * Math.PI, vec3.fromValues(-0.2, 1, 0));
    //------------------------------------------------------------------

    // set the size of our rendering area
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    // setting the background color
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    // clear the rendering area
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ------------------- Assignment -------------------
    // Enable face culling and depth test for the 2nd part of the assignment
    //gl.enable(gl.CULL_FACE);
    //gl.enable(gl.DEPTH_TEST);
    //---------------------------------------------------
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    //----------------------------------------------------------------------------
    // Now we are ready to render
    //----------------------------------------------------------------------------
    // enable the GLSL program for the rendering
    gl.useProgram(shaderProgram);
    gl.uniformMatrix4fv(shaderProgram.rotationMatrix, false, rotationMatrix); // extra code for interactive rotation, it does need to be modified
    // bind the VAO (this restores the state from when we were creating the VAO)
    gl.bindVertexArray(triangle_vao);
    // ------------------- Assignment -------------------
    // Remember to set the number of vertices correctly.
    // For the triangle it is 3, but how many for a cube?
    //---------------------------------------------------
    // draw all the triangles
    gl.drawArrays(gl.TRIANGLES, 0, 6*6);

    window.requestAnimationFrame(function () { draw(); });
}
function start() {
    // initialze WebGL
    initWebGL();
    // create GLSL programs
    createGLSLPrograms();
    // initialize all the buffers and set up the vertex array objects (VAO)
    initBuffers();
    // draw
    draw();
}