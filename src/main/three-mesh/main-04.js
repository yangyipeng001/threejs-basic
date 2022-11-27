// ! 目标：纹理常用属性
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
const texture = textureLoader.load('./textures/minecraft.png')
// 设置纹理偏移
// doorColorTexture.offset.x = 0.5
// doorColorTexture.offset.y = 0.5
// doorColorTexture.offset.set(0.5, 0.5)
// 纹理旋转
// 设置旋转的原点(默认(0, 0)，左下角)
// doorColorTexture.center.set(0.5, 0.5)
// 旋转45deg
// doorColorTexture.rotation = Math.PI / 4
// 设置纹理的重复
// doorColorTexture.repeat.set(2, 3)
// 设置纹理重复的模式
// x轴方向
// doorColorTexture.wrapS = THREE.RepeatWrapping
// y轴方向 (THREE.MirroredRepeatWrapping -> 镜像重复)
// doorColorTexture.wrapT = THREE.MirroredRepeatWrapping

// 添加物体
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
// 材质
const basicMaterial = new THREE.MeshBasicMaterial({
    color: '#ffff00',

    // 颜色贴图
    // map: doorColorTexture,
    map: texture,
})
const cube = new THREE.Mesh(cubeGeometry, basicMaterial)
scene.add(cube)


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