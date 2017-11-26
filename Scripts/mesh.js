//The mesh holds a material and a meshbase containing bufferobjects
function Mesh(typeOfMesh, shader)
{
	this.meshbase = new MeshBase();
	this.meshbase.CreateBlock(typeOfMesh);

	this.material = new Material();
}