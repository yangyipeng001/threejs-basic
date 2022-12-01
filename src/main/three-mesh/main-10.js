// ! 目标：标准网络材质（MeshStandardMaterial）- 粗糙度、金属度、法线贴图
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

// 导入纹理
// 纹理加载器
const textureLoader = new THREE.TextureLoader()
// 因为本地启动的服务是运行在dist文件夹下的index.html,所以把资料放到dist文件夹下
const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAoTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
// 导入置换贴图
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
// 导入粗糙度贴图
const roughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
// 导入金属贴图
const metalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
// 导入法线贴图
const normalTexture = textureLoader.load('./textures/door/normal.jpg')


// 添加物体
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100)
// 材质
const material = new THREE.MeshStandardMaterial({
    color: '#ffff00',
    // 颜色贴图
    map: doorColorTexture,

    // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。
    alphaMap: doorAlphaTexture,
    // 材质是否透明
    transparent: true,

    // 环境遮挡贴图
    aoMap: doorAoTexture,
    // 环境遮挡效果的强度
    aoMapIntensity: 0.5,

    // 置换贴图（位移贴图会影响网格顶点的位置）
    displacementMap: doorHeightTexture,
    // 位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）
    displacementScale: 0.1,
    // 材质的粗糙程度
    roughness: 1,
    // 该纹理的绿色通道用于改变材质的粗糙度
    roughnessMap: roughnessTexture,
    // 材质与金属的相似度
    metalness: 1,
    // 该纹理的蓝色通道用于改变材质的金属度
    metalnessMap: metalnessTexture,
    // 用于创建法线贴图的纹理
    normalMap: normalTexture,

    // 透明度
    // opacity: 0.3,
    // 渲染哪一面，默认前面
    // side: THREE.DoubleSide,
})
material.side = THREE.DoubleSide
const cube = new THREE.Mesh(
    cubeGeometry,
    material
)
scene.add(cube)
// 给cube设置第二组uv
cubeGeometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
)

// 添加平面
const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 200, 200)
const plane = new THREE.Mesh(
    planeGeometry,
    material
)
plane.position.set(1.5, 0, 0)
scene.add(plane)
// 给平面设置第二组uv
planeGeometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
)


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