precision mediump float;
	 
	struct Light
	{
		vec3 position;
		vec3 color;
		float intensity;
		float range;
	};

	varying vec2 fragTexCoord;
	varying vec3 fragNormal;
	varying vec4 fragPos;
	varying vec3 v_eyeDir;
	varying mat3 TBN;

	uniform Light light01;
	uniform Light light02;
	uniform vec3 ambientLightIntensity;
	uniform float shinyness;
	uniform sampler2D mainTex;
	uniform sampler2D specularTex;
	uniform sampler2D normalMap;
	uniform vec3 eye;
	uniform vec3 fogColor;
	uniform vec2 fogDist;
	
	void main()
	{
		Light light[2];
		light[0] = light01;
		light[1] = light02;

		//COMMON
		float vertDistFromCamera = length(eye-fragPos.xyz);
		vec3 eyeDir = normalize(-v_eyeDir);

		//Start diffuse and specular
		vec3 Idiffuse = vec3(0.0,0.0,0.0);
		vec3 Ispecular = vec3(0.0,0.0,0.0);

		//Light calculations per light
		for(int i = 0; i < 2; i++)
		{

			//Distances and directions for light calculation
			float vertDistFromLight = length(light[i].position - fragPos.xyz);
			vec3 vertexToLightDir = light[i].position - fragPos.xyz;

			//Get normal from normalMap and transform it into tangent space
			vec3 normal = normalize(texture2D(normalMap, fragTexCoord).xyz) * 2.0 - 1.0;
			normal = normalize(TBN * normal);

			//The intensity of the light
			float lightIntensity = max(dot(fragNormal, normalize(vertexToLightDir)), 0.0) * 3.0;

			//Light fade off multiplier
			float lightMultiplier = clamp(1.0 - (vertDistFromLight/light[i].range), 0.0, 1.0);

			//Sparkle specular
			vec3 halfVector = normalize(normalize(vertexToLightDir) + eyeDir);
			vec3 reflectVec = normalize(-reflect(vertexToLightDir, normal));
			float specular = pow(max(dot(reflectVec, eyeDir), 0.0), shinyness);
			float specularTexel = texture2D(specularTex, fragTexCoord).x * 5.0;
			specular *= specularTexel;

			//Adding the calculations to the final output variables
			Idiffuse += light[i].color * (lightIntensity * lightMultiplier);
			Ispecular += vec3(1.0,1.0,1.0) * specular * lightMultiplier;
		}
		
		//Adding it all together
		vec3 Iambient = ambientLightIntensity;
		vec3 finalColor = Idiffuse + Iambient + Ispecular;
		vec4 texel = texture2D(mainTex, fragTexCoord);

		//FOG
		float fogFactor = clamp((fogDist.y - vertDistFromCamera) / (fogDist.y - fogDist.x), 0.0, 1.0);
		finalColor = mix(fogColor, texel.rgb * finalColor, fogFactor);

		gl_FragColor = vec4(finalColor, 1.0);
	}