import * as THREE from 'three'
import startPointFragment from '../../shaders/startpoint/fragment.glsl'
import startPointVertex from '../../shaders/startpoint/vertex.glsl'
import fireworksFragment from '../../shaders/fireworks/fragment.glsl'
import fireworksVertex from '../../shaders/fireworks/vertex.glsl'

export default class Fireworks {
    constructor(color, to, from = {x: 0, y: 0, z: 0}) {
        // console.log('创建烟花：', color, to)

        // 创建烟花发射的球点
        this.startGeometry = new THREE.BufferGeometry()
        const startPossitionArray = new Float32Array(3)
        startPossitionArray[0] = from.x
        startPossitionArray[1] = from.y
        startPossitionArray[2] = from.z
        this.startGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(startPossitionArray, 3)
        )

        // 自定义一个属性
        const astepArray = new Float32Array(3)
        astepArray[0] = to.x - from.x;
        astepArray[1] = to.y - from.y;
        astepArray[2] = to.z - from.z;
        this.startGeometry.setAttribute(
            'aStep',
            new THREE.BufferAttribute(astepArray, 3)
        )

        // 设置着色器材质
        this.startMaterial = new THREE.ShaderMaterial({
            vertexShader: startPointVertex,
            fragmentShader: startPointFragment,

            // 是否允许透明
            transparent: true,
            // 在使用此材质显示对象时要使用何种混合
            blending: THREE.AdditiveBlending,
            // 渲染此材质是否对深度缓冲区有任何影响。默认为true
            depthWrite: false,

            uniforms: {
                uTime: {
                    value: 0,
                },
                uSize: {
                    value: 20
                }
            }
        })

        // 创建烟花点球
        this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial)

        // 开始计时
        this.clock = new THREE.Clock()

        // 创建爆炸的烟花
        this.fireworkGeometry = new THREE.BufferGeometry()
        this.FireworksCount = 180 + Math.floor(Math.random() * 180)
        const positionFireworksArray = new Float32Array(this.FireworksCount * 3)
        const scaleFireArray = new Float32Array(this.FireworksCount)
        // 方向
        const directionArray = new Float32Array(this.FireworksCount * 3)

        for (let i = 0; i < this.FireworksCount; i++) {
            // 一开始烟花的位置
            positionFireworksArray[i * 3 + 0] = to.x
            positionFireworksArray[i * 3 + 1] = to.y
            positionFireworksArray[i * 3 + 2] = to.z

            // 设置烟花所有粒子初始化大小
            scaleFireArray[i] = Math.random()
            // 设置四周发射的角度（相当于经纬度）
            let theta = Math.random() * 2 * Math.PI
            let beta = Math.random() * 2 * Math.PI
            let r = Math.random()

            directionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta)
            directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta)
            directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta)
        }

        this.fireworkGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positionFireworksArray, 3)
        )
        this.fireworkGeometry.setAttribute(
            'aScale',
            new THREE.BufferAttribute(scaleFireArray, 1)
        )
        this.fireworkGeometry.setAttribute(
            'aRandom',
            new THREE.BufferAttribute(directionArray, 3)
        )

        this.fireworksMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {
                    value: 0,
                },
                uSize: {
                    value: 0
                }
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexShader: fireworksVertex,
            fragmentShader: fireworksFragment,
        })

        this.fireworks = new THREE.Points(
            this.fireworkGeometry,
            this.fireworksMaterial
        )
    }

    // 添加到场景中
    addScene(scene, camera) {
        scene.add(this.startPoint)
        scene.add(this.fireworks)
        this.scene = scene
    }

    // update变量
    update() {
        const elapsedTime = this.clock.getElapsedTime()
        // console.log(elapsedTime)

        if (elapsedTime < 1) {
            this.startMaterial.uniforms.uTime.value = elapsedTime
            this.startMaterial.uniforms.uSize.value = 20.0
        }
        else {
            const time = elapsedTime - 1

            // 让元素消失
            this.startMaterial.uniforms.uSize.value = 0;
            // 从内存中清除
            this.startPoint.clear()
            // 清除几何体
            this.startGeometry.dispose()
            // 清除材质
            this.startMaterial.dispose()

            // 设置烟花显示
            this.fireworksMaterial.uniforms.uSize.value = 20
            this.fireworksMaterial.uniforms.uTime.value = time

            // 消失处理
            if (time > 5) {
                // 从内存中清除
                this.fireworks.clear()
                // 清除几何体
                this.fireworkGeometry.dispose()
                // 清除材质
                this.fireworksMaterial.dispose()
            }
        }
    }
}