// ! 目标：控制3d物体移动
import * as THREE from 'three'
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

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

// 将几何体添加到场景中
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
// 创建坐标轴，红色代表X轴、绿色代表Y轴、蓝色代表Z轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)


// 渲染函数
function render() {
    cube.position.x += 0.01
    if (cube.position.x > 5) {
        cube.position.x = 0
    }

    renderer.render(scene, camera)
    // 渲染下一帧的时候就会调用render函数
    requestAnimationFrame(render)
}
render()