import api from '~api'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_COMMUTE_TIME') {
    ;(async () => {

      if (message.addresses.length === 0) {
        sendResponse({ data: null, error: 'No addresses provided' })
        return
      }

      if (message.addresses.length > 2) {
        sendResponse({ data: null, error: 'Maximum 2 addresses allowed' })
        return
      }
      
      const { data, error } = await api.commute.durations.post({
        addresses: message.addresses,
      })
      sendResponse({ data, error })
    })()
  }
  return true
})
