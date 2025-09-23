/**
 * 测试真实的评价API
 */
const axios = require('axios')

const API_BASE = 'http://emagen.323424.xyz/api/v2'

async function testReviewAPI() {
  console.log('开始测试真实的评价API...\n')

  try {
    // 1. 测试获取技师评价列表
    console.log('1. 测试获取技师评价列表')
    const therapistId = 181
    const reviewsResponse = await axios.get(
      `${API_BASE}/therapists/${therapistId}/reviews`,
      {
        params: {
          page: 1,
          pageSize: 5
        }
      }
    )
    console.log('技师评价列表返回:', JSON.stringify(reviewsResponse.data, null, 2))
    console.log('---\n')

    // 2. 测试获取评价统计
    console.log('2. 测试获取评价统计')
    const statsResponse = await axios.get(
      `${API_BASE}/therapists/${therapistId}/review-stats`
    )
    console.log('评价统计返回:', JSON.stringify(statsResponse.data, null, 2))
    console.log('---\n')

    // 3. 测试检查是否可以评价（通过获取评价详情）
    console.log('3. 测试检查是否可以评价')
    const appointmentId = 25 // 使用一个测试预约ID
    try {
      const reviewCheckResponse = await axios.get(
        `${API_BASE}/reviews/${appointmentId}`
      )
      console.log('评价检查返回（已评价）:', JSON.stringify(reviewCheckResponse.data, null, 2))
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('评价检查返回（可以评价）: 404 - 评价不存在，可以创建评价')
      } else {
        console.log('评价检查错误:', error.message)
      }
    }
    console.log('---\n')

    // 4. 测试创建评价（注意：这会真的创建一条评价记录）
    console.log('4. 测试创建评价（跳过，避免重复创建）')
    console.log('创建评价的示例参数:')
    console.log(JSON.stringify({
      appointmentId: 123,
      therapistId: '181',
      rating: 5,
      content: '服务非常专业，推拿手法到位，效果很好！',
      tags: ['专业', '手法好', '环境舒适']
    }, null, 2))
    console.log('---\n')

    // 5. 测试获取用户评价历史
    console.log('5. 测试获取用户评价历史')
    const userId = 20
    const userReviewsResponse = await axios.get(
      `${API_BASE}/users/${userId}/reviews`,
      {
        params: {
          page: 1,
          pageSize: 5
        }
      }
    )
    console.log('用户评价历史返回:', JSON.stringify(userReviewsResponse.data, null, 2))
    console.log('---\n')

    console.log('✅ 所有API测试完成！')

  } catch (error) {
    console.error('❌ API测试失败:')
    if (error.response) {
      console.error('状态码:', error.response.status)
      console.error('响应数据:', error.response.data)
    } else {
      console.error('错误信息:', error.message)
    }
  }
}

// 运行测试
testReviewAPI()