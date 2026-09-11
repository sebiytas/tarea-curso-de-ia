/**
 * NINTENDO PERIPHERAL VAULT // ACCESSORIES-DATA.JS
 * Repositorio estructurado con el registro histórico de consolas y periféricos oficiales.
 */

export const nintendoData = [
  {
    consoleId: "nes",
    consoleName: "Famicom / NES",
    year: 1983,
    accessories: [
      {
        id: "nes-zapper",
        name: "NES Zapper",
        type: "Óptico",
        year: 1984,
        technicalData: "Fotodiodo detector de contraste CRT",
        description: "Pistola óptica para tubos CRT. Funcionamiento técnico mediante fotodiodo que detectaba el cuadro negro con blanco del objetivo cuando la pantalla parpadeaba por una fracción de segundo.",
        games: ["Duck Hunt", "Wild Gunman", "Hogan's Alley"]
      },
      {
        id: "rob",
        name: "R.O.B. (Robotic Operating Buddy)",
        type: "Robótico / Interfaz física",
        year: 1985,
        technicalData: "Receptor óptico para comandos CRT",
        description: "Accesorio robótico motorizado creado como estrategia de marketing para posicionar a la NES como un juguete tecnológico tras la crisis del videojuego de 1983, recibiendo comandos ópticos desde la TV.",
        games: ["Gyromite", "Stack-Up"]
      },
      {
        id: "power-glove",
        name: "Power Glove",
        type: "Control gestual",
        year: 1989,
        technicalData: "Sensores resistivos y emisor ultrasónico",
        description: "Primer periférico gestual para recrear movimiento de mano en un entorno 3D primitivo mediante triangulación ultrasónica de la posición de la mano sobre el televisor.",
        games: ["Super Glove Ball", "Bad Street Brawler"]
      }
    ]
  },
  {
    consoleId: "gb",
    consoleName: "Game Boy / GBC",
    year: 1989,
    accessories: [
      {
        id: "gb-camera",
        name: "Game Boy Camera & Game Boy Printer",
        type: "Captura visual / Impresión",
        year: 1998,
        technicalData: "CMOS 128x128px / Impresora térmica",
        description: "Sensor CMOS térmico que capturaba imágenes en 4 escalas de gris y microimpresora térmica sobre papel adhesivo. Uno de los dispositivos digitales de fotografía más pequeños de su época.",
        games: ["Game Boy Camera (Software)", "Pokémon Amarillo (Diplomas)"]
      },
      {
        id: "link-cable",
        name: "Game Link Cable",
        type: "Cable de enlace de datos",
        year: 1989,
        technicalData: "Conexión serial bidireccional",
        description: "Cable de conexión serial para intercambio de datos y partidas multijugador directas entre dos sistemas Game Boy independientes.",
        games: ["Tetris", "Pokémon Rojo / Azul"]
      }
    ]
  },
  {
    consoleId: "snes",
    consoleName: "Super Nintendo",
    year: 1990,
    accessories: [
      {
        id: "super-scope",
        name: "Super Scope",
        type: "Óptico / Disparador",
        year: 1992,
        technicalData: "Sensor infrarrojo inalámbrico",
        description: "Bazuca inalámbrico por sensor infrarrojo que operaba con 6 pilas AA, detectando el barrido de los televisores CRT de manera más sofisticada que el Zapper original.",
        games: ["Super Scope 6", "Yoshi's Safari", "Battle Clash"]
      },
      {
        id: "super-game-boy",
        name: "Super Game Boy",
        type: "Adaptador de hardware",
        year: 1994,
        technicalData: "CPU y RAM de Game Boy integrados",
        description: "Cartucho adaptador con hardware interno de Game Boy para reproducir cartuchos monocromos en TV con paletas de color asignables de 16 colores y marcos personalizados.",
        games: ["Todo el catálogo original de Game Boy"]
      },
      {
        id: "snes-mouse",
        name: "Super NES Mouse",
        type: "Puntero periférico",
        year: 1992,
        technicalData: "Ratón de bola con dos botones",
        description: "Ratón mecánico de dos botones con alfombrilla rígida. Diseñado originalmente como interfaz creativa y luego adaptado a títulos de estrategia.",
        games: ["Mario Paint", "SimCity", "Jurassic Park"]
      }
    ]
  },
  {
    consoleId: "n64",
    consoleName: "Nintendo 64",
    year: 1996,
    accessories: [
      {
        id: "expansion-pak",
        name: "Expansion Pak",
        type: "Expansión de Memoria RAM",
        year: 1998,
        technicalData: "4 MB RDRAM adicional",
        description: "Módulo de memoria RAM adicional tipo RDRAM de 4 MB que se instalaba en la bahía frontal ('Jumper Pak bay'), duplicando la memoria del sistema de 4 MB a 8 MB. Permitía mayor resolución (hasta 640x480), distancia de dibujado ampliada y búferes complejos de geometría.",
        games: ["Donkey Kong 64 (Obligatorio)", "The Legend of Zelda: Majora's Mask (Obligatorio)", "Perfect Dark (Mejoras visuales)"]
      },
      {
        id: "rumble-pak",
        name: "Rumble Pak",
        type: "Vibración háptica",
        year: 1997,
        technicalData: "Motor excéntrico a batería",
        description: "Periférico pionero en la industria en introducir vibración háptica mediante motor excéntrico insertado en la ranura trasera del mando, alimentado por dos pilas AAA.",
        games: ["Star Fox 64", "The Legend of Zelda: Ocarina of Time"]
      },
      {
        id: "controller-pak",
        name: "Controller Pak",
        type: "Almacenamiento (Memory Card)",
        year: 1996,
        technicalData: "256 kilobits (32 KB) SRAM",
        description: "Tarjeta de memoria externa para guardado de partidas y datos fantasma en juegos que no utilizaban SRAM, EEPROM o memoria Flash interna en el cartucho.",
        games: ["Mario Kart 64 (Fantasmas)", "Turok: Dinosaur Hunter"]
      },
      {
        id: "transfer-pak",
        name: "Transfer Pak",
        type: "Adaptador de datos",
        year: 1998,
        technicalData: "Lector de cartuchos de Game Boy",
        description: "Adaptador que permitía conectar cartuchos de Game Boy y Game Boy Color al mando de N64 para transferir datos de partidas guardadas o desbloquear contenido especial.",
        games: ["Pokémon Stadium 1 y 2", "Mario Golf"]
      }
    ]
  },
  {
    consoleId: "gc",
    consoleName: "Nintendo GameCube",
    year: 2001,
    accessories: [
      {
        id: "broadband-adapter",
        name: "GameCube Broadband Adapter / Modem Adapter",
        type: "Conectividad de red",
        year: 2002,
        technicalData: "Banda ancha 10/100 Mbps / Módem 56k",
        description: "Conexión de red de banda ancha a 10/100 Mbps o módem de 56k instalables en la base. Pionero en multijugador local en red y funciones online primitivas.",
        games: ["Phantasy Star Online Episode I & II", "Mario Kart: Double Dash!! (Modo LAN)"]
      },
      {
        id: "gb-player",
        name: "Game Boy Player",
        type: "Adaptador de hardware",
        year: 2003,
        technicalData: "Hardware nativo GBA acoplable",
        description: "Base que se acoplaba a los puertos inferiores para ejecutar todo el catálogo de Game Boy, Game Boy Color y Game Boy Advance en pantalla grande sin emulación (mediante hardware idéntico a una GBA).",
        games: ["Todo el catálogo de GBA, GBC y GB"]
      },
      {
        id: "dk-bongos",
        name: "Bongós DK (DK Bongos)",
        type: "Controlador musical",
        year: 2003,
        technicalData: "Sensores de percusión y micrófono",
        description: "Mando en forma de barriles con sensores acústicos de membrana y micrófono central para detectar aplausos.",
        games: ["Donkey Konga", "Donkey Kong Jungle Beat"]
      },
      {
        id: "gba-link",
        name: "Cable GBA-GameCube",
        type: "Enlace asimétrico",
        year: 2001,
        technicalData: "Conexión GameCube a GBA",
        description: "Cable conector de enlace para usar la Game Boy Advance como pantalla secundaria interactiva, radar secreto o inventario independiente del televisor principal.",
        games: ["The Legend of Zelda: The Wind Waker", "The Legend of Zelda: Four Swords Adventures", "Final Fantasy Crystal Chronicles"]
      }
    ]
  },
  {
    consoleId: "wii",
    consoleName: "Nintendo Wii",
    year: 2006,
    accessories: [
      {
        id: "wii-wheel",
        name: "Wii Wheel",
        type: "Adaptador de control",
        year: 2008,
        technicalData: "Carcasa plástica ergonómica",
        description: "Volante plástico ergonómico en el cual se acoplaba el Wii Remote para aprovechar el acelerómetro de 3 ejes, ofreciendo conducción por inclinación intuitiva y democrática.",
        games: ["Mario Kart Wii"]
      },
      {
        id: "wii-motionplus",
        name: "Wii MotionPlus",
        type: "Expansión de sensores",
        year: 2009,
        technicalData: "Giróscopo multieje de diapasón",
        description: "Periférico adaptador (y posteriormente integrado) con giróscopo multieje de diapasón que permitía una captura 1:1 de la rotación y orientación en el espacio tridimensional.",
        games: ["The Legend of Zelda: Skyward Sword", "Wii Sports Resort", "Red Steel 2"]
      },
      {
        id: "wii-balance-board",
        name: "Wii Balance Board",
        type: "Plataforma de peso",
        year: 2007,
        technicalData: "Cuatro transductores de fuerza",
        description: "Plataforma con cuatro transductores de fuerza sensibles a la presión para medir el centro de gravedad, distribución del peso y masa del usuario en tiempo real.",
        games: ["Wii Fit", "Wii Fit Plus", "Shaun White Snowboarding"]
      },
      {
        id: "wii-zapper",
        name: "Wii Zapper",
        type: "Adaptador de control",
        year: 2007,
        technicalData: "Armazón unificador de mandos",
        description: "Carcasa estilo subfusil para alojar el Wii Remote y Nunchuk simultáneamente, optimizando la ergonomía en shooters sobre raíles.",
        games: ["Link's Crossbow Training", "Resident Evil: The Umbrella Chronicles"]
      }
    ]
  },
  {
    consoleId: "wiiu",
    consoleName: "Nintendo Wii U",
    year: 2012,
    accessories: [
      {
        id: "gc-adapter-wiiu",
        name: "Adaptador de Mandos de GameCube para Wii U",
        type: "Interfaz USB de legado",
        year: 2014,
        technicalData: "Hub USB para 4 puertos nativos",
        description: "Dispositivo USB de dos puertos que permitía conectar hasta 4 mandos originales de GameCube para juego competitivo sin latencia, respondiendo a la demanda de la comunidad de juegos de lucha.",
        games: ["Super Smash Bros. for Wii U"]
      },
      {
        id: "amiibo-reader",
        name: "Lector/Escritor NFC de amiibo (Para modelos antiguos)",
        type: "Comunicación NFC",
        year: 2015,
        technicalData: "Escáner y escritor RFID/NFC",
        description: "Módulo inalámbrico infrarrojo utilizado mayormente en consolas de la familia Nintendo 3DS antiguas para habilitar compatibilidad de figuras interactivas amiibo (integrado de serie en Wii U).",
        games: ["Super Smash Bros.", "Animal Crossing: Amiibo Festival"]
      }
    ]
  },
  {
    consoleId: "switch",
    consoleName: "Nintendo Switch",
    year: 2017,
    accessories: [
      {
        id: "pro-controller",
        name: "Nintendo Switch Pro Controller",
        type: "Controlador Premium",
        year: 2017,
        technicalData: "Vibración HD, Giróscopo, Lector NFC, 1300 mAh",
        description: "Mando tradicional premium ergonómico con sticks asimétricos, vibración HD (mediante actuadores lineales de resonancia), lector NFC para amiibo, giroscopio avanzado y batería de ion-litio de 1300 mAh con hasta 40 horas de autonomía. Universal y global.",
        games: ["Super Smash Bros. Ultimate", "The Legend of Zelda: Tears of the Kingdom", "Monster Hunter Rise"]
      },
      {
        id: "joycon-wheel",
        name: "Joy-Con Wheel",
        type: "Adaptador de control",
        year: 2017,
        technicalData: "Botones SL/SR ensanchados",
        description: "Set de volantes compactos para los Joy-Con individuales que mejora el agarre y agranda el perfil de los botones laterales internos (SL/SR).",
        games: ["Mario Kart 8 Deluxe"]
      },
      {
        id: "nintendo-labo",
        name: "Nintendo Labo (Toy-Con kits)",
        type: "Kits de construcción / Robótica de cartón",
        year: 2018,
        technicalData: "Ingeniería de cartón acoplada al sensor IR Joy-Con",
        description: "Láminas de cartón pre-cortadas combinadas con el sensor de cámara infrarroja del Joy-Con derecho (para detectar marcadores reflectantes) para construir periféricos interactivos complejos: un piano funcional, una caña de pescar, un visor VR y más.",
        games: ["Nintendo Labo Variety Kit", "Nintendo Labo Robot Kit", "Nintendo Labo VR Kit"]
      },
      {
        id: "ring-con",
        name: "Ring-Con y Correa de la pierna",
        type: "Periférico de Fitness",
        year: 2019,
        technicalData: "Anillo de resistencia con sensor de tensión",
        description: "Aro de pilates de alta resistencia equipado con un sensor de deformación/tensión que lee con precisión la fuerza de compresión y estiramiento, interactuando de la mano con el giróscopo del Joy-Con y la correa sujeta al muslo para registrar carreras.",
        games: ["Ring Fit Adventure"]
      }
    ]
  }
];
