const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const https = require('https')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 820,
    height: 680,
    minWidth: 600,
    minHeight: 500,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    title: 'Assistant Entrepreneur'
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('claude-chat', async (event, { messages, apiKey }) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: `Tu es un assistant expert en entrepreneuriat, stratégie business et développement d'entreprises. Tu aides Maëlan, un entrepreneur français basé à Saint-Quentin (Hauts-de-France).

Ses projets :
- ArtBid : plateforme de vente aux enchères d'art étudiant, modèle marketplace avec commissions dégressives, structure SAS recommandée, business plan avancé (v3, 19 sections), break-even prévu mois 15-18. Cible : étudiants des écoles d'art + acheteurs cherchant de l'art abordable original.
- Il explore aussi d'autres idées de business : critères = bootstrappable, monétisation rapide, modèle marketplace avec commissions, transactions à haute valeur, pas de leader dominant.

Ton rôle : répondre de façon concise, directe, actionnable. Utilise des listes courtes quand c'est utile. Réponds toujours en français.`,
      messages
    })

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) reject(parsed.error.message)
          else resolve(parsed.content?.map(b => b.text || '').join('') || '')
        } catch(e) {
          reject('Erreur de parsing')
        }
      })
    })

    req.on('error', reject)
    req.write(body)
    req.end()
  })
})
