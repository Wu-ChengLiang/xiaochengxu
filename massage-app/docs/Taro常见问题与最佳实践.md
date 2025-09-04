# Taro 常见问题与最佳实践

## 一、环境配置相关

### 1. Taro CLI 版本管理
**问题**：项目依赖的 Taro 版本与全局 CLI 版本不一致

**解决方案**：
```bash
# 查看当前版本
taro info

# 更新 CLI 到指定版本
taro update self 3.6.0

# 更新项目依赖到最新版本
taro update project

# 使用项目本地的 CLI（推荐）
npx @tarojs/cli init myapp
```

### 2. Node.js 版本问题
**问题**：Node.js 版本过低导致编译失败

**解决方案**：
```bash
# 使用 nvm 管理 Node 版本
nvm install 16
nvm use 16

# 或使用 n
n 16.0.0
```

### 3. 依赖安装失败
**问题**：npm install 时出现各种错误

**解决方案**：
```bash
# 清理缓存
npm cache clean --force

# 使用淘宝镜像源
npm config set registry https://registry.npmmirror.com

# 删除 node_modules 和 lock 文件重新安装
rm -rf node_modules package-lock.json
npm install
```

## 二、开发常见问题

### 1. 样式单位问题
**问题**：设计稿尺寸与实际显示不符

**最佳实践**：
```javascript
// config/index.js
module.exports = {
  // 设计稿尺寸
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  }
}

// 使用 Taro.pxTransform
import Taro from '@tarojs/taro'

const styles = {
  width: Taro.pxTransform(100), // 自动转换为 rpx
  height: '100px' // 不会转换
}

// CSS 中使用 PX 避免转换
.element {
  font-size: 24PX; /* 大写 PX 不会被转换 */
  width: 100px;   /* 小写会被转换为 rpx */
}
```

### 2. 图片资源处理
**问题**：图片无法显示或路径错误

**最佳实践**：
```javascript
// 1. 使用 import 引入本地图片
import logoImg from '../../assets/logo.png'

<Image src={logoImg} />

// 2. 使用 require
<Image src={require('../../assets/logo.png')} />

// 3. 网络图片直接使用
<Image src='https://example.com/image.jpg' />

// 4. Base64 图片
const base64Img = 'data:image/png;base64,iVBORw0...'
<Image src={base64Img} />

// 5. 配置静态资源路径
// config/index.js
module.exports = {
  // 配置静态资源路径
  copy: {
    patterns: [
      { from: 'src/assets/', to: 'dist/assets/' }
    ]
  }
}
```

### 3. 跨平台兼容性
**问题**：代码在不同平台表现不一致

**解决方案**：
```javascript
// 1. 使用环境变量判断
if (process.env.TARO_ENV === 'weapp') {
  // 微信小程序特定代码
} else if (process.env.TARO_ENV === 'h5') {
  // H5 特定代码
}

// 2. 条件编译
// 文件命名方式
index.js          // 通用
index.weapp.js    // 微信小程序专用
index.h5.js       // H5 专用

// 3. 样式条件编译
/* #ifdef weapp */
.weapp-only {
  color: red;
}
/* #endif */

/* #ifndef h5 */
.not-h5 {
  display: none;
}
/* #endif */
```

### 4. 组件通信
**问题**：父子组件通信复杂

**最佳实践**：
```javascript
// 父组件
import React, { useState } from 'react'
import Child from './Child'

export default function Parent() {
  const [data, setData] = useState('')
  
  const handleChildData = (value) => {
    setData(value)
  }
  
  return (
    <View>
      <Child onUpdate={handleChildData} initialValue={data} />
    </View>
  )
}

// 子组件
export default function Child({ onUpdate, initialValue }) {
  const [value, setValue] = useState(initialValue)
  
  const handleChange = (e) => {
    const newValue = e.detail.value
    setValue(newValue)
    onUpdate(newValue)
  }
  
  return (
    <Input value={value} onInput={handleChange} />
  )
}
```

## 三、性能优化最佳实践

### 1. 长列表优化
**使用虚拟列表**：
```javascript
import React from 'react'
import { View } from '@tarojs/components'
import VirtualList from '@tarojs/components/virtual-list'

export default function LongList() {
  const Row = React.memo(({ index, style, data }) => {
    return (
      <View style={style}>
        Row {index} : {data[index]}
      </View>
    )
  })
  
  const data = Array.from({ length: 1000 }).map((_, i) => `Item ${i}`)
  
  return (
    <VirtualList
      height={800} /* 列表高度 */
      width='100%' /* 列表宽度 */
      itemData={data} /* 数据 */
      itemCount={data.length} /* 数据长度 */
      itemSize={100} /* 列表单项高度 */
    >
      {Row}
    </VirtualList>
  )
}
```

### 2. 图片懒加载
```javascript
import { Image } from '@tarojs/components'

export default function LazyImage() {
  return (
    <Image
      src='https://example.com/image.jpg'
      lazyLoad
      mode='aspectFill'
      placeholder='加载中...'
      onError={(e) => console.log('图片加载失败', e)}
      onLoad={(e) => console.log('图片加载成功', e)}
    />
  )
}
```

### 3. 减少 setData 频率
```javascript
// 错误示例
for (let i = 0; i < 100; i++) {
  this.setState({ [`item${i}`]: i })
}

// 正确示例
const newState = {}
for (let i = 0; i < 100; i++) {
  newState[`item${i}`] = i
}
this.setState(newState)

// 使用防抖
import { debounce } from 'lodash'

const handleSearch = debounce((value) => {
  // 搜索逻辑
}, 300)
```

### 4. 分包加载
```javascript
// app.config.js
export default {
  pages: [
    'pages/index/index',
    'pages/home/index'
  ],
  subPackages: [
    {
      root: 'packageA',
      pages: [
        'pages/cat/index',
        'pages/dog/index'
      ]
    },
    {
      root: 'packageB',
      name: 'pack2',
      pages: [
        'pages/apple/index',
        'pages/banana/index'
      ]
    }
  ]
}

// 跳转分包页面
Taro.navigateTo({
  url: '/packageA/pages/cat/index'
})
```

## 四、网络请求最佳实践

### 1. 封装统一的请求方法
```javascript
// src/utils/request.js
import Taro from '@tarojs/taro'

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.example.com' 
  : 'https://test-api.example.com'

class Request {
  constructor() {
    this.queue = {}
  }
  
  interceptor(instance, url) {
    // 请求拦截
    instance.requestInterceptor = (config) => {
      // 添加 token
      const token = Taro.getStorageSync('token')
      if (token) {
        config.header = {
          ...config.header,
          Authorization: `Bearer ${token}`
        }
      }
      
      Taro.showLoading({ title: '加载中...' })
      return config
    }
    
    // 响应拦截
    instance.responseInterceptor = (res) => {
      Taro.hideLoading()
      
      if (res.statusCode === 200) {
        return res.data
      } else if (res.statusCode === 401) {
        // token 失效，跳转登录
        Taro.navigateTo({ url: '/pages/login/index' })
        return Promise.reject('未授权')
      } else {
        return Promise.reject(res)
      }
    }
  }
  
  request(options) {
    const instance = Taro.request
    options = Object.assign({}, options, {
      url: BASE_URL + options.url
    })
    
    this.interceptor(instance, options.url)
    
    options = instance.requestInterceptor(options)
    
    return instance(options).then(res => {
      return instance.responseInterceptor(res)
    }).catch(err => {
      Taro.showToast({
        title: err.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(err)
    })
  }
  
  get(url, data, config = {}) {
    return this.request({ 
      url, 
      data, 
      method: 'GET',
      ...config 
    })
  }
  
  post(url, data, config = {}) {
    return this.request({ 
      url, 
      data, 
      method: 'POST',
      ...config 
    })
  }
}

export default new Request()
```

### 2. API 模块化管理
```javascript
// src/api/user.js
import request from '../utils/request'

export const getUserInfo = (userId) => {
  return request.get('/user/info', { userId })
}

export const updateUserInfo = (data) => {
  return request.post('/user/update', data)
}

// src/api/index.js
import * as user from './user'
import * as product from './product'

export default {
  user,
  product
}

// 使用
import api from '@/api'

const fetchUser = async () => {
  try {
    const res = await api.user.getUserInfo('123')
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}
```

## 五、状态管理最佳实践

### 1. 使用 Redux
```javascript
// src/store/index.js
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import user from './modules/user'
import product from './modules/product'

const rootReducer = combineReducers({
  user,
  product
})

const middlewares = [thunk]

if (process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger())
}

export default createStore(
  rootReducer,
  applyMiddleware(...middlewares)
)

// src/store/modules/user.js
const initialState = {
  userInfo: null,
  isLogin: false
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return {
        ...state,
        userInfo: action.payload,
        isLogin: true
      }
    case 'LOGOUT':
      return initialState
    default:
      return state
  }
}

export default user

// 使用
import { useSelector, useDispatch } from 'react-redux'

export default function UserPage() {
  const userInfo = useSelector(state => state.user.userInfo)
  const dispatch = useDispatch()
  
  const handleLogin = () => {
    dispatch({
      type: 'SET_USER_INFO',
      payload: { name: '张三', id: 1 }
    })
  }
  
  return (
    <View>
      {userInfo ? (
        <Text>{userInfo.name}</Text>
      ) : (
        <Button onClick={handleLogin}>登录</Button>
      )}
    </View>
  )
}
```

### 2. 使用 MobX
```javascript
// src/store/user.js
import { observable, action, makeObservable } from 'mobx'

class UserStore {
  constructor() {
    makeObservable(this)
  }
  
  @observable userInfo = null
  @observable isLogin = false
  
  @action
  setUserInfo(info) {
    this.userInfo = info
    this.isLogin = true
  }
  
  @action
  logout() {
    this.userInfo = null
    this.isLogin = false
  }
}

export default new UserStore()

// 使用
import { observer } from 'mobx-react'
import userStore from '@/store/user'

export default observer(function UserPage() {
  const { userInfo, isLogin, setUserInfo } = userStore
  
  return (
    <View>
      {isLogin ? (
        <Text>{userInfo.name}</Text>
      ) : (
        <Button onClick={() => setUserInfo({ name: '张三' })}>
          登录
        </Button>
      )}
    </View>
  )
})
```

## 六、调试技巧

### 1. 使用 console 的正确方式
```javascript
// 开发环境打印，生产环境自动移除
if (process.env.NODE_ENV !== 'production') {
  console.log('调试信息')
}

// 格式化输出
console.table([
  { name: '张三', age: 20 },
  { name: '李四', age: 25 }
])

// 性能测试
console.time('fetch')
await fetchData()
console.timeEnd('fetch')
```

### 2. 使用 Source Map
```javascript
// config/prod.js
module.exports = {
  // 生产环境也生成 source map 方便调试
  enableSourceMap: true,
  sourceMapType: 'source-map'
}
```

### 3. 真机调试
```bash
# 开启真机调试模式
npm run dev:weapp -- --debug
```

## 七、发布前检查清单

### 1. 代码质量检查
- [ ] ESLint 检查通过
- [ ] 无 console.log 等调试代码
- [ ] 无未使用的变量和导入
- [ ] 代码格式统一

### 2. 性能检查
- [ ] 包体积是否超过限制（主包 2MB）
- [ ] 是否需要分包加载
- [ ] 图片是否压缩优化
- [ ] 是否有内存泄漏

### 3. 功能检查
- [ ] 所有页面路径是否正确
- [ ] 网络请求错误处理
- [ ] 权限申请是否正常
- [ ] 兼容性测试

### 4. 安全检查
- [ ] 敏感信息是否加密
- [ ] API 密钥是否暴露
- [ ] 用户数据是否安全存储

## 八、持续集成与部署

### 1. Git Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### 2. 自动化构建
```yaml
# .github/workflows/build.yml
name: Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Lint
      run: npm run lint
      
    - name: Build
      run: npm run build:weapp
      
    - name: Upload artifacts
      uses: actions/upload-artifact@v2
      with:
        name: dist
        path: dist/
```

## 九、推荐工具和资源

### 1. 开发工具
- VSCode 插件：Taro Helper
- 小程序开发助手
- 微信开发者工具

### 2. UI 组件库
- Taro UI：官方组件库
- NutUI：京东风格组件库
- Taroify：Vant 风格组件库
- @antmjs/vantui：功能丰富的组件库

### 3. 实用库
- dayjs：日期处理
- lodash：工具函数库
- qs：查询字符串处理
- crypto-js：加密库

### 4. 学习资源
- Taro 官方文档
- Taro 源码解析
- 小程序开发文档
- 社区最佳实践分享

## 总结

通过遵循这些最佳实践，可以有效提升 Taro 项目的开发效率和代码质量。记住以下几点：

1. 始终关注跨平台兼容性
2. 注重性能优化，特别是在小程序环境
3. 保持代码模块化和可维护性
4. 充分利用 Taro 生态系统
5. 持续学习和实践

希望这份指南能帮助你更好地使用 Taro 进行开发！