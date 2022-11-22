var vertexShaderCode =
    `#version 300 es
    in vec3 a_position;
    in vec3 a_color;
    out vec3 v_color;

    uniform mat4 rotationMatrix; // required for the solution of the previous assignment, please remove

    // Exercise 1: add uniforms for all transformation matrices
    // Exercise 3: add input attribute for normals
    //             add output variables required for light computation, e.g., normal, view direction etc.
    //             add here also a uniform for light direction, unless you pass it directly to the fragment shader

    void main(){
        v_color = a_color;

        // compute all the variables required for light computation in the fragment shader
        // remember that all the locations and vectors have to be in a common space, e.g., eye/camera space

        // replace the rotationMatrix with correct transformations
        gl_Position = rotationMatrix * vec4(a_position,1.0);
    }`;

var fragmentShaderCode =
    `#version 300 es
    precision mediump float;

    in vec3 v_color;

    // Exercise 3: add all the input variable passed from the vertex shader
    //             if the do not include the light direction, you should add here an additional uniform for it
    //             you can also add here constants for Phong shading model, e.g., light color, ambient, diffuse, and specular coefficients, gamma value, as well as shininess

    out vec4 out_color;
    void main(){

        // Exercise 3: add computation of Phong shading
        //             do not forget about: normalizing all vectors beforehand, (2) performing gamma correction at the end

        out_color = vec4(v_color, 1.0);
    }`;


var gl; // WebGL context
var shaderProgram; // the GLSL program we will use for rendering
var cube_vao; // the vertex array object for the cube

// Exercise 2: you may want to add here variable for VAO of plane and sphere


// The function initilize the WebGL canvas
function initWebGL(){
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    //keep the size of the canvas for leter rendering
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    //check for errors
    if(gl){
        console.log("WebGL succesfully initialized.");
    }else{
        console.log("Failed to initialize WebGL.")
    }
}

// This function compiles a shader
function compileShader(shader, source, type, name = ""){
    // link the source of the shader to the shader object
    gl.shaderSource(shader,source);
    // compile the shader
    gl.compileShader(shader);
    // check for success and errors
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        console.log(name + " shader compiled succesfully.");
    }else{
        console.log(name + " vertex shader error.")
        console.log(gl.getShaderInfoLog(shader));
    }
}

// This function links the GLSL program by combining different shaders
function linkProgram(program,vertShader,fragShader){
    // attach vertex shader to the program
    gl.attachShader(program,vertShader);
    // attach fragment shader to the program
    gl.attachShader(program,fragShader);
    // link the program
    gl.linkProgram(program);
    // check for success and errors
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("The shaders are initialized.");
    }else{
        console.log("Could not initialize shaders.");
    }
}

function createGLSLPrograms(){
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    compileShader(vertexShader, vertexShaderCode, gl.VERTEX_SHADER, "Vertex shader");
    // Creating fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    compileShader(fragmentShader, fragmentShaderCode, gl.VERTEX_SHADER, "Fragment shader");
    // Creating and linking the program
    shaderProgram = gl.createProgram();
    linkProgram(shaderProgram, vertexShader, fragmentShader);
}

// Excercies 2:
// Since one has to repeat creating VAO of each object (cube, plane, sphere) separately,
// we suggest implement a function which takes the arrays containing values of the attributes,
// and then, creates VBOa, VAOs, and sets up the attributes.
// This should later simplify your code in initBuffers() to something like:
//      cube_vao = gl.createVertexArray();
//      createVAO(cube_vao, shaderProgram, cube_vertices, cube_normals, cube_colors);
//      sphere_vao = gl.createVertexArray();
//      createVAO(sphere_vao, shaderProgram, sphere_vertices, sphere_vertices, sphere_colors);
//      plane_vao = gl.createVertexArray();
//      createVAO(plane_vao, shaderProgram, plane_vertices, plane_normals, plane_colors);
function createVAO(vao, shader, vertices, colors){
}

function initBuffers(){
    // a buffer for positions
    var cubeVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_vertices), gl.STATIC_DRAW);

    // a buffer for colors
    var cubeColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_colors), gl.STATIC_DRAW);

    // VAO for a cube
    cube_vao = gl.createVertexArray();
    gl.bindVertexArray(cube_vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "a_color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
}

function draw(){
    // input variables for controling camera and light parameters
    // feel free to use these or create your own
    let camera_azimuthal_angle = document.getElementById("camera_azimuthal_angle").value / 360 * 2 * Math.PI;
    let camera_polar_angle = document.getElementById("camera_polar_angle").value / 360 * 2 * Math.PI;
    let camera_distance = document.getElementById("camera_distance").value / 10;
    let camera_fov = document.getElementById("camera_fov").value / 360 * 2 * Math.PI;
    let light_azimuthal_angle = document.getElementById("light_azimuthal_angle").value / 360 * 2 * Math.PI;
    let light_polar_angle = document.getElementById("light_polar_angle").value / 360 * 2 * Math.PI;

    // Exercise 1:
    // add computation of camera position
    // let camera_x =
    // let camera_y =
    // let camera_z =
    // let camera_position = vec3.fromValues(camera_x, camera_y, camera_z);

    // Excercise 3:
    // add computation of light direction
    // let light_x =
    // let light_y =
    // let light_z =
    // let lightDirection = vec3.fromValues(light_x, light_y, light_z);
    // add computation of view and projection matrices


    // relevant only for the solutions of the previous assignment (please remove it for this assignment)
    var rotation = document.getElementById("rotation");
    var rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, -(rotation.value-100)/100*Math.PI, vec3.fromValues(-0.2,1,0));


    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // enable the GLSL program for the rendering
    gl.useProgram(shaderProgram);

    // Tips for drawing:
    // - Before drawing anything using the program you still have to set values of all uniforms.
    // - As long as you use the same shader program you do not need to set all uniforms everytime you draw new object. The programs remembers the uniforms after calling gl.drawArrays
    // - The same, if you draw the same object, e.g., cube, multiple times, you do not need to bind the corresponding VAO everytime you draw.


    // drawing the cube
    gl.bindVertexArray(cube_vao);
    let rotationMatrixLocation = gl.getUniformLocation(shaderProgram,"rotationMatrix");
    gl.uniformMatrix4fv(rotationMatrixLocation, false, rotationMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length/3);


    window.requestAnimationFrame(function() {draw();});
}
function start(){
    // initialze WebGL
    initWebGL();
    // create GLSL programs
    createGLSLPrograms();
    // initialize all the buffers and set up the vertex array objects (VAO)
    initBuffers();
    // draw
    draw();
}
