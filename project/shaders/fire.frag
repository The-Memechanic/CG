#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);

    color.a *= 0.7;

    color.rgb *= 0.9;

    gl_FragColor = color;
}
