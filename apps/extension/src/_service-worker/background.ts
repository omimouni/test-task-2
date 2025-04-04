import api from '~api'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_COMMUTE_TIME') {
    ;(async () => {
      const { data, error } = await api.commute.durations.get()
      sendResponse({ data, error })
    })()
  }
  return true
})
