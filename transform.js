var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

//Transform component for all objects that needs to have a position in 3D space
function Transform ()
{
	this.pos = vec3(0,0,0);
	this.rot = vec3(0,0,0);
	this.scale = vec3(1,1,1);
}

Transform.prototype.GetModelMatrix = function()
{
	var modelMatrix = mat4();
	modelMatrix = mult(modelMatrix, translate(this.pos[xAxis], this.pos[yAxis], this.pos[zAxis]));
	modelMatrix = mult(modelMatrix, rotate([0,this.rot[yAxis],0][yAxis], [0,1,0])); //Rotation Y
	modelMatrix = mult(modelMatrix, rotate([this.rot[xAxis],0,0][xAxis], [1,0,0]));
	modelMatrix = mult(modelMatrix, rotate([0,0,this.rot[zAxis]][zAxis], [0,0,1]));
	modelMatrix = mult(modelMatrix, scalem(this.scale[xAxis], this.scale[yAxis], this.scale[zAxis]));
	return modelMatrix;
}

Transform.prototype.Rotate = function(x,y,z)
{
	this.rot[xAxis] += x;
	this.rot[yAxis] += y;
	this.rot[zAxis] += z;
}

Transform.prototype.SetRotation = function(x,y,z)
{
	this.rot[xAxis] = x;
	this.rot[yAxis] = y;
	this.rot[zAxis] = z;
}

Transform.prototype.Translate = function(x,y,z)
{
	this.pos[xAxis] += x;
	this.pos[yAxis] += y;
	this.pos[zAxis] += z;
}

Transform.prototype.SetPosition = function(x,y,z)
{
	this.pos[xAxis] = x;
	this.pos[yAxis] = y;
	this.pos[zAxis] = z;
}

Transform.prototype.Scale = function(x,y,z)
{
	this.scale[xAxis] += x;
	this.scale[yAxis] += y;
	this.scale[zAxis] += z;	
}

Transform.prototype.SetScale = function(x,y,z)
{
	this.scale[xAxis] = x;
	this.scale[yAxis] = y;
	this.scale[zAxis] = z;	
}