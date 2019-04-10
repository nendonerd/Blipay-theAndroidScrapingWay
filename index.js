const wdio = require("webdriverio")
const PNG = require("pngjs").PNG
const QR = require("jsqr")

const opts = {
  port: 4723,
  desiredCapabilities: {
    platformName: "Android",
    platformVersion: "8.0",
    deviceName: "Mix2s",
    udid: "b2304ba6",
    appPackage: "com.eg.android.AlipayGphone",
    appActivity: "com.eg.android.AlipayGphone.AlipayLogin",
    noReset: true,
    automationName: "UiAutomator2", // appium 2 has better support for UiAutomator2
    newCommandTimeout: "0" // disable session timeout to keep app always open
  }
};

const client = wdio.remote(opts)

let collect = 'android=new UiSelector().resourceId("com.alipay.android.phone.openplatform:id/collect_layout")'
let specify = 'android=new UiSelector().resourceId("com.alipay.mobile.payee:id/payee_QRCodePayModifyMoney")'
let reason = 'android=new UiSelector().resourceId("com.alipay.mobile.payee:id/payee_QRAddBeiZhuLink")'

let input = 'android=new UiSelector().resourceId("com.alipay.mobile.antui:id/input_edit")'

// let reasonInput = 'android=new UiSelector().resourceId("com.alipay.mobile.antui:id/input_edit").instance(1)'
// {
  //   xpath: '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.RelativeLayout[2]/android.widget.LinearLayout/android.widget.EditText',
  //   'resource-id': 'com.alipay.mobile.antui:id/input_edit',
  //   'instance': 1
// }

let confirm = 'android=new UiSelector().resourceId("com.alipay.mobile.payee:id/payee_NextBtn")'
let save = 'android=new UiSelector().resourceId("com.alipay.mobile.payee:id/payee_save_qrcode")'
let backbtn = 'android=new UiSelector().resourceId("com.alipay.mobile.antui:id/back_button")'

// let howMuch = 1
// let token = 'abc'

let alipay = client.init().then(alipay => {console.log('initialized'); return alipay})
// let state = 1
// let asserters = wdio.asserters

let delay = (sec) => new Promise((res) => setTimeout(()=>res(), sec))

// let waitForElem = (elem) => alipay.element(elem).catch(() => delay(100).waitForElem(elem))

function getQR(money, token, res) {
  // return alipay
    // .wait(until.elementLocated(By.name(collect)))

    // .then(alipay => {
    //   if (state) {state = 0; return alipay}
    //   else {return delay(100).catch((e)=>getQR(money, token, res))}
    // })
    // .element(collect)
  return alipay
    .then((alipay) => delay(200).then(() => alipay))
    .click(collect)
    .click(specify)
    // .setValue(input, '20') //very slow
    .click(input)
    .execute('mobile:shell', { command: 'input', args: ['text', money] }) //'adb -s b2304ba6 shell input text 30'
    .click(reason)
    .execute('mobile:shell', { command: 'input', args: ['text', token] })
    .click(confirm)
    .element(save) // wait for a fully loaded qr view
    .screenshot()
    .then(obj => obj.value)
    // .then(data => fs.writeFile('./screenshot.png', data, { encoding: 'base64' })) // save as png file
    .then(b64Buffer => b64Buffer.toString())
    .then(b64 => Buffer.from(b64, 'base64'))
    .then(buffer => PNG.sync.read(buffer))
    .then(png => new Uint8ClampedArray(png.data))
    .then(arr => QR(arr, 1080, 2160))
    .then(img => {console.log(img.data); res.end(img.data)})
    .click(backbtn)
    // .then(alipay => {
    //   state = 1
    // })
    .catch(console.log)
}

const http = require('http')
const url = require('url')

http.createServer((req, res) => {
  const params = url.parse(req.url, true)
  const {money, token} = params.query
  getQR(money, token, res).catch(e => console.log(e))
}).listen(3005)

let sth = `
curl 'http://127.0.0.1:3005/?money=30&token=yoooo';
curl 'http://127.0.0.1:3005/?money=30&token=yoooo';
curl 'http://127.0.0.1:3005/?money=30&token=yoooo'
`