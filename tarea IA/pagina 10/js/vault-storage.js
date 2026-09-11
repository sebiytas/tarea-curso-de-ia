/**
 * VAULT-STORAGE.JS
 * Capa de persistencia en localStorage para almacenar la colección de videojuegos,
 * gestionar la precarga de los 3 juegos de prueba ficticios y realizar operaciones CRUD seguras.
 */

const VAULT_STORAGE_KEY = 'digital_vault_games';
const VAULT_DOWNLOADS_KEY = 'digital_vault_downloads';

// SVG Placeholder para portadas ausentes
const DEFAULT_COVER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23101D33" stroke="%231E3B66" stroke-width="4"/><line x1="0" y1="0" x2="400" y2="300" stroke="%231E3B66" stroke-width="2"/><line x1="400" y1="0" x2="0" y2="300" stroke="%231E3B66" stroke-width="2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="24" fill="%2300E5C9">NO SYSTEM DATA</text></svg>`;

const PRELOAD_GAMES = [
  {
    id: 'demo-1',
    title: 'Chronicles of Aethelgard: The Lost Sigils',
    author: 'Elena Ruiz (Estudio PixelForge)',
    platform: 'Game Boy Advance',
    year: 2003,
    description: 'RPG táctico de exploración isométrica y batallas por turnos rúnicos desarrollado para demostrar el uso de chips de sonido personalizados en consolas portátiles de 32 bits. Registro ingresado como demostración de preservación de cartuchos portátiles.',
    links: 'Twitter/X: @pixel_elena, Portafolio: https://github.com/ejemplo-elena-dev',
    isDemo: true,
    coverBase64: DEFAULT_COVER,
    dateAdded: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
  },
  {
    id: 'demo-2',
    title: 'CyberDrift 2099: Neon Protocol',
    author: 'Marcus Vance / HyperDrive Interactive',
    platform: 'PlayStation 1 (PSX)',
    year: 1998,
    description: 'Simulador de carreras arcade futuristas en entornos poligonales sin texturizar con música drum & bass sintetizada por software. Se incluye en el archivo para ejemplificar la conservación de títulos de automovilismo experimental.',
    links: 'YouTube: youtube.com/@hyperdrive_games, Discord: discord.gg/ejemplo-cyberdrift',
    isDemo: true,
    coverBase64: DEFAULT_COVER,
    dateAdded: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'demo-3',
    title: 'MicroQuest: La Aldea Flotante',
    author: 'Sofía Mendoza & Mateo Torres',
    platform: 'PC (MS-DOS / Windows 95)',
    year: 1996,
    description: 'Aventura gráfica point-and-click con estética pixel art de 256 colores y puzles mecánicos sobre inventos solares. Título ingresado para validar el almacenamiento de manuales escaneados y binarios de aventura clásica.',
    links: 'Instagram: @microquest_retro, Sitio Web: https://ejemplo-microquest.art',
    isDemo: true,
    coverBase64: DEFAULT_COVER,
    dateAdded: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

class VaultStorage {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    const existing = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!existing || JSON.parse(existing).length === 0) {
      console.log("[VAULT_STORAGE] Inicializando base de datos con registros de prueba...");
      this.saveGames(PRELOAD_GAMES);
    }
    
    if (!localStorage.getItem(VAULT_DOWNLOADS_KEY)) {
      localStorage.setItem(VAULT_DOWNLOADS_KEY, '124'); // Starting with some fake downloads for metrics
    }
  }

  getGames() {
    try {
      const data = localStorage.getItem(VAULT_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("[VAULT_STORAGE] Error leyendo juegos:", e);
      return [];
    }
  }

  saveGames(games) {
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(games));
    } catch (e) {
      console.error("[VAULT_STORAGE] Error guardando juegos. Posible cuota excedida:", e);
      alert('Error de almacenamiento: El archivo es demasiado grande para la bóveda local.');
    }
  }

  addGame(gameData) {
    const games = this.getGames();
    const newGame = {
      id: 'game-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      dateAdded: new Date().toISOString(),
      isDemo: false,
      ...gameData
    };
    
    // Add to beginning of array
    games.unshift(newGame);
    this.saveGames(games);
    return newGame;
  }

  getMetrics() {
    const games = this.getGames();
    const platformsSet = new Set();
    const authorsSet = new Set();
    
    games.forEach(g => {
      if (g.platform) platformsSet.add(g.platform);
      if (g.author) authorsSet.add(g.author);
    });

    const downloads = parseInt(localStorage.getItem(VAULT_DOWNLOADS_KEY) || '0', 10);
    
    return {
      totalGames: games.length,
      totalPlatforms: platformsSet.size,
      totalAuthors: authorsSet.size,
      totalDownloads: downloads
    };
  }

  recordDownload() {
    let d = parseInt(localStorage.getItem(VAULT_DOWNLOADS_KEY) || '0', 10);
    d++;
    localStorage.setItem(VAULT_DOWNLOADS_KEY, d.toString());
  }
}

// Instancia global accesible para otros scripts
window.vaultStorage = new VaultStorage();
