# threejs-basic


## 资料
### 动画库（gsap）
- [文档](https://greensock.com/docs/)
- [文档指导例子](https://greensock.com/get-started/)

### ui界面控制库
- [dat.gui](https://www.npmjs.com/package/dat.gui)


## 搭建项目
使用parcel

- [官网v1](https://www.parceljs.cn/)
- [官网v2](https://v2.parceljs.cn/blog/alpha1/)
```bash
npm init -y
# pnpm add parcel-bundler --save-dev
pnpm add parcel --save-dev
# 动画库安装gsap
pnpm add three gsap dat.gui

# 着色器shader
# 目前是用parcelv1
pnpm add parcel-bundler glslify-bundle glslify-deps --save-dev
```

```js
{
  "scripts": {
    "dev": "parcel <your entry file>",
    "build": "parcel build <your entry file>"
  }
}
```


## 几何体属性
geometry
### BufferGeometry
```js
cubeGeometry： {
  attributes： {
    // 法相量
    normal,

    // 顶点位置
    position,

    // UV 坐标(二维平面展开图)
    uv
  }
}
```


## 材质
material


## 贴图资料网站
- [poliigon](https://www.poliigon.com/)
- [3dtextures](https://3dtextures.me/)
- [arroway-textures](https://www.arroway-textures.ch/)
- Quixel Bridge 软件
  - 得注册一个虚幻引擎的账号，登录账号后，所有贴图都是免费的。


## 点材质贴图网站
- [particle-pack](https://kenney.nl/assets/particle-pack)
- [iconfont](https://iconfont.cn)
- [aigei](https://www.aigei.com/)


## HDR详解
HDR技术是一种改善动态对比度的技术。 