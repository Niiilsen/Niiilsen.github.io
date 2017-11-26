function GameObject(mesh, pos = [0,0,0], rot = [0,0,0], scale = [1,1,1])
{
	this.mesh = mesh;
	this.transform = new Transform();
	this.transform.SetPosition(pos[0], pos[1], pos[2]);
	this.transform.SetRotation(rot[0], rot[1], rot[2]);
	this.transform.SetScale(scale[0], scale[1], scale[2]);

	//Quick fix for particles
	this.yVelocity = Math.random() * 0.05;
}

GameObject.prototype.Render = function (positionAttributeLocation, normalAttributeLocation, tangentAttributeLocation, texCoordAttributeLocation)
{
	this.mesh.meshbase.Render(positionAttributeLocation, 
		normalAttributeLocation,
		tangentAttributeLocation, 
		texCoordAttributeLocation
		);
}