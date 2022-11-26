// ! 目标：dat.gui ui界面控制库的使用
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

// 添加物体
// 创建几何体
// BoxGeometry(长， 宽， 高)
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// 添加材质
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00})
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

// 修改物体位置
// cube.position.set(5, 0, 0)
// cube.position.x = 3
// 缩放
// cube.scale.set(3, 2, 1)
// cube.scale.x = 5
// 旋转 (x, y, z, order: string)
// cube.rotation.set(Math.PI / 4, 0, 0)

// 将几何体添加到场景中
scene.add(cube)

// 打印几何体属性
console.log('cubeGeometry: ', cubeGeometry)
console.log('cube: ', cube)

// 创建ui控制界面
const gui = new dat.GUI()
gui
    .add(cube.position, 'x')
    .min(0).max(5)
    .step(0.01)
    .name('移动x轴')
    .onChange((value) => {
        console.log('值被修改：', value)
    })
    .onFinishChange((value) => {
        console.log('完全停下来：', value)
    })
// 修改物体的颜色
const params = {
    color: '#ffff00',
    fn: () => {
        // 让立方体运动起来
        gasp.to(cube.position, {x: 5, duration: 2, yoyo: true, repeat: -1})
    }
}
gui
    .addColor(params, 'color')
    .onChange((value) => {
        // console.log('值修改为：', value)
        cube.material.color.set(value)
    })
// 设置选项框
gui
    .add(cube, 'visible')
    .name('是否显示')
// 设置按钮：点击触发某个事件
// gui
//     .add(params, 'fn')
//     .name('立方体运动')
// 设置文件夹
let folder = gui.addFolder('设置立方体')
folder.add(cube.material, 'wireframe')
folder
    .add(params, 'fn')
    .name('立方体运动')

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