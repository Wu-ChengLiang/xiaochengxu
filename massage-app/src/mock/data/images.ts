// 导入本地图片资源
import caodongli from '@/assets/images/store/caodongli/caodongli.jpg'
import chenlaoshi from '@/assets/images/store/caodongli/chenlaoshi.jpg'
import malaoshi from '@/assets/images/store/caodongli/malaoshi.jpg'
import wangglaoshi from '@/assets/images/store/caodongli/wangglaoshi.jpg'
import zhanglaohsi from '@/assets/images/store/caodongli/zhanglaohsi.jpg'
import zhaolaoshi from '@/assets/images/store/caodongli/zhaolaoshi.jpg'
import bannerGoodnight from '@/assets/images/banners/goodnight.jpg'

export const mockImages = {
  // 门店图片 - 目前都使用曹东里店的图片
  stores: [
    caodongli,
    caodongli,
    caodongli,
    caodongli,
    caodongli
  ],
  
  // 推拿师头像
  therapists: {
    male: [
      zhanglaohsi,
      wangglaoshi,
      zhaolaoshi
    ],
    female: [
      chenlaoshi,
      malaoshi
    ]
  },
  
  // 优惠活动banner
  banners: [
    bannerGoodnight
  ]
}