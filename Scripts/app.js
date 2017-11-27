// Loading shaders before program starts
var InitProgram = function () {
	loadTextResource('./Shaders/shader.vs.glsl', function (vsErr, vsText) {
		if (vsErr) {
			alert('Fatal error getting vertex shader (see console)');
			console.error(vsErr);
		} else {
			loadTextResource('./Shaders/shader.fs.glsl', function (fsErr, fsText) {
				if (fsErr) {
					alert('Fatal error getting fragment shader (see console)');
					console.error(fsErr);
				} else {
					RunProgram(vsText, fsText);
				}
			});
		}
	});
};

//Adds a block to the gameobject-list
function AddToRenderObjectList(object)
{
	gameObjects.push(object);
}

//HTML5 canvas
var canvas;

//Render var
var gl;
var gameObjects = [];
var particles = [];
var lights = [];
var worldAmbient = vec3(0.0,0.0,0.1);
var fogDist = [25, 29];

//Interaction var
var lastMouseX = 0;
var lastMouseY = 0;
var mouseDown = false;

var RunProgram = function(vertexShaderText, fragmentShaderText)
{
	console.log('This is working');

	canvas = document.getElementById('game-surface');
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;


	gl = canvas.getContext('webgl');

	// Internet Explorer, Edge and some other browsers dont support the 
	// above context fully, so we need to get a different context for those
	// if gl wasn't found
	if(!gl)
	{
		console.log('WebGL not supported, falling back on expermental-webgl')
		gl = canvas.getContext('expermental-webgl');
	}

	if(!gl){
		alert('Your browser does not support WebGL');
	}

	/* 		SHADER PROGRAM INITIALIZATION END 		*/
	//Setting the background color
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

	var program = CreateShaderProgram(gl, vertexShaderText, fragmentShaderText);

	// Tell OpenGL state machine which program should be active
	gl.useProgram(program);

	//Find and enable attributes
	var positionAttributeLocation = gl.getAttribLocation(program, 'vertexPosition');
	var normalAttributeLocation = gl.getAttribLocation(program, 'vertexNormal');
	var tangentAttributeLocation = gl.getAttribLocation(program, 'vertexTangent');
	var texCoordAttributeLocation = gl.getAttribLocation(program, 'vertexTexCoord');

	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.enableVertexAttribArray(normalAttributeLocation);
	//gl.enableVertexAttribArray(tangentAttributeLocation);
	gl.enableVertexAttribArray(texCoordAttributeLocation);

	//Object uniforms
	var matModelUniformLocation = gl.getUniformLocation(program, 'mModel');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
	//Material uniforms
	var shinynessUniformLocation = gl.getUniformLocation(program, 'shinyness');
	var ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');

	//Fog uniforms
	var fogUniformLocation = gl.getUniformLocation(program, 'fogColor');
	var fogDistUniformLocation = gl.getUniformLocation(program, 'fogDist');

	//Light uniforms
	var lightPosUniformLocation = gl.getUniformLocation(program, 'light01.position');
	var lightColorUniformLocation = gl.getUniformLocation(program, 'light01.color');
	var lightIntUniformLocation = gl.getUniformLocation(program, 'light01.intensity');
	var lightRangeUniformLication = gl.getUniformLocation(program, 'light01.range');
	
	var light02PosUniformLocation = gl.getUniformLocation(program, 'light02.position');
	var light02ColorUniformLocation = gl.getUniformLocation(program, 'light02.color');
	var light02IntUniformLocation = gl.getUniformLocation(program, 'light02.intensity');
	var light02RangeUniformLication = gl.getUniformLocation(program, 'light02.range');

	//Camera uniforms
	var camPosUniformLocation = gl.getUniformLocation(program, 'eye');
	
	//Texture uniforms
	var mainTexLocation = gl.getUniformLocation(program, 'mainTex');
	var specTexLocation = gl.getUniformLocation(program, 'specularTex');
	var normalMapLocation = gl.getUniformLocation(program, 'normalMap');
	/* 		SHADER PROGRAM INITIALIZATION END 		*/

	/* 		TEXTURE CREATION START  	*/
	images = [];
	images.push(document.getElementById('cubeAtlas'));
	images.push(document.getElementById('cubeAtlasSpecular'));

	var textures = [];
	for(var i = 0; i < images.length; i++)
	{
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
			gl.UNSIGNED_BYTE,
			images[i]
			)
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
		textures.push(texture);
	}

	gl.uniform1i(mainTexLocation, 0);
	gl.uniform1i(specTexLocation, 1);
	console.log("MainTex: " + mainTexLocation + " SpecTex: " + specTexLocation)

	gl.bindTexture(gl.TEXTURE_2D, null);
	/* 		TEXTURE CREATION END 	 */
	
	// Camera
	var camera = new Camera();
	gl.uniform3f(camPosUniformLocation, camera.transform.pos[0], camera.transform.pos[1], camera.transform.pos[2]);
	
	//Lights
	var light = new Light()
	light.transform.SetPosition(10, 8, 10);
	light.SetColor(0.3, 0.35, 1);
	light.intensity = 0.5;
	lights.push(light);

	var light02 = new Light()
	light02.transform.SetPosition(-10, 8, -10);
	light02.SetColor(0.9, 0.1, 1);
	light02.intensity = 0.5;
	lights.push(light02);

	//Fog
	gl.uniform3f(fogUniformLocation, worldAmbient[0], worldAmbient[1], worldAmbient[2]);
	gl.uniform2f(fogDistUniformLocation, fogDist[0], fogDist[1]);
	
	/*		INTERACTION	START	*/
	//On mousedragging - rotate the camera
	var deltaXgravity = 1;
	var deltaYgravity = 0;
	var zoomGravity = 0;
	var rotateTimer = 0;
	canvas.onmousedown = function(ev){
		mouseDown = true;
		lastMouseX = ev.x;
		lastMouseY = ev.y;
		rotateTimer = 2;
	}
	canvas.onmousemove = function(ev){
		if(!mouseDown)
			return;
		deltaX = ev.x - lastMouseX;
		deltaY = ev.y - lastMouseY;
		deltaXgravity = deltaX;
		deltaYgravity = deltaY;

		lastMouseX = ev.x;
		lastMouseY = ev.y;
	};
	canvas.onmouseup = function(ev){mouseDown = false;}

	//Zoom on mousewheel scroll
	window.onmousewheel = function(ev){
		zoomGravity = ev.wheelDelta/250;
	}
	/*		INTERACTION	END	*/
	
	//Creates all the objects in the scene
	CreateScene();
	
	/* 		MAIN RENDER LOOP 	*/
	var angle = 0;
	var loop = function()
	{
		// Fit the canvas to the whole browser window
		resize(gl.canvas);
		gl.viewport(0,0,gl.canvas.width, gl.canvas.height);

		//AutoRotation
		if(!mouseDown && rotateTimer >= 0)
			rotateTimer -= 0.1
		else if(!mouseDown && rotateTimer < 0 && Math.abs(deltaXgravity) < 1)
		{
			if(deltaXgravity > 0)
				deltaXgravity = Math.min(2, deltaXgravity + 0.1);
			else
				deltaXgravity = Math.max(-2, deltaXgravity - 0.1);
			//deltaYgravity = Math.min(1, deltaYgravity + deltaTime);	
		}


		//Smoother movement on camera
		deltaXgravity *=0.90;
		deltaYgravity *= 0.90;
		zoomGravity *= 0.85;
		camera.AdjustAngle(deltaXgravity, deltaYgravity);
		camera.AdjustDistance(zoomGravity);
		camera.UpdatePosition();

		//Set view and projection matrices
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, flatten(camera.GetViewMatrix()));
		gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, flatten(camera.GetProjectionMatrix()));

		//Lighting
		gl.uniform3f(ambientUniformLocation, worldAmbient[0], worldAmbient[1], worldAmbient[2]);
		SetLightUniforms(0, lightPosUniformLocation, lightColorUniformLocation, lightRangeUniformLication, lightIntUniformLocation);
		SetLightUniforms(1, light02PosUniformLocation, light02ColorUniformLocation, light02RangeUniformLication, light02IntUniformLocation);

		//CameraPos uniform update in case of movement in camera pos
		gl.uniform3f(camPosUniformLocation, camera.transform.pos[0], camera.transform.pos[1], camera.transform.pos[2]);

		
		//Bind texture atlas
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[0]);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, textures[1]);

		for(i = 0; i < gameObjects.length; i++)
		{
			RenderObject(gameObjects[i]);
		}

		gl.enable(gl.BLEND);

		for(i = 0; i < particles.length; i++)
		{
			var pos = particles[i].transform.pos;
			particles[i].transform.Translate(0, -particles[i].yVelocity, 0);
			if(pos[1] < 0)
				particles[i].transform.pos[1] = Math.random() * 2 + 10;
			RenderObject(particles[i]);
		}
		gl.disable(gl.BLEND);
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);

	function RenderObject(obj)
	{
		//Get modelMatrix and material variables and send it to the shaderprogram
		modelMatrix = obj.transform.GetModelMatrix();
		gl.uniformMatrix4fv(matModelUniformLocation, gl.FALSE, flatten(modelMatrix));
		gl.uniform1f(shinynessUniformLocation, obj.mesh.material.shinyness);
		gl.uniform3f(ambientUniformLocation, obj.mesh.material.ambient[0], obj.mesh.material.ambient[1], obj.mesh.material.ambient[2]);
		
		//Render the gameobject mesh
		obj.Render(positionAttributeLocation, normalAttributeLocation , tangentAttributeLocation,texCoordAttributeLocation);	
	}
}



//Sets all the light uniforms for the light "i"
function SetLightUniforms(i, posLocation, colorLocation, rangeLocation, intLocation)
{
	gl.uniform3f(posLocation, lights[i].transform.pos[0], lights[i].transform.pos[1], lights[i].transform.pos[2]);
	gl.uniform3f(colorLocation, lights[i].color[0], lights[i].color[1], lights[i].color[2]);
	gl.uniform1f(rangeLocation, lights[i].range);
	gl.uniform1f(intLocation, lights[i].intensity);
}

//Handling of browserwindow resizing
function resize(canvas)
	{
		// Lookup the size the browser is displaying the canvas.
	  	var displayWidth  = canvas.clientWidth;
	  	var displayHeight = canvas.clientHeight;
	 
	  	// Check if the canvas is not the same size.
	  	if (canvas.width  != displayWidth ||
	    	canvas.height != displayHeight) {
	 
	    // Make the canvas the same size
	    canvas.width  = displayWidth;
	    canvas.height = displayHeight;

	}
}