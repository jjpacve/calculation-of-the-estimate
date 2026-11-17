const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('calculatorDesktop', {
    openSor: () => ipcRenderer.invoke('open-sor')
});
