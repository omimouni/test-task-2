import api from '~api'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_COMMUTE_TIME') {
    ; (async () => {

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
  if (message.type === 'GET_COOKIE') {
    // a way to set url dynamically
    (async () => {
      console.log('message', message);
      const cookie = await chrome.cookies.get({ name: message.name, url: message.url }, (cookie) => {
        console.log('cookie', cookie);
        sendResponse({ data: cookie?.value || '' });
      })
      console.log('cookie', cookie);
    })()
  }

  if (message.type === 'SET_COOKIE') {
    (async () => {
      console.log('message', message);
      await chrome.cookies.set({ 
        url: message.url,
        name: message.name,
        value: message.value,
        domain: message.domain,
        path: message.path,
        expirationDate: message.expirationDate
      }, (cookie) => {
        console.log('cookie', cookie);
        sendResponse({ data: !!cookie, error: null });
      });
    })()
  }

  // Return true to indicate that the response will be sent asynchronously
  return true
});

