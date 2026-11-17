const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

let mainWindow;
let sorWindow;

function createWindow(page, options) {
    const win = new BrowserWindow({
        width: 640,
        height: 760,
        minWidth: 380,
        minHeight: 480,
        backgroundColor: '#0f172a',
        autoHideMenuBar: true,
        ...options,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });
    win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    win.webContents.on('will-navigate', event => event.preventDefault());
    win.loadFile(path.join(__dirname, '..', page));
    return win;
}

function createMainWindow() {
    mainWindow = createWindow('index.html');
    mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
    ipcMain.handle('open-sor', event => {
        if (event.sender !== mainWindow?.webContents) return;
        if (sorWindow && !sorWindow.isDestroyed()) {
            if (sorWindow.isMinimized()) sorWindow.restore();
            sorWindow.focus();
            return;
        }
        sorWindow = createWindow('sor.html', { width: 560, height: 670 });
        sorWindow.on('closed', () => { sorWindow = null; });
    });
    createMainWindow();
    app.on('activate', () => {
        if (!mainWindow) createMainWindow();
        else mainWindow.show();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
