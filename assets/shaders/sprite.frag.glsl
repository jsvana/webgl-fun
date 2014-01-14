precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uTexRowHeight;
uniform float uFrame;

void main(void) {
	gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t + uFrame * uTexRowHeight));
}
