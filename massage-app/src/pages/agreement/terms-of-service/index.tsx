import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const TermsOfService: React.FC = () => {
  return (
    <View className="agreement-page">
      <View className="agreement-header">
        <Text className="agreement-title">用户服务协议</Text>
      </View>
      <View className="agreement-content">
        <View className="section">
          <Text className="section-title">1. 协议接受</Text>
          <Text className="section-text">您使用本小程序即表示您同意遵守本用户服务协议的所有条款和条件。如果您不同意，请勿使用本小程序。</Text>
        </View>

        <View className="section">
          <Text className="section-title">2. 服务描述</Text>
          <Text className="section-text">本小程序提供以下主要服务：</Text>
          <Text className="list-item">• 推拿预约服务：用户可以浏览推拿师信息，预约推拿服务</Text>
          <Text className="list-item">• 礼品购买服务：用户可以购买礼品卡和周边产品</Text>
          <Text className="list-item">• 账户管理：用户可以管理个人信息、订单和支付</Text>
        </View>

        <View className="section">
          <Text className="section-title">3. 用户账户</Text>

          <Text className="subsection-title">3.1 账户创建</Text>
          <Text className="list-item">• 用户需要通过微信授权和手机号绑定创建账户</Text>
          <Text className="list-item">• 用户须提供真实、准确的信息</Text>
          <Text className="list-item">• 用户对账户安全负责</Text>

          <Text className="subsection-title">3.2 账户使用</Text>
          <Text className="list-item">• 您不得将账户用于任何非法或有害目的</Text>
          <Text className="list-item">• 您不得骚扰或威胁他人</Text>
          <Text className="list-item">• 您不得发布虚假或误导性信息</Text>
        </View>

        <View className="section">
          <Text className="section-title">4. 服务条款</Text>

          <Text className="subsection-title">4.1 预约服务</Text>
          <Text className="list-item">• 用户可根据推拿师的可用时间进行预约</Text>
          <Text className="list-item">• 用户应提前告知任何特殊需求或过敏情况</Text>
          <Text className="list-item">• 如需取消预约，请提前通知</Text>
          <Text className="list-item">• 迟到超过15分钟的预约可能被取消</Text>

          <Text className="subsection-title">4.2 支付</Text>
          <Text className="list-item">• 所有价格以人民币显示</Text>
          <Text className="list-item">• 支付通过微信支付进行</Text>
          <Text className="list-item">• 已支付的费用根据具体退款政策处理</Text>

          <Text className="subsection-title">4.3 礼品购买</Text>
          <Text className="list-item">• 礼品订单确认后不可修改或取消</Text>
          <Text className="list-item">• 礼品配送由第三方物流公司负责</Text>
          <Text className="list-item">• 我们对物流损失不承担责任</Text>
        </View>

        <View className="section">
          <Text className="section-title">5. 免责声明</Text>
          <Text className="section-text">我们在现状基础上提供服务，不做任何明示或暗示的保证，包括：</Text>
          <Text className="list-item">• 服务的可用性或持续性</Text>
          <Text className="list-item">• 服务的准确性或完整性</Text>
          <Text className="list-item">• 第三方内容的准确性</Text>
        </View>

        <View className="section">
          <Text className="section-title">6. 责任限制</Text>
          <Text className="section-text">除法律明确规定外，在任何情况下，我们对由您使用本小程序而产生的任何直接、间接、附带、特殊或后果性损害不承担责任。</Text>
        </View>

        <View className="section">
          <Text className="section-title">7. 用户行为准则</Text>
          <Text className="section-text">用户承诺：</Text>
          <Text className="list-item">• 遵守所有适用的法律和法规</Text>
          <Text className="list-item">• 不发送垃圾邮件或从事骚扰行为</Text>
          <Text className="list-item">• 不尝试未经授权访问系统</Text>
          <Text className="list-item">• 不破坏或干扰服务的正常运行</Text>
          <Text className="list-item">• 尊重他人的知识产权和隐私</Text>
        </View>

        <View className="section">
          <Text className="section-title">8. 知识产权</Text>
          <Text className="section-text">本小程序的所有内容和功能均受版权和其他知识产权法保护。您无权复制、修改或分发任何内容，除非获得明确许可。</Text>
        </View>

        <View className="section">
          <Text className="section-title">9. 第三方链接</Text>
          <Text className="section-text">本小程序可能包含第三方网站或服务的链接。我们对第三方内容不承担责任。请在访问任何第三方服务时查看其条款。</Text>
        </View>

        <View className="section">
          <Text className="section-title">10. 协议修改</Text>
          <Text className="section-text">我们有权随时修改本协议。修改生效后继续使用小程序表示您接受修改后的条款。</Text>
        </View>

        <View className="section">
          <Text className="section-title">11. 终止服务</Text>
          <Text className="section-text">我们有权在以下情况下终止用户的使用权：</Text>
          <Text className="list-item">• 违反本协议</Text>
          <Text className="list-item">• 从事非法或有害活动</Text>
          <Text className="list-item">• 长期不活跃</Text>
          <Text className="list-item">• 其他合理原因</Text>
        </View>

        <View className="section">
          <Text className="section-title">12. 法律管辖</Text>
          <Text className="section-text">本协议受中华人民共和国法律管辖，任何争议应在管辖法院解决。</Text>
        </View>

        <View className="section">
          <Text className="section-title">13. 投诉和反馈</Text>
          <Text className="section-text">如对本协议有任何疑问或投诉，请通过以下方式联系我们：</Text>
          <Text className="list-item">• 小程序内反馈功能</Text>
          <Text className="section-text">我们承诺在收到投诉后的15个工作日内进行回复和处理。</Text>
        </View>

        <View className="section">
          <Text className="update-date">生效日期：2026年1月7日</Text>
        </View>
      </View>
    </View>
  )
}

export default TermsOfService
