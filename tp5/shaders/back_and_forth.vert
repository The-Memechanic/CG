attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform float normScale;

varying vec4 vVertexPosition;

void main() {

    vec3 offset = vec3(normScale * sin(timeFactor), 0.0, 0.0);
    
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);

    vVertexPosition = gl_Position;

}