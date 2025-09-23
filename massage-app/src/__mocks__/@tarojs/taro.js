module.exports = {
  default: {
    getLocation: jest.fn().mockResolvedValue({
      latitude: 31.2304,
      longitude: 121.4737
    }),
    getSetting: jest.fn().mockResolvedValue({
      authSetting: {
        'scope.userLocation': true
      }
    }),
    authorize: jest.fn().mockResolvedValue({}),
    showModal: jest.fn(),
    openSetting: jest.fn(),
    makePhoneCall: jest.fn(),
    openLocation: jest.fn(),
    showToast: jest.fn(),
    navigateTo: jest.fn(),
    getStorageSync: jest.fn(),
    setStorageSync: jest.fn(),
    removeStorageSync: jest.fn(),
    getStorageInfoSync: jest.fn(() => ({ keys: [] })),
    eventCenter: {
      trigger: jest.fn()
    }
  }
}