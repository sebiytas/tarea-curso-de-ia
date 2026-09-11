/**
 * Base de Datos de Catálogo - Ciara Creativa
 * Inventario estructurado con las publicaciones de prueba (ES Module adaptado para entorno local sin build).
 */

const catalogData = [
    {
        id: "ag-001",
        name: 'Agenda Ejecutiva Floral "Aura Dorada"',
        category: "Personalizadas",
        categoryLabel: "Personalizada a Mano",
        price: "$32.00 USD",
        size: "A5 (15 x 21 cm)",
        paper: "Ahuesado 106 gr/m² (180 páginas)",
        binding: "Wire-o Oro Rosado, Tapa Dura Laminada Mate",
        closure: "Elástico de Lurex Brillante",
        extras: "Bolsillo doble kraft, Cinta señaladora de raso, Set de stickers funcionales, Foil dorado en nombre",
        description: "Diseñada para quienes buscan elegancia y orden. Personalizable en la portada con tu nombre o frase motivacional favorita. Apta para pluma estilográfica y bolígrafos de gel sin traspaso.",
        // Representación visual vectorial
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23F7E7E5'/%3E%3Crect x='100' y='30' width='160' height='240' rx='8' fill='%23362E2B'/%3E%3Crect x='110' y='40' width='140' height='220' rx='4' fill='%23DE8F8F'/%3E%3Ccircle cx='180' cy='150' r='45' fill='none' stroke='%23D4A373' stroke-width='3'/%3E%3Cpath d='M100 60 h-10 v10 h10 z M100 90 h-10 v10 h10 z M100 120 h-10 v10 h10 z M100 150 h-10 v10 h10 z M100 180 h-10 v10 h10 z M100 210 h-10 v10 h10 z M100 240 h-10 v10 h10 z' fill='%23D4A373'/%3E%3Ctext x='180' y='155' font-family='serif' font-size='18' text-anchor='middle' fill='%23FFFDF9'%3EAura Dorada%3C/text%3E%3C/svg%3E"
    },
    {
        id: "ag-002",
        name: 'Agenda Sencilla Pastel "Minimal Rose"',
        category: "Sencillas",
        categoryLabel: "Clásica Diaria",
        price: "$18.00 USD",
        size: "B6 Compacto (12.5 x 17.6 cm)",
        paper: "Bond Blanco Extra Suave 90 gr/m² (120 páginas)",
        binding: "Espiral Blanco Perlado, Tapas Blandas Reforzadas",
        closure: "Goma Elástica Rosa Empolvado",
        extras: "Esquinas redondeadas, Formato perpetuo (comienza cuando quieras), Semana a la vista",
        description: "Ligera, práctica y lista para acompañarte todos los días. La opción ideal para un ritmo de organización directo, sin complicaciones y con estética limpia.",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23FFFDF9'/%3E%3Crect x='120' y='40' width='140' height='220' rx='15' fill='%23F7E7E5'/%3E%3Cpath d='M120 60 h-10 v10 h10 z M120 90 h-10 v10 h10 z M120 120 h-10 v10 h10 z M120 150 h-10 v10 h10 z M120 180 h-10 v10 h10 z M120 210 h-10 v10 h10 z M120 240 h-10 v10 h10 z' fill='%23E2E2E2'/%3E%3Crect x='245' y='40' width='5' height='220' fill='%23DE8F8F'/%3E%3Ctext x='180' y='155' font-family='sans-serif' font-weight='bold' font-size='16' text-anchor='middle' fill='%23786C66'%3EMinimal Rose%3C/text%3E%3C/svg%3E"
    },
    {
        id: "ag-003",
        name: 'Directorio Telefónico & Libreta "Nostalgia Botánica"',
        category: "Telefonicas",
        categoryLabel: "Edición Clásica",
        price: "$22.00 USD",
        size: "Mediano (14 x 20 cm)",
        paper: "Marfil 120 gr/m² (160 páginas)",
        binding: "Anillado Oculto, Tapa Dura forrada en tela rosa pálido",
        closure: "Sin cierre (Estilo libro clásico)",
        extras: "Cantoneras metálicas de latón, Pestañas alfabéticas plastificadas A-Z",
        description: "El rescate analógico que todo hogar y oficina merece. Conserva a mano los contactos más importantes de tu familia, amigos y clientes sin temor a perderlos por fallas digitales.",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23FBF4F2'/%3E%3Crect x='110' y='30' width='160' height='240' rx='2' fill='%23DE8F8F'/%3E%3Cpath d='M110 30 l15 0 l0 15 l-15 0 z M255 30 l15 0 l0 15 l-15 0 z M110 255 l15 0 l0 15 l-15 0 z M255 255 l15 0 l0 15 l-15 0 z' fill='%23D4A373'/%3E%3Crect x='270' y='60' width='12' height='25' fill='%23FFFDF9'/%3E%3Crect x='270' y='95' width='12' height='25' fill='%23FFFDF9'/%3E%3Crect x='270' y='130' width='12' height='25' fill='%23FFFDF9'/%3E%3Ctext x='190' y='155' font-family='serif' font-size='22' font-style='italic' text-anchor='middle' fill='%23FFFDF9'%3ENostalgia%3C/text%3E%3C/svg%3E"
    },
    {
        id: "ag-004",
        name: 'Agenda Diaria "Un Día a la Vez // Crema & Canela"',
        category: "Sencillas",
        categoryLabel: "Día por Página",
        price: "$26.00 USD",
        size: "A5 Estándar (15 x 21 cm)",
        paper: "Bookcel Ahuesado 80 gr/m² (365 páginas)",
        binding: "Doble Anillado Bronce Vintage, Portada Dura Soft-Touch",
        closure: "Banda Elástica Color Teja",
        extras: "Control de citas por horas, cuadro de prioridades diarias, registro de hidratación",
        description: "Para quienes necesitan espacio ilimitado para escribir, anotar reuniones y hacer listas diarias extensas. Cada página es un lienzo en blanco para tu rutina diaria.",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23FFFDF9'/%3E%3Crect x='100' y='30' width='160' height='240' rx='5' fill='%23C76B6B'/%3E%3Cpath d='M95 50 h10 v10 h-10 z M95 75 h10 v10 h-10 z M95 100 h10 v10 h-10 z M95 125 h10 v10 h-10 z M95 150 h10 v10 h-10 z M95 175 h10 v10 h-10 z M95 200 h10 v10 h-10 z M95 225 h10 v10 h-10 z M95 250 h10 v10 h-10 z' fill='%238C5B3E'/%3E%3Crect x='240' y='30' width='8' height='240' fill='%238C5B3E'/%3E%3Ctext x='170' y='155' font-family='sans-serif' font-size='16' text-anchor='middle' fill='%23FFFDF9'%3EUn Día a la Vez%3C/text%3E%3C/svg%3E"
    }
];

// Exportación global explícita para evitar CORS en file:// protocol
window.catalogData = catalogData;
