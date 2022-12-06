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

const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    // 将几何体渲染为线框
    wireframe: true,
})
const redMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000'
})

// 创建1000个立方体
let cubeArr = []
for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
        for (let z = -5; z < 5; z++) {
            const cube = new THREE.Mesh(cubeGeometry, material)
            cube.position.set(i, j, z)
            scene.add(cube)
            cubeArr.push(cube)
        }
    }
}

// 创建投射光线对象
const raycaster = new THREE.Raycaster();
// 鼠标的位置对象
const mouse = new THREE.Vector2()

// 监听鼠标的位置
// window.addEventListener('mousemove', (event) => {
//     // console.log(event)
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1
//     mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
//     raycaster.setFromCamera(mouse, camera)
//     const result = raycaster.intersectObjects(cubeArr)
//     // console.log(result)
//     // result[0].object.material = redMaterial
//     result.forEach(item => {
//         item.object.material = redMaterial
//     })
// })
window.addEventListener('click', (event) => {
    // console.log(event)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
    raycaster.setFromCamera(mouse, camera)
    const result = raycaster.intersectObjects(cubeArr)
    // console.log(result)
    // result[0].object.material = redMaterial
    result.forEach(item => {
        item.object.material = redMaterial
    })
})


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