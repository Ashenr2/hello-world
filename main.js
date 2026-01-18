const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Data storage path
const dataPath = path.join(app.getPath('userData'), 'data.json');

// Initialize data file if it doesn't exist
function initializeData() {
  if (!fs.existsSync(dataPath)) {
    const initialData = {
      clients: [],
      campaigns: [],
      contentCalendar: [],
      reports: []
    };
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
  }
}

// Create the main window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    title: 'Marketing Consultancy Manager'
  });

  // Load the app
  // Check if dist folder exists to determine if we should use dev server
  const distExists = fs.existsSync(path.join(__dirname, 'dist/index.html'));
  const isDev = !distExists || process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

// App lifecycle
app.whenReady().then(() => {
  initializeData();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for data operations
ipcMain.handle('load-data', async () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading data:', error);
    return { clients: [], campaigns: [], contentCalendar: [], reports: [] };
  }
});

ipcMain.handle('save-data', async (event, data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving data:', error);
    return { success: false, error: error.message };
  }
});
