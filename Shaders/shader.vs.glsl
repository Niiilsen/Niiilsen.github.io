precision mediump float;

attribute vec3 vertexPosition;
attribute vec2 vertexTexCoord;
attribute vec3 vertexNormal;
attribute vec3 vertexTangent;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec4 fragPos;
varying float fogFactor;
varying vec3 v_eyeDir;
varying mat3 TBN;

uniform vec3 eye;
uniform mat4 mModel;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
	vec3 wNorm = normalize((mModel * vec4(vertexNormal, 0.0)).xyz);
	vec3 wTang = normalize((mModel * vec4(vertexTangent, 0.0)).xyz);


	vec3 wBiTang = normalize(cross(wNorm, wTang));

	TBN = mat3(
		wTang.x, wBiTang.x, wNorm.x,
		wTang.y, wBiTang.y, wNorm.y,
		wTang.z, wBiTang.z, wNorm.z
	);

	fragTexCoord = vertexTexCoord;
	fragNormal = wNorm;
	fragPos = mModel * vec4(vertexPosition, 1.0);
	v_eyeDir = vertexPosition - eye;

	gl_Position = mProj * mView * mModel * vec4(vertexPosition, 1.0);
}