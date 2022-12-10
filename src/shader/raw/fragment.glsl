// 精度（一般放到程序最前面）
/**
    highp -2^16 - 2^16
    mediump -2^10 - 2^10
    lowp -2^8 - 2^8
*/
precision lowp float;

// 接收顶点着色器传的变量
varying vec2 vUv;
varying float vElevation;

// 全局
uniform sampler2D uTexture;

// 主函数
void main() {
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // (vElevation + 0.05) * 10 --> 0~1
    // float height = vElevation + 0.05 * 10.0;
    // gl_FragColor = vec4(height * 1.0, 0.0, 0.0, 1.0);

    // 根据 uv 取出对应的颜色
    float height = vElevation + 0.05 * 20.0;
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= height;
    gl_FragColor = textureColor;
}