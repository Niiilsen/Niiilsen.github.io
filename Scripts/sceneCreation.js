function CreateScene()
{
	/*		SCENE CREATION START 	*/
	var size = 5;
	var flatLimit = 2;
	var randomRot = 0;
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
				var block = new GameObject(new Mesh(grassBlock), [x*2,y,z*2]);
				gameObjects.push(block);		
			}
			//The hills around the tree
			else if((Math.abs(z) > flatLimit || Math.abs(x) > flatLimit) && (Math.abs(x) > flatLimit || Math.abs(z) > flatLimit))
			{
				y = (Math.abs(z) - 2) * -1;
				y += (Math.abs(x) - 2) * -1;

				//The toplayer of grassblocks
				var block = new GameObject(new Mesh(grassBlock), [x*2,y,z*2]);
				gameObjects.push(block);
			}
			else
			{
				//Shiny iceblocks around the tree
				var block = new GameObject(new Mesh(iceBlock), [x*2,y+0.5,z*2]);
				block.blendMode = true;
				block.mesh.material.shinyness = 400.0;
				gameObjects.push(block);		
			}
		}
	}

	//Tree Construction
	//Trunk
	var block = new GameObject(new Mesh(woodBlock), [0, 2, 0]);
	gameObjects.push(block);
	block = new GameObject(new Mesh(woodBlock), [0, 4, 0]);
	gameObjects.push(block);

	//Leaves 
	for(z = -1; z <= 1; z++)
	{
		for(x = -1; x <= 1; x++)
		{
			var block = new GameObject(new Mesh(bushBlock), [x*2,6,z*2]);
			block.mesh.material.shinyness = 600;
			gameObjects.push(block);		
		}
	}	
	block = new GameObject(new Mesh(bushBlock), [0, 8, 0]);
	gameObjects.push(block);

	//Gifts
	var gift = new GameObject(new Mesh(giftRedBlock), [2, 2, 2], [0, 60, 0], [0.5, 0.5, 0.5]);
	gameObjects.push(gift);

	gift = new GameObject(new Mesh(giftBlueBlock), [0, 1.9, 1.7], [45, -10, 0], [1.5, 0.4, 0.6]);
	gameObjects.push(gift);

	gift = new GameObject(new Mesh(giftRedBlock), [2, 1.9, 0.8], [0, 100, 0], [0.35, 0.3, 0.6]);
	gameObjects.push(gift);

	gift = new GameObject(new Mesh(giftYellowBlock), [2, 2.2, -0.5], [0, 90, -15], [1.5, 0.2, 0.6]);
	gameObjects.push(gift);

	gift = new GameObject(new Mesh(giftYellowBlock), [-0.5, 1.9, 2.7], [0, -10, 0], [0.3, 0.3, 0.3]);
	gameObjects.push(gift);

	var gift = new GameObject(new Mesh(giftRedBlock), [-2, 2, -2], [0, -60, 0], [0.5, 0.5, 0.5]);
	gameObjects.push(gift);

	gift = new GameObject(new Mesh(giftBlueBlock), [0, 1.9, -1.7], [-45, 10, 0], [1.5, 0.4, 0.6]);
	gameObjects.push(gift);

	gift = new GameObject(new Mesh(giftRedBlock), [-2, 1.9, -0.8], [0, -100, 0], [0.35, 0.3, 0.6]);
	gameObjects.push(gift);

	gift = new GameObject(new Mesh(giftYellowBlock), [-2, 2.2, 0.5], [0, -90, -15], [1.5, 0.2, 0.6]);
	gameObjects.push(gift);

	gift = new GameObject(new Mesh(giftYellowBlock), [0.5, 1.9, -2.7], [0, 10, 0], [0.3, 0.3, 0.3]);
	gameObjects.push(gift);

	for(i = 0; i < 200; i++)
	{
		var x = Math.floor(Math.random() * 30 -15);
		var y = Math.floor(Math.random() * 10);
		var z = Math.floor(Math.random() * 30 -15);

		var scale = Math.random() * 0.025 + 0.020;
		
		var particle = new GameObject(new Mesh(snowBlock), [x,y,z], [0,0,0], [scale,scale,scale])
		particles.push(particle);
	}

	/* 		SCENE CREATION END 		*/

}