/**
 * js/music-data.js
 * Base de datos estructurada con el catálogo oficial de Lo Micro TD
 */

const musicDatabase = [
    {
        id: "track-001",
        title: "Cafuné (Soul Version)",
        year: 2021,
        duration: "3:42",
        type: "single", // single, feat, acoustic
        role: "Intérprete principal",
        producer: "Ovy On The Drums / The Dog House",
        coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        spotifyUrl: "https://open.spotify.com",
        youtubeUrl: "https://youtube.com",
        lyrics: `
(Verso 1)
Y aunque sé que no es tan fácil,
decidiste caminar por el borde de mi piel.
Un roce lento, casi frágil,
y la noche nos vistió con sabor a miel.

(Coro)
Hazme un cafuné, de esos que me hacen volar,
que detienen el tiempo y me obligan a pensar.
Que no hay nada más afuera,
solo tu respiración y esta primavera...`
    },
    {
        id: "track-002",
        title: "Bésame Sin Sentir",
        year: 2020,
        duration: "4:15",
        type: "single",
        role: "Intérprete principal / Co-autora",
        producer: "The Dog House",
        coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        spotifyUrl: "https://open.spotify.com",
        youtubeUrl: "https://youtube.com",
        lyrics: `
(Verso 1)
Bésame sin sentir, solo por esta noche.
Deja que el orgullo se pierda en el coche.
No quiero promesas, no quiero mañana,
solo el calor que entra por la ventana...`
    },
    {
        id: "track-003",
        title: "Te Vi (Versión R&B)",
        year: 2019,
        duration: "3:58",
        type: "feat",
        role: "Featuring (con Piso 21)",
        producer: "Ovy On The Drums",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        spotifyUrl: "https://open.spotify.com",
        youtubeUrl: "https://youtube.com",
        lyrics: `
(Pre-Coro: Lo Micro TD)
Y yo te vi, estabas tan diferente,
ya no eres la misma que jugaba con mi mente.
Ahora brillas sola, sin necesidad de gente,
pero aquí estoy yo, extrañándote de repente.`
    },
    {
        id: "track-004",
        title: "Aquí Estoy (Acústico)",
        year: 2022,
        duration: "4:30",
        type: "acoustic",
        role: "Intérprete principal",
        producer: "Sesiones de Estudio",
        coverUrl: "https://images.unsplash.com/photo-1520446266423-6daca23fe8c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        spotifyUrl: "https://open.spotify.com",
        youtubeUrl: "https://youtube.com",
        lyrics: `
(Verso Único)
Solo una guitarra y mi voz rota,
contando las horas, sintiendo cada nota.
Si alguna vez dudaste, escucha esta verdad,
aquí sigo firme, buscando libertad.`
    },
    {
        id: "track-005",
        title: "Dime Cuántas Veces",
        year: 2020,
        duration: "3:20",
        type: "feat",
        role: "Featuring (con Rels B)",
        producer: "Itchy & Buco",
        coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        spotifyUrl: "https://open.spotify.com",
        youtubeUrl: "https://youtube.com",
        lyrics: `
(Coro)
Dime cuántas veces tengo que caer,
para darme cuenta que no vas a volver.
Dime si las noches te saben a hiel,
cuando buscas en otro lo que había en mi piel.`
    },
    {
        id: "track-006",
        title: "Confianza",
        year: 2023,
        duration: "3:10",
        type: "single",
        role: "Intérprete principal / Autora",
        producer: "The Dog House",
        coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        spotifyUrl: "https://open.spotify.com",
        youtubeUrl: "https://youtube.com",
        lyrics: `
(Verso 1)
La confianza se rompe como cristal fino,
te perdiste en la curva de este camino.
Ya no quiero excusas, guarda tu veneno,
yo sigo mi rumbo, el cielo está sereno.`
    }
];

// Hacer la base de datos accesible globalmente
window.LoMicroTDCatalog = musicDatabase;
