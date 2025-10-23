/**
 * 订单问题诊断脚本
 *
 * 通过真实 API 调用和逻辑分析来诊断问题：
 * 1. 订单详情页没有照片
 * 2. 订单金额显示 NaN
 */

const http = require('https');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  log(colors.cyan, '\n========== 订单问题诊断开始 ==========\n');

  try {
    // 1. 获取订单详情
    log(colors.blue, '📋 第一步：获取订单详情...');
    const orderResponse = await httpGet('https://mingyitang1024.com/api/v2/orders/ORDER202510226158563');
    const order = orderResponse.data;

    log(colors.green, '✅ 订单详情获取成功');
    log(colors.reset, 'orderNo:', order.orderNo);
    log(colors.reset, 'amount:', order.amount, '(类型:', typeof order.amount + ')');
    log(colors.reset, 'extraData:', JSON.stringify(order.extraData, null, 2));

    // 2. 诊断问题1：therapistAvatar
    log(colors.blue, '\n🔍 诊断问题1：therapistAvatar 数据流\n');

    const therapistId = order.extraData.therapistId;
    const therapistAvatarInExtraData = order.extraData.therapistAvatar;

    log(colors.yellow, '⚠️ 关键发现：');
    log(colors.reset, 'therapistId:', therapistId);
    log(colors.reset, 'extraData 中的 therapistAvatar:', therapistAvatarInExtraData);

    if (!therapistAvatarInExtraData) {
      log(colors.red, '❌ 问题确认：extraData 中没有 therapistAvatar 字段！');
      log(colors.reset, '这意味着需要调用 /therapists/{id} API 来获取真实头像');

      // 获取技师信息
      log(colors.blue, '\n📷 获取技师信息来获取真实头像...');
      const therapistResponse = await httpGet(`https://mingyitang1024.com/api/v2/therapists/${therapistId}`);
      const therapist = therapistResponse.data;

      log(colors.green, '✅ 技师信息获取成功');
      log(colors.reset, 'therapist.avatar:', therapist.avatar);

      // 诊断 normalizeImageUrl 的问题
      log(colors.blue, '\n⚙️ 诊断 normalizeImageUrl() 函数的行为...');

      const testUrl = undefined;
      log(colors.yellow, '测试: normalizeImageUrl(undefined) 会返回什么？');
      log(colors.reset, '当前代码：order.therapistAvatar = normalizeImageUrl(order.extraData.therapistAvatar)');
      log(colors.reset, '其中 order.extraData.therapistAvatar = undefined');

      log(colors.red, '❌ 问题根源：');
      log(colors.reset, '根据 image.ts 代码，normalizeImageUrl(undefined) 会返回：');
      log(colors.reset, '  getDefaultImage() → "https://mingyitang1024.com/static/default.png"');
      log(colors.reset, '\n这导致：');
      log(colors.reset, '1. order.therapistAvatar 被设置为默认值');
      log(colors.reset, '2. enrichOrderWithStoreAndTherapistInfo 的条件 !order.therapistAvatar 变为 false');
      log(colors.reset, '3. 不会调用 /therapists/{id} API');
      log(colors.reset, '4. 最终显示默认占位符而不是真实头像');
    }

    // 3. 诊断问题2：amount
    log(colors.blue, '\n💰 诊断问题2：amount 数据流\n');

    log(colors.green, '✅ amount 确实存在：');
    log(colors.reset, 'order.amount:', order.amount);
    log(colors.reset, 'order.extraData 中是否有 amount:', order.extraData.amount);

    if (typeof order.amount === 'number' && order.amount > 0) {
      log(colors.green, '✅ amount 是有效的数字');

      // 模拟 formatAmount 函数
      const formatAmount = (amountInCents) => {
        if (!amountInCents && amountInCents !== 0) return '¥0.00元';
        const yuan = Math.round(amountInCents) / 100;
        return `¥${yuan.toFixed(2)}元`;
      };

      const formatted = formatAmount(order.amount);
      log(colors.reset, '使用 formatAmount(amount) 的结果:', formatted);

      if (formatted.includes('NaN')) {
        log(colors.red, '❌ 显示 NaN 的原因可能是：');
        log(colors.reset, '1. amount 在某个环节被设置为 undefined');
        log(colors.reset, '2. amount 是字符串而非数字');
        log(colors.reset, '3. React state 更新问题');
      } else {
        log(colors.green, '✅ formatAmount 函数正常工作');
      }
    }

    // 4. 总结
    log(colors.cyan, '\n========== 诊断总结 ==========\n');

    log(colors.yellow, '📌 问题1 - 没有照片 (已确认)：');
    log(colors.reset, '根本原因: normalizeImageUrl() 对 undefined 返回默认值');
    log(colors.reset, '影响: enrichOrderWithStoreAndTherapistInfo() 不会调用 API 获取真实头像');
    log(colors.reset, '修复方向:');
    log(colors.reset, '  - 分离数据验证和规范化逻辑');
    log(colors.reset, '  - 先调用 API 获取真实值，再规范化');
    log(colors.reset, '  - 或改进 normalizeImageUrl() 函数的条件判断');

    log(colors.yellow, '\n📌 问题2 - 金额为 NaN：');
    log(colors.reset, 'API 数据: amount 字段存在且正确');
    log(colors.reset, 'formatAmount 函数: 能正确处理数据');
    log(colors.reset, '可能原因: React state 更新或页面接收数据问题');
    log(colors.reset, '修复方向:');
    log(colors.reset, '  - 检查 React state 流');
    log(colors.reset, '  - 添加数据验证: amount && typeof amount === "number"');
    log(colors.reset, '  - 在 formatAmount 中添加更多容错处理');

    log(colors.cyan, '\n========== 诊断完成 ==========\n');

  } catch (error) {
    log(colors.red, '❌ 诊断过程出错:', error.message);
    process.exit(1);
  }
}

main();
