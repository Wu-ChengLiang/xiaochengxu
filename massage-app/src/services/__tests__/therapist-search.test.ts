import { therapistService } from '../therapist'

/**
 * 技师搜索API测试
 * 直接调用真实API来验证搜索功能
 */
describe('Therapist Search API Tests', () => {
  // 测试搜索功能
  test('should search therapists with keyword "任老师"', async () => {
    const result = await therapistService.searchTherapists('任老师', 1, 100)

    console.log('✅ 搜索"任老师"结果:')
    console.log('  total:', result.total)
    console.log('  returned count:', result.list?.length)
    if (result.list && result.list.length > 0) {
      console.log('  first therapist:', result.list[0])
    }

    expect(result).toBeDefined()
    expect(result.list).toBeDefined()
  }, 30000)

  // 测试搜索全部推拿师
  test('should search therapists with keyword "师"', async () => {
    const result = await therapistService.searchTherapists('师', 1, 100)

    console.log('\n✅ 搜索"师"结果:')
    console.log('  total:', result.total)
    console.log('  returned count:', result.list?.length)

    expect(result).toBeDefined()
    expect(result.list).toBeDefined()
    expect(result.total).toBeGreaterThan(0)
  }, 30000)

  // 测试搜索不存在的人
  test('should return empty result for non-existent therapist', async () => {
    const result = await therapistService.searchTherapists('不存在的人999', 1, 100)

    console.log('\n✅ 搜索"不存在的人999"结果:')
    console.log('  total:', result.total)
    console.log('  returned count:', result.list?.length)

    expect(result).toBeDefined()
    expect(result.total).toBe(0)
  }, 30000)

  // 测试获取推荐技师（全部100个）
  test('should get recommended therapists with pageSize=100', async () => {
    const result = await therapistService.getRecommendedTherapistsWithDistance(1, 100)

    console.log('\n✅ 获取推荐技师(pageSize=100)结果:')
    console.log('  total:', result.total)
    console.log('  returned count:', result.list?.length)
    if (result.list && result.list.length > 0) {
      console.log('  first therapist:', result.list[0].name, 'distance:', result.list[0].distance)
    }

    expect(result).toBeDefined()
    expect(result.list).toBeDefined()
    expect(result.list.length).toBeGreaterThan(0)
  }, 30000)

  // 测试分页
  test('should support pagination - page 2', async () => {
    const page1 = await therapistService.getRecommendedTherapistsWithDistance(1, 50)
    const page2 = await therapistService.getRecommendedTherapistsWithDistance(2, 50)

    console.log('\n✅ 分页测试:')
    console.log('  page 1 count:', page1.list?.length)
    console.log('  page 2 count:', page2.list?.length)
    console.log('  total:', page2.total)

    expect(page1.list?.length).toBeGreaterThan(0)
    expect(page2.list?.length).toBeGreaterThan(0)
  }, 30000)
})
