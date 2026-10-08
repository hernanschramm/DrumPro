// ============================================================
// DrumPro Academy - Catálogo de Grooves por Estilo
// Fase 6: Biblioteca y Metrónomo
// Grooves clasificados por estilo y dificultad
// ============================================================

import { Groove } from '../../../types/academy';

export const GROOVES_CATALOG: Groove[] = [
  // ROCK
  {
    id: 'groove-rock-1',
    nombre: 'Rock Básico',
    estilo: 'Rock',
    dificultad: 'basico',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 100,
    descripcion: 'El groove de rock más básico. Bombo en 1 y 3, caja en 2 y 4, hi-hat en corcheas.',
  },
  {
    id: 'groove-rock-2',
    nombre: 'Rock con Bombo Doble',
    estilo: 'Rock',
    dificultad: 'intermedio',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 110,
    descripcion: 'Rock con bombo en cada tiempo. Más energía y drive.',
  },
  {
    id: 'groove-rock-3',
    nombre: 'Rock con Hi-Hat Abierto',
    estilo: 'Rock',
    dificultad: 'intermedio',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      hihatOpen: [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
    },
    bpmSugerido: 120,
    descripcion: 'Rock con hi-hat abierto en el "and" de 2 y 4.',
  },

  // POP
  {
    id: 'groove-pop-1',
    nombre: 'Pop Básico',
    estilo: 'Pop',
    dificultad: 'basico',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 100,
    descripcion: 'Groove pop limpio y directo. Base para muchos estilos.',
  },
  {
    id: 'groove-pop-2',
    nombre: 'Pop con Ghost Notes',
    estilo: 'Pop',
    dificultad: 'intermedio',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      snare: [0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 95,
    descripcion: 'Pop con ghost notes en la caja. Añade groove y movimiento.',
  },

  // FUNK
  {
    id: 'groove-funk-1',
    nombre: 'Funk Básico',
    estilo: 'Funk',
    dificultad: 'basico',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hihat: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    },
    bpmSugerido: 95,
    descripcion: 'Funk con bombo sincopado y hi-hat en semicorcheas.',
  },
  {
    id: 'groove-funk-2',
    nombre: 'Funk con Hi-Hat Abierto',
    estilo: 'Funk',
    dificultad: 'intermedio',
    compas: '4/4',
    patron: {
      kick: [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      hihatOpen: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    },
    bpmSugerido: 100,
    descripcion: 'Funk con hi-hat abierto y cerrado alternados.',
  },
  {
    id: 'groove-funk-3',
    nombre: 'Funk Avanzado',
    estilo: 'Funk',
    dificultad: 'avanzado',
    compas: '4/4',
    patron: {
      kick: [1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0],
      snare: [0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,1],
      hihat: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    },
    bpmSugerido: 105,
    descripcion: 'Funk complejo con bombo y caja muy sincopados.',
  },

  // BLUES
  {
    id: 'groove-blues-1',
    nombre: 'Shuffle Básico',
    estilo: 'Blues',
    dificultad: 'basico',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      ride: [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
    },
    bpmSugerido: 80,
    descripcion: 'Shuffle clásico de blues con patrón de tresillo en el ride.',
  },
  {
    id: 'groove-blues-2',
    nombre: 'Slow Blues',
    estilo: 'Blues',
    dificultad: 'intermedio',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      ride: [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
    },
    bpmSugerido: 60,
    descripcion: 'Blues lento con bombo sincopado y ride constante.',
  },

  // JAZZ
  {
    id: 'groove-jazz-1',
    nombre: 'Jazz Ride Básico',
    estilo: 'Jazz',
    dificultad: 'basico',
    compas: '4/4',
    patron: {
      ride: [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
      hihat: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    },
    bpmSugerido: 140,
    descripcion: 'Patrón básico de ride jazz con hi-hat en 2 y 4.',
  },
  {
    id: 'groove-jazz-2',
    nombre: 'Jazz con Feathering',
    estilo: 'Jazz',
    dificultad: 'intermedio',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
      ride: [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
      hihat: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    },
    bpmSugerido: 150,
    descripcion: 'Jazz con feathering (bombo suave) en tiempos 1 y 3.',
  },

  // LATINO
  {
    id: 'groove-latino-1',
    nombre: 'Bossa Nova',
    estilo: 'Latino',
    dificultad: 'intermedio',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
      snare: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      crossStick: [0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0],
    },
    bpmSugerido: 120,
    descripcion: 'Bossa nova con patrón de cross-stick y hi-hat constante.',
  },
  {
    id: 'groove-latino-2',
    nombre: 'Salsa Básico',
    estilo: 'Latino',
    dificultad: 'intermedio',
    compas: '4/4',
    patron: {
      kick: [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 180,
    descripcion: 'Salsa con patrón de clave 3-2 y bombo sincopado.',
  },

  // METAL
  {
    id: 'groove-metal-1',
    nombre: 'Metal Básico',
    estilo: 'Metal',
    dificultad: 'basico',
    compas: '4/4',
    patron: {
      kick: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 160,
    descripcion: 'Metal con bombo en corcheas y hi-hat constante.',
  },
  {
    id: 'groove-metal-2',
    nombre: 'Blast Beat',
    estilo: 'Metal',
    dificultad: 'avanzado',
    compas: '4/4',
    patron: {
      kick: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      snare: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 180,
    descripcion: 'Blast beat con bombo, caja y hi-hat en semicorcheas.',
  },
  {
    id: 'groove-metal-3',
    nombre: 'Double Bass Metal',
    estilo: 'Metal',
    dificultad: 'avanzado',
    compas: '4/4',
    patron: {
      kick: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      ride: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    },
    bpmSugerido: 200,
    descripcion: 'Metal con doble bombo en semicorcheas y ride constante.',
  },

  // REGGAE
  {
    id: 'groove-reggae-1',
    nombre: 'One Drop',
    estilo: 'Reggae',
    dificultad: 'basico',
    compas: '4/4',
    patron: {
      kick: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 80,
    descripcion: 'Reggae one drop con bombo y caja juntos en el tiempo 3.',
  },
  {
    id: 'groove-reggae-2',
    nombre: 'Steppers',
    estilo: 'Reggae',
    dificultad: 'intermedio',
    compas: '4/4',
    patron: {
      kick: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 85,
    descripcion: 'Reggae steppers con bombo en cada tiempo.',
  },

  // PUNK
  {
    id: 'groove-punk-1',
    nombre: 'Punk Rock',
    estilo: 'Punk',
    dificultad: 'basico',
    compas: '4/4',
    patron: {
      kick: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
      snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
      hihat: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    },
    bpmSugerido: 180,
    descripcion: 'Punk rápido con bombo en corcheas y hi-hat constante.',
  },

  // FUSION
  {
    id: 'groove-fusion-1',
    nombre: 'Fusion Básico',
    estilo: 'Fusion',
    dificultad: 'intermedio',
    compas: '4/4',
    patron: {
      kick: [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],
      snare: [0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],
      hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    },
    bpmSugerido: 120,
    descripcion: 'Fusion con bombo sincopado y caja con ghost notes.',
  },
  {
    id: 'groove-fusion-2',
    nombre: 'Odd Meter Fusion',
    estilo: 'Fusion',
    dificultad: 'avanzado',
    compas: '7/8',
    patron: {
      kick: [1,0,0,1,0,0,1],
      snare: [0,0,1,0,0,1,0],
      hihat: [1,1,1,1,1,1,1],
    },
    bpmSugerido: 140,
    descripcion: 'Fusion en compás impar de 7/8.',
  },
];
