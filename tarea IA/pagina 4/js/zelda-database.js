/**
 * js/zelda-database.js
 * Base de datos estática integral de la saga The Legend of Zelda.
 * Incluye todos los títulos principales y canónicos hasta 2024.
 */

const ZeldaDatabase = [
    {
        id: "loz-1986",
        title: "The Legend of Zelda",
        year: 1986,
        platform: "NES",
        era: "Aventura 2D Clásica",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "El reino de Hyrule ha sido invadido por Ganon, quien ha robado la Trifuerza del Poder. La Princesa Zelda dividió la Trifuerza de la Sabiduría en ocho fragmentos antes de ser capturada. Un joven llamado Link debe reunir los fragmentos para derrotar a Ganon.",
        innovations: [
            "Introducción del guardado interno mediante batería.",
            "Diseño de mundo abierto no lineal en consolas de sobremesa.",
            "Concepto base de exploración, recolección de objetos y mazmorras."
        ]
    },
    {
        id: "zal-1987",
        title: "Zelda II: The Adventure of Link",
        year: 1987,
        platform: "NES",
        era: "Aventura 2D Clásica",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "Años después del primer juego, Link descubre la existencia de una Trifuerza del Valor oculta y debe despertar a una antigua Princesa Zelda de un sueño eterno provocado por un hechizo, mientras los seguidores de Ganon buscan revivirlo.",
        innovations: [
            "Perspectiva lateral (side-scrolling) para combates y ciudades.",
            "Sistema de progresión RPG con experiencia, niveles y magia.",
            "Mayor énfasis en el combate cuerpo a cuerpo y esquiva."
        ]
    },
    {
        id: "alttp-1991",
        title: "The Legend of Zelda: A Link to the Past",
        year: 1991,
        platform: "SNES",
        era: "Aventura 2D Clásica",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "El malvado mago Agahnim usurpa el trono de Hyrule para liberar a Ganon de su prisión en el Reino Sagrado. Link debe rescatar a las doncellas descendientes de los sabios navegando entre el Mundo de la Luz y el Mundo Oscuro.",
        innovations: [
            "Dualidad de mundos interactivos (Mundo de la Luz y Mundo Oscuro).",
            "Creación de la Espada Maestra (Master Sword).",
            "Estructura narrativa en tres actos que definió el canon de la franquicia."
        ]
    },
    {
        id: "la-1993",
        title: "The Legend of Zelda: Link's Awakening",
        year: 1993,
        platform: "Game Boy",
        era: "Aventura 2D Clásica",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "Tras naufragar, Link despierta en la misteriosa Isla Koholint. Para escapar y volver a Hyrule, debe despertar al Pez Viento recogiendo ocho instrumentos musicales, descubriendo lentamente el trágico secreto de la isla.",
        innovations: [
            "Trama profunda y melancólica sin la Trifuerza, Zelda ni Ganon.",
            "Primera entrega portátil con asignación dinámica de dos botones para cualquier objeto.",
            "Incorporación de personajes de otras franquicias (como Goombas y Yoshi)."
        ]
    },
    {
        id: "oot-1998",
        title: "The Legend of Zelda: Ocarina of Time",
        year: 1998,
        platform: "Nintendo 64",
        era: "Revolución 3D",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "El joven Link del Bosque Kokiri viaja en el tiempo para evitar que Ganondorf, el Rey Gerudo, conquiste Hyrule tras obtener el poder absoluto de la Trifuerza del Reino Sagrado.",
        innovations: [
            "Transición pionera al 3D con el sistema de fijado Z-Targeting.",
            "Botones contextuales dinámicos que simplificaron los controles.",
            "Mecánica de viaje temporal entre la infancia y adultez alterando el entorno."
        ]
    },
    {
        id: "mm-2000",
        title: "The Legend of Zelda: Majora's Mask",
        year: 2000,
        platform: "Nintendo 64",
        era: "Revolución 3D",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "En la región de Términa, Link se enfrenta a un apocalipsis inminente: la luna caerá en tres días. Usando la Ocarina, deberá retroceder en el tiempo perpetuamente para curar a los espíritus y detener a Skull Kid.",
        innovations: [
            "Ciclo temporal estricto de tres días interactivos.",
            "Sistema de transformaciones físicas mediante máscaras (Deku, Goron, Zora).",
            "Narrativa existencialista con rutinas diarias complejas para todos los NPCs."
        ]
    },
    {
        id: "ww-2002",
        title: "The Legend of Zelda: The Wind Waker",
        year: 2002,
        platform: "GameCube",
        era: "Revolución 3D",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "Hyrule yace inundado bajo un Gran Mar. Un joven isleño se embarca para rescatar a su hermana, aliándose con piratas y un barco parlante para enfrentarse al regreso de Ganondorf.",
        innovations: [
            "Gráficos estilo Cel-Shading hiper-expresivos e imperecederos.",
            "Navegación oceánica de mundo continuo disimulando cargas en tiempo real.",
            "Control direccional del viento para navegación y resolución de puzles."
        ]
    },
    {
        id: "tp-2006",
        title: "The Legend of Zelda: Twilight Princess",
        year: 2006,
        platform: "Wii / GameCube",
        era: "Revolución 3D",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "Hyrule es absorbido por el Reino del Crepúsculo. Link, convertido en un lobo en estas zonas oscuras, se alía con la enigmática Midna para derrotar a Zant y restaurar la luz del mundo.",
        innovations: [
            "Combate kinestésico mediante controles por movimiento (Wii).",
            "Transformación en bestia (lobo) con mecánicas de instinto y sentidos ampliados.",
            "Dirección de arte realista oscura y épica solicitada por los fans."
        ]
    },
    {
        id: "ss-2011",
        title: "The Legend of Zelda: Skyward Sword",
        year: 2011,
        platform: "Wii",
        era: "Revolución 3D",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "La primera entrega cronológica de la historia. Link debe descender de la isla flotante de Altárea (Skyloft) hacia la superficie olvidada para rescatar a Zelda y forjar la Espada Maestra.",
        innovations: [
            "Combate con espada direccional 1:1 mediante Wii MotionPlus.",
            "Sistema de resistencia (estamina) para esprintar y trepar.",
            "Diseño de nivel condensado: el overworld exterior funcionaba como una mazmorra gigante."
        ]
    },
    {
        id: "botw-2017",
        title: "The Legend of Zelda: Breath of the Wild",
        year: 2017,
        platform: "Nintendo Switch / Wii U",
        era: "Era Mundo Abierto / Sistémico",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "Tras un sueño de 100 años, Link despierta sin recuerdos en un Hyrule devastado por Ganon el Cataclismo. Debe recuperar su fuerza y liberar a las Bestias Divinas para asaltar el Castillo de Hyrule.",
        innovations: [
            "Motor químico unificado (interacción emergente de fuego, viento, electricidad, agua).",
            "Escalada topográfica universal sin barreras artificiales.",
            "Libertad narrativa total: el objetivo final es accesible desde el minuto uno."
        ]
    },
    {
        id: "totk-2023",
        title: "The Legend of Zelda: Tears of the Kingdom",
        year: 2023,
        platform: "Nintendo Switch",
        era: "Era Mundo Abierto / Sistémico",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d8df3863283014924ed9ac7bea3558d4a984fd4c34fb5d7c8fc3",
        synopsis: "Tras descubrir un cadáver momificado bajo el Castillo de Hyrule, el reino se fragmenta y asciende a los cielos. Link debe dominar nuevas habilidades rúnicas para encontrar a Zelda y reconstruir el mundo fragmentado.",
        innovations: [
            "Sistema de creación y construcción de vehículos/mecanismos libres (Ultramano).",
            "Fusión de objetos para alterar armas y escudos (Combinación).",
            "Mundo tridimensional absoluto con archipiélagos celestes y un subsuelo inmenso."
        ]
    },
    {
        id: "eow-2024",
        title: "The Legend of Zelda: Echoes of Wisdom",
        year: 2024,
        platform: "Nintendo Switch",
        era: "Remakes & Re-imaginaciones",
        cover: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_800/b_white/f_auto/q_auto/ncom/software/switch/70010000084614/b9b78eaf28359fbaacb2f3e827a51cc20f2623a9d29ef19e49a0ad99238e8ec4",
        synopsis: "Tras la desaparición de Link y del mismísimo Rey de Hyrule en unas extrañas grietas moradas, la Princesa Zelda toma el mando. Usando el Cetro de Tri, debe resolver los misterios de su reino fracturado.",
        innovations: [
            "Primer juego principal donde la Princesa Zelda es la protagonista jugable y canónica.",
            "Sistema de \"Ecos\" que permite clonar monstruos y objetos del entorno para el combate y puzles.",
            "Fusión de las lógicas sistémicas de TotK en el formato 2D clásico top-down."
        ]
    }
];

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { ZeldaDatabase };
}
