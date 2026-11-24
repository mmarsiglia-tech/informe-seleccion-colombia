import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import { BarChart, FileText, Settings, ShieldAlert } from 'lucide-react';

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

// Datos iniciales de referencia mientras agregas tus primeros partidos en Firebase
const mockData = [
  { rival: 'Brasil', ranking: 7, confederacion: 'Conmebol', golesCol: 0, golesRiv: 1, resultado: 'Perdido', fecha: '2026-10-01' },
  { rival: 'Venezuela', ranking: 42, confederacion: 'Conmebol', golesCol: 2, golesRiv: 0, resultado: 'Ganado', fecha: '2026-10-05' },
  { rival: 'Estados Unidos', ranking: 2, confederacion: 'Concacaf', golesCol: 0, golesRiv: 3, resultado: 'Perdido', fecha: '2026-10-10' },
  { rival: 'Nueva Zelanda', ranking: 33, confederacion: 'OFC', golesCol: 1, golesRiv: 1, resultado: 'Empatado', fecha: '2026-10-15' },
];

export default function App() {
  const [partidos, setPartidos] = useState(mockData);
  const [activeTab, setActiveTab] = useState('estadisticas');

  // Estado para la protección de PIN
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    rival: '', ranking: '', confederacion: 'Conmebol', golesCol: '', golesRiv: '', fecha: ''
  });

  // Lectura en tiempo real desde Firestore
  useEffect(() => {
    const q = query(collection(db, "partidos"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (data.length > 0) setPartidos(data);
    });
    return () => unsubscribe();
  }, []);

  // Cálculos Estadísticos
  const calcMetricas = (datos) => {
    const total = datos.length;
    const ganados = datos.filter(d => d.resultado === 'Ganado').length;
    const empatados = datos.filter(d => d.resultado === 'Empatado').length;
    const perdidos = datos.filter(d => d.resultado === 'Perdido').length;
    const puntos = (ganados * 3) + empatados;
    const posibles = total * 3;
    const rendimiento = total > 0 ? ((puntos / posibles) * 100).toFixed(2) : '0.00';
    return { total, ganados, empatados, perdidos, puntos, rendimiento };
  };

  const global = calcMetricas(partidos);
  const top10 = calcMetricas(partidos.filter(p => parseInt(p.ranking) <= 10));
  const top20 = calcMetricas(partidos.filter(p => parseInt(p.ranking) <= 20));
  const fueraTop20 = calcMetricas(partidos.filter(p => parseInt(p.ranking) > 20));

  // Lógica del formulario
  const verificarPin = (e) => {
    e.preventDefault();
    if (pinInput === '2026') {
      setIsAdmin(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gc = parseInt(formData.golesCol);
    const gr = parseInt(formData.golesRiv);
    const res = gc > gr ? 'Ganado' : (gc === gr ? 'Empatado' : 'Perdido');

    const nuevoPartido = {
      ...formData,
      ranking: parseInt(formData.ranking),
      golesCol: gc,
      golesRiv: gr,
      resultado: res
    };

    try {
      await addDoc(collection(db, "partidos"), nuevoPartido);
      setFormData({ rival: '', ranking: '', confederacion: 'Conmebol', golesCol: '', golesRiv: '', fecha: '' });
      alert("Partido registrado con éxito en la base de datos.");
    } catch (error) {
      alert("Error al guardar: verifica que las Reglas de Firestore estén publicadas en modo prueba.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* HEADER */}
      <header className="w-full bg-brand-dark text-white p-6 shadow-md text-center">
        <h1 className="text-3xl font-bold">Panel Ejecutivo: Selección Colombia Femenina</h1>
        <p className="text-sm mt-2 font-light text-blue-100">Actualización en tiempo real de rendimiento y rankings</p>
      </header>

      {/* NAVEGACIÓN */}
      <nav className="flex space-x-4 mt-6 bg-white p-2 rounded-lg shadow">
        <button onClick={() => setActiveTab('estadisticas')} className={`px-4 py-2 rounded font-semibold flex items-center space-x-2 ${activeTab === 'estadisticas' ? 'bg-brand-light text-white' : 'text-gray-600'}`}><BarChart size={18}/> <span>Estadísticas</span></button>
        <button onClick={() => setActiveTab('analisis')} className={`px-4 py-2 rounded font-semibold flex items-center space-x-2 ${activeTab === 'analisis' ? 'bg-brand-light text-white' : 'text-gray-600'}`}><FileText size={18}/> <span>Análisis Ejecutivo</span></button>
        <button onClick={() => setActiveTab('formulario')} className={`px-4 py-2 rounded font-semibold flex items-center space-x-2 ${activeTab === 'formulario' ? 'bg-red-600 text-white' : 'text-red-600 border border-red-200'}`}><Settings size={18}/> <span>Registrar Datos</span></button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="w-full max-w-5xl mt-6 p-4">

        {/* TAB 1: ESTADÍSTICAS */}
        {activeTab === 'estadisticas' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 shadow rounded border-l-4 border-brand-dark">
                <p className="text-xs text-gray-500 font-bold uppercase">Partidos Jugados</p>
                <p className="text-3xl font-bold text-gray-800">{global.total}</p>
              </div>
              <div className="bg-white p-4 shadow rounded border-l-4 border-green-500">
                <p className="text-xs text-gray-500 font-bold uppercase">Victorias</p>
                <p className="text-3xl font-bold text-green-600">{global.ganados}</p>
              </div>
              <div className="bg-white p-4 shadow rounded border-l-4 border-brand-light">
                <p className="text-xs text-gray-500 font-bold uppercase">Rendimiento Global</p>
                <p className="text-3xl font-bold text-brand-light">{global.rendimiento}%</p>
              </div>
              <div className="bg-white p-4 shadow rounded border-l-4 border-red-500">
                <p className="text-xs text-gray-500 font-bold uppercase">Rendimiento Top 10</p>
                <p className="text-3xl font-bold text-red-600">{top10.rendimiento}%</p>
              </div>
            </div>

            <div className="bg-white shadow rounded overflow-hidden">
              <div className="bg-brand-light text-white p-3 font-bold text-lg text-center">Rendimiento por Ranking FIFA</div>
              <table className="w-full text-center">
                <thead className="bg-gray-100 text-sm">
                  <tr>
                    <th className="p-3 border">Categoría</th>
                    <th className="p-3 border">PJ</th>
                    <th className="p-3 border">G</th>
                    <th className="p-3 border">E</th>
                    <th className="p-3 border">P</th>
                    <th className="p-3 border bg-blue-50">Rendimiento</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="p-3 font-semibold text-left">Total General</td><td>{global.total}</td><td>{global.ganados}</td><td>{global.empatados}</td><td>{global.perdidos}</td><td className="font-bold text-brand-dark">{global.rendimiento}%</td></tr>
                  <tr className="border-b bg-gray-50"><td className="p-3 font-semibold text-left">Top 10 (1 al 10)</td><td>{top10.total}</td><td>{top10.ganados}</td><td>{top10.empatados}</td><td>{top10.perdidos}</td><td className="font-bold text-red-600">{top10.rendimiento}%</td></tr>
                  <tr className="border-b"><td className="p-3 font-semibold text-left">Top 20 (1 al 20)</td><td>{top20.total}</td><td>{top20.ganados}</td><td>{top20.empatados}</td><td>{top20.perdidos}</td><td className="font-bold">{top20.rendimiento}%</td></tr>
                  <tr><td className="p-3 font-semibold text-left">Fuera del Top 20</td><td>{fueraTop20.total}</td><td>{fueraTop20.ganados}</td><td>{fueraTop20.empatados}</td><td>{fueraTop20.perdidos}</td><td className="font-bold text-green-600">{fueraTop20.rendimiento}%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ANÁLISIS EJECUTIVO */}
        {activeTab === 'analisis' && (
          <div className="bg-white shadow-lg rounded-lg p-8 border-t-8 border-brand-dark space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 border-b pb-2">Diagnóstico Automatizado de Rendimiento</h2>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>Basado en los <strong>{global.total} partidos</strong> registrados actualmente, la Selección Colombia presenta un rendimiento global del <strong>{global.rendimiento}%</strong>.</p>

              <div className="bg-blue-50 p-4 rounded border border-blue-100">
                <h3 className="font-bold text-brand-dark mb-2">1. Dominio Regional y Media Tabla</h3>
                <p>El equipo demuestra solvencia ante selecciones ubicadas fuera del Top 20. En este segmento, Colombia obtiene un rendimiento del <strong>{fueraTop20.rendimiento}%</strong>. Esto consolida su estatus como una de las potencias dominantes de Sudamérica (Conmebol).</p>
              </div>

              <div className="bg-red-50 p-4 rounded border border-red-100">
                <h3 className="font-bold text-red-700 mb-2">2. La Brecha frente a la Élite (Top 10)</h3>
                <p>El análisis evidencia que el principal desafío deportivo se encuentra al enfrentar a la élite mundial. Contra el Top 10 del Ranking FIFA, el rendimiento cae drásticamente al <strong>{top10.rendimiento}%</strong> (con {top10.perdidos} derrotas en {top10.total} partidos). Cerrar esta brecha frente a Estados Unidos, Brasil, Japón y potencias europeas es crítico para aspirar a podios en competiciones orbitales.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded border">
                <h3 className="font-bold text-gray-800 mb-2">Conclusión Estratégica</h3>
                <p>La selección está consolidada en su confederación y vence rutinariamente a rivales de menor jerarquía. El próximo salto cualitativo requiere modificar la planificación para disputar más amistosos de alta intensidad contra el Top 10 global.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FORMULARIO PROTEGIDO */}
        {activeTab === 'formulario' && (
          <div className="max-w-md mx-auto">
            {!isAdmin ? (
              <div className="bg-white p-8 rounded shadow-md text-center border-t-4 border-red-500">
                <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
                <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
                <p className="text-gray-600 mb-6 text-sm">Ingrese el PIN de administrador para alimentar la base de datos.</p>
                <form onSubmit={verificarPin}>
                  <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="PIN (ej. 2026)" className="w-full p-3 border rounded mb-4 text-center text-lg tracking-widest focus:ring-2 focus:ring-red-500 outline-none"/>
                  {pinError && <p className="text-red-500 text-sm mb-4">PIN incorrecto.</p>}
                  <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700">Desbloquear Acceso</button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded space-y-4 border-t-4 border-brand-dark">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h2 className="text-xl font-bold text-brand-dark">Registrar Nuevo Partido</h2>
                  <button type="button" onClick={() => setIsAdmin(false)} className="text-sm text-gray-500 hover:text-red-500">Cerrar Sesión</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700">Rival</label>
                    <input required type="text" value={formData.rival} onChange={e => setFormData({...formData, rival: e.target.value})} className="w-full p-2 border rounded mt-1"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Ranking FIFA</label>
                    <input required type="number" min="1" value={formData.ranking} onChange={e => setFormData({...formData, ranking: e.target.value})} className="w-full p-2 border rounded mt-1"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Confederación</label>
                    <select required value={formData.confederacion} onChange={e => setFormData({...formData, confederacion: e.target.value})} className="w-full p-2 border rounded mt-1">
                      <option>Conmebol</option><option>Concacaf</option><option>UEFA</option><option>AFC</option><option>OFC</option><option>CAF</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Goles Colombia</label>
                    <input required type="number" min="0" value={formData.golesCol} onChange={e => setFormData({...formData, golesCol: e.target.value})} className="w-full p-2 border rounded mt-1"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Goles Rival</label>
                    <input required type="number" min="0" value={formData.golesRiv} onChange={e => setFormData({...formData, golesRiv: e.target.value})} className="w-full p-2 border rounded mt-1"/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700">Fecha</label>
                    <input required type="date" value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} className="w-full p-2 border rounded mt-1"/>
                  </div>
                </div>
                <button type="submit" className="w-full bg-brand-light text-white font-bold py-3 mt-4 rounded hover:bg-brand-dark transition">Guardar Resultado</button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}