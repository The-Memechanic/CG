#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float timeFactor;
uniform float randomValue;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;

    float wavingSpeed = 8.0 * randomValue;
    float offsetAmplitude = 0.1 * randomValue;

    float offsetX = sin(aVertexPosition.y * 5.0 + timeFactor * wavingSpeed) * offsetAmplitude;
    float offsetZ = cos(aVertexPosition.y * 5.0 + timeFactor * wavingSpeed) * offsetAmplitude;

    float offsetY = sin(aVertexPosition.x + aVertexPosition.z + timeFactor * wavingSpeed) * offsetAmplitude;

    float heightFactor = pow(smoothstep(0.0, 1.0, aVertexPosition.y), 0.7);
    offsetX *= heightFactor;
    offsetY *= heightFactor;
    offsetZ *= heightFactor;

    vec3 displacedPosition = vec3(
        aVertexPosition.x + offsetX,
        aVertexPosition.y + offsetY,
        aVertexPosition.z + offsetZ
    );

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
}