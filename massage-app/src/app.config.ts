export default {
  pages: [
    'pages/appointment/index',
    'pages/gift/index',
    'pages/mine/index',
    'pages/appointment/store/index',
    'pages/store/list/index',
    'pages/store/detail/index',
    'pages/therapist/detail/index',
    'pages/booking/confirm/index',
    'pages/booking/select-time/index',
    'pages/promotion/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '推拿预约',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#D9455F',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/appointment/index',
        text: '预约'
        // iconPath: 'assets/icons/appointment.png',
        // selectedIconPath: 'assets/icons/appointment-active.png'
      },
      {
        pagePath: 'pages/gift/index',
        text: '好礼'
        // iconPath: 'assets/icons/gift.png',
        // selectedIconPath: 'assets/icons/gift-active.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
        // iconPath: 'assets/icons/mine.png',
        // selectedIconPath: 'assets/icons/mine-active.png'
      }
    ]
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于计算附近门店距离'
    }
  },
  requiredPrivateInfos: [
    'getLocation'
  ]
}