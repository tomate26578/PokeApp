export const situacionesBatalla = {
  inicio: {
    titulo: "Turno 1",
    texto: "Tu Pokémon quedó con poca energía tras el primer golpe del rival. Te queda una poción. ¿Qué hacés?",
    opciones: [
      { texto: "Atacar", siguiente: "despuesDelAtaque" },
      { texto: "Usar poción", siguiente: "despuesDeLaPocion" },
    ],
  },
  despuesDelAtaque: {
    titulo: "Turno 2",
    texto: "Tu ataque dejó al rival a un golpe de caer. Tenés tiempo para actuar antes de que se recupere.",
    opciones: [
      { texto: "Atacar de nuevo", siguiente: "victoria" },
      { texto: "Usar poción", siguiente: "derrota" },
    ],
  },
  despuesDeLaPocion: {
    titulo: "Turno 2",
    texto: "Tu Pokémon recuperó energía. Mientras se curaba, el rival preparó un ataque fuerte.",
    opciones: [
      { texto: "Atacar de frente", siguiente: "derrota" },
      { texto: "Esquivar y contraatacar", siguiente: "victoria" },
    ],
  },
  victoria: {
    titulo: "¡Ganaste!",
    texto: "Tu Pokémon dio el golpe final y el rival se quedó sin energía.",
    opciones: [],
  },
  derrota: {
    titulo: "Ganó el rival",
    texto: "El rival acertó el último golpe y tu Pokémon se quedó sin energía.",
    opciones: [],
  },
};
