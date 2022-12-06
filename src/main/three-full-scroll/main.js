// ! 目标：运用数学知识打造复杂粒子
import * as THREE from 'three'
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'
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
    300
)
// 设置相机的位置（x, y, z）
camera.position.set(0, 0, 18)
// 把相机添加到场景当中
scene.add(camera)

const cubeGeometry = new THREE.BoxBufferGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({
    // 将几何体渲染为线框
    wireframe: true,
})
const redMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000'
})


// 创建1000个立方体
let cubeArr = []
let cubeGroup = new THREE.Group()
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        for (let z = 0; z < 5; z++) {
            const cube = new THREE.Mesh(cubeGeometry, material)
            cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4)
            // scene.add(cube)
            cubeGroup.add(cube)
            cubeArr.push(cube)
        }
    }
}
scene.add(cubeGroup)


// 创建酷炫三角形
// 添加物体
// 创建几何体
var sjxGroup = new THREE.Group()
for (let i = 0; i < 50; i++) {
    const geometry = new THREE.BufferGeometry()
    // 因为是缓存区数据，所以得给默认值
    const positionArray = new Float32Array(9)

    // 每个三角形，需要3个点， 每个点需要3个值
    for (let j = 0; j < 9; j++) {
        // if (j % 3 === 1) {
        //     positionArray[j] = Math.random() * 10 - 35
        // }
        // else {
            // 0~5, -5~5
            positionArray[j] = Math.random() * 10 - 5
        // }
    }

    // new THREE.BufferAttribute(vertices, 3), 每三个值作为一组
    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
    // 添加材质
    let color = new THREE.Color(Math.random(), Math.random(), Math.random())
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    })
    // 根据几何体和材质创建物体
    let sjxMesh = new THREE.Mesh(geometry, material)
    // 把物体添加场景当中
    sjxGroup.add(sjxMesh)
}
sjxGroup.position.set(0, -30, 0)
scene.add(sjxGroup)


// 弹跳小球
const sphereGroup = new THREE.Group()
// 创建球体
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    // 金属度
    // metalness: 0.7,

    // 粗糙度
    // roughness: 0.1,

    // 环境贴图
    // envMap: envMapTexture,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
// 投射阴影
sphere.castShadow = true
sphereGroup.add(sphere)

// 创建平面
const planeGeometry = new THREE.PlaneBufferGeometry(50, 50)
const plane = new THREE.Mesh(planeGeometry, sphereMaterial)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
// 接收阴影
plane.receiveShadow = true
sphereGroup.add(plane)

// 灯光
/**
 * 环境光（AmbientLight 参数）
 * color - (参数可选）颜色的rgb数值。缺省值为 0xffffff
 * intensity - (参数可选)光照的强度。缺省值为 1。
 */
const light = new THREE.AmbientLight(0xffffff, 0.5)
sphereGroup.add(light)

// 创建一个小球，绑定点光源
const smallBall = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.1, 20, 20),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)
smallBall.position.set(2, 2, 2)

// 聚光源
const pointLight = new THREE.PointLight( 0xff0000, 3);
// pointLight.position.set(2, 2, 2)
// 聚光灯将投射阴影
pointLight.castShadow = true
// 设置阴影贴图模糊度
pointLight.shadow.radius = 20
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(2048, 2048)

// scene.add(pointLight);
smallBall.add(pointLight)
sphereGroup.add(smallBall);
sphereGroup.position.set(0, -60, 0)
scene.add(sphereGroup)


const arrGroup = [cubeGroup, sjxGroup, sphereGroup]


// 创建投射光线对象
const raycaster = new THREE.Raycaster();
// 鼠标的位置对象
const mouse = new THREE.Vector2()

// 监听鼠标的位置
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / window.innerWidth - 0.5
    mouse.y = event.clientY / window.innerHeight - 0.5
})

// 监听鼠标的位置
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
const renderer = new THREE.WebGLRenderer({
    // 渲染器透明
    alpha: true,
})
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
// const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼，让控制器更有真实效果，必须在动画循环里调用.update()。
// controls.enableDamping = true

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

gsap.to(cubeGroup.rotation, {
    x: '+=' + Math.PI,
    y: '+=' + Math.PI,
    duration: 5,
    ease: 'power2.inOut',
    repeat: -1,
})
gsap.to(sjxGroup.rotation, {
    x: '-=' + Math.PI,
    z: '+=' + Math.PI,
    duration: 6,
    ease: 'power2.inOut',
    repeat: -1,
})
gsap.to(smallBall.position, {
    x: -3,
    duration: 6,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
})
gsap.to(smallBall.position, {
    y: 0,
    duration: 0.5,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
})

// 渲染函数
function render() {
    // const time = clock.getElapsedTime()
    const deltaTime = clock.getDelta()

    // cubeGroup.rotation.x = time * 0.5
    // cubeGroup.rotation.y = time * 0.5

    // sjxGroup.rotation.x = time * 0.4
    // sjxGroup.rotation.z = time * 0.3

    // sphereGroup.rotation.x = Math.sin(time) * 0.05
    // sphereGroup.rotation.z = Math.sin(time) * 0.05
    // smallBall.position.x = Math.sin(time) * 3
    // smallBall.position.z = Math.cos(time) * 3
    // smallBall.position.y = 2 + Math.sin(time * 10) / 2

    // 根据当前滚动的scrollY,去设置相机移动的位置
    camera.position.y = -(window.scrollY / window.innerHeight) * 30
    camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 5

    // controls.update()
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

// 设置当前页数
let currentPage = 0
// 监听滚动事件
window.addEventListener('scroll', () => {
    // 当前页数
    const newPage = Math.round(window.scrollY / window.innerHeight)

    if (newPage !== currentPage) {
        currentPage = newPage
        console.log('改变页面，当前是：', currentPage)

        gsap.to(arrGroup[currentPage].rotation, {
            z: '+=' + Math.PI,
            x: '+=' + Math.PI,
            duration: 1,
            onComplete: () => {
                console.log('旋转完成')
            }
        })

        // gsap.to(`.page${currentPage} h1`, {
        //     rotate: '+=360',
        //     duration: 1,
        // })
        gsap.fromTo(`.page${currentPage} h1`, 
            {x: -300},
            {
                x: 0,
                rotate: '+=360',
                duration: 1,
            }
        )
    }
})