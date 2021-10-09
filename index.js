export default function (options) {
  const { Ulink, wx } = options
  if (!Ulink || !wx) throw new Error('config error')
  return function http(router, data, option) {
      option = { errAlert: true, resAlert: false, loading: true, ...option }
      const methods = option.methods || 'post'
      if (option.loading) {
          wx.showLoading({
              title: '加载中',
              mask: true
          })
      }
      return new Promise((resolve, reject) => {
          Ulink.http[methods](router, data)
              .then(res => {
                  if (option.resAlert) {
                      Ulink.miniAPI.showToast(res.rawData.sMsg)
                  }
                  if (option.loading) {
                      wx.hideLoading()
                  }
                  console.log(router + ' \n ' + res.rawData.sULinkSerial + ' \n ', res.rawData)
                  resolve(res)
              })
              .catch(err => {
                  if (option.errAlert) {
                      Ulink.miniAPI.showToast(err.sMsg)
                  }
                  if (option.loading) {
                      wx.hideLoading()
                  }
                  if (__wxConfig.envVersion == 'trial') {
                      uni.setClipboardData({
                          data: `路由：【${router}】\r\n错误码：【${err.iRet}】\r\n提示：【${err.sMsg}】\r\n流水号：【${err.sULinkSerial}】`,
                          success: (res) => {
                              Ulink.miniAPI.alert({
                                  content: `路由：【${router}】\r\n错误码：【${err.iRet}】\r\n提示：【${err.sMsg}】\r\n流水号已复制，发给开发吧！😄`
                              })
                          }
                      })
                  }
                  console.log(router + ' \n ' + err.sULinkSerial + ' \n ', err.jData)
                  reject(err)
              })
      })
  }
}
