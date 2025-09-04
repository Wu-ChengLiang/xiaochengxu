import { Component } from 'react'
import './app.scss'

class App extends Component {
  componentDidMount () {
    console.log('推拿预约小程序启动')
  }

  componentDidShow () {}

  componentDidHide () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App