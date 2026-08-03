const bizSdk = require('facebook-nodejs-business-sdk');

const PIXEL_ID = '910511058151135';
const ACCESS_TOKEN = process.env.META_PIXEL_ACCESS_TOKEN;

async function sendPurchaseEvent({ orderId, total, clientIp, userAgent, email, phone }) {
  if (!ACCESS_TOKEN) return;

  try {
    const { ServerEvent, EventRequest, UserData, CustomData, Content } = bizSdk;

    const userData = new UserData()
      .setClientIpAddress(clientIp || '')
      .setClientUserAgent(userAgent || '');

    if (email) userData.setEmail(email);
    if (phone) userData.setPhone(phone);

    const customData = new CustomData()
      .setValue(parseFloat(total))
      .setCurrency('INR')
      .setOrderId(String(orderId));

    const event = new ServerEvent()
      .setEventName('Purchase')
      .setEventTime(Math.floor(Date.now() / 1000))
      .setEventSourceUrl('https://traditional-xi.vercel.app/checkout')
      .setActionSource('website')
      .setUserData(userData)
      .setCustomData(customData);

    await new EventRequest(ACCESS_TOKEN, PIXEL_ID)
      .setEvents([event])
      .execute();
  } catch (err) {
    console.error('Meta CAPI error:', err?.message || err);
  }
}

module.exports = { sendPurchaseEvent };
