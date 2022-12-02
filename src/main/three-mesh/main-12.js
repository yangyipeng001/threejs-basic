// ! 目标：环境贴图
import * as THREE from 'three'
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gasp from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'

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
    1000
)
// 设置相机的位置（x, y, z）
camera.position.set(0, 0, 10)
// 把相机添加到场景当中
scene.add(camera)

// 设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([
    'textures/environmentMaps/1/px.jpg',
    'textures/environmentMaps/1/nx.jpg',
    'textures/environmentMaps/1/py.jpg',
    'textures/environmentMaps/1/ny.jpg',
    'textures/environmentMaps/1/pz.jpg',
    'textures/environmentMaps/1/nz.jpg',
])

// 创建球体
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
    // 金属度
    metalness: 0.7,

    // 粗糙度
    roughness: 0.1,

    // 环境贴图
    envMap: envMapTexture,
})
const sphere = new THREE.Mesh(sphereGeometry, material)
scene.add(sphere)

// 灯光
/**
 * 环境光（AmbientLight 参数）
 * color - (参数可选）颜色的rgb数值。缺省值为 0xffffff
 * intensity - (参数可选)光照的强度。缺省值为 1。
 */
const light = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(light)
// 直线光源
// 平行光（DirectionalLight）
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(10, 10, 10)
scene.add( directionalLight );


//* 3. 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
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


window.addEventListener('dblclick', () => {
    // 双击控制屏幕进入全屏，退出全屏
    const fullscreenElement = document.fullscreenElement
    if (!fullscreenElement) {
        // 让画布对象全屏
        renderer.domElement.requestFullscreen()
    }
    else {
        // 退出全屏，使用document对象
        document.exitFullscreen()
    }
})

// 渲染函数
function render() {
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