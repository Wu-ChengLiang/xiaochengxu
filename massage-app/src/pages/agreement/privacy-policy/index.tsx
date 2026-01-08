import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const PrivacyPolicy: React.FC = () => {
  return (
    <View className="agreement-page">
      <View className="agreement-header">
        <Text className="agreement-title">隐私政策</Text>
      </View>
      <View className="agreement-content">
        <View className="section">
          <Text className="section-title">1. 信息收集</Text>
          <Text className="section-text">我们的小程序可能会收集以下用户信息：</Text>

          <Text className="subsection-title">1.1 必要信息</Text>
          <Text className="list-item">• 手机号：用于账户注册、登录和身份验证</Text>
          <Text className="list-item">• 微信OpenID：用于账户标识和关联</Text>
          <Text className="list-item">• 头像和昵称：用于个人资料展示（仅在用户授权时）</Text>

          <Text className="subsection-title">1.2 服务相关信息</Text>
          <Text className="list-item">• 位置信息：用于查找附近门店（仅在用户授权时）</Text>
          <Text className="list-item">• 订单和预约信息：用于提供推拿预约和礼品购买服务</Text>
          <Text className="list-item">• 支付信息：用于处理微信支付交易（支付信息由微信平台处理）</Text>
        </View>

        <View className="section">
          <Text className="section-title">2. 信息使用</Text>
          <Text className="section-text">收集的用户信息将仅用于以下目的：</Text>
          <Text className="list-item">• 注册和验证用户账户</Text>
          <Text className="list-item">• 提供推拿预约服务</Text>
          <Text className="list-item">• 提供礼品购买和充值服务</Text>
          <Text className="list-item">• 改进服务质量和用户体验</Text>
          <Text className="list-item">• 发送重要通知和更新</Text>
          <Text className="list-item">• 遵守法律义务</Text>
        </View>

        <View className="section">
          <Text className="section-title">3. 信息保护</Text>
          <Text className="section-text">我们采取以下措施保护您的个人信息：</Text>
          <Text className="list-item">• 使用行业标准的安全措施</Text>
          <Text className="list-item">• 限制对个人信息的访问</Text>
          <Text className="list-item">• 定期审核安全实践</Text>
          <Text className="list-item">• 遵守相关的数据保护法规</Text>
        </View>

        <View className="section">
          <Text className="section-title">4. 信息共享</Text>
          <Text className="section-text">我们不会与第三方共享您的个人信息，除非：</Text>
          <Text className="list-item">• 获得您的明确同意</Text>
          <Text className="list-item">• 法律要求或允许</Text>
          <Text className="list-item">• 提供所需的服务（如微信支付）</Text>
        </View>

        <View className="section">
          <Text className="section-title">5. 数据保留</Text>
          <Text className="section-text">个人信息将在以下期间保留：</Text>
          <Text className="list-item">• 在您的账户存在期间</Text>
          <Text className="list-item">• 完成相关服务后的合理期限</Text>
          <Text className="list-item">• 根据法律要求的更长期限</Text>
        </View>

        <View className="section">
          <Text className="section-title">6. 用户权利</Text>
          <Text className="section-text">您有权：</Text>
          <Text className="list-item">• 访问您的个人信息</Text>
          <Text className="list-item">• 更正不准确的信息</Text>
          <Text className="list-item">• 申请删除您的账户和相关数据</Text>
          <Text className="list-item">• 撤回对信息收集的同意</Text>
        </View>

        <View className="section">
          <Text className="section-title">7. 特殊权限说明</Text>

          <Text className="subsection-title">7.1 位置权限</Text>
          <Text className="list-item">• 用途：用于计算用户与附近门店的距离，帮助用户快速找到最近的服务门店</Text>
          <Text className="list-item">• 收集方式：仅在用户主动授权时收集</Text>
          <Text className="list-item">• 使用范围：仅用于本小程序内的门店推荐功能</Text>
          <Text className="list-item">• 数据保留：位置信息不会被长期存储，仅在当次使用时获取</Text>

          <Text className="subsection-title">7.2 微信用户信息</Text>
          <Text className="list-item">• 用途：用于账户创建和身份识别</Text>
          <Text className="list-item">• 收集方式：通过微信授权获取（头像、昵称、OpenID）</Text>
          <Text className="list-item">• 使用范围：仅用于账户管理和服务提供</Text>
          <Text className="list-item">• 数据保留：在账户存在期间保留</Text>

          <Text className="subsection-title">7.3 手机号信息</Text>
          <Text className="list-item">• 用途：用于账户注册、登录验证和订单通知</Text>
          <Text className="list-item">• 收集方式：通过微信手机号授权获取</Text>
          <Text className="list-item">• 使用范围：仅用于账户管理和服务通知</Text>
          <Text className="list-item">• 数据保留：在账户存在期间保留</Text>
        </View>

        <View className="section">
          <Text className="section-title">8. 用户同意机制</Text>
          <Text className="list-item">• 用户在首次使用小程序时，必须阅读并同意本隐私政策和用户服务协议</Text>
          <Text className="list-item">• 用户可以随时撤回对特定权限的授权</Text>
          <Text className="list-item">• 用户可以随时申请删除账户和相关数据</Text>
          <Text className="list-item">• 撤回授权或删除账户后，我们将停止收集相关信息，但不影响已提供服务的结算</Text>
        </View>

        <View className="section">
          <Text className="section-title">9. 投诉和反馈</Text>
          <Text className="section-text">如您对我们的隐私保护实践有任何疑问或投诉，请通过以下方式联系我们：</Text>
          <Text className="list-item">• 小程序内反馈功能</Text>
          <Text className="section-text">我们承诺在收到投诉后的15个工作日内进行回复和处理。</Text>
        </View>

        <View className="section">
          <Text className="section-title">10. 政策更新</Text>
          <Text className="section-text">我们可能会不定期更新本隐私政策。更新将在本页面发布，重大变更会通过通知告知用户。</Text>
          <Text className="update-date">最后更新日期：2026年1月7日</Text>
        </View>
      </View>
    </View>
  )
}

export default PrivacyPolicy
