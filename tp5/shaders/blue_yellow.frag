#ifdef GL_ES
precision highp float;
#endif

varying vec4 vVertexPosition;

void main() {

	gl_FragColor.a = 1.0;

    if (vVertexPosition.y < 0.5){
        gl_FragColor.rgb = vec3(138.0, 138.0, 229.0) / 256.0;
    }
    else {
        gl_FragColor.rgb = vec3(229.0, 229.0, 0.0) / 256.0;
    }
}
