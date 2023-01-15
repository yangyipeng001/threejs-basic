// ! 目标：shader 粒子效果
import * as THREE from 'three'
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gasp from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'
// 加载RGBELoader 加载器
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {Color} from 'three'
import fragmentShader from '../../shader/basic-points/fragmentShader.glsl'
import vertexShader from '../../shader/basic-points/vertexShader.glsl'

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
camera.position.set(0, 0, 5)
// 把相机添加到场景当中
scene.add(camera)


// 创建点
// const geometry = new THREE.BufferGeometry()
// const positions = new Float32Array([0, 0, 0])
// geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// 点材质
// const material = new THREE.PointsMaterial({
//     color: 0xff0000,
//     // 大小
//     size: 10,
//     // 近大远小
//     sizeAttenuation: true,
// })

// 导入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/particles/10.png')
const texture1 = textureLoader.load('textures/particles/9.png')
const texture2 = textureLoader.load('textures/particles/11.png')

// 点着色起材质
// const material = new THREE.ShaderMaterial({
//     vertexShader: vertexShader,
//     fragmentShader: fragmentShader,
//     // 透明度
//     transparent: true,

//     uniforms: {
//         uTexture: {
//             value: texture
//         }
//     },
// })

// // 生成点
// const points = new THREE.Points(geometry, material)
// scene.add(points)

let geometry = null
let points = null
let material

// 设置星系参数
const params = {
    count: 1000,
    size: 0.1,
    radius: 5,
    branches: 4,
    spin: 0.5,
    color: '#ff6030',
    outColor: '#1b3984',
}

// GalaxyColor
let galaxyColor = new THREE.Color(params.color)
let outGalaxyColor = new THREE.Color(params.outColor)

const generateGalaxy = () => {
    // 如果已经存在这些顶点，那么先释放内存，再删除顶点数据
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    // 生成顶点几何
    geometry = new THREE.BufferGeometry()
    // 随机生成位置
    const positions = new Float32Array(params.count * 3)
    const colors = new Float32Array(params.count * 3)
    const scales = new Float32Array(params.count)

    // 图案索引
    const imgIndex = new Float32Array(params.count)

    // 循环生成点
    for (let i = 0; i < params.count; i++) {
        const current = i * 3;

        // 计算分支的角度 = (计算当前的点在第几个分支) * (2 * Math.PI / 多少个分支)
        const branchAngle = (i % params.branches) * ((2 * Math.PI) / params.branches)
        const radius = Math.random() * params.radius

        // 随机设置想x/y/z偏移值
        const randomX = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3
        const randomY = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3
        const randomZ = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3

        // 设置当前点x值坐标
        positions[current] = Math.cos(branchAngle) * radius + randomX
        // 设置当前点y值坐标
        positions[current + 1] = randomY
        // 设置当前点z值坐标
        positions[current + 2] = Math.sin(branchAngle) * radius + randomZ

        const mixColor = galaxyColor.clone()
        mixColor.lerp(outGalaxyColor, radius / params.radius)

        // 设置颜色
        colors[current] = mixColor.r
        colors[current + 1] = mixColor.g
        colors[current + 2] = mixColor.b

        // 顶点大小
        scales[current] = Math.random()

        // 根据索引值设置不同的图案
        imgIndex[current] = i % 3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('imgIndex', new THREE.BufferAttribute(imgIndex, 1))

    // 设置点的着色器材质
    material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
            uTime: {
                value: 0
            },
            uTexture: {
                value: texture
            },
            uTexture1: {
                value: texture1
            },
            uTexture2: {
                value: texture2
            },
        }
    })

    // 生成点
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