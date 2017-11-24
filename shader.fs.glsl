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

		vec3 Idiffuse = vec3(0.0,0.0,0.0);
		vec3 Ispecular = vec3(0.0,0.0,0.0);

		for(int i = 0; i < 2; i++)
		{

		float vertDistFromLight = length(light[i].position - fragPos.xyz);
		vec3 vertexToLightDir = light[i].position - fragPos.xyz;

		
		

		vec3 halfVector = normalize(normalize(vertexToLightDir) + eyeDir);

		float lightIntensityMultiplier = max(length(light[i].position - fragPos.xyz), 1.0);

		float lightIntensity = max(dot(fragNormal, vertexToLightDir), 0.0);
		float lightMultiplier = clamp(1.0 - (vertDistFromLight/light[i].range), 0.0, 1.0);

		vec3 reflectVec = normalize(-reflect(vertexToLightDir, fragNormal));
		float specular = pow(max(dot(reflectVec, eyeDir), 0.0), shinyness);




		
		Idiffuse += light[i].color * (lightIntensity * lightMultiplier);
		Ispecular += light[i].color * specular;
		}
		

		vec3 Iambient = ambientLightIntensity;
		
		vec3 finalColor = Idiffuse + Iambient + Ispecular;

		vec4 texel = texture2D(mainTex, fragTexCoord);

		//FOG
		float fogFactor = clamp((fogDist.y - vertDistFromCamera) / (fogDist.y - fogDist.x), 0.0, 1.0);
		finalColor = mix(fogColor, texel.rgb * finalColor, fogFactor);

		gl_FragColor = vec4(finalColor, 1.0);
	}