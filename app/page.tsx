"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useForm } from '@formspree/react';
import { 
  Sparkles, Send, CheckCircle, Palette, Box, Layout, Type, 
  Square, MessageSquare, BarChart2, Users, Code, Database, 
  ChevronRight, ArrowRight, Activity, Calculator, CheckSquare
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  projectType: string;
  features: string[];
  details: string;
}

interface SiteConfig {
  bgColor: string;
  primaryColor: string;
  textColor: string;
  radius: string;
  fontFamily: string;
  modules: {
    inventory: boolean;
    analytics: boolean;
    chat: boolean;
  }
}

const PROJECT_TYPES = [
  { id: '', label: 'Selecciona una arquitectura...', basePrice: 0 },
  { id: 'landing', label: 'Landing Page Corporativa', basePrice: 200000 },
  { id: 'inventory', label: 'Gestión de Inventario / Roles', basePrice: 650000 },
  { id: 'api', label: 'Plataforma con Integración API', basePrice: 450000 },
  { id: 'dashboard', label: 'Dashboard Analítico', basePrice: 500000 },
  { id: 'ecommerce', label: 'E-commerce / Catálogo', basePrice: 750000 },
  { id: 'other', label: 'Desarrollo a Medida', basePrice: 350000 }
];

const AVAILABLE_FEATURES = [
  { id: 'auth', label: 'Autenticación de Usuarios', price: 80000 },
  { id: 'payments', label: 'Pasarela de Pagos', price: 120000 },
  { id: 'export', label: 'Exportación de Datos (Excel/CSV)', price: 50000 },
  { id: 'design', label: 'Diseño UI/UX Premium', price: 100000 },
  { id: 'seo', label: 'Optimización SEO Avanzada', price: 60000 }
];

const playUISound = (isEnabling: boolean): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioCtx = new AudioContextClass();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    
    const startFreq = isEnabling ? 400 : 600;
    const endFreq = isEnabling ? 800 : 300;
    
    oscillator.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (error) {
    console.warn('Web Audio API no disponible en este contexto.', error);
  }
};

export default function AstraAgency() {
  const [state, handleSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSPREE_ID || "");
  
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', projectType: '', features: [], details: ''
  });

  const [config, setConfig] = useState<SiteConfig>({
    bgColor: '#09090b',
    primaryColor: '#818cf8',
    textColor: '#f8fafc',
    radius: '0.75rem',
    fontFamily: 'Inter, sans-serif',
    modules: {
      inventory: true,
      analytics: false,
      chat: false,
    }
  });

  useEffect(() => {
    if (state.succeeded) {
      setFormData({ name: '', email: '', projectType: '', features: [], details: '' });
    }
  }, [state.succeeded]);

  const presets = {
    dark: { bgColor: '#09090b', primaryColor: '#818cf8', textColor: '#f8fafc' },
    light: { bgColor: '#ffffff', primaryColor: '#0f172a', textColor: '#334155' },
    dim: { bgColor: '#1e1e24', primaryColor: '#fbbf24', textColor: '#e2e8f0' },
    elegant: { bgColor: '#0f172a', primaryColor: '#38bdf8', textColor: '#f1f5f9' }
  };

  const applyPreset = useCallback((presetKey: keyof typeof presets) => {
    setConfig(prev => ({ ...prev, ...presets[presetKey] }));
  }, []);

  const updateConfig = useCallback((key: keyof SiteConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleModule = useCallback((module: keyof SiteConfig['modules']) => {
    setConfig(prev => {
      const newState = !prev.modules[module];
      playUISound(newState);
      return {
        ...prev,
        modules: { ...prev.modules, [module]: newState }
      };
    });
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => {
      const isSelected = prev.features.includes(featureId);
      playUISound(!isSelected);
      return {
        ...prev,
        features: isSelected
          ? prev.features.filter(id => id !== featureId)
          : [...prev.features, featureId]
      };
    });
  };

  const estimatedPrice = useMemo(() => {
    const basePrice = PROJECT_TYPES.find(p => p.id === formData.projectType)?.basePrice || 0;
    const featuresPrice = formData.features.reduce((total, featureId) => {
      const feature = AVAILABLE_FEATURES.find(f => f.id === featureId);
      return total + (feature ? feature.price : 0);
    }, 0);
    return basePrice + featuresPrice;
  }, [formData.projectType, formData.features]);

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(estimatedPrice);

  const radiusLabel = useMemo(() => {
    if (config.radius === '0px') return 'Rígido (0px)';
    if (config.radius === '2rem') return 'Píldora (2rem)';
    return 'Suave (0.75rem)';
  }, [config.radius]);

  const activeModulesPreview = useMemo(() => {
    const active = [];
    if (config.modules.inventory) active.push('Inventario');
    if (config.modules.analytics) active.push('Analíticas');
    if (config.modules.chat) active.push('Soporte/Chat');
    return active.length > 0 ? active.join(', ') : 'Ninguno';
  }, [config.modules]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30 flex flex-col overflow-x-hidden">
      
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold tracking-tight">Astra</span>
          </div>
          <button 
            onClick={() => document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-medium hover:text-indigo-400 transition-transform hover:scale-105 active:scale-95"
          >
            Ver Proyectos
          </button>
        </div>
      </nav>

      <header className="relative pt-32 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-tight">
            Desarrollo Web <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              Arquitectura Sólida.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transformo ideas en plataformas web robustas. Especialista en sistemas de gestión, bases de datos en tiempo real e interfaces de alto rendimiento.
          </p>
        </div>
      </header>

      <section className="py-10 px-6 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 cursor-default">
            <Layout className="w-10 h-10 text-indigo-400 mb-6" />
            <h3 className="text-xl font-semibold mb-3">Diseño UI/UX</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">Interfaces escalables y modernas, con enfoque en la experiencia de usuario y jerarquía visual limpia.</p>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 cursor-default">
            <Database className="w-10 h-10 text-indigo-400 mb-6" />
            <h3 className="text-xl font-semibold mb-3">Sistemas Complejos</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">Desarrollo de inventarios, control de asistencia, roles de usuario y paneles de administración dinámicos.</p>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 cursor-default">
            <Code className="w-10 h-10 text-indigo-400 mb-6" />
            <h3 className="text-xl font-semibold mb-3">Integraciones</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">Conexión con APIs externas, bases de datos en tiempo real (Firebase) y exportación de métricas corporativas.</p>
          </div>
        </div>
      </section>

      <section id="proyectos" className="py-24 px-6 border-t border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Proyectos en Producción</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              Explora las plataformas, sistemas de gestión y herramientas analíticas que he desplegado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Astra POS', url: 'https://astra-pos-one.vercel.app/', icon: Database, desc: 'Sistema de gestión de inventario y administración. Arquitectura enfocada en el control de stock, escalabilidad y fluidez operativa.', tags: ['Gestión', 'Inventario'] },
              { title: 'Astra Board', url: 'https://astra-board-henna.vercel.app/', icon: Layout, desc: 'Dashboard de administración avanzado. Permite control de asistencia, manejo de roles de usuario (RBAC) y exportación de datos operativos.', tags: ['Dashboard', 'RBAC'] },
              { title: 'Osu! Analyzer', url: 'https://osu-analyzer.vercel.app/', icon: Activity, desc: 'Herramienta web integrada con la API v2 de osu! para obtener, visualizar y comparar estadísticas de perfiles en tiempo real.', tags: ['API v2', 'Data Fetching'] },
              { title: 'Astra Cuts', url: 'https://astra-cuts.vercel.app/', icon: Box, desc: 'Interfaz moderna y dinámica centrada en el diseño UI/UX, optimizada para ofrecer navegación rápida y alto impacto visual en el cliente.', tags: ['Frontend', 'UI / UX'] }
            ].map((proj, idx) => (
              <a key={idx} href={proj.url} target="_blank" rel="noopener noreferrer" className="group p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-indigo-500/40 hover:bg-zinc-900/60 transition-all duration-300 hover:scale-[1.01] flex flex-col h-full active:scale-[0.99]">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <proj.icon className="w-5 h-5 text-indigo-400 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 group-hover:-rotate-45 transition-all duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">{proj.title}</h3>
                <p className="text-zinc-400 leading-relaxed mb-6 flex-1 text-sm">
                  {proj.desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {proj.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-xs font-medium px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-zinc-300">{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Laboratorio UI</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">Construye la arquitectura visual de tu proyecto. Personaliza colores, estructura y módulos funcionales en tiempo real antes de solicitar una cotización.</p>
        </div>

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-8 h-[800px]">
          <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-2">
            <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800/50 space-y-8">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-indigo-400" /> Temas Globales
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => applyPreset('dark')} className="p-3 rounded-xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 active:scale-95 bg-zinc-950 text-xs font-medium transition-all text-left">⚫ Oscuro Premium</button>
                  <button onClick={() => applyPreset('light')} className="p-3 rounded-xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 active:scale-95 bg-zinc-950 text-xs font-medium transition-all text-left">⚪ Claro Minimal</button>
                  <button onClick={() => applyPreset('dim')} className="p-3 rounded-xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 active:scale-95 bg-zinc-950 text-xs font-medium transition-all text-left">🟡 Carbón & Oro</button>
                  <button onClick={() => applyPreset('elegant')} className="p-3 rounded-xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 active:scale-95 bg-zinc-950 text-xs font-medium transition-all text-left">🔵 Océano Profundo</button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  <Palette className="w-4 h-4 text-indigo-400" /> Paleta de Marca
                </div>
                <div className="grid gap-3">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-colors cursor-pointer">
                    <span className="text-xs font-medium">Fondo Principal</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">{config.bgColor}</span>
                      <input type="color" value={config.bgColor} onChange={(e) => updateConfig('bgColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0" />
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-colors cursor-pointer">
                    <span className="text-xs font-medium">Color de Acento</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">{config.primaryColor}</span>
                      <input type="color" value={config.primaryColor} onChange={(e) => updateConfig('primaryColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0" />
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-colors cursor-pointer">
                    <span className="text-xs font-medium">Color de Texto</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">{config.textColor}</span>
                      <input type="color" value={config.textColor} onChange={(e) => updateConfig('textColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0" />
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  <Layout className="w-4 h-4 text-indigo-400" /> Estructura UI
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-zinc-400 mb-2 block"><Square className="w-3 h-3 inline mr-1" /> Redondeo de Tarjetas</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => updateConfig('radius', '0px')} className={`py-2 text-xs border hover:bg-zinc-800 active:scale-95 ${config.radius === '0px' ? 'bg-zinc-800 border-zinc-600' : 'border-zinc-800'} transition-all`} style={{ borderRadius: '0px' }}>Rígido</button>
                      <button onClick={() => updateConfig('radius', '0.75rem')} className={`py-2 text-xs border hover:bg-zinc-800 active:scale-95 ${config.radius === '0.75rem' ? 'bg-zinc-800 border-zinc-600' : 'border-zinc-800'} transition-all`} style={{ borderRadius: '0.75rem' }}>Suave</button>
                      <button onClick={() => updateConfig('radius', '2rem')} className={`py-2 text-xs border hover:bg-zinc-800 active:scale-95 ${config.radius === '2rem' ? 'bg-zinc-800 border-zinc-600' : 'border-zinc-800'} transition-all`} style={{ borderRadius: '2rem' }}>Píldora</button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-400 mb-2 block"><Type className="w-3 h-3 inline mr-1" /> Fuente del Sistema</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => updateConfig('fontFamily', 'Inter, sans-serif')} className={`py-2 text-xs rounded-lg border hover:bg-zinc-800 active:scale-95 ${config.fontFamily === 'Inter, sans-serif' ? 'bg-zinc-800 border-zinc-600' : 'border-zinc-800'} transition-all`}>Sans Serif</button>
                      <button onClick={() => updateConfig('fontFamily', 'monospace')} className={`py-2 text-xs rounded-lg border hover:bg-zinc-800 active:scale-95 ${config.fontFamily === 'monospace' ? 'bg-zinc-800 border-zinc-600' : 'border-zinc-800'} transition-all`}>Monospace</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  <Box className="w-4 h-4 text-indigo-400" /> Alternar Componentes
                </div>
                <div className="grid gap-2">
                  <button onClick={() => toggleModule('inventory')} className={`p-3 border flex items-center justify-between text-xs hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ${config.modules.inventory ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`} style={{ borderRadius: config.radius }}>
                    <span className="flex items-center gap-2"><Database className="w-4 h-4" /> Gestor de Inventario</span>
                    {config.modules.inventory && <CheckCircle className="w-4 h-4 opacity-70" />}
                  </button>
                  <button onClick={() => toggleModule('analytics')} className={`p-3 border flex items-center justify-between text-xs hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ${config.modules.analytics ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`} style={{ borderRadius: config.radius }}>
                    <span className="flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Métricas Analíticas</span>
                    {config.modules.analytics && <CheckCircle className="w-4 h-4 opacity-70" />}
                  </button>
                  <button onClick={() => toggleModule('chat')} className={`p-3 border flex items-center justify-between text-xs hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ${config.modules.chat ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`} style={{ borderRadius: config.radius }}>
                    <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Interfaz de Soporte</span>
                    {config.modules.chat && <CheckCircle className="w-4 h-4 opacity-70" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col h-full rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl bg-zinc-900/50 relative">
            <div className="h-10 bg-zinc-950/80 backdrop-blur flex items-center px-4 gap-4 shrink-0 border-b border-zinc-800 z-10">
              <div className="flex gap-1.5 opacity-60">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 mx-4 max-w-md">
                <div className="bg-zinc-900/80 rounded-md text-[11px] text-zinc-500 font-mono py-1 px-3 text-center truncate border border-zinc-800/50">
                  demo.plataforma-astra.com
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto transition-all duration-700 ease-out p-8" style={{ backgroundColor: config.bgColor, color: config.textColor, fontFamily: config.fontFamily }}>
              <div className="max-w-4xl mx-auto space-y-8">
                
                <div className="flex justify-between items-center pb-4 border-b transition-colors duration-700" style={{ borderColor: `${config.textColor}15` }}>
                  <div className="font-semibold text-lg tracking-tight flex items-center gap-2">
                    <Box className="w-5 h-5 transition-colors duration-700" style={{ color: config.primaryColor }} /> Platforma Astra
                  </div>
                  <div className="flex gap-6 text-xs opacity-60 font-medium">
                    <span className="hover:opacity-100 cursor-pointer transition-opacity">Dashboard</span>
                    <span className="hover:opacity-100 cursor-pointer transition-opacity">Gestión</span>
                    <span className="hover:opacity-100 cursor-pointer transition-opacity">Ajustes</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 border shadow-sm transition-all duration-700 hover:shadow-md" style={{ backgroundColor: `${config.textColor}03`, borderColor: `${config.textColor}08`, borderRadius: config.radius }}>
                    <h4 className="text-xs opacity-60 mb-2 font-medium">Usuarios Concurrentes</h4>
                    <p className="text-2xl font-semibold">1,248</p>
                    <p className="text-[10px] mt-2 text-emerald-400 flex items-center font-medium"><ChevronRight className="w-3 h-3" /> +12.5% esta semana</p>
                  </div>
                  <div className="p-5 border shadow-sm transition-all duration-700 hover:shadow-md" style={{ backgroundColor: `${config.textColor}03`, borderColor: `${config.textColor}08`, borderRadius: config.radius }}>
                    <h4 className="text-xs opacity-60 mb-2 font-medium">Volumen de Inventario</h4>
                    <p className="text-2xl font-semibold">8,590</p>
                    <p className="text-[10px] mt-2 opacity-50 font-medium">Unidades verificadas</p>
                  </div>
                  <div className="p-5 shadow-sm transition-all duration-700 hover:shadow-md relative overflow-hidden" style={{ backgroundColor: config.primaryColor, borderRadius: config.radius }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                    <h4 className="text-xs opacity-90 mb-2 font-medium text-zinc-900" style={{ color: config.bgColor }}>Estado Operativo</h4>
                    <p className="text-2xl font-semibold text-zinc-900" style={{ color: config.bgColor }}>Óptimo</p>
                    <p className="text-[10px] mt-2 opacity-80 font-medium text-zinc-900" style={{ color: config.bgColor }}>Latencia: 24ms</p>
                  </div>
                </div>

                <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-top ${config.modules.inventory ? 'max-h-[800px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}>
                  {config.modules.inventory && (
                    <div className="p-6 border shadow-md transition-colors duration-700" style={{ backgroundColor: `${config.textColor}02`, borderColor: `${config.textColor}08`, borderRadius: config.radius }}>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-sm flex items-center gap-2 opacity-90">
                          <Database className="w-4 h-4 transition-colors duration-700" style={{ color: config.primaryColor }} /> Base de Datos Distribuida
                        </h3>
                        <button className="px-3 py-1.5 text-[11px] font-semibold text-zinc-900 shadow-sm flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: config.primaryColor, borderRadius: config.radius, color: config.bgColor }}>
                          Exportar CSV
                        </button>
                      </div>
                      <div className="space-y-1 overflow-x-auto">
                        <div className="grid grid-cols-5 gap-4 p-2 text-[10px] font-bold uppercase tracking-wider border-b min-w-[600px] transition-colors duration-700 opacity-50" style={{ borderColor: `${config.textColor}15` }}>
                          <span>SKU</span><span>Descriptor</span><span>Segmento</span><span>Stock</span><span>Estado</span>
                        </div>
                        {[
                          { id: 'ITM-001', name: 'Monitor IPS 24"', cat: 'Hardware', stock: 45, status: 'Disponible', statusColor: 'bg-emerald-400' },
                          { id: 'ITM-002', name: 'Teclado Mecánico', cat: 'Periféricos', stock: 12, status: 'Crítico', statusColor: 'bg-red-400' },
                          { id: 'ITM-003', name: 'Licencia Servidor', cat: 'Software', stock: 150, status: 'Disponible', statusColor: 'bg-emerald-400' },
                        ].map((item, i) => (
                          <div key={i} className="grid grid-cols-5 gap-4 p-3 text-xs items-center hover:bg-black/5 transition-colors min-w-[600px] cursor-pointer" style={{ borderRadius: config.radius }}>
                            <span className="font-mono text-[10px] opacity-50">{item.id}</span>
                            <span className="font-medium opacity-90">{item.name}</span>
                            <span className="text-[10px] py-0.5 px-2 w-fit bg-black/5 border" style={{ borderRadius: config.radius, borderColor: `${config.textColor}10` }}>{item.cat}</span>
                            <span className="font-mono text-[11px] opacity-80">{item.stock}</span>
                            <div className="flex items-center gap-2 font-medium text-[11px]">
                              <div className={`w-1.5 h-1.5 rounded-full ${item.statusColor}`}></div> 
                              {item.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-left ${config.modules.analytics ? 'max-h-[500px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}>
                    {config.modules.analytics && (
                      <div className="p-6 border shadow-md flex flex-col h-full transition-colors duration-700" style={{ backgroundColor: `${config.textColor}02`, borderColor: `${config.textColor}08`, borderRadius: config.radius }}>
                        <h3 className="font-semibold text-sm mb-6 flex items-center gap-2 pb-3 border-b transition-colors duration-700 opacity-90" style={{ borderColor: `${config.textColor}10` }}>
                          <BarChart2 className="w-4 h-4 transition-colors duration-700" style={{ color: config.primaryColor }} /> Telemetría
                        </h3>
                        <div className="flex-1 flex flex-col justify-center gap-5">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-medium opacity-70"><span>Ancho de Banda</span><span className="font-mono">82%</span></div>
                            <div className="h-1.5 w-full bg-black/5 overflow-hidden" style={{ borderRadius: config.radius }}>
                              <div className="h-full w-[82%] transition-colors duration-700" style={{ backgroundColor: config.primaryColor }}></div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-medium opacity-70"><span>Resolución de Peticiones</span><span className="font-mono">94%</span></div>
                            <div className="h-1.5 w-full bg-black/5 overflow-hidden" style={{ borderRadius: config.radius }}>
                              <div className="h-full w-[94%] transition-colors duration-700" style={{ backgroundColor: config.primaryColor }}></div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-medium opacity-70"><span>Carga de CPU</span><span className="font-mono">45%</span></div>
                            <div className="h-1.5 w-full bg-black/5 overflow-hidden" style={{ borderRadius: config.radius }}>
                              <div className="h-full w-[45%] bg-amber-400"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-right ${config.modules.chat ? 'max-h-[500px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}>
                    {config.modules.chat && (
                      <div className="p-6 border shadow-md flex flex-col h-80 transition-colors duration-700" style={{ backgroundColor: `${config.textColor}02`, borderColor: `${config.textColor}08`, borderRadius: config.radius }}>
                        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 pb-3 border-b transition-colors duration-700 opacity-90" style={{ borderColor: `${config.textColor}10` }}>
                          <MessageSquare className="w-4 h-4 transition-colors duration-700" style={{ color: config.primaryColor }} /> Logs del Sistema
                        </h3>
                        <div className="flex-1 space-y-3 overflow-hidden flex flex-col justify-end pb-4">
                          <div className="self-start px-3 py-2 text-[11px] bg-black/5 border opacity-80 max-w-[85%] rounded-bl-none font-medium" style={{ borderRadius: config.radius, borderColor: `${config.textColor}08` }}>
                            [SYS] Tarea cron ejecutada: Respaldo DB completado en 1.2s.
                          </div>
                          <div className="self-end px-3 py-2 text-[11px] font-medium max-w-[85%] shadow-sm transition-colors duration-700 rounded-br-none" style={{ backgroundColor: config.primaryColor, color: config.bgColor, borderRadius: config.radius }}>
                            Confirmado. ¿Programar limpieza de caché?
                          </div>
                        </div>
                        <div className="relative mt-auto">
                          <input type="text" placeholder="Ejecutar comando..." className="w-full py-2.5 px-3 bg-black/5 border border-black/5 outline-none text-xs transition-colors duration-700" style={{ borderRadius: config.radius, color: config.textColor, borderColor: `${config.textColor}15` }} />
                          <Send className="w-3.5 h-3.5 absolute right-3 top-2.5 opacity-40" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cotizador de Plataforma</h2>
            <p className="text-zinc-400 text-sm md:text-base">Estructura las bases técnicas de tu sistema para obtener una estimación en tiempo real y enviar la solicitud de desarrollo a producción.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 p-8 md:p-12 rounded-3xl border border-zinc-800/50">
            
            {/* Datos Técnicos y Presupuesto */}
            <input type="hidden" name="Arquitectura" value={PROJECT_TYPES.find(p => p.id === formData.projectType)?.label || ''} />
            <input type="hidden" name="Modulos Adicionales" value={formData.features.map(fId => AVAILABLE_FEATURES.find(f => f.id === fId)?.label).join(', ')} />
            <input type="hidden" name="Presupuesto Estimado" value={formattedPrice} />

            {/* Configuración visual del Laboratorio UI */}
            <input type="hidden" name="Color Fondo UI" value={config.bgColor} />
            <input type="hidden" name="Color Acento UI" value={config.primaryColor} />
            <input type="hidden" name="Color Texto UI" value={config.textColor} />
            <input type="hidden" name="Redondeo de Bordes" value={radiusLabel} />
            <input type="hidden" name="Tipografia Elegida" value={config.fontFamily} />
            <input type="hidden" name="Modulos Activos UI" value={activeModulesPreview} />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Nombre / Empresa</label>
                <input required type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Correo Electrónico</label>
                <input required type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Tipo de Arquitectura / Base</label>
              <select name="projectType" value={formData.projectType} onChange={handleFormChange} required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm text-zinc-300 cursor-pointer">
                {PROJECT_TYPES.map(type => (
                  <option key={type.id} value={type.id} disabled={type.id === ''} className="bg-zinc-900">{type.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300 block mb-2">Módulos Funcionales (Características Adicionales)</label>
              <div className="grid md:grid-cols-2 gap-3">
                {AVAILABLE_FEATURES.map(feature => {
                  const isSelected = formData.features.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border text-xs font-medium text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${isSelected ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300' : 'border-zinc-800/80 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'}`}
                    >
                      <span className="flex items-center gap-2">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4 opacity-50" />}
                        {feature.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Especificaciones Técnicas / Flujos de Usuario</label>
              <textarea name="details" value={formData.details} onChange={handleFormChange} required rows={4} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm resize-none" placeholder="Describe los requerimientos específicos, reglas de negocio..."></textarea>
            </div>

            {formData.projectType && (
              <div className="p-6 bg-zinc-950/80 border border-indigo-500/20 rounded-2xl flex items-center justify-between transition-all duration-500">
                <div>
                  <h4 className="text-sm text-indigo-300 font-medium mb-1">Presupuesto Estimado</h4>
                  <p className="text-xs text-zinc-500">Sujeto a evaluación técnica final.</p>
                </div>
                <div className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 md:w-6 md:h-6 text-indigo-500 opacity-50" />
                  {formattedPrice}
                </div>
              </div>
            )}

            {Boolean(state.errors) && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                Hubo un error de conexión al enviar el formulario. Verifica tu red e intenta nuevamente.
              </div>
            )}

            <button type="submit" disabled={state.submitting || state.succeeded || !formData.projectType} className="w-full bg-zinc-100 text-zinc-900 hover:bg-white hover:scale-[1.01] active:scale-[0.99] font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 text-sm md:text-base shadow-xl shadow-white/5">
              {state.submitting ? (
                <span className="animate-pulse">Procesando solicitud segura...</span>
              ) : state.succeeded ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700">Cotización enviada con éxito</span>
                </>
              ) : (
                <>
                  <span>Enviar Especificaciones y Agendar</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      <footer className="py-8 text-center text-zinc-600 text-xs md:text-sm border-t border-zinc-900 bg-zinc-950">
        <p>© 2026 Astra Studio. Ingeniería y Diseño Frontend.</p>
      </footer>
    </div>
  );
}