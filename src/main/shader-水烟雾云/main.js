// ! 目标：使用官方提供的水模型

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

// 导入water
import {Water} from 'three/examples/jsm/objects/Water2'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'


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
camera.position.set(5, 5, 5);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// const water = new Water(
//   new THREE.PlaneBufferGeometry(1, 1, 1024, 1024),
//   {
//     color: '#ffffff',
//     // 水纹大小
//     scale: 1,
//     // 水纹方向
//     flowDirection: new THREE.Vector2(1, 1),
//     // 纹理宽高
//     textureWidth: 1024,
//     textureHeight: 1024,
//   }
// )
// water.rotation.x = -Math.PI / 2
// scene.add(water)


// 加载场景背景
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('./assets/050.hdr').then((texture) => {
  // 设置为经纬球纹理
  texture.mapping = THREE.EquirectangularRefractionMapping
  // 场景背景
  scene.background = texture
  // 场景环境
  scene.environment = texture
})

// 加载浴缸
const gltfLoader = new GLTFLoader()
gltfLoader.load('./assets/model/yugang.glb', (gltf) => {
  console.log('----',gltf.scene.children)
  const yugang = gltf.scene.children[0]
  yugang.material.side = THREE.DoubleSide

  const waterGeometry = gltf.scene.children[1].geometry
  const water = new Water(
    waterGeometry,
    {
      color: '#ffffff',
      // 水纹大小
      scale: 1,
      // 水纹方向
      flowDirection: new THREE.Vector2(1, 1),
      // 纹理宽高
      textureWidth: 1024,
      textureHeight: 1024,
    }
  )
  scene.add(water)
  scene.add(yugang)
})

// 灯光 - 直线光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
scene.add(directionalLight)


// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
// renderer.shadowMap.type = THREE.VSMShadowMap;
// 渲染器的输出编码
// renderer.outputEncoding = THREE.sRGBEncoding
// 色调映射
// 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// 线性级别
// renderer.toneMapping = THREE.LinearToneMapping
// renderer.toneMapping = THREE.ReinhardToneMapping
// renderer.toneMapping = THREE.CineonToneMapping

// 色调映射的曝光级别。默认是1
// renderer.toneMappingExposure = 0.2


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

const clock = new THREE.Clock();
function animate(t) {
  const elapsedTime = clock.getElapsedTime();

  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();
