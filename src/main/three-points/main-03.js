// ! 目标：设置漫天雪花
import * as THREE from 'three'
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gasp from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'
// 加载RGBELoader 加载器
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'

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
camera.position.set(0, 0, 40)
// 把相机添加到场景当中
scene.add(camera)


// 封装创建点的函数
function createPoints(
    url,
    size = 0.5,
) {
    // 创建随机的点
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 10000
    // 设置缓冲区数组
    const positions = new Float32Array(count * 3)
    // 设置粒子顶点颜色
    const colors = new Float32Array(count * 3)
    // 设置顶点
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100
        colors[i] = Math.random()
    }
    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )
    particlesGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    // 创建points材质
    const pointsMaterial = new THREE.PointsMaterial()
    // 设置点材质
    // 设置点的大小
    pointsMaterial.size = size
    // 设置颜色
    pointsMaterial.color.set(0xfff000)
    // 指定点的大小是否因相机深度而衰减
    pointsMaterial.sizeAttenuation = true

    // 载入纹理
    const textureLoader = new THREE.TextureLoader()
    // const texture = textureLoader.load('./textures/particles/1.png')
    const texture = textureLoader.load(`./textures/particles/${url}.png`)
    // 设置点材质纹理
    pointsMaterial.map = texture
    // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度
    // （黑色：完全透明；白色：完全不透明）
    pointsMaterial.alphaMap = texture
    // 允许透明
    pointsMaterial.transparent = true
    // 渲染此材质是否对深度缓冲区有任何影响。默认为true
    pointsMaterial.depthWrite = false
    // 在使用此材质显示对象时要使用何种混合
    pointsMaterial.blending = THREE.AdditiveBlending
    // 是否使用顶点着色
    pointsMaterial.vertexColors = true

    const points = new THREE.Points(particlesGeometry, pointsMaterial)
    scene.add(points)

    return points
}

const points = createPoints('1', 1.5)
const points2 = createPoints('xh', 1)
const points3 = createPoints('xh', 2)


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
    const time = clock.getElapsedTime()
    points.rotation.x = time * 0.3
    points2.rotation.x = time * 0.5
    points2.rotation.y = time * 0.4
    points3.rotation.x = time * 0.2
    points3.rotation.y = time * 0.2

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