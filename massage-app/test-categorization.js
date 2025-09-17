// 测试分类逻辑
const categorizeService = (name, description = '') => {
  // 1. 颈肩腰腿痛调理
  if (name.includes('颈') || name.includes('肩') ||
      name.includes('腰') || name.includes('腿') ||
      name.includes('背') || name.includes('膝') ||
      name.includes('脊') || name.includes('关节')) {
    return '1';
  }

  // 2. 肝胆脾胃调理
  if (name.includes('肝') || name.includes('胆') ||
      name.includes('脾') || name.includes('胃') ||
      name.includes('消化') || name.includes('肠')) {
    return '2';
  }

  // 3. 女性健康调理
  if (name.includes('女') || name.includes('妇') ||
      name.includes('月经') || name.includes('生理') ||
      name.includes('产后') || name.includes('乳')) {
    return '3';
  }

  // 4. 失眠焦虑调理
  if (name.includes('失眠') || name.includes('焦虑') ||
      name.includes('睡') || name.includes('神经') ||
      name.includes('压力') || name.includes('心理')) {
    return '4';
  }

  // 5. 头痛头晕调理
  if (name.includes('头') || name.includes('晕') ||
      name.includes('眩') || name.includes('偏头痛')) {
    return '5';
  }

  // 6. 体质虚弱调理
  if (name.includes('体质') || name.includes('虚') ||
      name.includes('弱') || name.includes('免疫') ||
      name.includes('疲') || name.includes('乏')) {
    return '6';
  }

  // 7. 亚健康调理 (默认)
  return '7';
};

// 模拟服务数据
const services = [
  { name: '颈肩放松按摩', price: 168 },
  { name: '腰背舒缓推拿', price: 198 },
  { name: '脾胃调理推拿', price: 238 },
  { name: '女性经络调理', price: 268 },
  { name: '失眠调理推拿', price: 288 },
  { name: '头部舒缓按摩', price: 188 },
  { name: '全身疲劳恢复', price: 388 },
  { name: '肝胆排毒推拿', price: 298 },
  { name: '产后恢复推拿', price: 368 },
  { name: '偏头痛专项调理', price: 228 },
  { name: '免疫力提升推拿', price: 318 },
  { name: '办公室综合征调理', price: 258 }
];

// 分类统计
const categories = {
  '1': { name: '颈肩腰腿痛调理', services: [] },
  '2': { name: '肝胆脾胃调理', services: [] },
  '3': { name: '女性健康调理', services: [] },
  '4': { name: '失眠焦虑调理', services: [] },
  '5': { name: '头痛头晕调理', services: [] },
  '6': { name: '体质虚弱调理', services: [] },
  '7': { name: '亚健康调理', services: [] }
};

// 对每个服务进行分类
services.forEach(service => {
  const categoryId = categorizeService(service.name);
  categories[categoryId].services.push(service);
});

// 打印结果
console.log('=== 服务分类结果 ===\n');
console.log(`总服务数: ${services.length}\n`);

Object.entries(categories).forEach(([id, category]) => {
  console.log(`${category.name} (${category.services.length}个):`);
  category.services.forEach(s => {
    console.log(`  - ${s.name} (¥${s.price})`);
  });
  console.log('');
});

// 检查是否所有类别都有服务
const emptyCategoryCount = Object.values(categories).filter(c => c.services.length === 0).length;
if (emptyCategoryCount === 0) {
  console.log('✅ 所有7个类别都有服务！');
} else {
  console.log(`⚠️ 有 ${emptyCategoryCount} 个类别没有服务`);
}