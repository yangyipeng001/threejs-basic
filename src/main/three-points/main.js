// ! 目标：运用数学知识打造复杂粒子
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
camera.position.set(0, 0, 10)
// 把相机添加到场景当中
scene.add(camera)

// 参数
const params = {
    // 数量
    count: 10000,
    // 大小
    size: 0.1,
    // 半径
    radius: 5,
    // 分支
    branch: 3,
    // 颜色
    color: '#ff6030',
    // 渲染系数
    rotateScale: 0.3,
    // 末端颜色
    endColor: '#1b3984',
}
// 载入纹理
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('./textures/particles/1.png')

let geometry = null
let material = null
let points = null
const centerColor = new THREE.Color(params.color)
const endColor = new THREE.Color(params.endColor)
const generateGalaxy = () => {
    // 生成顶点
    geometry = new THREE.BufferGeometry()
    // 随机生成位置
    const positions = new Float32Array(params.count * 3)
    // 设置顶点颜色
    const colors = new Float32Array(params.count * 3)

    // 循环生成点
    for (let i = 0; i < params.count; i++) {
        // 当前的点应该在哪一条分支的角度上
        const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch)
        // 当前点距离圆心的距离
        const distance = Math.random() * params.radius * Math.pow(Math.random(), 3)
        const current = i * 3
        // 当前位置的随机值
        const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
        const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
        const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5

        // x轴
        positions[current] = distance * Math.cos(branchAngel + distance * params.rotateScale) + randomX
        // y轴
        positions[current + 1] = 0 + randomY
        // z轴
        positions[current + 2] = distance * Math.sin(branchAngel + distance * params.rotateScale) + randomZ

        // 混合颜色，形成渐变色
        const mixColor = centerColor.clone()
        mixColor.lerp(endColor, distance / params.radius)
        colors[current] = mixColor.r
        colors[current + 1] = mixColor.g
        colors[current + 2] = mixColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))


    // 设置点材质
    material = new THREE.PointsMaterial({
        // 设置颜色
        // color: new THREE.Color(params.color),
        // 设置点的大小
        size: params.size,
        // 指定点的大小是否因相机深度而衰减
        sizeAttenuation: true,
        // 渲染此材质是否对深度缓冲区有任何影响。默认为true
        depthWrite: false,
        // 在使用此材质显示对象时要使用何种混合
        blending: THREE.AdditiveBlending,
        // 设置点材质纹理
        map: particlesTexture,
        // alpha贴图是一张灰度纹理，用于控制整个表面的不透明度
        // （黑色：完全透明；白色：完全不透明）
        alphaMap: particlesTexture,
        // 允许透明
        transparent: true,
        // 是否使用顶点着色
        vertexColors: true,
    })

    points = new THREE.Points(geometry, material)
    scene.add(points)
}
generateGalaxy()


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