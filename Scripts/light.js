//Light object that holds a transform, and some light variables
function Light()
{
	this.transform = new Transform();
	this.intensity = 3;
	this.color = vec4(1.0,1.0,1.0,1.0);
	this.range = 17;
}

// Setting the color of the light
Light.prototype.SetColor = function(x,y,z,a = 1)
{
	this.color[0] = x;
	this.color[1] = y;
	this.color[2] = z;
	this.color[3] = a;
}