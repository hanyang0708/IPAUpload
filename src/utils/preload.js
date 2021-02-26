import { ipcRenderer } from 'electron'
const { exec } = require('child_process')

window.exec = exec;

window.ipcRenderer = ipcRenderer;