import React from 'react';
import { X, TrendingUp, Package, Calendar, Wallet, Trophy, Zap } from 'lucide-react';
import { UserProfile } from '../types';
import { XP_TO_LEVEL_UP, RANK_COLORS } from '../constants';

interface MotoboyDashboardProps {
  user: UserProfile;
  onClose: () => void;
  onSimulateJob?: () => void;
}

export default function MotoboyDashboard({ user, onClose, onSimulateJob }: MotoboyDashboardProps) {
  if (user.type !== 'motoboy') return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex items-center justify-between text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold">Painel do Entregador</h2>
            <p className="text-slate-400 text-sm">Bem-vindo, {user.name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* XP & Rank Section (Gamification) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                 <Trophy size={16} className="text-yellow-500" /> Patente Atual
              </span>
              <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold border ${user.rank ? RANK_COLORS[user.rank] : ''}`}>
                {user.rank}
              </span>
            </div>
            
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-black text-slate-800">{user.xp || 0}</span>
              <span className="text-sm font-bold text-slate-400 mb-1.5">/ {XP_TO_LEVEL_UP} XP</span>
            </div>
            
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500" 
                 style={{ width: `${(user.xp || 0)}%` }}
               ></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right">Complete entregas para subir de nível!</p>

            {/* Simulation Button for Demo */}
            {onSimulateJob && (
               <button 
                 onClick={onSimulateJob}
                 className="mt-4 w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold border border-blue-200 flex items-center justify-center gap-2 transition-colors"
               >
                 <Zap size={14} /> Simular Entrega Concluída (+2 XP)
               </button>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Wallet size={20} />
                <span className="text-xs font-bold uppercase">Saldo Atual</span>
              </div>
              <p className="text-2xl font-black text-slate-800">R$ {user.walletBalance?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <Package size={20} />
                <span className="text-xs font-bold uppercase">Entregas</span>
              </div>
              <p className="text-2xl font-black text-slate-800">{user.completedDeliveries || 0}</p>
            </div>
          </div>

          {/* History Section */}
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" />
            Histórico Recente
          </h3>

          <div className="space-y-3">
            {user.history && user.history.length > 0 ? (
              user.history.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.restaurantName}</h4>
                    <p className="text-xs text-slate-500 mt-1">{new Date(item.date).toLocaleDateString()} • {item.distance}</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-green-600">+ R$ {item.value.toFixed(2)}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">Concluída</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package size={24} className="opacity-50" />
                </div>
                <p className="text-sm">Nenhuma entrega realizada ainda.</p>
                <p className="text-xs mt-1">Fique online no mapa para receber chamados!</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-800">
             <Wallet size={18} /> Sacar Valores
          </button>
        </div>

      </div>
    </div>
  );
}