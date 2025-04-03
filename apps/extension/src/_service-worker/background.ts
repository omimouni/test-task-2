import api from '~api'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_COMMUTE_TIME') {
        (async () => {
            const { data, error } = await api.commute.durations.get();
            sendResponse({ data, error })
        })();
    }

    if (message.type === 'GET_COOKIE') {
        console.log('GET_COOKIE', message.name);
        chrome.cookies.get({
            url: 'http://localhost:5000',
            name: message.name,
        }, (cookie) => {
            // sendResponse({ value: cookie ? cookie.value : '' });

            console.log('COOKIE', cookie);
            sendResponse({ value: cookie ? cookie.value : '' });
        });
    }

    if (message.type === 'SET_COOKIE') {
        console.log('SET_COOKIE', message.name, message.value);
        chrome.cookies.set({
            url: 'http://localhost:5000',
            name: message.name,
            value: message.value,
            path: '/',
            expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime(), // 30 days
        }, (cookie) => {
            console.log('COOKIE', cookie);
            sendResponse({ success: !!cookie });
        });
    }

    // Return true means that the message is handled and the response will be sent asynchronously
    return true;
});
