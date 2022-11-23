# threejs-basic

## 搭建项目
使用parcel

[官网v1](https://www.parceljs.cn/)
[官网v2](https://v2.parceljs.cn/blog/alpha1/)
```bash
npm init -y
# pnpm add parcel-bundler --save-dev
pnpm add parcel --save-dev
pnpm add three gsap dat.gui
```

```js
{
  "scripts": {
    "dev": "parcel <your entry file>",
    "build": "parcel build <your entry file>"
  }
}
```