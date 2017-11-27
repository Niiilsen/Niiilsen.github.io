/*
Welcome to the Block Factory!
Here you can get all the vertices, indices, normals, tangents and texturecoords
for your cube! We have a lot of different textured blocks in our storage that you can choose from as you please.
The only thing you have to do is to provide us with the block type when asking for
texturecoordinates, and we'll modify your block so that it uses the UV-coordinates that goes
along with that block type!

Happy creating from all us here at the Block Factory!
*/


//A texture atlas (8x8) is used to texture the blocks
//we have to specify some base atlas variables 
var numberOfRows = 8;
var gridSpace = 1.0/numberOfRows;

// Cube sides = [left, right, front, back, top, bottom]
var grassBlock = [40,40,40,40,18,48];
var dirtBlock = [48,48,48,48,48,48];
var pumpkinBlock = [21,21,19,21,20,20];
var snowBlock = [63, 63, 63, 63, 63, 63];
var woodBlock = [49,49,49,49,50,50];
var brickBlock = [47,47,47,47,47,47];
var woodenPlanksBlock = [46,46,46,46,46,46];
var bushBlock = [24,24,24,24,18,24];
var lightBlock = [63, 63, 63, 63, 63, 63];
var sandCrackBlock = [8,8,8,8,8,8];
var crystalBlock = [39,39,39,39,39,39];
var redstoneBlock = [42, 42, 42, 42, 42, 42];
var stoneBlock = [60,60,60,60,60,60];
var iceBlock = [33,33,33,33,33,33];
var giftRedBlock = [10,10,10,10,10,10];
var giftYellowBlock = [11,11,11,11,11,11];
var giftBlueBlock = [12,12,12,12,12,12];

//Converts a index in the atlas to a useful x-offset
function GetXOffsetFromIndex(index)
{
	var multiplier = (index % numberOfRows);
	return 1.0/numberOfRows * multiplier;
}

//Converts a index in the atlas to a useful y-offset
function GetYOffsetFromIndex(index)
{
	var multiplier = Math.floor(index/numberOfRows);
	return 1.0/numberOfRows * multiplier;
}

//Create a different looking block by altering the texture-coordinates
//Left, right etc are atlas-indices. 
function CreateBoxTexCoords(blockType)
{
	var left = blockType[0];
	var right = blockType[1];
	var front = blockType[2];
	var back = blockType[3];
	var top = blockType[4];
	var bot = blockType[5];

	var boxTexCoords = 
	[
		//Top
		0/numberOfRows + GetXOffsetFromIndex(top),0/numberOfRows + GetYOffsetFromIndex(top),
		0/numberOfRows + GetXOffsetFromIndex(top),1/numberOfRows + GetYOffsetFromIndex(top),
		1/numberOfRows + GetXOffsetFromIndex(top),1/numberOfRows + GetYOffsetFromIndex(top),
		1/numberOfRows + GetXOffsetFromIndex(top),0/numberOfRows + GetYOffsetFromIndex(top),

		//Left
		0/numberOfRows + GetXOffsetFromIndex(left),0/numberOfRows + GetYOffsetFromIndex(left),
		0/numberOfRows + GetXOffsetFromIndex(left),1/numberOfRows + GetYOffsetFromIndex(left),
		1/numberOfRows + GetXOffsetFromIndex(left),1/numberOfRows + GetYOffsetFromIndex(left),
		1/numberOfRows + GetXOffsetFromIndex(left),0/numberOfRows + GetYOffsetFromIndex(left),

		//Right
		1/numberOfRows + GetXOffsetFromIndex(right),0/numberOfRows + GetYOffsetFromIndex(right),
		1/numberOfRows + GetXOffsetFromIndex(right),1/numberOfRows + GetYOffsetFromIndex(right),
		0/numberOfRows + GetXOffsetFromIndex(right),1/numberOfRows + GetYOffsetFromIndex(right),
		0/numberOfRows + GetXOffsetFromIndex(right),0/numberOfRows + GetYOffsetFromIndex(right),
		
		//Front
		1/numberOfRows + GetXOffsetFromIndex(front),0/numberOfRows + GetYOffsetFromIndex(front),
		1/numberOfRows + GetXOffsetFromIndex(front),1/numberOfRows + GetYOffsetFromIndex(front),
		0/numberOfRows + GetXOffsetFromIndex(front),1/numberOfRows + GetYOffsetFromIndex(front),
		0/numberOfRows + GetXOffsetFromIndex(front),0/numberOfRows + GetYOffsetFromIndex(front),
		
		//Back
		0/numberOfRows + GetXOffsetFromIndex(back),0/numberOfRows + GetYOffsetFromIndex(back),
		0/numberOfRows + GetXOffsetFromIndex(back),1/numberOfRows + GetYOffsetFromIndex(back),
		1/numberOfRows + GetXOffsetFromIndex(back),1/numberOfRows + GetYOffsetFromIndex(back),
		1/numberOfRows + GetXOffsetFromIndex(back),0/numberOfRows + GetYOffsetFromIndex(back),
		
		//Bot
		1/numberOfRows + GetXOffsetFromIndex(bot),1/numberOfRows + GetYOffsetFromIndex(bot),
		1/numberOfRows + GetXOffsetFromIndex(bot),0/numberOfRows + GetYOffsetFromIndex(bot),
		0/numberOfRows + GetXOffsetFromIndex(bot),0/numberOfRows + GetYOffsetFromIndex(bot),
		0/numberOfRows + GetXOffsetFromIndex(bot),1/numberOfRows + GetYOffsetFromIndex(bot)

	];

	return boxTexCoords;

}

function CreateBoxVertices()
{

	var boxVertices = 
	[	//X,Y,Z 				
		//Top
		-1.0, 1.0, -1.0,		
		-1.0, 1.0, 1.0,			
		1.0, 1.0, 1.0,			
		1.0, 1.0, -1.0,			

		//Left
		-1.0, 1.0, 1.0,			
		-1.0, -1.0, 1.0,		
		-1.0, -1.0, -1.0,		
		-1.0, 1.0, -1.0,		

		//Right
		1.0, 1.0, 1.0,			
		1.0, -1.0, 1.0,			
		1.0, -1.0, -1.0,		
		1.0, 1.0, -1.0,			

		//Back
		1.0, 1.0, 1.0,			
		1.0, -1.0, 1.0,			
		-1.0, -1.0, 1.0,		
		-1.0, 1.0, 1.0,			

		//Front
		1.0, 1.0, -1.0,			
		1.0, -1.0, -1.0,		
		-1.0, -1.0, -1.0,		
		-1.0, 1.0, -1.0,		

		//Bottom
		-1.0, -1.0, -1.0,		
		-1.0, -1.0, 1.0,	
		1.0, -1.0, 1.0,			
		1.0, -1.0, -1.0		
	];
	return boxVertices;
}

function CreateBoxIndices()
{
	var boxIndices = 
	[
		//Top
		0,1,2,
		0,2,3,

		//Left
		5,4,6, 
		6,4,7,

		//Right
		8,9,10,
		8,10,11,

		//Front
		13,12,14,
		15,14,12,

		//Back
		16,17,18,
		16,18,19,

		//Bottom
		21,20,22,
		22,20,23
	];
	return boxIndices;
}

function CreateBoxNormals()
{
	var boxNormals = [
	//Top
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,

	//Left
	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,

	//Right
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,

	//Back
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,

	//Front
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,

	//Bottom
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0
	];
	return boxNormals;
}


function CreateBoxTangents()
{
	var boxTangents = [
	//Top
	1.0, 0.0, -1.0,
	1.0, 0.0, -1.0,
	1.0, 0.0, -1.0,
	1.0, 0.0, -1.0,

	//Left
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,

	//Right
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,

	//Back
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,

	//Front
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,

	//Bottom
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0
	];
	return boxTangents;
}



