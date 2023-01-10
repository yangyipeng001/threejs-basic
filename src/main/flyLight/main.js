import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import vertexShader from "../../shaders/flyLight/vertex.glsl";
import fragmentShader from "../../shaders/flyLight/fragment.glsl";
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

// 目标：实现孔明灯

// 创建gui对象
const gui = new dat.GUI();

// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 2);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);


// 加载纹理
// 创建环境纹理
const rgbeLoader = new RGBELoader()
// 因为图片有点大，所以异步加载
rgbeLoader.loadAsync('./assets/2k.hdr').then((texture) => {
    // 按照圆柱体映射
    texture.mapping = THREE.EquirectangularReflectionMapping

    scene.background = texture
    scene.environment = texture
})


// 创建着色器材质;
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {},
  side: THREE.DoubleSide,
//   transparent: true,
});


// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
// renderer.shadowMap.type = THREE.VSMShadowMap;
// 渲染器的输出编码
renderer.outputEncoding = THREE.sRGBEncoding
// 色调映射
// 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 线性级别
// renderer.toneMapping = THREE.LinearToneMapping
// renderer.toneMapping = THREE.ReinhardToneMapping
// renderer.toneMapping = THREE.CineonToneMapping

// 色调映射的曝光级别。默认是1
renderer.toneMappingExposure = 0.2


// 导入孔明灯
const gLTFLoader = new GLTFLoader()
let LightBox = null
gLTFLoader.load('./assets/model/flyLight.glb', (gltf) => {
    // console.log('====gltf', gltf)
    // scene.add(gltf.scene)
    LightBox = gltf.scene.children[1]
    LightBox.material = shaderMaterial

    // 随机生成多个
    for (let i = 0; i < 100; i++) {
        let flyLight = gltf.scene.clone(true)
        // -150 ~ 150
        let x = (Math.random() - 0.5) * 300
        let z = (Math.random() - 0.5) * 300
        // 25 ~ 85
        let y = Math.random() * 60 + 25

        flyLight.position.set(x, y, z)
        gsap.to(flyLight.rotation, {
            y: 2 * Math.PI,
            duration: 10 + Math.random() * 30,
            repeat: -1,
        })
        gsap.to(flyLight.position, {
            x: '+=' + Math.random() * 5,
            y: '+=' + Math.random() * 20,
            yoyo: true,
            repeat: -1,
            duration: 5 + Math.random() * 10,
        })
        scene.add(flyLight)
    }
})


// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 将渲染器添加到body
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
controls.autoRotate = true;
// 当.autoRotate为true时，围绕目标旋转的速度将有多快，默认值为2.0，相当于在60fps时每旋转一周需要30秒。
controls.autoRotateSpeed = 0.1;
// 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI
controls.maxPolarAngle = Math.PI / 4 * 3
// 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
controls.minPolarAngle = Math.PI / 4 * 3

const clock = new THREE.Clock();
function animate(t) {
  const elapsedTime = clock.getElapsedTime();

  controls.update()

  //   console.log(elapsedTime);
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();
