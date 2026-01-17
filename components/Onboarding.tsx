import React, { useState, useEffect } from 'react';
import { User, Store, ArrowRight, Check, Upload, MapPin } from 'lucide-react';
import { UserProfile, UserType, DeliveryHistory } from '../types';
import { DEFAULT_CENTER } from '../constants';

interface OnboardingProps {
  onClose: () => void;
  onComplete: (user: UserProfile) => void;
  initialType?: UserType;
}

export default function Onboarding({ onClose, onComplete, initialType }: OnboardingProps) {
  const [step, setStep] = useState(initialType ? 2 : 1);
  const [type, setType] = useState<UserType>(initialType || 'motoboy');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [pix, setPix] = useState('');
  
  // Fake Mock History for Demo Purposes
  const generateMockHistory = (): DeliveryHistory[] => [
    { id: '101', restaurantName: 'Burger Kingo', date: new Date().toISOString(), value: 15.50, distance: '3.2 km' },
    { id: '102', restaurantName: 'Sushi House', date: new Date(Date.now() - 86400000).toISOString(), value: 22.00, distance: '5.1 km' }
  ];

  const handleFinish = () => {
    // Construct the user object
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name,
      type,
      status: 'available',
      location: { 
        // Logic will be handled in App.tsx to attach real GPS, 
        // but here we set defaults just in case.
        lat: DEFAULT_CENTER.lat,
        lng: DEFAULT_CENTER.lng 
      },
      city: 'São Paulo', // Default for MVP
      rating: 5.0, // New users start high
      rank: 'bronze',
      vehicleType: vehicle || 'N/A',
      pixKey: pix,
      minRate: 10,
      maxRate: 30,
      completedDeliveries: 0,
      walletBalance: 0,
      history: type === 'motoboy' ? [] : undefined // Start empty
    };
    onComplete(newUser);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
             <span className="text-xs">Fechar</span>
          </button>
          <h2 className="text-2xl font-black italic tracking-tighter">
            Bike<span className="text-orange-500">GO!</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {step === 1 ? 'Crie sua conta em segundos' : type === 'motoboy' ? 'Cadastro de Entregador' : 'Cadastro de Restaurante'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Conta</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setType('motoboy')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      type === 'motoboy' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <User size={32} />
                    <span className="font-bold">Motoboy</span>
                  </button>
                  <button 
                    onClick={() => setType('restaurant')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      type === 'restaurant' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Store size={32} />
                    <span className="font-bold">Restaurante</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome ou da loja" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">
                  Cancelar
                </button>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!name || !email}
                  className="flex-1 bg-orange-500 disabled:opacity-50 text-white py-3 rounded-lg font-bold hover:bg-orange-600 flex items-center justify-center gap-2"
                >
                  Continuar <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-300">
               
               {/* Pre-filled info check */}
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                 <label className="block text-xs font-bold text-slate-400 uppercase">Nome / Email</label>
                 <div className="text-sm font-semibold text-slate-700">{name || 'Usuário'} ({email || 'email@exemplo.com'})</div>
               </div>

               {/* Step 2 Content varies by type */}
               {type === 'motoboy' ? (
                 <>
                    <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <Upload size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 text-sm">Foto de Perfil & CNH</h4>
                        <p className="text-xs text-blue-700">Para garantir a segurança, precisamos validar seus documentos.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Veículo</label>
                      <input 
                        type="text" 
                        value={vehicle}
                        onChange={e => setVehicle(e.target.value)}
                        placeholder="Ex: Honda CG 160 Titan" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chave PIX</label>
                      <input 
                        type="text" 
                        value={pix}
                        onChange={e => setPix(e.target.value)}
                        placeholder="CPF, E-mail ou Aleatória" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                 </>
               ) : (
                 <>
                    {/* Restaurant Location Warning */}
                    <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <div className="bg-amber-100 p-2 rounded-full text-amber-600 shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-900 text-sm">Localização Exata</h4>
                        <p className="text-xs text-amber-800 mt-1">
                          Usaremos seu <strong>GPS atual</strong> para fixar o endereço do restaurante no mapa. Certifique-se de estar no estabelecimento.
                        </p>
                      </div>
                    </div>

                    {/* Restaurant fields */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CNPJ</label>
                      <input type="text" placeholder="00.000.000/0001-00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Cozinha</label>
                      <input type="text" placeholder="Ex: Pizzaria, Hamburgueria" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" />
                    </div>
                 </>
               )}

              <div className="flex gap-3 mt-6">
                {!initialType && (
                  <button onClick={() => setStep(1)} className="px-4 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">
                    Voltar
                  </button>
                )}
                <button 
                  onClick={handleFinish}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                >
                  <Check size={18} /> Finalizar Cadastro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}