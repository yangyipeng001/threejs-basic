// 精度（一般放到程序最前面）
/**
    highp -2^16 - 2^16
    mediump -2^10 - 2^10
    lowp -2^8 - 2^8
*/
precision lowp float;

// 声明属性变量（自动回去threejs的material中attribute的属性）
attribute vec3 position;
attribute vec2 uv;

// 声明全局变量
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
// 获取时间
uniform float uTime;

// 传给片元着色器的声明变量
varying vec2 vUv;
varying float vElevation;

// 主函数
void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.x += 1.0;
    // modelPosition.z += 1.0;

    // modelPosition.z += modelPosition.x;

    modelPosition.z = sin((modelPosition.x + uTime )* 10.0) * 0.05;
    modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.05;
    vElevation = modelPosition.z;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}