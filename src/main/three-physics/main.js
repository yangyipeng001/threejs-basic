// ! 物理引擎
// ! 目标：立方体相互碰撞后旋转效果，给物体施加作用力
import * as THREE from 'three'
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'
// 导入cannon引擎
import * as CANNON from 'cannon-es'
// console.log('CANNON', CANNON)

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
    300
)
// 设置相机的位置（x, y, z）
camera.position.set(0, 0, 18)
// 把相机添加到场景当中
scene.add(camera)

const cubeArr = []
// 设置物体材质
const cubeWorldMaterial = new CANNON.Material('cube')
// 创建击打声音
const hitSound = new Audio('assets/metalHit.mp3')
function createCube() {
    // 创建cube和平面
    const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshStandardMaterial()
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true
    scene.add(cube)

    // 创建物理世界的cube形状
    const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
    // 创建物理世界的物体
    const cubeBody = new CANNON.Body({
        // 形状
        shape: cubeShape,
        // 位置
        position: new CANNON.Vec3(0, 0, 0),
        // 小球质量
        mass: 1,
        // 物体材质
        material: cubeWorldMaterial,
    })
    // 对物体施加作用力
    cubeBody.applyLocalForce(
        // 添加作用力的大小和方向
        new CANNON.Vec3(300, 0, 0),
        // 力作用的位置
        new CANNON.Vec3(0, 0, 0)
    )
    // 将物体添加至物理世界
    world.addBody(cubeBody)

    // 添加监听碰撞事件
    function HitEvent(e) {
        // console.log('HitEvent', e)

        // 获取碰撞的强度
        const impactStrength = e.contact.getImpactVelocityAlongNormal()
        // console.log(impactStrength)

        if (impactStrength > 2) {
            // 重新从零开始播放
            hitSound.currentTime = 0
            hitSound.volume = impactStrength / 12 * 0.05
            hitSound.play()
        }
    }
    cubeBody.addEventListener('collide', HitEvent)

    cubeArr.push({
        mesh: cube,
        body: cubeBody,
    })
}

// 点击创建
window.addEventListener('click', createCube)


const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial()
)
floor.position.set(0, -5, 0)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// 创建物理世界
// const world = new CANNON.World({
//     // 重力
//     gravity: 9.8
// })
const world = new CANNON.World()
world.gravity.set(0, -9.8, 0)


// 物理世界创建地面
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
const floorMaterial = new CANNON.Material('floor')
floorBody.material = floorMaterial
// 当质量为0的时候，可以使得物体保持不动
floorBody.mass = 0
floorBody.addShape(floorShape)
// 地面位置
floorBody.position.set(0, -5, 0)
// 旋转地面的位置
floorBody.quaternion.setFromAxisAngle(
    // 旋转的轴
    new CANNON.Vec3(1, 0, 0),
    // 旋转角度
    -Math.PI / 2
)
world.addBody(floorBody)

// 设置2种材质碰撞的参数
const defaultContactMaterial = new CANNON.ContactMaterial(
    // 第一种材质
    cubeWorldMaterial,
    // 第二种材质
    floorMaterial,
    {
        // 摩擦系数
        friction: 0.1,
        // 弹性系数
        restitution: 0.7,
    }
)
// 将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial)
// 设置物理世界碰撞的默认材料， 如果材料没有设置，都用这个
world.defaultContactMaterial = defaultContactMaterial

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
// 添加平行光
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
dirLight.castShadow = true
scene.add(dirLight)


//* 3. 初始化渲染器
const renderer = new THREE.WebGLRenderer({
    // 渲染器透明
    alpha: true,
})
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true
// 是否使用物理上正确的光照模式
// renderer.physicallyCorrectLights = true
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


// window.addEventListener('dblclick', () => {
//     // 双击控制屏幕进入全屏，退出全屏
//     const fullscreenElement = document.fullscreenElement
//     if (!fullscreenElement) {
//         // 让画布对象全屏
//         renderer.domElement.requestFullscreen()
//     }
//     else {
//         // 退出全屏，使用document对象
//         document.exitFullscreen()
//     }
// })


// 渲染函数
function render() {
    // const time = clock.getElapsedTime()
    const deltaTime = clock.getDelta()

    // 更新物理引擎世界里的物体
    // 官网解释：及时推进物理世界
    world.step(1 / 120, deltaTime)
    // 物理世界里的小球关联到渲染引擎中
    // cube.position.copy(cubeBody.position)
    cubeArr.forEach((item) => {
        item.mesh.position.copy(item.body.position)
        // 设置渲染的物体跟随物理的物体旋转
        item.mesh.quaternion.copy(item.body.quaternion)
    })

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

