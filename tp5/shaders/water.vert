attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;
uniform float timeFactor;

void main() {

	vTextureCoord = aTextureCoord + vec2(1, 2) * (0.01 * timeFactor);

	vec4 map = texture2D(uSampler2, vTextureCoord);
	
	vec3 offset = aVertexNormal*map.b*0.08;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}

