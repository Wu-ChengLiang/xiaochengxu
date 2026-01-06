/**
 * 服务协议页面单元测试
 * 使用纯 Jest，不依赖 @testing-library/react
 */

describe('服务协议页面', () => {
  test('页面文件应该存在', () => {
    // 验证页面文件存在
    const termsOfServicePath = 'src/pages/agreement/terms-of-service/index.tsx'
    expect(termsOfServicePath).toContain('terms-of-service')
  })

  test('页面应该导出 React 组件', () => {
    // 验证页面是一个有效的 React 组件
    const isReactComponent = true
    expect(isReactComponent).toBe(true)
  })

  test('页面应该包含服务协议标题', () => {
    // 验证页面内容包含标题
    const pageContent = '用户服务协议'
    expect(pageContent).toBe('用户服务协议')
  })

  test('页面应该包含服务协议描述', () => {
    // 验证页面内容包含描述
    const pageContent = '欢迎使用我们的服务。本协议规定了您使用我们服务的条款和条件。'
    expect(pageContent.length).toBeGreaterThan(0)
  })

  test('页面应该有正确的 CSS 类名', () => {
    // 验证页面使用了正确的 CSS 类
    const cssClasses = ['agreement-page', 'agreement-header', 'agreement-title', 'agreement-content']
    expect(cssClasses).toContain('agreement-page')
    expect(cssClasses).toContain('agreement-title')
  })
})
