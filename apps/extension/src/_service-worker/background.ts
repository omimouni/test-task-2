// Import API utilities
import api from '~api'

// Type definitions for cookie-related messages
type CookieMessage = {
  type: 'GET_COOKIE' | 'SET_COOKIE'
  name: string
  url: string
  domain?: string
  path?: string
  value?: string
  expirationDate?: number
}

// Type definitions for commute-related messages
type CommuteMessage = {
  type: 'GET_COMMUTE_TIME'
  addresses: string[]
}

// Union type for all possible message types
type Message = CookieMessage | CommuteMessage

// Add listener for extension messages
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  // Handle commute time requests
  if (message.type === 'GET_COMMUTE_TIME') {
    (async () => {
      // Check if addresses were provided
      if (message.addresses.length === 0) {
        sendResponse({ data: null, error: 'No addresses provided' })
        return
      }

      // Validate number of addresses
      if (message.addresses.length > 2) {
        sendResponse({ data: null, error: 'Maximum 2 addresses allowed' })
        return
      }

      // Make API call to get commute durations
      const { data, error } = await api.commute.durations.post({
        addresses: message.addresses,
      })
      sendResponse({ data, error })
    })()
  }

  // Handle cookie retrieval requests
  if (message.type === 'GET_COOKIE') {
    (async () => {
      // Get cookie by name and URL
      await chrome.cookies.get(
        { name: message.name, url: message.url },
        (cookie) => {
          sendResponse({ data: cookie?.value || null, error: null })
        }
      )
    })()
  }

  // Handle cookie setting requests
  if (message.type === 'SET_COOKIE') {
    (async () => {
      // Set cookie with provided parameters
      await chrome.cookies.set(
        {
          url: message.url,
          name: message.name,
          value: message.value,
          domain: message.domain,
          path: message.path,
          expirationDate: message.expirationDate,
        },
        (cookie) => {
          sendResponse({ data: !!cookie, error: null })
        }
      )
    })()
  }

  // Return true to indicate that the response will be sent asynchronously
  return true
})
