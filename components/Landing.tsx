import React from 'react';
import { Map, Bike, Store, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { UserType } from '../types';

interface LandingProps {
  onExplore: () => void;
  onRegister: (type: UserType) => void;
}

export default function Landing({ onExplore, onRegister }: LandingProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-4xl w-full z-10 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center bg-orange-500 p-4 rounded-2xl mb-4 shadow-2xl shadow-orange-500/20">
            <Bike size={48} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-2">
            Bike<span className="text-orange-500">GO!</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium">
            Velocidade. Confiança. Sem burocracia.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
          {/* Motoboy Card */}
          <button 
            onClick={() => onRegister('motoboy')}
            className="group relative bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-orange-500 transition-all p-8 rounded-2xl text-left flex flex-col gap-4 shadow-xl"
          >
            <div className="bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bike className="text-orange-500" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Sou Motoboy</h3>
              <p className="text-slate-400 text-sm">Faça entregas, gerencie seus ganhos e suba de patente.</p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-orange-500 font-bold text-sm">
              Começar agora <ArrowRight size={16} />
            </div>
          </button>

          {/* Restaurant Card */}
          <button 
            onClick={() => onRegister('restaurant')}
            className="group relative bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-blue-500 transition-all p-8 rounded-2xl text-left flex flex-col gap-4 shadow-xl"
          >
            <div className="bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Sou Restaurante</h3>
              <p className="text-slate-400 text-sm">Encontre entregadores próximos e registre sua localização exata.</p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-blue-500 font-bold text-sm">
              Cadastrar loja <ArrowRight size={16} />
            </div>
          </button>
        </div>

        {/* Secondary Action: Explore */}
        <button 
          onClick={onExplore}
          className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 backdrop-blur-sm transition-all hover:scale-105"
        >
          <Map size={20} className="text-slate-300" />
          <span className="font-semibold">Apenas explorar o mapa (Visitante)</span>
        </button>

        {/* Trust Badges */}
        <div className="mt-16 flex gap-8 text-slate-500 text-sm font-medium">
          <span className="flex items-center gap-2"><ShieldCheck size={16} /> Identidade Validada</span>
          <span className="flex items-center gap-2"><DollarSign size={16} /> Pagamento via PIX</span>
        </div>
      </div>
    </div>
  );
}