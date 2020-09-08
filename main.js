// Modules to control application life and create native browser window
const { app, BrowserWindow, session, shell, globalShortcut } = require('electron')
const path = require('path')
const { defaultCipherList } = require('constants')


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }

  })

  // Remove menu for cleaner look and load website
  mainWindow.removeMenu()
  mainWindow.loadURL('https://play.geforcenow.com/')
  mainWindow.maximize()


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}


// Disabled HW acceleration becuase of artifacts
app.disableHardwareAcceleration()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  usrset()
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Allows you to see where popups are going to
  app.on('web-contents-created', (webContentsCreatedEvent, contents) => {
    contents.on('will-navigate', function (e, reqUrl) {
      console.log(`Popup is navigating to: ${reqUrl}`)
    })

  })

  //globalShortcut.register('Esc', () => {})

})

// Controls the sites which userstring works
const wsites = {
  urls: ['https://*.play.geforcenow.com/*', '*://electron.github.io']
}

// Fucntion used for setting user string
function usrset() {
  session.defaultSession.webRequest.onBeforeSendHeaders((wsites, callback) => {
    wsites.requestHeaders['User-Agent'] = 'Mozilla/5.0 (X11; CrOS x86_64 13310.59.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.84 Safari/537.36';
    callback({ cancel: false, requestHeaders: wsites.requestHeaders })
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Set all windows to have no menu
app.on('browser-window-created', function (e, window) {
  window.setMenu(null)
  window.setAlwaysOnTop(true, 'pop-up-menu')
})




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
