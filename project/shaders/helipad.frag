#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D textureH;
uniform sampler2D textureOther;

uniform float timeFactor;


void main() {
    vec4 hColor = texture2D(textureH, vTextureCoord);
    vec4 otherColor = texture2D(textureOther, vTextureCoord);
    
    float frequency = 8.0;

    float ratio = (sin(frequency * timeFactor) + 1.0) / 2.0;
    
    vec4 finalColor = mix(hColor, otherColor, ratio);

    finalColor.rgb *= 0.4; // this makes it so the textures don't blind you :thumbs_up:
    
    gl_FragColor = finalColor;
}