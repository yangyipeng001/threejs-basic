// ! 目标：认识rawShaderMaterial 与 attribute_uniform_varying变量
import * as THREE from 'three'
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gasp from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'
// 加载RGBELoader 加载器
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'

// 顶点着色器
import rawVertexShader from '../../shader/raw/vertex.glsl'
// 片元着色器
import rawFragmentShader from '../../shader/raw/fragment.glsl'

// 灯光与阴影
// 1、材质要满足能够对光照有反应
// 2、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true
// 3、设置光照投射阴影 directionalLight.castShadow = true
// 4、设置物体投射阴影 sphere.castShadow = true
// 5、设置物体接收阴影 plane.receiveShadow = true

const gui = new dat.GUI()

//* 1. 创建场景
const scene = new THREE.Scene()

//* 2. 创建相机 PerspectiveCamera: 透视相机
// 视锥体：https://localhost:8080/examples/#webgl_camera
/**
 * PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
 * fov — 摄像机视锥体垂直视野角度
 * aspect — 摄像机视锥体长宽比
 * near — 摄像机视锥体近端面
 * far — 摄像机视锥体远端面
 */
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    // 1000
    30
)
// 设置相机的位置（x, y, z）
camera.position.set(0, 0, 10)
// 把相机添加到场景当中
scene.add(camera)


// const material = new THREE.MeshBasicMaterial({color: '#00ff00'})
// 创建原始着色器材质
const rawShaderMaterial = new THREE.RawShaderMaterial({
    // 顶点着色器：顶点坐标
    vertexShader: rawVertexShader,

    // 片元着色器: 像素颜色
    fragmentShader: rawFragmentShader,
})

// 创建平面
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 64, 64),
    rawShaderMaterial
)
scene.add(floor)


//* 3. 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true
// 是否使用物理上正确的光照模式
renderer.physicallyCorrectLights = true
// 将webgl渲染的canvas内容添加到body
document.body.append(renderer.domElement)

//* 4. 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera)


// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼，让控制器更有真实效果，必须在动画循环里调用.update()。
controls.enableDamping = true

// 创建坐标轴，红色代表X轴、绿色代表Y轴、蓝色代表Z轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 设置时钟
const clock = new THREE.Clock()

// 渲染函数
function render() {
    const time = clock.getElapsedTime()

    controls.update()
    renderer.render(scene, camera)
    // 渲染下一帧的时候就会调用render函数
    requestAnimationFrame(render)
}
render()

// 监听画面变化，更新渲染画面
window.addEventListener('resize', () => {
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像头的投影矩阵
    camera.updateProjectionMatrix()
    // 更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio)
})