# Taro 微信小程序开发指南

## 一、Taro 框架简介

Taro 是由京东开源的多端统一开发框架，支持使用 React/Vue/Nerv 等框架来开发微信/京东/百度/支付宝/字节跳动/QQ 小程序/H5/React Native 等应用。

### 核心优势
- **多端统一**：一套代码可编译到多个平台
- **现代框架支持**：支持 React/Vue/Vue3 等主流框架
- **TypeScript 支持**：内置 TypeScript 支持，提供更好的类型安全
- **丰富的组件库**：提供跨平台的 UI 组件
- **活跃的社区**：持续维护，社区活跃

## 二、环境准备

### 1. 安装 Node.js
- 要求 Node.js 版本 ≥12.0.0
- 推荐使用 nvm 管理 Node 版本

### 2. 安装微信开发者工具
- 下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
- 用于预览和调试小程序

### 3. 安装 Taro CLI
```bash
# 使用 npm 安装
npm install -g @tarojs/cli

# 或使用 yarn 安装
yarn global add @tarojs/cli

# 验证安装
taro info
```

## 三、创建项目

### 1. 初始化项目
```bash
# 创建项目
taro init myApp

# 进入项目目录
cd myApp

# 安装依赖
npm install
# 或
yarn
```

初始化时需要选择：
- 框架类型（React/Vue/Vue3）
- 是否使用 TypeScript
- CSS 预处理器（Sass/Less/Stylus）
- 项目模板

### 2. 项目结构
```
myApp/
├── dist/                    # 编译结果目录
├── config/                  # 项目配置
│   ├── index.js            # 默认配置
│   ├── dev.js              # 开发环境配置
│   └── prod.js             # 生产环境配置
├── src/                    # 源代码目录
│   ├── pages/              # 页面文件
│   │   └── index/          
│   │       ├── index.js    # 页面逻辑
│   │       ├── index.scss  # 页面样式
│   │       └── index.config.js  # 页面配置
│   ├── components/         # 公共组件
│   ├── app.js             # 应用入口
│   ├── app.scss           # 全局样式
│   └── app.config.js      # 全局配置
├── project.config.json     # 小程序项目配置
└── package.json           # 项目依赖
```

## 四、开发基础

### 1. 全局配置（app.config.js）
```javascript
export default {
  pages: [
    'pages/index/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '我的小程序',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#ff6c00',
    backgroundColor: '#fafafa',
    list: [{
      pagePath: 'pages/index/index',
      text: '首页',
      iconPath: 'assets/tab-bar/home.png',
      selectedIconPath: 'assets/tab-bar/home-active.png'
    }, {
      pagePath: 'pages/user/index',
      text: '我的',
      iconPath: 'assets/tab-bar/user.png',
      selectedIconPath: 'assets/tab-bar/user-active.png'
    }]
  }
}
```

### 2. 页面开发（React 示例）
```javascript
// src/pages/index/index.js
import React, { useState, useEffect } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Index() {
  const [userInfo, setUserInfo] = useState(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 页面加载时的逻辑
    console.log('页面加载')
  }, [])

  const handleGetUserInfo = async () => {
    try {
      const res = await Taro.getUserProfile({
        desc: '获取用户信息'
      })
      setUserInfo(res.userInfo)
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  }

  const handleNavigate = () => {
    Taro.navigateTo({
      url: '/pages/user/index'
    })
  }

  return (
    <View className='index'>
      <View className='header'>
        <Text className='title'>欢迎使用 Taro</Text>
      </View>
      
      {userInfo ? (
        <View className='user-info'>
          <Image className='avatar' src={userInfo.avatarUrl} />
          <Text className='name'>{userInfo.nickName}</Text>
        </View>
      ) : (
        <Button onClick={handleGetUserInfo}>获取用户信息</Button>
      )}
      
      <View className='counter'>
        <Text>计数器：{count}</Text>
        <Button onClick={() => setCount(count + 1)}>+1</Button>
      </View>
      
      <Button onClick={handleNavigate}>跳转到个人中心</Button>
    </View>
  )
}
```

### 3. 页面配置
```javascript
// src/pages/index/index.config.js
export default {
  navigationBarTitleText: '首页',
  enablePullDownRefresh: true
}
```

### 4. 样式编写
```scss
// src/pages/index/index.scss
.index {
  padding: 40px;
  
  .header {
    text-align: center;
    margin-bottom: 40px;
    
    .title {
      font-size: 36px;
      font-weight: bold;
      color: #333;
    }
  }
  
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-right: 20px;
    }
    
    .name {
      font-size: 28px;
      color: #666;
    }
  }
  
  .counter {
    margin-bottom: 40px;
    text-align: center;
  }
  
  button {
    margin-top: 20px;
  }
}
```

## 五、常用 API

### 1. 路由跳转
```javascript
// 保留当前页面，跳转到应用内的某个页面
Taro.navigateTo({
  url: '/pages/detail/index?id=1'
})

// 关闭当前页面，跳转到应用内的某个页面
Taro.redirectTo({
  url: '/pages/detail/index'
})

// 跳转到 tabBar 页面
Taro.switchTab({
  url: '/pages/index/index'
})

// 返回上一页
Taro.navigateBack()
```

### 2. 数据缓存
```javascript
// 设置缓存
Taro.setStorageSync('userInfo', { name: '张三', age: 20 })

// 获取缓存
const userInfo = Taro.getStorageSync('userInfo')

// 移除缓存
Taro.removeStorageSync('userInfo')

// 清空缓存
Taro.clearStorageSync()
```

### 3. 网络请求
```javascript
Taro.request({
  url: 'https://api.example.com/user',
  method: 'GET',
  data: {
    id: 1
  },
  header: {
    'content-type': 'application/json'
  },
  success: function (res) {
    console.log(res.data)
  },
  fail: function (error) {
    console.error('请求失败', error)
  }
})

// 使用 async/await
const fetchUserData = async () => {
  try {
    const res = await Taro.request({
      url: 'https://api.example.com/user',
      method: 'GET'
    })
    return res.data
  } catch (error) {
    console.error('请求失败', error)
  }
}
```

### 4. 交互反馈
```javascript
// 显示 loading
Taro.showLoading({
  title: '加载中...'
})

// 隐藏 loading
Taro.hideLoading()

// 显示提示
Taro.showToast({
  title: '操作成功',
  icon: 'success',
  duration: 2000
})

// 显示模态框
Taro.showModal({
  title: '提示',
  content: '确定要删除吗？',
  success: function (res) {
    if (res.confirm) {
      console.log('用户点击确定')
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }
})
```

## 六、开发调试

### 1. 启动开发服务
```bash
# 开发模式（支持热更新）
npm run dev:weapp
# 或
yarn dev:weapp
```

### 2. 微信开发者工具设置
1. 打开微信开发者工具
2. 选择小程序项目
3. 项目目录选择 `dist` 文件夹
4. **重要设置**：
   - 关闭 ES6 转 ES5
   - 关闭上传代码时样式自动补全
   - 关闭代码压缩上传

### 3. 真机调试
1. 在微信开发者工具中点击"预览"
2. 使用手机扫描二维码
3. 在手机上进行调试

## 七、构建发布

### 1. 生产构建
```bash
# 构建生产版本
npm run build:weapp
# 或
yarn build:weapp
```

### 2. 上传代码
1. 在微信开发者工具中点击"上传"
2. 填写版本号和项目备注
3. 在小程序管理后台提交审核

## 八、最佳实践

### 1. 组件化开发
创建可复用的组件：
```javascript
// src/components/Card/index.js
import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default function Card({ title, children }) {
  return (
    <View className='card'>
      <View className='card-header'>
        <Text className='card-title'>{title}</Text>
      </View>
      <View className='card-body'>
        {children}
      </View>
    </View>
  )
}
```

### 2. 状态管理
对于复杂应用，推荐使用状态管理库：
- Redux
- MobX
- Zustand

### 3. 性能优化
- 避免频繁的 setData 操作
- 使用虚拟列表处理长列表
- 图片懒加载
- 分包加载

### 4. 异常处理
```javascript
// app.js
import Taro from '@tarojs/taro'

class App extends Component {
  componentDidCatchError(error) {
    console.error('全局错误捕获:', error)
    // 上报错误
  }
  
  // ...
}
```

## 九、常见问题

### 1. 编译报错
- 检查 Node.js 版本是否满足要求
- 删除 node_modules 重新安装依赖
- 清理缓存：`rm -rf dist`

### 2. 样式问题
- Taro 默认使用 750px 设计稿
- 使用 Taro.pxTransform 进行单位转换
- 避免使用 position: fixed

### 3. 第三方库兼容性
- 部分 npm 包可能不支持小程序环境
- 可以使用小程序专用的替代库
- 必要时进行条件编译

## 十、相关资源

- [Taro 官方文档](https://docs.taro.zone/)
- [Taro UI 组件库](https://taro-ui.jd.com/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Taro 物料市场](https://taro-ext.jd.com/)
- [GitHub 仓库](https://github.com/NervJS/taro)

## 总结

Taro 提供了一套完整的跨端开发解决方案，让开发者可以使用熟悉的 React/Vue 语法开发小程序。通过本指南，你应该已经掌握了使用 Taro 开发微信小程序的基础知识。建议通过实际项目练习来深入理解和掌握 Taro 的各项特性。