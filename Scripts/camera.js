//Camera object that has a transform for positioning
//and other camera related variables to calculate view and projection matrix
function Camera()
{
	this.transform = new Transform();
	this.transform.SetPosition(0,10,0);
	this.distance = 20;
	this.angle = Math.PI/-3;
	this.angleStepSize = 0.0075;
	this.fov = 60;
	this.nearPlane = 0.1;
	this.farPlane = 1000.0;
	this.UpdatePosition();
}

Camera.prototype.GetViewMatrix = function()
{
	var viewMatrix = mat4();
	viewMatrix = lookAt([this.transform.pos[0],this.transform.pos[1],this.transform.pos[2]], [0,0,0],[0,1,0]);
	return viewMatrix;
}

Camera.prototype.GetProjectionMatrix = function()
{
	var projMatrix = mat4();
	projMatrix = perspective(this.fov, gl.canvas.width/gl.canvas.height, this.nearPlane, this.farPlane);
	return projMatrix;
}

//Controls how far the camera will be from the lookAt position
Camera.prototype.AdjustDistance = function(amount)
{
	this.distance -= amount;
	this.distance = Math.max(5, this.distance);
	this.distance = Math.min(35, this.distance);
}

//Rotation of the camera
Camera.prototype.AdjustAngle = function(deltaX, deltaY)
{
	this.angle += deltaX * this.angleStepSize;
	this.transform.pos[1] += deltaY * this.angleStepSize * 10;
	this.transform.pos[1] = Math.min(20, this.transform.pos[1]);
	this.transform.pos[1] = Math.max(5, this.transform.pos[1]);
}

//Update camera position
Camera.prototype.UpdatePosition = function ()
{
	this.transform.SetPosition(this.distance * Math.cos(this.angle), this.transform.pos[1], this.distance * Math.sin(this.angle));
}