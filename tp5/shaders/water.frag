#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	vec4 map = texture2D(uSampler2, vTextureCoord);

	
	float b = 1.0 / (map.b + 0.7);
	if ( b > 1.0)
		b = 1.0;
	color.rgb = color.rgb * b;
	gl_FragColor = color;
}