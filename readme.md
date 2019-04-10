> This is an experimental test for scraping alipay fixed checkout code from its android app.
> And it's kind of hard to set up the environment and I have forgot the details about doing it.
> But it works very well for me, the computer i use is a macbook pro with MacOS 10.14, the phone i use is Xiaomi Mix2S with Android 8
> Note that alipay limits fixed checkout code generation amount to 20, so it's better to use [another way](https://github.com/nendonerd/Blipay--) to do the task

## how to build and run
1. make sure you have put your android phone into developer mode, and turn on these options: usb debugging, install via usb,  stay awake
2. have alipay app installed and login on your phone
2. make sure you have appium installed on your computer(I use the appium desktop, cli version should work as well)
3. make sure you have adb installed on your computer(this is the hard part. for mac I installed Android Studio, degrading Java to version8, and tweaking some java environment variable)
4. plug your phone, and get some info by using some adb commands(I forget how to do it, pls google it) the info we need is
  - platformVersion
  - deviceName
  - udid
5. open appium, enable relaxedSecurity and sessionOverride in Advance panel, then click connect
6. `git clone` this repo, then `yarn install` some dependencies
7. `node index` to run this repo
8. then you can test it by `curl 'http://127.0.0.1:3005/?money=30&token=yoooo'`
