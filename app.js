// Loading shaders before program starts
var InitDemo = function () {
	loadTextResource('./shader.vs.glsl', function (vsErr, vsText) {
		if (vsErr) {
			alert('Fatal error getting vertex shader (see console)');
			console.error(vsErr);
		} else {
			loadTextResource('./shader.fs.glsl', function (fsErr, fsText) {
				if (fsErr) {
					alert('Fatal error getting fragment shader (see console)');
					console.error(fsErr);
				} else {
					RunDemo(vsText, fsText);
				}
			});
		}
	});
};

//This program contains only blocks as meshes
//This object holds the meshBase, a transform and a material
function Block(typeOfBlock, pos = [0,0,0], rot = [0,0,0], scale = [1,1,1])
{
	this.meshbase = new MeshBase();
	this.meshbase.CreateBlock(typeOfBlock);

	this.transform = new Transform();
	this.transform.SetPosition(pos[0], pos[1], pos[2]);
	this.transform.SetRotation(rot[0], rot[1], rot[2]);
	this.transform.SetScale(scale[0], scale[1], scale[2]);

	this.material = new Material();

	//Quick fix for particles
	this.yVelocity = Math.random() * 0.05;
}

//Adds a block to the gameobject-list
function AddToRenderObjectList(object)
{
	renderObjects.push(object);
}

//HTML5 canvas
var canvas;

//Render var
var gl;
var renderObjects = [];
var particles = [];
var lights = [];
var worldAmbient = vec3(0.0,0.0,0.1);
var fogDist = [25, 29];

//Interaction var
var lastMouseX = 0;
var lastMouseY = 0;
var mouseDown = false;

var RunDemo = function(vertexShaderText, fragmentShaderText)
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

	//Create shaders
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	//Compile the vertexshader and check for errors
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	
	//Compile the vertexshader and check for errors
	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	//Create and link the program
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	// Tell OpenGL state machine which program should be active
	gl.useProgram(program);

	//Find and enable attributes
	var positionAttributeLocation = gl.getAttribLocation(program, 'vertexPosition');
	var normalAttributeLocation = gl.getAttribLocation(program, 'vertexNormal');
	var tangentAttributeLocation = gl.getAttribLocation(program, 'vertexTangent');
	var texCoordAttributeLocation = gl.getAttribLocation(program, 'vertexTexCoord');

	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.enableVertexAttribArray(normalAttributeLocation);
	gl.enableVertexAttribArray(tangentAttributeLocation);
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
	var normalMapLocation = gl.getUniformLocation(program, 'normalMap');
	/* 		SHADER PROGRAM INITIALIZATION END 		*/

	/* 		TEXTURE CREATION START  	*/
	images = [];
	images.push(document.getElementById('cubeAtlas'));

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
	gl.uniform1i(normalMapLocation, 1);

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
	canvas.onmousedown = function(ev){
		mouseDown = true;
		lastMouseX = ev.x;
		lastMouseY = ev.y;
	}
	canvas.onmousemove = function(ev){
		if(!mouseDown)
			return;
		deltaX = ev.x - lastMouseX;
		deltaY = ev.y - lastMouseY;

		camera.AdjustAngle(deltaX, deltaY);
		camera.UpdatePosition();

		lastMouseX = ev.x;
		lastMouseY = ev.y;
	};
	canvas.onmouseup = function(ev){mouseDown = false;}

	//Zoom on mousewheel scroll
	window.onmousewheel = function(ev){
		camera.AdjustDistance(ev.wheelDelta/250);
		camera.UpdatePosition();
	}
	/*		INTERACTION	END	*/
	
	/*		SCENE CREATION START 	*/
	var size = 5;
	var flatLimit = 2;
	for(z = -size; z <= size; z++)
	{
		for(x = -size; x <= size; x++)
		{
			var y = 0;
			//The flat ground around the tree
			if((Math.abs(z) == flatLimit && Math.abs(x) <= flatLimit) || (Math.abs(x) == flatLimit && Math.abs(z) <= flatLimit))
			{
				if(Math.abs(z) == flatLimit && Math.abs(x) == flatLimit)
					y = -1;
				else
					y = 0;	
				var block = new Block(grassBlock, [x*2,y,z*2]);
				renderObjects.push(block);		
			}
			//The hills around the tree
			else if((Math.abs(z) > flatLimit || Math.abs(x) > flatLimit) && (Math.abs(x) > flatLimit || Math.abs(z) > flatLimit))
			{
				y = (Math.abs(z) - 2) * -1;
				y += (Math.abs(x) - 2) * -1;

				//The toplayer of grassblocks
				var block = new Block(grassBlock, [x*2,y,z*2]);
				renderObjects.push(block);

				//Dirtblocks underneath the grassblocks
				for(w = (y%2) * -1 - 10; w < y; w+= 2)
				{
					var block = new Block(dirtBlock, [x*2,w,z*2]);
					renderObjects.push(block);		
				}
			}
			else
			{
				//Shiny iceblocks around the tree
				var block = new Block(iceBlock, [x*2,y+0.5,z*2]);
				block.blendMode = true;
				block.material.shinyness = 400.0;
				renderObjects.push(block);		
			}
		}
	}

	

	//Tree Construction
	//Trunk
	var block = new Block(woodBlock, [0, 2, 0]);
	renderObjects.push(block);
	block = new Block(woodBlock, [0, 4, 0]);
	renderObjects.push(block);

	//Leaves 
	for(z = -1; z <= 1; z++)
	{
		for(x = -1; x <= 1; x++)
		{
			var block = new Block(bushBlock, [x*2,6,z*2]);
			block.material.shinyness = 600;
			renderObjects.push(block);		
		}
	}	
	block = new Block(bushBlock, [0, 8, 0]);
	renderObjects.push(block);

	//Gifts
	var gift = new Block(giftRedBlock, [2, 2, 2], [0, 60, 0], [0.5, 0.5, 0.5]);
	renderObjects.push(gift);

	gift = new Block(giftBlueBlock, [0, 1.9, 1.7], [45, -10, 0], [1.5, 0.4, 0.6]);
	renderObjects.push(gift);

	gift = new Block(giftRedBlock, [2, 1.9, 0.8], [0, 100, 0], [0.35, 0.3, 0.6]);
	renderObjects.push(gift);

	gift = new Block(giftYellowBlock, [2, 2.2, -0.5], [0, 90, -15], [1.5, 0.2, 0.6]);
	renderObjects.push(gift);

	gift = new Block(giftYellowBlock, [-0.5, 1.9, 2.7], [0, -10, 0], [0.3, 0.3, 0.3]);
	renderObjects.push(gift);

	var gift = new Block(giftRedBlock, [-2, 2, -2], [0, -60, 0], [0.5, 0.5, 0.5]);
	renderObjects.push(gift);

	gift = new Block(giftBlueBlock, [0, 1.9, -1.7], [-45, 10, 0], [1.5, 0.4, 0.6]);
	renderObjects.push(gift);

	gift = new Block(giftRedBlock, [-2, 1.9, -0.8], [0, -100, 0], [0.35, 0.3, 0.6]);
	renderObjects.push(gift);

	gift = new Block(giftYellowBlock, [-2, 2.2, 0.5], [0, -90, -15], [1.5, 0.2, 0.6]);
	renderObjects.push(gift);

	gift = new Block(giftYellowBlock, [0.5, 1.9, -2.7], [0, 10, 0], [0.3, 0.3, 0.3]);
	renderObjects.push(gift);

	for(i = 0; i < 200; i++)
	{
		var x = Math.floor(Math.random() * 30 -15);
		var y = Math.floor(Math.random() * 10);
		var z = Math.floor(Math.random() * 30 -15);

		var scale = Math.random() * 0.025 + 0.020;
		
		var particle = new Block(snowBlock, [x,y,z], [0,0,0], [scale,scale,scale])
		particles.push(particle);
	}

	/* 		SCENE CREATION END 		*/

	
	/* 		MAIN RENDER LOOP 	*/
	var angle = 0;
	var loop = function()
	{
		// Fit the canvas to the whole browser window
		resize(gl.canvas);
		gl.viewport(0,0,gl.canvas.width, gl.canvas.height);

		//Set view and projection matrices
		gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, flatten(camera.GetViewMatrix()));
		gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, flatten(camera.GetProjectionMatrix()));

		//Lighting
		gl.uniform3f(ambientUniformLocation, worldAmbient[0], worldAmbient[1], worldAmbient[2]);
		SetLightUniforms(0, lightPosUniformLocation, lightColorUniformLocation, lightRangeUniformLication, lightIntUniformLocation);
		SetLightUniforms(1, light02PosUniformLocation, light02ColorUniformLocation, light02RangeUniformLication, light02IntUniformLocation);

		//CameraPos uniform update in case of movement in camera pos
		gl.uniform3f(camPosUniformLocation, camera.transform.pos[0], camera.transform.pos[1], camera.transform.pos[2]);

		//Clear the screen
		gl.clearColor(worldAmbient[0], worldAmbient[1], worldAmbient[2], 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		//Bind texture atlas
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures[0]);

		for(i = 0; i < renderObjects.length; i++)
		{
			RenderObject(renderObjects[i]);
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
		gl.uniform1f(shinynessUniformLocation, obj.material.shinyness);
		gl.uniform3f(ambientUniformLocation, obj.material.ambient[0], obj.material.ambient[1], obj.material.ambient[2]);
		
		//Render the gameobject mesh
		obj.meshbase.Render(positionAttributeLocation, normalAttributeLocation , tangentAttributeLocation,texCoordAttributeLocation);	
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