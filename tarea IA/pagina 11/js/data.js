const animeData = [
    {
        id: "arc-1",
        title: "Arco de la Rebelión Inicial",
        episodes: [
            { id: 1, number: 1, title: "El despertar del núcleo", type: "canon", synopsis: "Kael descubre su afinidad con la energía del núcleo durante un ataque inesperado a su aldea.", date: "2024-01-05", introduces: "Kael, Lyra" },
            { id: 2, number: 2, title: "Huida hacia las montañas", type: "canon", synopsis: "Perseguidos por la Guardia de Élite, los sobrevivientes buscan refugio en las montañas sagradas.", date: "2024-01-12", introduces: "Comandante Vane" },
            { id: 3, number: 3, title: "El festival de las luces", type: "filler", synopsis: "Los protagonistas toman un descanso para celebrar un festival local, olvidando temporalmente su misión.", date: "2024-01-19", introduces: "Ninguno" },
            { id: 4, number: 4, title: "Entrenamiento acelerado", type: "mixed", synopsis: "Kael entrena sus nuevas habilidades mientras los aldeanos preparan una defensa. Contiene escenas exclusivas.", date: "2024-01-26", introduces: "Maestro Jin" },
            { id: 5, number: 5, title: "El origen de la Guardia", type: "anime-canon", synopsis: "Un vistazo al pasado del Comandante Vane y cómo se formó la Guardia de Élite.", date: "2024-02-02", introduces: "Rey Oscuro" },
            { id: 6, number: 6, title: "Asalto a la fortaleza", type: "canon", synopsis: "El grupo lanza un ataque desesperado para rescatar a los prisioneros de la aldea.", date: "2024-02-09", introduces: "Ninguno" }
        ]
    },
    {
        id: "arc-2",
        title: "Arco del Torneo de las Sombras",
        episodes: [
            { id: 7, number: 7, title: "Invitación letal", type: "canon", synopsis: "Para obtener información sobre el paradero de la resistencia, Kael debe participar en un torneo clandestino.", date: "2024-02-16", introduces: "Jax el Sombrío" },
            { id: 8, number: 8, title: "Primera ronda: Bestias", type: "canon", synopsis: "El primer desafío enfrenta a Kael contra bestias mutadas por el núcleo inestable.", date: "2024-02-23", introduces: "Ninguno" },
            { id: 9, number: 9, title: "Recuerdos perdidos", type: "filler", synopsis: "Un episodio de recapitulación narrado desde la perspectiva del robot acompañante de Lyra.", date: "2024-03-01", introduces: "Ninguno" },
            { id: 10, number: 10, title: "Semifinales sangrientas", type: "canon", synopsis: "Kael se enfrenta a Jax en una batalla que pondrá a prueba sus límites físicos y morales.", date: "2024-03-08", introduces: "Ninguno" },
            { id: 11, number: 11, title: "Una alianza inesperada", type: "mixed", synopsis: "Mientras el torneo concluye, Lyra forma una alianza con desertores de la Guardia.", date: "2024-03-15", introduces: "Capitana Elara" },
            { id: 12, number: 12, title: "El verdadero premio", type: "canon", synopsis: "El torneo fue una trampa. Comienza la verdadera batalla por el control del artefacto.", date: "2024-03-22", introduces: "Ninguno" }
        ]
    },
    {
        id: "arc-3",
        title: "Arco de la Ciudad Flotante",
        episodes: [
            { id: 13, number: 13, title: "Ascenso a los cielos", type: "canon", synopsis: "El grupo logra acceder a la mítica ciudad de Aethelgard usando la energía del núcleo.", date: "2024-03-29", introduces: "Consejo de Ancianos" },
            { id: 14, number: 14, title: "Laberinto de cristal", type: "anime-canon", synopsis: "Para llegar al consejo, deben atravesar una prueba de ilusiones basada en sus peores miedos.", date: "2024-04-05", introduces: "Ninguno" },
            { id: 15, number: 15, title: "Día de compras", type: "filler", synopsis: "Lyra y Elara pasan el día comprando suministros y ropa nueva en el distrito comercial.", date: "2024-04-12", introduces: "Ninguno" },
            { id: 16, number: 16, title: "La traición", type: "canon", synopsis: "Alguien del grupo revela su verdadera lealtad, poniendo a todos en grave peligro.", date: "2024-04-19", introduces: "Ninguno" },
            { id: 17, number: 17, title: "Caída", type: "canon", synopsis: "La ciudad flotante empieza a colapsar tras la destrucción de su generador principal.", date: "2024-04-26", introduces: "Ninguno" }
        ]
    }
];

// Tipos de episodios y sus configuraciones
const episodeTypes = {
    "canon": { label: "Manga Canon", color: "#39FF14", class: "type-canon" },
    "filler": { label: "Relleno", color: "#FF003C", class: "type-filler" },
    "mixed": { label: "Mixto Canon/Relleno", color: "#FFE600", class: "type-mixed" },
    "anime-canon": { label: "Anime Canon", color: "#00F0FF", class: "type-anime-canon" }
};
