import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import {
  BarChart2,
  Activity,
  FileText,
  Settings,
  ShieldAlert,
  UploadCloud,
  Trash2,
  CheckCircle2,
  Trophy,
  Globe,
  Users,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// CONFIGURACIÓN DE FIREBASE CONECTADA
const firebaseConfig = {
  apiKey: "AIzaSyCRFpHmcNmGVxg9Zq56hrHe_twwKEfs0lQ",
  authDomain: "sele-colombia-femenina-mayores.firebaseapp.com",
  projectId: "sele-colombia-femenina-mayores",
  storageBucket: "sele-colombia-femenina-mayores.firebasestorage.app",
  messagingSenderId: "404994970807",
  appId: "1:404994970807:web:0c272f31874f289b5d2932",
  measurementId: "G-Q1CM6SJSS0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// BASE HISTÓRICA COMPLETA (53 PARTIDOS CON ESTADÍSTICAS ACTUALIZADAS)
const historicalData = [
  {
    "id": "hist_01",
    "numero": 1,
    "fecha": "2023-10-26",
    "rival": "Estados Unidos",
    "golesCol": 0,
    "golesRiv": 0,
    "tipo": "Fecha Fifa",
    "resultado": "Empatado",
    "ranking": 2,
    "confederacion": "Concacaf",
    "remates": 3,
    "rematesArco": 2,
    "posesion": 46.0,
    "pases": 333,
    "precisionPases": 74.0,
    "faltas": 11,
    "amarillas": 2,
    "rojas": 0,
    "tirosEsquina": 1,
    "fueraLugar": 0,
    "esHistorico": true
  },
  {
    "id": "hist_02",
    "numero": 2,
    "fecha": "2023-10-29",
    "rival": "Estados Unidos",
    "golesCol": 0,
    "golesRiv": 3,
    "tipo": "Fecha Fifa",
    "resultado": "Perdido",
    "ranking": 2,
    "confederacion": "Concacaf",
    "remates": 3,
    "rematesArco": 2,
    "posesion": 43.0,
    "pases": 298,
    "precisionPases": 73.0,
    "faltas": 27,
    "amarillas": 4,
    "rojas": 0,
    "tirosEsquina": 2,
    "fueraLugar": 1,
    "esHistorico": true
  },
  {
    "id": "hist_03",
    "numero": 3,
    "fecha": "2024-12-02",
    "rival": "Nueva Zelanda",
    "golesCol": 0,
    "golesRiv": 0,
    "tipo": "Fecha Fifa",
    "resultado": "Empatado",
    "ranking": 33,
    "confederacion": "OFC",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_04",
    "numero": 4,
    "fecha": "2024-12-05",
    "rival": "Nueva Zelanda",
    "golesCol": 1,
    "golesRiv": 0,
    "tipo": "Fecha Fifa",
    "resultado": "Ganado",
    "ranking": 33,
    "confederacion": "OFC",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_05",
    "numero": 5,
    "fecha": "2024-02-21",
    "rival": "Panamá",
    "golesCol": 6,
    "golesRiv": 0,
    "tipo": "Copa Oro",
    "resultado": "Ganado",
    "ranking": 54,
    "confederacion": "Concacaf",
    "remates": 28,
    "rematesArco": 14,
    "posesion": 73.0,
    "pases": 773,
    "precisionPases": 86.0,
    "faltas": 8,
    "amarillas": 1,
    "rojas": 0,
    "tirosEsquina": 3,
    "fueraLugar": 1,
    "esHistorico": true
  },
  {
    "id": "hist_06",
    "numero": 6,
    "fecha": "2024-02-24",
    "rival": "Brazil",
    "golesCol": 0,
    "golesRiv": 1,
    "tipo": "Copa Oro",
    "resultado": "Perdido",
    "ranking": 7,
    "confederacion": "Conmebol",
    "remates": 11,
    "rematesArco": 0,
    "posesion": 57.0,
    "pases": 341,
    "precisionPases": 70.0,
    "faltas": 13,
    "amarillas": 3,
    "rojas": 0,
    "tirosEsquina": 5,
    "fueraLugar": 1,
    "esHistorico": true
  },
  {
    "id": "hist_07",
    "numero": 7,
    "fecha": "2024-02-27",
    "rival": "Puerto Rico",
    "golesCol": 2,
    "golesRiv": 0,
    "tipo": "Copa Oro",
    "resultado": "Ganado",
    "ranking": 77,
    "confederacion": "Concacaf",
    "remates": 11,
    "rematesArco": 8,
    "posesion": 73.0,
    "pases": 654,
    "precisionPases": 84.0,
    "faltas": 12,
    "amarillas": 1,
    "rojas": 0,
    "tirosEsquina": 3,
    "fueraLugar": 3,
    "esHistorico": true
  },
  {
    "id": "hist_08",
    "numero": 8,
    "fecha": "2024-03-03",
    "rival": "Estados Unidos",
    "golesCol": 0,
    "golesRiv": 3,
    "tipo": "Copa Oro",
    "resultado": "Perdido",
    "ranking": 2,
    "confederacion": "Concacaf",
    "remates": 7,
    "rematesArco": 3,
    "posesion": 56.0,
    "pases": 384,
    "precisionPases": 66.0,
    "faltas": 16,
    "amarillas": 4,
    "rojas": 0,
    "tirosEsquina": 3,
    "fueraLugar": 5,
    "esHistorico": true
  },
  {
    "id": "hist_09",
    "numero": 9,
    "fecha": "2024-04-07",
    "rival": "Mexico",
    "golesCol": 1,
    "golesRiv": 0,
    "tipo": "Fecha Fifa",
    "resultado": "Ganado",
    "ranking": 28,
    "confederacion": "Concacaf",
    "remates": 11,
    "rematesArco": 4,
    "posesion": 45.0,
    "pases": 267,
    "precisionPases": 67.0,
    "faltas": 14,
    "amarillas": 1,
    "rojas": 0,
    "tirosEsquina": 2,
    "fueraLugar": 3,
    "esHistorico": true
  },
  {
    "id": "hist_10",
    "numero": 10,
    "fecha": "2024-04-09",
    "rival": "Guatemala",
    "golesCol": 3,
    "golesRiv": 0,
    "tipo": "Fecha Fifa",
    "resultado": "Ganado",
    "ranking": 82,
    "confederacion": "Concacaf",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_11",
    "numero": 11,
    "fecha": "2024-05-30",
    "rival": "Venezuela",
    "golesCol": 2,
    "golesRiv": 0,
    "tipo": "Fecha Fifa",
    "resultado": "Ganado",
    "ranking": 42,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_12",
    "numero": 12,
    "fecha": "2024-06-02",
    "rival": "Venezuela",
    "golesCol": 3,
    "golesRiv": 0,
    "tipo": "Fecha Fifa",
    "resultado": "Ganado",
    "ranking": 42,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_13",
    "numero": 13,
    "fecha": "2024-07-13",
    "rival": "Ecuador",
    "golesCol": 1,
    "golesRiv": 2,
    "tipo": "Fecha Fifa",
    "resultado": "Perdido",
    "ranking": 60,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_14",
    "numero": 14,
    "fecha": "2024-07-25",
    "rival": "Francia",
    "golesCol": 2,
    "golesRiv": 3,
    "tipo": "Olímpicos 2024",
    "resultado": "Perdido",
    "ranking": 6,
    "confederacion": "UEFA",
    "remates": 16,
    "rematesArco": 4,
    "posesion": 39.0,
    "pases": 310,
    "precisionPases": 75.16,
    "faltas": 11,
    "amarillas": 1,
    "rojas": 1,
    "tirosEsquina": 5,
    "fueraLugar": 2,
    "esHistorico": true
  },
  {
    "id": "hist_15",
    "numero": 15,
    "fecha": "2024-07-28",
    "rival": "Nueva Zelanda",
    "golesCol": 2,
    "golesRiv": 0,
    "tipo": "Olímpicos 2024",
    "resultado": "Ganado",
    "ranking": 33,
    "confederacion": "OFC",
    "remates": 18,
    "rematesArco": 7,
    "posesion": 64.0,
    "pases": 567,
    "precisionPases": 84.13,
    "faltas": 7,
    "amarillas": 0,
    "rojas": 0,
    "tirosEsquina": 8,
    "fueraLugar": 0,
    "esHistorico": true
  },
  {
    "id": "hist_16",
    "numero": 16,
    "fecha": "2024-07-31",
    "rival": "Canada",
    "golesCol": 0,
    "golesRiv": 1,
    "tipo": "Olímpicos 2024",
    "resultado": "Perdido",
    "ranking": 9,
    "confederacion": "Concacaf",
    "remates": 10,
    "rematesArco": 5,
    "posesion": 52.0,
    "pases": 429,
    "precisionPases": 79.49,
    "faltas": 13,
    "amarillas": 3,
    "rojas": 0,
    "tirosEsquina": 3,
    "fueraLugar": 2,
    "esHistorico": true
  },
  {
    "id": "hist_17",
    "numero": 17,
    "fecha": "2024-08-03",
    "rival": "España",
    "golesCol": 2,
    "golesRiv": 2,
    "tipo": "Olímpicos 2024",
    "resultado": "Empatado",
    "ranking": 1,
    "confederacion": "UEFA",
    "remates": 7,
    "rematesArco": 5,
    "posesion": 28.0,
    "pases": 286,
    "precisionPases": 61.54,
    "faltas": 12,
    "amarillas": 1,
    "rojas": 0,
    "tirosEsquina": 2,
    "fueraLugar": 2,
    "esHistorico": true
  },
  {
    "id": "hist_18",
    "numero": 18,
    "fecha": "2024-10-26",
    "rival": "Brazil",
    "golesCol": 1,
    "golesRiv": 1,
    "tipo": "Fecha Fifa",
    "resultado": "Empatado",
    "ranking": 7,
    "confederacion": "Conmebol",
    "remates": 7,
    "rematesArco": 2,
    "posesion": 40.0,
    "pases": null,
    "precisionPases": null,
    "faltas": 18,
    "amarillas": 2,
    "rojas": 0,
    "tirosEsquina": 2,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_19",
    "numero": 19,
    "fecha": "2024-10-29",
    "rival": "Brazil",
    "golesCol": 1,
    "golesRiv": 3,
    "tipo": "Fecha Fifa",
    "resultado": "Perdido",
    "ranking": 7,
    "confederacion": "Conmebol",
    "remates": 11,
    "rematesArco": 3,
    "posesion": 45.0,
    "pases": 127,
    "precisionPases": null,
    "faltas": 9,
    "amarillas": 0,
    "rojas": 1,
    "tirosEsquina": 4,
    "fueraLugar": 1,
    "esHistorico": true
  },
  {
    "id": "hist_20",
    "numero": 20,
    "fecha": "2024-11-30",
    "rival": "Argentina",
    "golesCol": 1,
    "golesRiv": 1,
    "tipo": "Fecha Fifa",
    "resultado": "Empatado",
    "ranking": 30,
    "confederacion": "Conmebol",
    "remates": 10,
    "rematesArco": 5,
    "posesion": 68.0,
    "pases": 539,
    "precisionPases": 77.74,
    "faltas": 22,
    "amarillas": 3,
    "rojas": 0,
    "tirosEsquina": 2,
    "fueraLugar": 5,
    "esHistorico": true
  },
  {
    "id": "hist_21",
    "numero": 21,
    "fecha": "2025-02-20",
    "rival": "Estados Unidos",
    "golesCol": 0,
    "golesRiv": 2,
    "tipo": "She B. Cup",
    "resultado": "Perdido",
    "ranking": 2,
    "confederacion": "Concacaf",
    "remates": 7,
    "rematesArco": 0,
    "posesion": 37.0,
    "pases": 210,
    "precisionPases": null,
    "faltas": 14,
    "amarillas": 3,
    "rojas": 0,
    "tirosEsquina": 4,
    "fueraLugar": 0,
    "esHistorico": true
  },
  {
    "id": "hist_22",
    "numero": 22,
    "fecha": "2025-02-23",
    "rival": "Japón",
    "golesCol": 1,
    "golesRiv": 4,
    "tipo": "She B. Cup",
    "resultado": "Perdido",
    "ranking": 5,
    "confederacion": "AFC",
    "remates": 5,
    "rematesArco": 2,
    "posesion": 40.0,
    "pases": 317,
    "precisionPases": null,
    "faltas": 16,
    "amarillas": 1,
    "rojas": 0,
    "tirosEsquina": 3,
    "fueraLugar": 1,
    "esHistorico": true
  },
  {
    "id": "hist_23",
    "numero": 23,
    "fecha": "2025-02-26",
    "rival": "Australia",
    "golesCol": 2,
    "golesRiv": 1,
    "tipo": "She B. Cup",
    "resultado": "Ganado",
    "ranking": 15,
    "confederacion": "AFC",
    "remates": 12,
    "rematesArco": 4,
    "posesion": 50.0,
    "pases": 363,
    "precisionPases": null,
    "faltas": 10,
    "amarillas": 1,
    "rojas": 0,
    "tirosEsquina": 3,
    "fueraLugar": 1,
    "esHistorico": true
  },
  {
    "id": "hist_24",
    "numero": 24,
    "fecha": "2025-04-06",
    "rival": "Japón",
    "golesCol": 1,
    "golesRiv": 1,
    "tipo": "Fecha Fifa",
    "resultado": "Empatado",
    "ranking": 5,
    "confederacion": "AFC",
    "remates": 1,
    "rematesArco": 1,
    "posesion": 36.0,
    "pases": null,
    "precisionPases": null,
    "faltas": 0,
    "amarillas": 1,
    "rojas": 0,
    "tirosEsquina": 0,
    "fueraLugar": 2,
    "esHistorico": true
  },
  {
    "id": "hist_25",
    "numero": 25,
    "fecha": "2025-04-08",
    "rival": "Japón",
    "golesCol": 1,
    "golesRiv": 6,
    "tipo": "Amistoso",
    "resultado": "Perdido",
    "ranking": 5,
    "confederacion": "AFC",
    "remates": 2,
    "rematesArco": 1,
    "posesion": 45.0,
    "pases": 408,
    "precisionPases": 81.37,
    "faltas": 9,
    "amarillas": 1,
    "rojas": 0,
    "tirosEsquina": 0,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_26",
    "numero": 26,
    "fecha": "2025-05-30",
    "rival": "Corea del Sur",
    "golesCol": 1,
    "golesRiv": 0,
    "tipo": "Fecha Fifa",
    "resultado": "Ganado",
    "ranking": 17,
    "confederacion": "AFC",
    "remates": 2,
    "rematesArco": 1,
    "posesion": 50.0,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": 1,
    "rojas": 0,
    "tirosEsquina": 3,
    "fueraLugar": 3,
    "esHistorico": true
  },
  {
    "id": "hist_27",
    "numero": 27,
    "fecha": "2025-06-02",
    "rival": "Corea del Sur",
    "golesCol": 1,
    "golesRiv": 1,
    "tipo": "Fecha Fifa",
    "resultado": "Empatado",
    "ranking": 17,
    "confederacion": "AFC",
    "remates": 13,
    "rematesArco": 6,
    "posesion": 50.0,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": 5,
    "rojas": 0,
    "tirosEsquina": 5,
    "fueraLugar": 1,
    "esHistorico": true
  },
  {
    "id": "hist_28",
    "numero": 28,
    "fecha": "2025-06-27",
    "rival": "Mexico",
    "golesCol": 0,
    "golesRiv": 0,
    "tipo": "Fecha Fifa",
    "resultado": "Empatado",
    "ranking": 28,
    "confederacion": "Concacaf",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_29",
    "numero": 29,
    "fecha": "2025-07-02",
    "rival": "Mexico",
    "golesCol": 0,
    "golesRiv": 1,
    "tipo": "Fecha Fifa",
    "resultado": "Perdido",
    "ranking": 28,
    "confederacion": "Concacaf",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": 328,
    "precisionPases": 78.35,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_30",
    "numero": 30,
    "fecha": "2025-07-16",
    "rival": "Venezuela",
    "golesCol": 0,
    "golesRiv": 0,
    "tipo": "Copa America",
    "resultado": "Empatado",
    "ranking": 42,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": 233,
    "precisionPases": 63.09,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_31",
    "numero": 31,
    "fecha": "2025-07-19",
    "rival": "Paraguay",
    "golesCol": 4,
    "golesRiv": 1,
    "tipo": "Copa America",
    "resultado": "Ganado",
    "ranking": 44,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": 456,
    "precisionPases": 82.02,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_32",
    "numero": 32,
    "fecha": "2025-07-22",
    "rival": "Bolivia",
    "golesCol": 8,
    "golesRiv": 0,
    "tipo": "Copa America",
    "resultado": "Ganado",
    "ranking": 115,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": 513,
    "precisionPases": 84.21,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_33",
    "numero": 33,
    "fecha": "2025-07-25",
    "rival": "Brazil",
    "golesCol": 0,
    "golesRiv": 0,
    "tipo": "Copa America",
    "resultado": "Empatado",
    "ranking": 7,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_34",
    "numero": 34,
    "fecha": "2025-07-28",
    "rival": "Argentina",
    "golesCol": 0,
    "golesRiv": 0,
    "tipo": "Copa America",
    "resultado": "Empatado",
    "ranking": 30,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": 404,
    "precisionPases": 78.96,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_35",
    "numero": 35,
    "fecha": "2025-08-02",
    "rival": "Brazil",
    "golesCol": 4,
    "golesRiv": 4,
    "tipo": "Copa America",
    "resultado": "Empatado",
    "ranking": 7,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": 199,
    "precisionPases": 52.76,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_36",
    "numero": 36,
    "fecha": "2025-10-24",
    "rival": "Perú",
    "golesCol": 4,
    "golesRiv": 1,
    "tipo": "Liga de Naciones",
    "resultado": "Ganado",
    "ranking": 74,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_37",
    "numero": 37,
    "fecha": "2025-10-28",
    "rival": "Ecuador",
    "golesCol": 2,
    "golesRiv": 1,
    "tipo": "Liga de Naciones",
    "resultado": "Ganado",
    "ranking": 60,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_38",
    "numero": 38,
    "fecha": "2025-11-28",
    "rival": "Bolivia",
    "golesCol": 1,
    "golesRiv": 1,
    "tipo": "Liga de Naciones",
    "resultado": "Empatado",
    "ranking": 115,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_39",
    "numero": 39,
    "fecha": "2026-03-01",
    "rival": "Canada",
    "golesCol": 1,
    "golesRiv": 4,
    "tipo": "She B. Cup",
    "resultado": "Perdido",
    "ranking": 9,
    "confederacion": "Concacaf",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": 450,
    "precisionPases": 87.56,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_40",
    "numero": 40,
    "fecha": "2026-03-04",
    "rival": "Argentina",
    "golesCol": 1,
    "golesRiv": 0,
    "tipo": "She B. Cup",
    "resultado": "Ganado",
    "ranking": 30,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_41",
    "numero": 41,
    "fecha": "2026-03-07",
    "rival": "Estados Unidos",
    "golesCol": 0,
    "golesRiv": 1,
    "tipo": "She B. Cup",
    "resultado": "Perdido",
    "ranking": 2,
    "confederacion": "Concacaf",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": 269,
    "precisionPases": 72.12,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_42",
    "numero": 42,
    "fecha": "2026-04-10",
    "rival": "Venezuela",
    "golesCol": 2,
    "golesRiv": 1,
    "tipo": "Liga de Naciones",
    "resultado": "Ganado",
    "ranking": 42,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_43",
    "numero": 43,
    "fecha": "2026-04-14",
    "rival": "Chile",
    "golesCol": 2,
    "golesRiv": 0,
    "tipo": "Liga de Naciones",
    "resultado": "Ganado",
    "ranking": 49,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_44",
    "numero": 44,
    "fecha": "2026-04-18",
    "rival": "Argentina",
    "golesCol": 0,
    "golesRiv": 0,
    "tipo": "Liga de Naciones",
    "resultado": "Empatado",
    "ranking": 30,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_45",
    "numero": 45,
    "fecha": "2026-06-05",
    "rival": "Uruguay",
    "golesCol": 1,
    "golesRiv": 0,
    "tipo": "Liga de Naciones",
    "resultado": "Ganado",
    "ranking": 61,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_46",
    "numero": 46,
    "fecha": "2026-06-09",
    "rival": "Paraguay",
    "golesCol": 4,
    "golesRiv": 3,
    "tipo": "Liga de Naciones",
    "resultado": "Ganado",
    "ranking": 44,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_47",
    "numero": 47,
    "fecha": "2026-07-29",
    "rival": "Jamaica",
    "golesCol": 5,
    "golesRiv": 0,
    "tipo": "Centro Americanos",
    "resultado": "Ganado",
    "ranking": 40,
    "confederacion": "Concacaf",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_48",
    "numero": 48,
    "fecha": "2026-07-31",
    "rival": "Mexico",
    "golesCol": 0,
    "golesRiv": 1,
    "tipo": "Centro Americanos",
    "resultado": "Perdido",
    "ranking": 28,
    "confederacion": "Concacaf",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_49",
    "numero": 49,
    "fecha": "2026-08-02",
    "rival": "Puerto Rico",
    "golesCol": 3,
    "golesRiv": 0,
    "tipo": "Centro Americanos",
    "resultado": "Ganado",
    "ranking": 77,
    "confederacion": "Concacaf",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_50",
    "numero": 50,
    "fecha": "2026-08-04",
    "rival": "Venezuela",
    "golesCol": 2,
    "golesRiv": 2,
    "tipo": "Centro Americanos",
    "resultado": "Empatado",
    "ranking": 42,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_51",
    "numero": 51,
    "fecha": "2026-08-06",
    "rival": "Mexico",
    "golesCol": 1,
    "golesRiv": 1,
    "tipo": "Centro Americanos",
    "resultado": "Empatado",
    "ranking": 28,
    "confederacion": "Concacaf",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_52",
    "numero": 52,
    "fecha": "2026-10-10",
    "rival": "Venezuela",
    "golesCol": 1,
    "golesRiv": 0,
    "tipo": "Fecha Fifa",
    "resultado": "Ganado",
    "ranking": 42,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  },
  {
    "id": "hist_53",
    "numero": 53,
    "fecha": "2026-10-13",
    "rival": "Venezuela",
    "golesCol": 2,
    "golesRiv": 1,
    "tipo": "Fecha Fifa",
    "resultado": "Ganado",
    "ranking": 42,
    "confederacion": "Conmebol",
    "remates": null,
    "rematesArco": null,
    "posesion": null,
    "pases": null,
    "precisionPases": null,
    "faltas": null,
    "amarillas": null,
    "rojas": null,
    "tirosEsquina": null,
    "fueraLugar": null,
    "esHistorico": true
  }
];

export default function App() {
  const [firestorePartidos, setFirestorePartidos] = useState([]);
  const [activeTab, setActiveTab] = useState('rendimiento');
  const [syncing, setSyncing] = useState(false);

  // Modo de visualización en sección Estadísticas: 'totales' | 'promedios'
  const [statsMode, setStatsMode] = useState('totales');

  // Estados para filas desplegables en Rendimiento
  const [expandedRankings, setExpandedRankings] = useState({});
  const [expandedConfeds, setExpandedConfeds] = useState({});

  // Estados para filas desplegables en Estadísticas
  const [expandedStatsRankings, setExpandedStatsRankings] = useState({});
  const [expandedStatsConfeds, setExpandedStatsConfeds] = useState({});

  // Estado para la protección de PIN
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    rival: '',
    ranking: '',
    confederacion: 'Conmebol',
    golesCol: '',
    golesRiv: '',
    fecha: '',
    tipo: 'Fecha Fifa',
    remates: '',
    rematesArco: '',
    posesion: '',
    pases: '',
    precisionPases: '',
    faltas: '',
    amarillas: '',
    rojas: '',
    tirosEsquina: '',
    fueraLugar: ''
  });

  // Lectura en tiempo real desde Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "partidos"), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setFirestorePartidos(data);
    }, (error) => {
      console.error("Error leyendo Firestore:", error);
    });
    return () => unsubscribe();
  }, []);

  // Combinar los 53 partidos históricos con los nuevos registros en Firestore sin duplicados
  const partidos = useMemo(() => {
    const map = new Map();
    historicalData.forEach(item => map.set(item.id, item));
    firestorePartidos.forEach(item => map.set(item.id, item));
    return Array.from(map.values()).sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  }, [firestorePartidos]);

  // --- Cálculos de Rendimiento (Puntos y Resultados) ---
  const calcMetricas = (datos) => {
    const total = datos.length;
    const ganados = datos.filter(d => d.resultado === 'Ganado').length;
    const empatados = datos.filter(d => d.resultado === 'Empatado').length;
    const perdidos = datos.filter(d => d.resultado === 'Perdido').length;
    const puntos = (ganados * 3) + empatados;
    const posibles = total * 3;
    const rendimiento = total > 0 ? ((puntos / posibles) * 100) : 0;
    return {
      total,
      ganados,
      empatados,
      perdidos,
      puntos,
      posibles,
      rendimientoNum: rendimiento,
      rendimiento: rendimiento.toFixed(2)
    };
  };

  // --- Cálculos de Estadísticas de Juego (10 variables técnicas y disciplinarias) ---
  const calcEstadisticasJuego = (datos) => {
    const total = datos.length;

    const sumarCampo = (campo) => {
      const validos = datos
        .map(d => d[campo])
        .filter(v => v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v)))
        .map(Number);
      if (validos.length === 0) return { sum: null, avg: null, count: 0 };
      const sum = validos.reduce((acc, v) => acc + v, 0);
      return {
        sum,
        avg: sum / validos.length,
        count: validos.length
      };
    };

    return {
      total,
      remates: sumarCampo('remates'),
      rematesArco: sumarCampo('rematesArco'),
      posesion: sumarCampo('posesion'),
      pases: sumarCampo('pases'),
      precisionPases: sumarCampo('precisionPases'),
      faltas: sumarCampo('faltas'),
      amarillas: sumarCampo('amarillas'),
      rojas: sumarCampo('rojas'),
      tirosEsquina: sumarCampo('tirosEsquina'),
      fueraLugar: sumarCampo('fueraLugar')
    };
  };

  // Agrupar un subconjunto de partidos por rival (incluyendo tanto Rendimiento como Estadísticas de Juego)
  const agruparPorRival = (datos) => {
    const grupos = {};
    const ordenadosFecha = [...datos].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
    ordenadosFecha.forEach(p => {
      const key = p.rival.trim();
      if (!grupos[key]) {
        grupos[key] = {
          rival: key,
          confederacion: p.confederacion,
          ranking: parseInt(p.ranking),
          lista: []
        };
      }
      grupos[key].lista.push(p);
      grupos[key].confederacion = p.confederacion;
      grupos[key].ranking = parseInt(p.ranking);
    });

    return Object.values(grupos)
      .map(g => ({
        rival: g.rival,
        confederacion: g.confederacion,
        ranking: g.ranking,
        ...calcMetricas(g.lista),
        stats: calcEstadisticasJuego(g.lista)
      }))
      .sort((a, b) => b.total - a.total || b.puntos - a.puntos || a.rival.localeCompare(b.rival));
  };

  // Subconjuntos por Ranking FIFA
  const partidosTop10 = useMemo(() => partidos.filter(p => parseInt(p.ranking) <= 10), [partidos]);
  const partidos11a20 = useMemo(() => partidos.filter(p => parseInt(p.ranking) > 10 && parseInt(p.ranking) <= 20), [partidos]);
  const partidosTop20 = useMemo(() => partidos.filter(p => parseInt(p.ranking) <= 20), [partidos]);
  const partidosFueraTop20 = useMemo(() => partidos.filter(p => parseInt(p.ranking) > 20), [partidos]);

  // Métricas de Rendimiento por Ranking FIFA
  const global = useMemo(() => calcMetricas(partidos), [partidos]);
  const top10 = useMemo(() => ({ ...calcMetricas(partidosTop10), rivales: agruparPorRival(partidosTop10) }), [partidosTop10]);
  const top11a20 = useMemo(() => ({ ...calcMetricas(partidos11a20), rivales: agruparPorRival(partidos11a20) }), [partidos11a20]);
  const top20 = useMemo(() => ({ ...calcMetricas(partidosTop20), rivales: agruparPorRival(partidosTop20) }), [partidosTop20]);
  const fueraTop20 = useMemo(() => ({ ...calcMetricas(partidosFueraTop20), rivales: agruparPorRival(partidosFueraTop20) }), [partidosFueraTop20]);

  // Métricas de Estadísticas de Juego por Ranking FIFA
  const globalStats = useMemo(() => calcEstadisticasJuego(partidos), [partidos]);
  const top10Stats = useMemo(() => ({ ...calcEstadisticasJuego(partidosTop10), rivales: agruparPorRival(partidosTop10) }), [partidosTop10]);
  const top11a20Stats = useMemo(() => ({ ...calcEstadisticasJuego(partidos11a20), rivales: agruparPorRival(partidos11a20) }), [partidos11a20]);
  const top20Stats = useMemo(() => ({ ...calcEstadisticasJuego(partidosTop20), rivales: agruparPorRival(partidosTop20) }), [partidosTop20]);
  const fueraTop20Stats = useMemo(() => ({ ...calcEstadisticasJuego(partidosFueraTop20), rivales: agruparPorRival(partidosFueraTop20) }), [partidosFueraTop20]);

  // Rendimiento y Estadísticas por Confederación
  const confederacionesStats = useMemo(() => {
    const confs = ['Conmebol', 'Concacaf', 'AFC', 'OFC', 'UEFA', 'CAF'];
    return confs
      .map(c => {
        const filtrados = partidos.filter(p => (p.confederacion || '').toLowerCase() === c.toLowerCase());
        return {
          nombre: c,
          ...calcMetricas(filtrados),
          stats: calcEstadisticasJuego(filtrados),
          rivales: agruparPorRival(filtrados)
        };
      })
      .filter(c => c.total > 0)
      .sort((a, b) => b.total - a.total || b.puntos - a.puntos);
  }, [partidos]);

  // Listado general por Rival (ordenado de mayor a menor cantidad de partidos)
  const rivalesStats = useMemo(() => agruparPorRival(partidos), [partidos]);

  // --- Lógica de Administrador ---
  const verificarPin = (e) => {
    e.preventDefault();
    if (pinInput === '2026') {
      setIsAdmin(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Subir los 53 partidos históricos (con estadísticas incluidas) a Firebase Firestore
  const sincronizarHistoricos = async () => {
    setSyncing(true);
    try {
      const batch = writeBatch(db);
      historicalData.forEach((item) => {
        const docRef = doc(db, "partidos", item.id);
        batch.set(docRef, item);
      });
      await batch.commit();
      alert("¡Éxito! Los 53 partidos históricos y sus estadísticas quedaron guardados en Firebase.");
    } catch (error) {
      console.error(error);
      alert("Error al sincronizar: verifica que las Reglas en Firestore permitan lectura y escritura (allow read, write: if true;).");
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gc = parseInt(formData.golesCol);
    const gr = parseInt(formData.golesRiv);
    const res = gc > gr ? 'Ganado' : (gc === gr ? 'Empatado' : 'Perdido');

    const parseOptInt = (v) => (v === '' || v === null || v === undefined ? null : parseInt(v));
    const parseOptFloat = (v) => (v === '' || v === null || v === undefined ? null : parseFloat(v));

    const nuevoPartido = {
      rival: formData.rival.trim(),
      ranking: parseInt(formData.ranking),
      confederacion: formData.confederacion,
      golesCol: gc,
      golesRiv: gr,
      resultado: res,
      fecha: formData.fecha,
      tipo: formData.tipo || 'Fecha Fifa',
      remates: parseOptInt(formData.remates),
      rematesArco: parseOptInt(formData.rematesArco),
      posesion: parseOptFloat(formData.posesion),
      pases: parseOptInt(formData.pases),
      precisionPases: parseOptFloat(formData.precisionPases),
      faltas: parseOptInt(formData.faltas),
      amarillas: parseOptInt(formData.amarillas),
      rojas: parseOptInt(formData.rojas),
      tirosEsquina: parseOptInt(formData.tirosEsquina),
      fueraLugar: parseOptInt(formData.fueraLugar),
      esHistorico: false
    };

    try {
      await addDoc(collection(db, "partidos"), nuevoPartido);
      setFormData({
        rival: '',
        ranking: '',
        confederacion: 'Conmebol',
        golesCol: '',
        golesRiv: '',
        fecha: '',
        tipo: 'Fecha Fifa',
        remates: '',
        rematesArco: '',
        posesion: '',
        pases: '',
        precisionPases: '',
        faltas: '',
        amarillas: '',
        rojas: '',
        tirosEsquina: '',
        fueraLugar: ''
      });
      alert("Partido registrado con éxito. Las secciones de Rendimiento, Estadísticas y Análisis se han actualizado.");
    } catch (error) {
      console.error(error);
      alert("Error al guardar: verifica que las Reglas de Firestore estén publicadas con allow read, write: if true;");
    }
  };

  const eliminarPartido = async (id) => {
    if (!window.confirm("¿Deseas eliminar este partido?")) return;
    try {
      await deleteDoc(doc(db, "partidos", id));
    } catch (error) {
      alert("Error al eliminar el registro.");
    }
  };

  const nuevosPartidosFirebase = firestorePartidos.filter(p => !p.esHistorico);

  // Formateadores para celdas de Estadísticas de Juego
  const fmtCountStat = (obj) => {
    if (!obj || obj.count === 0) return <span className="text-gray-300">—</span>;
    if (statsMode === 'promedios') {
      return (
        <span title={`Total: ${obj.sum} en ${obj.count} partidos con dato`}>
          {obj.avg.toFixed(1)}
        </span>
      );
    }
    return (
      <span title={`Promedio: ${obj.avg.toFixed(1)} por partido (${obj.count} PJ con dato)`}>
        {obj.sum.toLocaleString('es-CO')}
      </span>
    );
  };

  const fmtPctStat = (obj) => {
    if (!obj || obj.count === 0) return <span className="text-gray-300">—</span>;
    return (
      <span title={`Promedio calculado sobre ${obj.count} partidos con registro`}>
        {obj.avg.toFixed(1)}%
      </span>
    );
  };

  const renderStatsCells = (st) => (
    <>
      <td className="p-2.5 border-x border-gray-100">{fmtCountStat(st.remates)}</td>
      <td className="p-2.5 border-x border-gray-100">{fmtCountStat(st.rematesArco)}</td>
      <td className="p-2.5 border-x border-gray-100 font-medium text-brand-light">{fmtPctStat(st.posesion)}</td>
      <td className="p-2.5 border-x border-gray-100 font-medium">{fmtCountStat(st.pases)}</td>
      <td className="p-2.5 border-x border-gray-100 font-medium text-green-700">{fmtPctStat(st.precisionPases)}</td>
      <td className="p-2.5 border-x border-gray-100">{fmtCountStat(st.faltas)}</td>
      <td className="p-2.5 border-x border-gray-100 text-amber-700">{fmtCountStat(st.amarillas)}</td>
      <td className="p-2.5 border-x border-gray-100 text-red-700">{fmtCountStat(st.rojas)}</td>
      <td className="p-2.5 border-x border-gray-100">{fmtCountStat(st.tirosEsquina)}</td>
      <td className="p-2.5 border-x border-gray-100">{fmtCountStat(st.fueraLugar)}</td>
    </>
  );

  const rankingRowsRendimiento = [
    { key: 'total', label: 'Total General', stat: global, color: 'text-brand-dark', bar: 'bg-brand-dark', expandable: false },
    { key: 'top10', label: 'Rivales Top 10 (Puestos 1 al 10)', stat: top10, color: 'text-red-600', bar: 'bg-red-500', expandable: true },
    { key: 'top11a20', label: 'Rivales del 11 al 20 (Puestos 11 al 20)', stat: top11a20, color: 'text-orange-500', bar: 'bg-orange-500', expandable: true },
    { key: 'top20', label: 'Rivales Top 20 (Acumulado 1 al 20)', stat: top20, color: 'text-amber-700', bar: 'bg-amber-500', expandable: true },
    { key: 'fueraTop20', label: 'Rivales Fuera del Top 20 (> 20)', stat: fueraTop20, color: 'text-green-600', bar: 'bg-green-600', expandable: true }
  ];

  const rankingRowsEstadisticas = [
    { key: 'total', label: 'Total General', stat: globalStats, expandable: false },
    { key: 'top10', label: 'Rivales Top 10 (Puestos 1 al 10)', stat: top10Stats, expandable: true },
    { key: 'top11a20', label: 'Rivales del 11 al 20 (Puestos 11 al 20)', stat: top11a20Stats, expandable: true },
    { key: 'top20', label: 'Rivales Top 20 (Acumulado 1 al 20)', stat: top20Stats, expandable: true },
    { key: 'fueraTop20', label: 'Rivales Fuera del Top 20 (> 20)', stat: fueraTop20Stats, expandable: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-12">
      {/* HEADER */}
      <header className="w-full bg-brand-dark text-white p-6 shadow-md text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Panel Ejecutivo: Selección Colombia Femenina</h1>
        <p className="text-sm mt-2 font-light text-blue-100">
          Rendimiento, Estadísticas de Juego, Ranking FIFA y Análisis Gerencial ({partidos.length} Partidos Analizados)
        </p>
      </header>

      {/* NAVEGACIÓN */}
      <nav className="flex flex-wrap justify-center gap-2 md:space-x-3 mt-6 bg-white p-2 rounded-lg shadow">
        <button
          onClick={() => setActiveTab('rendimiento')}
          className={`px-4 py-2 rounded font-semibold flex items-center space-x-2 transition ${activeTab === 'rendimiento' ? 'bg-brand-light text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <BarChart2 size={18} /> <span>Rendimiento</span>
        </button>
        <button
          onClick={() => setActiveTab('estadisticas')}
          className={`px-4 py-2 rounded font-semibold flex items-center space-x-2 transition ${activeTab === 'estadisticas' ? 'bg-brand-light text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Activity size={18} /> <span>Estadísticas</span>
        </button>
        <button
          onClick={() => setActiveTab('analisis')}
          className={`px-4 py-2 rounded font-semibold flex items-center space-x-2 transition ${activeTab === 'analisis' ? 'bg-brand-light text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <FileText size={18} /> <span>Análisis Ejecutivo</span>
        </button>
        <button
          onClick={() => setActiveTab('formulario')}
          className={`px-4 py-2 rounded font-semibold flex items-center space-x-2 transition ${activeTab === 'formulario' ? 'bg-red-600 text-white' : 'text-red-600 border border-red-200 hover:bg-red-50'}`}
        >
          <Settings size={18} /> <span>Registrar Datos</span>
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="w-full max-w-7xl mt-6 px-4">

        {/* ========================================================== */}
        {/* TAB 1: RENDIMIENTO (ANTES ESTADÍSTICAS Y TABLAS)           */}
        {/* ========================================================== */}
        {activeTab === 'rendimiento' && (
          <div className="space-y-8">
            {/* TARJETAS KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 shadow rounded-lg border-l-4 border-brand-dark">
                <p className="text-xs text-gray-500 font-bold uppercase">Partidos Jugados</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{global.total}</p>
                <p className="text-xs text-gray-500 mt-1">{global.ganados}G · {global.empatados}E · {global.perdidos}P</p>
              </div>
              <div className="bg-white p-5 shadow rounded-lg border-l-4 border-green-600">
                <p className="text-xs text-gray-500 font-bold uppercase">Puntos Obtenidos</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{global.puntos} <span className="text-base font-normal text-gray-400">/ {global.posibles}</span></p>
                <p className="text-xs text-gray-500 mt-1">3 pts victoria · 1 pt empate</p>
              </div>
              <div className="bg-white p-5 shadow rounded-lg border-l-4 border-brand-light">
                <p className="text-xs text-gray-500 font-bold uppercase">Rendimiento Global</p>
                <p className="text-3xl font-bold text-brand-light mt-1">{global.rendimiento}%</p>
                <p className="text-xs text-gray-500 mt-1">Fuera Top 20: <strong className="text-green-600">{fueraTop20.rendimiento}%</strong></p>
              </div>
              <div className="bg-white p-5 shadow rounded-lg border-l-4 border-red-600">
                <p className="text-xs text-gray-500 font-bold uppercase">Rendimiento vs. Top 10</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{top10.rendimiento}%</p>
                <p className="text-xs text-gray-500 mt-1">{top10.puntos} de {top10.posibles} pts ({top10.total} PJ)</p>
              </div>
            </div>

            {/* TABLA 1: RENDIMIENTO GENERAL Y POR RANKING FIFA */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-brand-dark text-white p-3.5 flex flex-col sm:flex-row items-center justify-between gap-1 px-5">
                <div className="font-bold text-base md:text-lg flex items-center space-x-2">
                  <Trophy size={20} />
                  <span>1. Rendimiento General y por Ranking FIFA</span>
                </div>
                <span className="text-xs text-blue-200">Haz clic en una categoría para desplegar sus rivales</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-sm">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3 border text-left">Categoría Ranking FIFA</th>
                      <th className="p-3 border">PJ</th>
                      <th className="p-3 border">Ganados</th>
                      <th className="p-3 border">Empatados</th>
                      <th className="p-3 border">Perdidos</th>
                      <th className="p-3 border">Pts Obtenidos</th>
                      <th className="p-3 border">Pts Posibles</th>
                      <th className="p-3 border bg-blue-50">Rendimiento (%)</th>
                      <th className="p-3 border w-36">Gráfico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingRowsRendimiento.map((row, idx) => {
                      const isExpanded = !!expandedRankings[row.key];
                      const rivalesList = row.stat.rivales || [];
                      return (
                        <React.Fragment key={row.key}>
                          <tr
                            onClick={() => row.expandable && setExpandedRankings(prev => ({ ...prev, [row.key]: !prev[row.key] }))}
                            className={`border-b transition ${
                              row.expandable ? 'cursor-pointer hover:bg-blue-50/70' : ''
                            } ${isExpanded ? 'bg-blue-50/50' : idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                          >
                            <td className="p-3 font-semibold text-left text-gray-800">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  {row.expandable ? (
                                    isExpanded ? (
                                      <ChevronDown size={16} className="text-brand-light shrink-0" />
                                    ) : (
                                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                                    )
                                  ) : (
                                    <span className="w-4 inline-block" />
                                  )}
                                  <span>{row.label}</span>
                                </div>
                                {row.expandable && (
                                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">
                                    {rivalesList.length} {rivalesList.length === 1 ? 'rival' : 'rivales'}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 font-medium">{row.stat.total}</td>
                            <td className="p-3 text-green-700 font-medium">{row.stat.ganados}</td>
                            <td className="p-3 text-amber-700 font-medium">{row.stat.empatados}</td>
                            <td className="p-3 text-red-700 font-medium">{row.stat.perdidos}</td>
                            <td className="p-3 font-semibold">{row.stat.puntos}</td>
                            <td className="p-3 text-gray-500">{row.stat.posibles}</td>
                            <td className={`p-3 font-bold bg-blue-50/40 ${row.color}`}>{row.stat.rendimiento}%</td>
                            <td className="p-3">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className={`${row.bar} h-2.5 rounded-full`} style={{ width: `${Math.min(100, row.stat.rendimientoNum)}%` }}></div>
                              </div>
                            </td>
                          </tr>

                          {row.expandable && isExpanded && (
                            <>
                              <tr className="bg-slate-100/90 text-[11px] uppercase tracking-wider text-slate-600 border-b">
                                <td className="py-1.5 px-3 pl-9 text-left font-bold" colSpan={9}>
                                  Desglose por rival — {row.label}
                                </td>
                              </tr>
                              {rivalesList.map((riv) => (
                                <tr key={`${row.key}-${riv.rival}`} className="bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200/70 text-xs">
                                  <td className="py-2 px-3 pl-9 text-left">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-slate-400">↳</span>
                                      <span className="font-semibold text-gray-800">{riv.rival}</span>
                                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                        riv.ranking <= 10
                                          ? 'bg-red-100 text-red-700'
                                          : riv.ranking <= 20
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-blue-100 text-brand-dark'
                                      }`}>
                                        #{riv.ranking}
                                      </span>
                                      <span className="text-[10px] text-gray-500">({riv.confederacion})</span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 font-medium text-gray-700">{riv.total}</td>
                                  <td className="py-2 px-3 text-green-700">{riv.ganados}</td>
                                  <td className="py-2 px-3 text-amber-700">{riv.empatados}</td>
                                  <td className="py-2 px-3 text-red-700">{riv.perdidos}</td>
                                  <td className="py-2 px-3 font-semibold text-gray-800">{riv.puntos}</td>
                                  <td className="py-2 px-3 text-gray-500">{riv.posibles}</td>
                                  <td className="py-2 px-3 font-bold text-brand-dark bg-blue-50/30">{riv.rendimiento}%</td>
                                  <td className="py-2 px-3">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div
                                        className={`${row.bar} h-1.5 rounded-full opacity-80`}
                                        style={{ width: `${Math.min(100, riv.rendimientoNum)}%` }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA 2: RENDIMIENTO POR CONFEDERACIÓN */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-brand-light text-white p-3.5 flex flex-col sm:flex-row items-center justify-between gap-1 px-5">
                <div className="font-bold text-base md:text-lg flex items-center space-x-2">
                  <Globe size={20} />
                  <span>2. Rendimiento por Confederación del Rival</span>
                </div>
                <span className="text-xs text-blue-100">Haz clic en una confederación para desplegar sus rivales</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-sm">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3 border text-left">Confederación</th>
                      <th className="p-3 border">PJ</th>
                      <th className="p-3 border">Ganados</th>
                      <th className="p-3 border">Empatados</th>
                      <th className="p-3 border">Perdidos</th>
                      <th className="p-3 border">Pts Obtenidos</th>
                      <th className="p-3 border">Pts Posibles</th>
                      <th className="p-3 border bg-blue-50">Rendimiento (%)</th>
                      <th className="p-3 border w-36">Gráfico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confederacionesStats.map((c, idx) => {
                      const isExpanded = !!expandedConfeds[c.nombre];
                      return (
                        <React.Fragment key={c.nombre}>
                          <tr
                            onClick={() => setExpandedConfeds(prev => ({ ...prev, [c.nombre]: !prev[c.nombre] }))}
                            className={`border-b cursor-pointer transition hover:bg-blue-50/70 ${
                              isExpanded ? 'bg-blue-50/50' : idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                            }`}
                          >
                            <td className="p-3 font-semibold text-left text-gray-800">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  {isExpanded ? (
                                    <ChevronDown size={16} className="text-brand-light shrink-0" />
                                  ) : (
                                    <ChevronRight size={16} className="text-gray-400 shrink-0" />
                                  )}
                                  <span>{c.nombre}</span>
                                </div>
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">
                                  {c.rivales.length} {c.rivales.length === 1 ? 'rival' : 'rivales'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 font-medium">{c.total}</td>
                            <td className="p-3 text-green-700 font-medium">{c.ganados}</td>
                            <td className="p-3 text-amber-700 font-medium">{c.empatados}</td>
                            <td className="p-3 text-red-700 font-medium">{c.perdidos}</td>
                            <td className="p-3 font-semibold">{c.puntos}</td>
                            <td className="p-3 text-gray-500">{c.posibles}</td>
                            <td className="p-3 font-bold text-brand-dark bg-blue-50/40">{c.rendimiento}%</td>
                            <td className="p-3">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-brand-light h-2.5 rounded-full" style={{ width: `${Math.min(100, c.rendimientoNum)}%` }}></div>
                              </div>
                            </td>
                          </tr>

                          {isExpanded && (
                            <>
                              <tr className="bg-slate-100/90 text-[11px] uppercase tracking-wider text-slate-600 border-b">
                                <td className="py-1.5 px-3 pl-9 text-left font-bold" colSpan={9}>
                                  Rivales enfrentados — {c.nombre}
                                </td>
                              </tr>
                              {c.rivales.map((riv) => (
                                <tr key={`${c.nombre}-${riv.rival}`} className="bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200/70 text-xs">
                                  <td className="py-2 px-3 pl-9 text-left">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-slate-400">↳</span>
                                      <span className="font-semibold text-gray-800">{riv.rival}</span>
                                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                        riv.ranking <= 10
                                          ? 'bg-red-100 text-red-700'
                                          : riv.ranking <= 20
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-blue-100 text-brand-dark'
                                      }`}>
                                        #{riv.ranking}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 font-medium text-gray-700">{riv.total}</td>
                                  <td className="py-2 px-3 text-green-700">{riv.ganados}</td>
                                  <td className="py-2 px-3 text-amber-700">{riv.empatados}</td>
                                  <td className="py-2 px-3 text-red-700">{riv.perdidos}</td>
                                  <td className="py-2 px-3 font-semibold text-gray-800">{riv.puntos}</td>
                                  <td className="py-2 px-3 text-gray-500">{riv.posibles}</td>
                                  <td className="py-2 px-3 font-bold text-brand-dark bg-blue-50/30">{riv.rendimiento}%</td>
                                  <td className="py-2 px-3">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div
                                        className="bg-brand-light h-1.5 rounded-full opacity-80"
                                        style={{ width: `${Math.min(100, riv.rendimientoNum)}%` }}
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA 3: RENDIMIENTO POR RIVAL */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-brand-dark text-white p-3.5 font-bold text-base md:text-lg flex items-center justify-center space-x-2">
                <Users size={20} />
                <span>3. Rendimiento por Rival (Ordenado de Mayor a Menor Cantidad de Partidos)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-sm">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3 border text-left">Rival</th>
                      <th className="p-3 border">Confederación</th>
                      <th className="p-3 border">Ranking FIFA</th>
                      <th className="p-3 border">PJ</th>
                      <th className="p-3 border">G</th>
                      <th className="p-3 border">E</th>
                      <th className="p-3 border">P</th>
                      <th className="p-3 border">Pts Obt.</th>
                      <th className="p-3 border">Pts Pos.</th>
                      <th className="p-3 border bg-blue-50">Rendimiento (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rivalesStats.map((r, idx) => (
                      <tr key={r.rival} className={`border-b ${idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="p-3 font-semibold text-left text-gray-800">{r.rival}</td>
                        <td className="p-3 text-gray-600">{r.confederacion}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${r.ranking <= 10 ? 'bg-red-100 text-red-700' : r.ranking <= 20 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-brand-dark'}`}>
                            #{r.ranking}
                          </span>
                        </td>
                        <td className="p-3 font-semibold">{r.total}</td>
                        <td className="p-3 text-green-700">{r.ganados}</td>
                        <td className="p-3 text-amber-700">{r.empatados}</td>
                        <td className="p-3 text-red-700">{r.perdidos}</td>
                        <td className="p-3 font-semibold">{r.puntos}</td>
                        <td className="p-3 text-gray-500">{r.posibles}</td>
                        <td className="p-3 font-bold text-brand-dark bg-blue-50/40">{r.rendimiento}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: ESTADÍSTICAS (10 VARIABLES TÉCNICAS Y DISCIPLINA)   */}
        {/* ========================================================== */}
        {activeTab === 'estadisticas' && (
          <div className="space-y-8">
            {/* TARJETAS KPI ESTADÍSTICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 shadow rounded-lg border-l-4 border-brand-dark">
                <p className="text-xs text-gray-500 font-bold uppercase">Remates / Al Arco</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {globalStats.remates.sum ?? 0} <span className="text-lg font-semibold text-brand-light">/ {globalStats.rematesArco.sum ?? 0}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Prom: {globalStats.remates.avg ? globalStats.remates.avg.toFixed(1) : '—'} remates · {globalStats.rematesArco.avg ? globalStats.rematesArco.avg.toFixed(1) : '—'} al arco ({globalStats.remates.count} PJ)
                </p>
              </div>
              <div className="bg-white p-5 shadow rounded-lg border-l-4 border-brand-light">
                <p className="text-xs text-gray-500 font-bold uppercase">Posesión Promedio</p>
                <p className="text-3xl font-bold text-brand-light mt-1">
                  {globalStats.posesion.avg ? `${globalStats.posesion.avg.toFixed(1)}%` : '—'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Calculado sobre {globalStats.posesion.count} partidos con dato</p>
              </div>
              <div className="bg-white p-5 shadow rounded-lg border-l-4 border-green-600">
                <p className="text-xs text-gray-500 font-bold uppercase">Pases y Precisión</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {globalStats.precisionPases.avg ? `${globalStats.precisionPases.avg.toFixed(1)}%` : '—'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(globalStats.pases.sum ?? 0).toLocaleString('es-CO')} pases totales ({globalStats.pases.count} PJ)
                </p>
              </div>
              <div className="bg-white p-5 shadow rounded-lg border-l-4 border-amber-500">
                <p className="text-xs text-gray-500 font-bold uppercase">Disciplina y Balón Parado</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {globalStats.amarillas.sum ?? 0} <span className="text-xs font-normal text-amber-600">TA</span> · {globalStats.rojas.sum ?? 0} <span className="text-xs font-normal text-red-600">TR</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {globalStats.faltas.sum ?? 0} faltas · {globalStats.tirosEsquina.sum ?? 0} tiros esquina · {globalStats.fueraLugar.sum ?? 0} fuera lugar
                </p>
              </div>
            </div>

            {/* BARRA DE CONTROL: TOTALES VS PROMEDIOS */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center justify-between gap-3 border border-gray-200">
              <div className="text-xs text-gray-600">
                <strong className="text-brand-dark">Nota metodológica:</strong> Los valores de <em>Posesión</em> y <em>Precisión de Pases</em> corresponden siempre al promedio porcentual de los partidos con registro estadístico disponible.
              </div>
              <div className="flex items-center bg-gray-100 p-1 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setStatsMode('totales')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition ${statsMode === 'totales' ? 'bg-brand-dark text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Totales Acumulados
                </button>
                <button
                  type="button"
                  onClick={() => setStatsMode('promedios')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition ${statsMode === 'promedios' ? 'bg-brand-dark text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Promedios por Partido
                </button>
              </div>
            </div>

            {/* TABLA 1: ESTADÍSTICAS GENERALES Y POR RANKING FIFA */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-brand-dark text-white p-3.5 flex flex-col sm:flex-row items-center justify-between gap-1 px-5">
                <div className="font-bold text-base md:text-lg flex items-center space-x-2">
                  <Trophy size={20} />
                  <span>1. Estadísticas Generales y por Ranking FIFA</span>
                </div>
                <span className="text-xs text-blue-200">Haz clic en una categoría para desplegar sus rivales</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs md:text-sm whitespace-nowrap">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3 border text-left">Categoría Ranking FIFA</th>
                      <th className="p-3 border">PJ</th>
                      <th className="p-3 border">Remates</th>
                      <th className="p-3 border">Rem. Arco</th>
                      <th className="p-3 border bg-blue-50">Posesión</th>
                      <th className="p-3 border">Pases</th>
                      <th className="p-3 border bg-green-50">Prec. Pases</th>
                      <th className="p-3 border">Faltas</th>
                      <th className="p-3 border">Amarillas</th>
                      <th className="p-3 border">Rojas</th>
                      <th className="p-3 border">T. Esquina</th>
                      <th className="p-3 border">Fuera Lugar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingRowsEstadisticas.map((row, idx) => {
                      const isExpanded = !!expandedStatsRankings[row.key];
                      const rivalesList = row.stat.rivales || [];
                      return (
                        <React.Fragment key={row.key}>
                          <tr
                            onClick={() => row.expandable && setExpandedStatsRankings(prev => ({ ...prev, [row.key]: !prev[row.key] }))}
                            className={`border-b transition ${
                              row.expandable ? 'cursor-pointer hover:bg-blue-50/70' : ''
                            } ${isExpanded ? 'bg-blue-50/50' : idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                          >
                            <td className="p-3 font-semibold text-left text-gray-800">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  {row.expandable ? (
                                    isExpanded ? (
                                      <ChevronDown size={16} className="text-brand-light shrink-0" />
                                    ) : (
                                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                                    )
                                  ) : (
                                    <span className="w-4 inline-block" />
                                  )}
                                  <span>{row.label}</span>
                                </div>
                                {row.expandable && (
                                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                    {rivalesList.length}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-2.5 font-semibold">{row.stat.total}</td>
                            {renderStatsCells(row.stat)}
                          </tr>

                          {row.expandable && isExpanded && (
                            <>
                              <tr className="bg-slate-100/90 text-[11px] uppercase tracking-wider text-slate-600 border-b">
                                <td className="py-1.5 px-3 pl-9 text-left font-bold" colSpan={12}>
                                  Desglose estadístico por rival — {row.label}
                                </td>
                              </tr>
                              {rivalesList.map((riv) => (
                                <tr key={`st-${row.key}-${riv.rival}`} className="bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200/70 text-xs">
                                  <td className="py-2 px-3 pl-9 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-slate-400">↳</span>
                                      <span className="font-semibold text-gray-800">{riv.rival}</span>
                                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                        riv.ranking <= 10
                                          ? 'bg-red-100 text-red-700'
                                          : riv.ranking <= 20
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-blue-100 text-brand-dark'
                                      }`}>
                                        #{riv.ranking}
                                      </span>
                                      <span className="text-[10px] text-gray-500">({riv.confederacion})</span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-2.5 font-medium text-gray-700">{riv.total}</td>
                                  {renderStatsCells(riv.stats)}
                                </tr>
                              ))}
                            </>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA 2: ESTADÍSTICAS POR CONFEDERACIÓN DEL RIVAL */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-brand-light text-white p-3.5 flex flex-col sm:flex-row items-center justify-between gap-1 px-5">
                <div className="font-bold text-base md:text-lg flex items-center space-x-2">
                  <Globe size={20} />
                  <span>2. Estadísticas por Confederación del Rival</span>
                </div>
                <span className="text-xs text-blue-100">Haz clic en una confederación para desplegar sus rivales</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs md:text-sm whitespace-nowrap">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3 border text-left">Confederación</th>
                      <th className="p-3 border">PJ</th>
                      <th className="p-3 border">Remates</th>
                      <th className="p-3 border">Rem. Arco</th>
                      <th className="p-3 border bg-blue-50">Posesión</th>
                      <th className="p-3 border">Pases</th>
                      <th className="p-3 border bg-green-50">Prec. Pases</th>
                      <th className="p-3 border">Faltas</th>
                      <th className="p-3 border">Amarillas</th>
                      <th className="p-3 border">Rojas</th>
                      <th className="p-3 border">T. Esquina</th>
                      <th className="p-3 border">Fuera Lugar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confederacionesStats.map((c, idx) => {
                      const isExpanded = !!expandedStatsConfeds[c.nombre];
                      return (
                        <React.Fragment key={c.nombre}>
                          <tr
                            onClick={() => setExpandedStatsConfeds(prev => ({ ...prev, [c.nombre]: !prev[c.nombre] }))}
                            className={`border-b cursor-pointer transition hover:bg-blue-50/70 ${
                              isExpanded ? 'bg-blue-50/50' : idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                            }`}
                          >
                            <td className="p-3 font-semibold text-left text-gray-800">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  {isExpanded ? (
                                    <ChevronDown size={16} className="text-brand-light shrink-0" />
                                  ) : (
                                    <ChevronRight size={16} className="text-gray-400 shrink-0" />
                                  )}
                                  <span>{c.nombre}</span>
                                </div>
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                  {c.rivales.length}
                                </span>
                              </div>
                            </td>
                            <td className="p-2.5 font-semibold">{c.total}</td>
                            {renderStatsCells(c.stats)}
                          </tr>

                          {isExpanded && (
                            <>
                              <tr className="bg-slate-100/90 text-[11px] uppercase tracking-wider text-slate-600 border-b">
                                <td className="py-1.5 px-3 pl-9 text-left font-bold" colSpan={12}>
                                  Estadísticas por rival — {c.nombre}
                                </td>
                              </tr>
                              {c.rivales.map((riv) => (
                                <tr key={`st-${c.nombre}-${riv.rival}`} className="bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200/70 text-xs">
                                  <td className="py-2 px-3 pl-9 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-slate-400">↳</span>
                                      <span className="font-semibold text-gray-800">{riv.rival}</span>
                                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                        riv.ranking <= 10
                                          ? 'bg-red-100 text-red-700'
                                          : riv.ranking <= 20
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-blue-100 text-brand-dark'
                                      }`}>
                                        #{riv.ranking}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-2.5 font-medium text-gray-700">{riv.total}</td>
                                  {renderStatsCells(riv.stats)}
                                </tr>
                              ))}
                            </>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA 3: ESTADÍSTICAS POR RIVAL (ORDENADO DE MAYOR A MENOR CANTIDAD DE PARTIDOS) */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-brand-dark text-white p-3.5 font-bold text-base md:text-lg flex items-center justify-center space-x-2">
                <Users size={20} />
                <span>3. Estadísticas por Rival (Ordenado de Mayor a Menor Cantidad de Partidos)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs md:text-sm whitespace-nowrap">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="p-3 border text-left">Rival</th>
                      <th className="p-3 border">Confed.</th>
                      <th className="p-3 border">Ranking</th>
                      <th className="p-3 border">PJ</th>
                      <th className="p-3 border">Remates</th>
                      <th className="p-3 border">Rem. Arco</th>
                      <th className="p-3 border bg-blue-50">Posesión</th>
                      <th className="p-3 border">Pases</th>
                      <th className="p-3 border bg-green-50">Prec. Pases</th>
                      <th className="p-3 border">Faltas</th>
                      <th className="p-3 border">Amarillas</th>
                      <th className="p-3 border">Rojas</th>
                      <th className="p-3 border">T. Esquina</th>
                      <th className="p-3 border">Fuera Lugar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rivalesStats.map((r, idx) => (
                      <tr key={r.rival} className={`border-b ${idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="p-3 font-semibold text-left text-gray-800">{r.rival}</td>
                        <td className="p-2.5 text-gray-600">{r.confederacion}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${r.ranking <= 10 ? 'bg-red-100 text-red-700' : r.ranking <= 20 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-brand-dark'}`}>
                            #{r.ranking}
                          </span>
                        </td>
                        <td className="p-2.5 font-semibold">{r.total}</td>
                        {renderStatsCells(r.stats)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: ANÁLISIS EJECUTIVO                                  */}
        {/* ========================================================== */}
        {activeTab === 'analisis' && (
          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 border-t-8 border-brand-dark space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-brand-dark">Análisis Ejecutivo: Rendimiento de la Selección Colombia Femenina</h2>
              <p className="text-sm text-gray-500 mt-1">
                Evaluación automatizada actualizada sobre la base de <strong>{global.total} partidos</strong> ({global.puntos} de {global.posibles} puntos posibles).
              </p>
            </div>

            <div className="space-y-5 text-gray-700 leading-relaxed">
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                <h3 className="font-bold text-brand-dark text-lg mb-2">1. Posicionamiento Global y Continental (Ranking FIFA)</h3>
                <p>
                  La Selección Colombia Femenina se consolida en el puesto 19 del Ranking FIFA como la segunda potencia de la Conmebol, únicamente detrás de Brasil (#7) y superando de forma sostenida a Argentina (#30) y al resto de selecciones sudamericanas. En el ámbito global, compite directamente en el bloque de selecciones emergentes junto a Corea del Sur (#17), China (#18) y Bélgica (#20), acumulando actualmente un rendimiento global del <strong>{global.rendimiento}%</strong> ({global.ganados} victorias, {global.empatados} empates y {global.perdidos} derrotas).
                </p>
              </div>

              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <h3 className="font-bold text-brand-dark text-lg mb-2">2. Rendimiento por Jerarquía del Rival (Top 10 vs. Top 20 vs. &gt;20)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Contra rivales fuera del Top 20 (&gt;20) — Dominio Consolidado ({fueraTop20.rendimiento}%):</strong> En {fueraTop20.total} partidos disputados, Colombia suma {fueraTop20.ganados} victorias, {fueraTop20.empatados} empates y solo {fueraTop20.perdidos} derrotas ({fueraTop20.puntos} de {fueraTop20.posibles} puntos). Demuestra solvencia táctica frente a selecciones de media y baja tabla.
                  </li>
                  <li>
                    <strong>Contra rivales del Top 11 al 20 — Paridad Competitiva ({top11a20.rendimiento}%):</strong> Al aislar los {top11a20.total} enfrentamientos frente a pares directos ubicados entre los puestos 11 y 20, Colombia registra {top11a20.ganados} victorias, {top11a20.empatados} empates y {top11a20.perdidos} derrotas, ratificando su competitividad en su misma franja FIFA.
                  </li>
                  <li>
                    <strong>Contra rivales del Top 10 (1 al 10) — Brecha Crítica de Élite ({top10.rendimiento}%):</strong> Frente a las potencias consolidadas (EE. UU., Brasil, Japón, España, Francia, Canadá), el rendimiento cae al <strong>{top10.rendimiento}%</strong> ({top10.ganados}G, {top10.empatados}E, {top10.perdidos}P en {top10.total} partidos), concentrando la gran mayoría de las derrotas históricas del ciclo.
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-50/60 p-5 rounded-lg border border-indigo-200">
                <h3 className="font-bold text-brand-light text-lg mb-2">3. Comparativa Intercontinental por Confederaciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {confederacionesStats.map(c => (
                    <div key={c.nombre} className="bg-white p-3 rounded border border-indigo-100 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-800">{c.nombre}</span>
                        <span className="text-xs text-gray-500 block">{c.total} PJ ({c.ganados}G - {c.empatados}E - {c.perdidos}P)</span>
                      </div>
                      <span className="font-bold text-brand-dark text-lg">{c.rendimiento}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                <h3 className="font-bold text-red-800 text-lg mb-2">4. Conclusión Estratégica</h3>
                <p className="text-gray-800">
                  La Selección Colombia respalda plenamente su ubicación dentro del Top 20 mundial gracias a su hegemonía frente a rivales ubicados por debajo del puesto 20 (<strong>{fueraTop20.rendimiento}%</strong>) y su liderazgo sudamericano. Para dar el salto definitivo hacia el Top 10 global y competir por instancias decisivas en torneos orbitales, la planificación deportiva debe enfocarse en cerrar la brecha frente a las selecciones élite de Top 10, UEFA y Concacaf.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: FORMULARIO PROTEGIDO                                */}
        {/* ========================================================== */}
        {activeTab === 'formulario' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!isAdmin ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center border-t-4 border-red-600 max-w-md mx-auto">
                <ShieldAlert className="mx-auto text-red-600 mb-4" size={48} />
                <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
                <p className="text-gray-600 mb-6 text-sm">Ingrese el PIN de administrador para registrar partidos o sincronizar la base de datos.</p>
                <form onSubmit={verificarPin}>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="PIN (ej. 2026)"
                    className="w-full p-3 border rounded mb-4 text-center text-lg tracking-widest focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  {pinError && <p className="text-red-500 text-sm mb-4">PIN incorrecto.</p>}
                  <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition">
                    Desbloquear Acceso
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* PANEL DE SINCRONIZACIÓN DE LOS 53 PARTIDOS HISTÓRICOS */}
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-brand-dark flex items-center space-x-2">
                      <CheckCircle2 size={18} className="text-green-600" />
                      <span>Base Histórica (53 Partidos + Estadísticas)</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Sincroniza los 53 partidos históricos junto con sus estadísticas actualizadas de remates, posesión, pases y disciplina en Firebase Firestore:
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={syncing}
                    onClick={sincronizarHistoricos}
                    className="whitespace-nowrap bg-brand-dark text-white text-xs font-bold px-4 py-2.5 rounded hover:bg-brand-light transition flex items-center space-x-2 disabled:opacity-50"
                  >
                    <UploadCloud size={16} />
                    <span>{syncing ? 'Subiendo...' : 'Actualizar 53 en Firebase'}</span>
                  </button>
                </div>

                {/* FORMULARIO DE NUEVO PARTIDO */}
                <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg space-y-5 border-t-4 border-brand-dark">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-bold text-brand-dark">Registrar Nuevo Partido (#{partidos.length + 1})</h2>
                    <button type="button" onClick={() => setIsAdmin(false)} className="text-sm text-gray-500 hover:text-red-600">
                      Cerrar Sesión
                    </button>
                  </div>

                  {/* DATOS BÁSICOS Y MARCADOR */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-light mb-3">1. Datos del Encuentro y Resultado</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-bold text-gray-700">Selección Rival *</label>
                        <input
                          required
                          type="text"
                          placeholder="Ej. Alemania, Argentina, Estados Unidos..."
                          value={formData.rival}
                          onChange={e => setFormData({ ...formData, rival: e.target.value })}
                          className="w-full p-2.5 border rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700">Ranking FIFA del Rival *</label>
                        <input
                          required
                          type="number"
                          min="1"
                          placeholder="Ej. 12"
                          value={formData.ranking}
                          onChange={e => setFormData({ ...formData, ranking: e.target.value })}
                          className="w-full p-2.5 border rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700">Confederación *</label>
                        <select
                          required
                          value={formData.confederacion}
                          onChange={e => setFormData({ ...formData, confederacion: e.target.value })}
                          className="w-full p-2.5 border rounded mt-1"
                        >
                          <option value="Conmebol">Conmebol</option>
                          <option value="Concacaf">Concacaf</option>
                          <option value="UEFA">UEFA</option>
                          <option value="AFC">AFC</option>
                          <option value="OFC">OFC</option>
                          <option value="CAF">CAF</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700">Goles Colombia *</label>
                        <input
                          required
                          type="number"
                          min="0"
                          value={formData.golesCol}
                          onChange={e => setFormData({ ...formData, golesCol: e.target.value })}
                          className="w-full p-2.5 border rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700">Goles Rival *</label>
                        <input
                          required
                          type="number"
                          min="0"
                          value={formData.golesRiv}
                          onChange={e => setFormData({ ...formData, golesRiv: e.target.value })}
                          className="w-full p-2.5 border rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700">Fecha del Partido *</label>
                        <input
                          required
                          type="date"
                          value={formData.fecha}
                          onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                          className="w-full p-2.5 border rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700">Competencia / Tipo</label>
                        <input
                          type="text"
                          placeholder="Ej. Fecha Fifa, Copa América..."
                          value={formData.tipo}
                          onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                          className="w-full p-2.5 border rounded mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ESTADÍSTICAS DEL PARTIDO (OPCIONAL) */}
                  <div className="border-t pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-light mb-3">
                      2. Estadísticas de Juego de Colombia (Opcional)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700">Remates</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Ej. 14"
                          value={formData.remates}
                          onChange={e => setFormData({ ...formData, remates: e.target.value })}
                          className="w-full p-2 border rounded mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700">Rem. al Arco</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Ej. 6"
                          value={formData.rematesArco}
                          onChange={e => setFormData({ ...formData, rematesArco: e.target.value })}
                          className="w-full p-2 border rounded mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700">Posesión (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="Ej. 58.5"
                          value={formData.posesion}
                          onChange={e => setFormData({ ...formData, posesion: e.target.value })}
                          className="w-full p-2 border rounded mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700">Pases Totales</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Ej. 420"
                          value={formData.pases}
                          onChange={e => setFormData({ ...formData, pases: e.target.value })}
                          className="w-full p-2 border rounded mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700">Prec. Pases (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="Ej. 81.2"
                          value={formData.precisionPases}
                          onChange={e => setFormData({ ...formData, precisionPases: e.target.value })}
                          className="w-full p-2 border rounded mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700">Faltas</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Ej. 12"
                          value={formData.faltas}
                          onChange={e => setFormData({ ...formData, faltas: e.target.value })}
                          className="w-full p-2 border rounded mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700">Amarillas</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Ej. 2"
                          value={formData.amarillas}
                          onChange={e => setFormData({ ...formData, amarillas: e.target.value })}
                          className="w-full p-2 border rounded mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700">Rojas</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Ej. 0"
                          value={formData.rojas}
                          onChange={e => setFormData({ ...formData, rojas: e.target.value })}
                          className="w-full p-2 border rounded mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700">T. Esquina</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Ej. 5"
                          value={formData.tirosEsquina}
                          onChange={e => setFormData({ ...formData, tirosEsquina: e.target.value })}
                          className="w-full p-2 border rounded mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700">Fuera Lugar</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="Ej. 2"
                          value={formData.fueraLugar}
                          onChange={e => setFormData({ ...formData, fueraLugar: e.target.value })}
                          className="w-full p-2 border rounded mt-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-brand-light text-white font-bold py-3 mt-2 rounded hover:bg-brand-dark transition">
                    Guardar Resultado y Estadísticas
                  </button>
                </form>

                {/* LISTA DE PARTIDOS NUEVOS AGREGADOS EN FIREBASE */}
                {nuevosPartidosFirebase.length > 0 && (
                  <div className="bg-white p-5 shadow rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-3">Partidos Nuevos Registrados en la Web ({nuevosPartidosFirebase.length})</h3>
                    <div className="divide-y text-sm">
                      {nuevosPartidosFirebase.map(p => (
                        <div key={p.id} className="py-2.5 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-gray-800">Colombia {p.golesCol} - {p.golesRiv} {p.rival}</span>
                            <span className="text-xs text-gray-500 block">{p.fecha} · {p.confederacion} · Ranking #{p.ranking} ({p.resultado})</span>
                          </div>
                          <button onClick={() => eliminarPartido(p.id)} className="text-red-500 hover:text-red-700 p-1" title="Eliminar partido">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
