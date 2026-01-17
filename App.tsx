import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { 
  User, Map as MapIcon, Navigation, Filter, Star, ShieldCheck, 
  Bike, Store, Menu, X, CheckCircle, Clock, DollarSign, LogIn, Locate, Navigation2, LayoutDashboard,
  Moon, Sun, Bell, AlertCircle, Ruler, Briefcase
} from 'lucide-react';
import { UserProfile, UserType, FilterState, Status, Location, AppNotification } from './types';
import { MOCK_USERS, DEFAULT_CENTER, RANK_COLORS, STATUS_COLORS, XP_TO_LEVEL_UP } from './constants';
import Onboarding from './components/Onboarding';
import Landing from './components/Landing';
import MotoboyDashboard from './components/MotoboyDashboard';

// --- Icons ---
const createCustomIcon = (type: UserType, status: Status) => {
  const color = status === 'available' ? '#22c55e' : status === 'busy' ? '#eab308' : '#9ca3af';
  const html = `
    <div style="
      background-color: white;
      border: 3px solid ${color};
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    ">
      ${type === 'motoboy' 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>'
      }
    </div>
  `;
  return L.divIcon({
    html: html,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const userLocationIcon = L.divIcon({
  html: '<div class="user-pulse"></div><div class="user-dot"></div>',
  className: 'user-location-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// --- Helper: Calculate Distance ---
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
};

// --- Helper Components ---
const LocationController = ({ location, trigger }: { location: Location | null, trigger: number }) => {
  const map = useMap();
  const processedTrigger = useRef(0);
  useEffect(() => {
    if (location && trigger > processedTrigger.current) {
      processedTrigger.current = trigger;
      map.flyTo([location.lat, location.lng], 15, { animate: true, duration: 1.5 });
    }
  }, [trigger, location, map]);
  return null;
};

const NotificationToast = ({ notifications, onDismiss }: { notifications: AppNotification[], onDismiss: (id: string) => void }) => {
  return (
    <div className="fixed top-20 right-4 z-[1100] flex flex-col gap-2 pointer-events-none">
      {notifications.map(notif => (
        <div 
          key={notif.id} 
          className={`pointer-events-auto w-80 p-4 rounded-xl shadow-2xl border-l-4 animate-in slide-in-from-right duration-300 flex items-start gap-3 relative
            ${notif.type === 'success' ? 'bg-white border-green-500 text-slate-800' : ''}
            ${notif.type === 'info' ? 'bg-slate-800 border-blue-500 text-white' : ''}
            ${notif.type === 'alert' ? 'bg-orange-50 border-orange-500 text-orange-900' : ''}
          `}
        >
          <div className={`mt-0.5 ${notif.type === 'success' ? 'text-green-500' : notif.type === 'info' ? 'text-blue-400' : 'text-orange-500'}`}>
            {notif.type === 'success' && <CheckCircle size={18} />}
            {notif.type === 'info' && <Bell size={18} />}
            {notif.type === 'alert' && <AlertCircle size={18} />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm leading-tight">{notif.title}</h4>
            <p className="text-xs opacity-90 mt-1 leading-normal">{notif.message}</p>
          </div>
          <button onClick={() => onDismiss(notif.id)} className="absolute top-2 right-2 opacity-50 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState<'landing' | 'map'>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // States
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingType, setOnboardingType] = useState<UserType | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [proposalPrice, setProposalPrice] = useState<string>('');
  const [isDailyRate, setIsDailyRate] = useState(false); // Mode for hiring

  const [myLocation, setMyLocation] = useState<Location | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number>(0);
  const [mapCenterTrigger, setMapCenterTrigger] = useState(0);
  const initializedRef = useRef(false);

  const [filters, setFilters] = useState<FilterState>({
    showMotoboys: true,
    showRestaurants: true,
    minRank: 'all',
    onlyAvailable: false,
    maxDistance: 20,
    onlyDailyRate: false,
    priceRange: { min: 0, max: 200 }
  });

  const lightTiles = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  const addNotification = (title: string, message: string, type: 'success' | 'info' | 'alert') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, title, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  // --- Simulation: Dashboard XP Update ---
  // When Dashboard triggers a "Simulated Delivery", we update the user state here
  const handleSimulateDelivery = () => {
    if (!currentUser || currentUser.type !== 'motoboy') return;

    setCurrentUser(prev => {
      if (!prev || prev.type !== 'motoboy') return prev;
      
      const xpGain = 2;
      let newXp = (prev.xp || 0) + xpGain;
      let newRank = prev.rank;
      let leveledUp = false;

      // Level Up Logic (0 -> 100)
      if (newXp >= XP_TO_LEVEL_UP) {
        newXp = newXp - XP_TO_LEVEL_UP; // Reset XP but keep overflow
        leveledUp = true;
        
        // Upgrade Rank
        if (prev.rank === 'bronze') newRank = 'silver';
        else if (prev.rank === 'silver') newRank = 'gold';
        else if (prev.rank === 'gold') newRank = 'diamond';
      }

      if (leveledUp && newRank !== prev.rank) {
         addNotification("PARABÉNS! NOVA PATENTE!", `Você subiu para ${newRank?.toUpperCase()}!`, 'success');
      } else {
         addNotification("Entrega Concluída", `Você ganhou +${xpGain} XP!`, 'success');
      }

      return {
        ...prev,
        xp: newXp,
        rank: newRank,
        completedDeliveries: (prev.completedDeliveries || 0) + 1,
        walletBalance: (prev.walletBalance || 0) + 15.00
      };
    });
  };

  // --- Simulation Logic (Incoming Requests) ---
  useEffect(() => {
    if (!currentUser || view !== 'map') return;
    const interval = setInterval(() => {
      const chance = Math.random();
      if (currentUser.type === 'motoboy' && currentUser.status === 'available') {
        if (chance > 0.90) { 
          addNotification("Nova Solicitação!", "Restaurante 'Burger Kingo' (2.5km) - Oferta: R$ 18,50", "info");
        }
      }
      if (currentUser.type === 'restaurant') {
        if (chance > 0.95) { 
          addNotification("Solicitação Recebida", "Motoboy 'Carlos Silva' propôs R$ 22,00 pela entrega.", "alert");
        }
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [currentUser, view]);

  // --- Geolocation Logic ---
  useEffect(() => {
    // Only run this effect if we are in map mode
    if (view !== 'map') return;

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLoc = { lat: position.coords.latitude, lng: position.coords.longitude };
          
          setMyLocation(newLoc);
          setLocationAccuracy(position.coords.accuracy);
          
          // Only center on the very first lock found
          if (!initializedRef.current) {
            setMapCenterTrigger(Date.now());
            initializedRef.current = true;
          }

          // Update current user location in state without breaking the watcher
          // We use functional state update to avoid dependency on 'currentUser'
          setCurrentUser(prev => {
             if (!prev) return null;
             // Here we could add logic to only update if moved > 5 meters to save renders,
             // but for this demo, direct update is smoother.
             return { ...prev, location: newLoc };
          });
        },
        (error) => console.warn("Geolocation error:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      
      // Cleanup: Stop watching when component unmounts or view changes
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [view]); // Critical: Removed currentUser from dependency array to prevent watcher reset

  const handleExplore = () => {
    setView('map');
    if (myLocation) {
      setTimeout(() => { setMapCenterTrigger(Date.now()); initializedRef.current = true; }, 100);
    }
  };

  const handleCenterMap = () => {
    if (myLocation) setMapCenterTrigger(Date.now());
    else alert("Aguardando sinal de GPS...");
  };

  // --- Handle Action: Hiring ---
  const handleHire = (targetUser: UserProfile) => {
    if (!currentUser) return;
    
    // Validation for Daily Rate
    let messageBody = "";
    if (isDailyRate) {
      const val = parseFloat(proposalPrice);
      // New limits: 81.50 to 301.50
      if (isNaN(val) || val < 81.50 || val > 301.50) {
        alert("O valor da diária deve ser entre R$ 81,50 e R$ 301,50.");
        return;
      }
      
      // Calculate Fee
      const fee = 1.50;
      const total = val + fee;
      messageBody = `Proposta de DIÁRIA: R$ ${val.toFixed(2)} + R$ ${fee.toFixed(2)} (Taxa) = Total R$ ${total.toFixed(2)}.`;
    } else {
      const price = proposalPrice ? `R$ ${proposalPrice}` : 'a combinar';
      messageBody = `Proposta de CORRIDA (${price}) enviada.`;
    }

    addNotification(
      "Solicitação Enviada", 
      `${messageBody} Aguarde a confirmação de ${targetUser.name}.`, 
      "success"
    );
    setActiveProfile(null);
    setProposalPrice('');
    setIsDailyRate(false);
  };

  // --- Filtering Logic ---
  const filteredUsers = MOCK_USERS.filter(user => {
    if (!filters.showMotoboys && user.type === 'motoboy') return false;
    if (!filters.showRestaurants && user.type === 'restaurant') return false;
    if (filters.onlyAvailable && user.status !== 'available') return false;
    
    if (filters.onlyDailyRate && user.type === 'motoboy' && !user.acceptsDailyRate) return false;

    if (user.type === 'motoboy' && filters.minRank !== 'all') {
      const ranks = ['bronze', 'silver', 'gold', 'diamond'];
      if (ranks.indexOf(user.rank || 'bronze') < ranks.indexOf(filters.minRank)) return false;
    }

    if (user.minRate && user.maxRate) {
      if (user.maxRate < filters.priceRange.min || user.minRate > filters.priceRange.max) return false;
    }

    const center = myLocation || DEFAULT_CENTER;
    const distance = calculateDistance(center.lat, center.lng, user.location.lat, user.location.lng);
    if (distance > filters.maxDistance) return false;

    return true;
  });

  const handleLogin = (newUser: UserProfile) => {
    const finalUser = myLocation ? { ...newUser, location: myLocation } : newUser;
    if (finalUser.type === 'motoboy') {
      // Initialize mock data for new login
      finalUser.history = [];
      finalUser.walletBalance = 0;
      finalUser.completedDeliveries = 0;
      finalUser.xp = 0;
      finalUser.rank = 'bronze';
    }
    setCurrentUser(finalUser);
    setShowOnboarding(false);
    setView('map'); 
    setTimeout(() => {
      addNotification("Bem-vindo ao BikeGO!", "Você está visível no mapa.", "success");
    }, 1000);
    setTimeout(() => {
      setMapCenterTrigger(Date.now());
      initializedRef.current = true;
    }, 500);
  };

  const StatusButton = ({ status, current }: { status: Status; current: Status }) => (
    <button
      onClick={() => currentUser && setCurrentUser({ ...currentUser, status })}
      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-r last:border-r-0 transition-colors
        ${current === status 
          ? 'bg-slate-800 text-white' 
          : darkMode ? 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800' : 'bg-white text-slate-500 hover:bg-slate-50'
        }
      `}
    >
      {status}
    </button>
  );

  if (view === 'landing') {
    return (
      <>
        <Landing onExplore={handleExplore} onRegister={(type) => { setOnboardingType(type); setShowOnboarding(true); }} />
        {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} onComplete={handleLogin} initialType={onboardingType} />}
      </>
    );
  }

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden relative font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      
      <NotificationToast notifications={notifications} onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />

      {/* --- Navbar --- */}
      <nav className={`h-16 shadow-md flex items-center justify-between px-4 z-20 shrink-0 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-white'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-orange-500 p-2 rounded-lg text-white"><Bike size={24} /></div>
          <h1 className={`text-xl font-black italic tracking-tighter hidden sm:block ${darkMode ? 'text-white' : 'text-slate-800'}`}>Bike<span className="text-orange-500">GO!</span></h1>
        </div>
        
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
               {currentUser.type === 'motoboy' && (
                 <button onClick={() => setShowDashboard(true)} className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`} title="Meu Painel"><LayoutDashboard size={20} /></button>
               )}
               <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[currentUser.status]}`}></div>
                <span className={`text-sm font-semibold max-w-[100px] truncate ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{currentUser.name}</span>
              </div>
            </div>
          ) : (
            <button onClick={() => { setOnboardingType(undefined); setShowOnboarding(true); }} className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2"><LogIn size={16} /> Entrar</button>
          )}
        </div>
      </nav>

      {/* --- Main Map Area --- */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          key={`map-container-${darkMode ? 'dark' : 'light'}`}
          center={DEFAULT_CENTER} zoom={13} scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: darkMode ? '#0f172a' : '#e2e8f0' }}
        >
          <TileLayer attribution={attribution} url={darkMode ? darkTiles : lightTiles} className={darkMode ? 'map-tiles-dark' : ''} />
          <LocationController location={myLocation} trigger={mapCenterTrigger} />
          {myLocation && (
            <>
              <Circle center={myLocation} radius={filters.maxDistance * 1000} pathOptions={{ color: '#f97316', dashArray: '10, 10', fillColor: 'transparent', weight: 1, opacity: 0.4 }} />
              <Circle center={myLocation} radius={locationAccuracy || 50} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1, opacity: 0.3 }} />
              <Marker position={myLocation} icon={userLocationIcon} zIndexOffset={1000}><Popup><div className="text-center"><span className="font-bold text-slate-800">Você está aqui</span></div></Popup></Marker>
            </>
          )}
          {filteredUsers.map(user => {
             if (currentUser && user.id === currentUser.id) return null;
             return <Marker key={user.id} position={user.location} icon={createCustomIcon(user.type, user.status)} eventHandlers={{ click: () => { setActiveProfile(user); setIsDailyRate(false); setProposalPrice(''); }, }} />;
          })}
        </MapContainer>

        {/* --- Floating Action: Theme Toggle & Locate --- */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
           <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-full shadow-xl transition-all active:scale-95 border-2 ${darkMode ? 'bg-slate-800 text-yellow-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'}`}>{darkMode ? <Sun size={24} /> : <Moon size={24} />}</button>
           <button onClick={handleCenterMap} className={`p-3 rounded-full shadow-xl transition-all active:scale-95 border-2 ${myLocation ? (darkMode ? 'bg-slate-800 text-blue-400 border-slate-700' : 'bg-white text-blue-600 border-blue-100') : (darkMode ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-wait' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-wait')}`}>{myLocation ? <Navigation2 size={24} fill="currentColor" /> : <Locate size={24} className="animate-pulse" />}</button>
        </div>

        {/* --- Floating Action: Filters --- */}
        <div className="absolute top-4 left-4 z-[400]">
           <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-full shadow-xl transition-transform active:scale-95 ${darkMode ? 'bg-slate-800 text-slate-200 hover:text-orange-400' : 'bg-white text-slate-700 hover:text-orange-600'}`}><Filter size={24} /></button>
           
           {showFilters && (
             <div className={`mt-2 rounded-xl shadow-xl p-4 w-72 animate-in fade-in slide-in-from-top-4 duration-200 relative ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700'}`}>
                {/* Close Button for Filters */}
                <button 
                  onClick={() => setShowFilters(false)} 
                  className={`absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors ${darkMode ? 'hover:bg-white/10' : ''}`}
                >
                  <X size={16} />
                </button>

                <h3 className={`font-bold mb-3 text-sm flex items-center justify-between mr-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Filtros do Mapa
                  <span className="text-[10px] uppercase text-orange-500 cursor-pointer hover:underline" onClick={() => setFilters({showMotoboys: true, showRestaurants: true, minRank: 'all', onlyAvailable: false, maxDistance: 20, onlyDailyRate: false, priceRange: {min:0, max:200}})}>Limpar</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                     <label className={`flex items-center gap-2 text-xs p-2 rounded border cursor-pointer ${filters.showMotoboys ? 'border-orange-500 bg-orange-50/10 text-orange-600' : 'border-transparent'}`}>
                        <input type="checkbox" checked={filters.showMotoboys} onChange={e => setFilters({...filters, showMotoboys: e.target.checked})} className="accent-orange-500" /> Motoboys
                     </label>
                     <label className={`flex items-center gap-2 text-xs p-2 rounded border cursor-pointer ${filters.showRestaurants ? 'border-orange-500 bg-orange-50/10 text-orange-600' : 'border-transparent'}`}>
                        <input type="checkbox" checked={filters.showRestaurants} onChange={e => setFilters({...filters, showRestaurants: e.target.checked})} className="accent-orange-500" /> Lojas
                     </label>
                  </div>

                  {/* Daily Rate Filter */}
                  <label className={`flex items-center gap-2 text-xs p-2 rounded border cursor-pointer ${filters.onlyDailyRate ? 'border-purple-500 bg-purple-50/10 text-purple-600' : 'border-transparent'}`}>
                      <input type="checkbox" checked={filters.onlyDailyRate} onChange={e => setFilters({...filters, onlyDailyRate: e.target.checked})} className="accent-purple-500" /> 
                      <span className="flex items-center gap-1 font-bold"> <Briefcase size={12} /> Aceita Diária (R$ 81,50+)</span>
                  </label>

                  <div className={`border-t pt-3 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                     <div className="flex justify-between text-xs font-semibold mb-2">
                       <span className="flex items-center gap-1"><Ruler size={12}/> Raio (Distância)</span>
                       <span className="text-orange-500">{filters.maxDistance} km</span>
                     </div>
                     <input type="range" min="1" max="50" step="1" value={filters.maxDistance} onChange={e => setFilters({...filters, maxDistance: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"/>
                  </div>

                  <div className={`border-t pt-3 space-y-2 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <label className="flex items-center justify-between text-sm cursor-pointer opacity-90 hover:opacity-100">
                      <span>Apenas Disponíveis</span>
                      <input type="checkbox" checked={filters.onlyAvailable} onChange={e => setFilters({...filters, onlyAvailable: e.target.checked})} className="accent-orange-500 w-4 h-4" />
                    </label>
                    <select value={filters.minRank} onChange={(e) => setFilters({...filters, minRank: e.target.value as any})} className={`w-full text-sm rounded-md p-2 outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-300'}`}>
                      <option value="all">Qualquer Patente</option>
                      <option value="bronze">Bronze +</option>
                      <option value="silver">Prata +</option>
                      <option value="gold">Gold +</option>
                      <option value="diamond">Diamante</option>
                    </select>
                  </div>
                </div>
             </div>
           )}
        </div>

        {/* --- Floating Action: Profile Modal --- */}
        {activeProfile && (
          <div className="absolute bottom-0 left-0 right-0 sm:bottom-4 sm:left-auto sm:right-4 sm:w-96 z-[500] animate-in slide-in-from-bottom-10 duration-300">
             <div className={`sm:rounded-2xl shadow-2xl overflow-hidden border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
               <div className="h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
               <div className="p-5">
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                       {activeProfile.name}
                       {activeProfile.type === 'motoboy' && activeProfile.rank && <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${RANK_COLORS[activeProfile.rank]}`}>{activeProfile.rank}</span>}
                     </h2>
                     <p className={`text-sm flex items-center gap-1 mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                       <MapIcon size={12} /> {activeProfile.city} • {activeProfile.type === 'restaurant' ? activeProfile.cuisine : activeProfile.vehicleType}
                     </p>
                     
                     {/* XP Display for Visitors */}
                     {activeProfile.type === 'motoboy' && (
                       <div className="mt-2 w-full max-w-[150px]">
                         <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-0.5">
                           <span>XP</span>
                           <span>{activeProfile.xp || 0} / 100</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                           <div className="h-full bg-orange-500" style={{ width: `${activeProfile.xp || 0}%` }}></div>
                         </div>
                       </div>
                     )}

                   </div>
                   <button onClick={() => setActiveProfile(null)} className={`${darkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}><X size={20} /></button>
                 </div>

                 <div className="flex items-center gap-4 mb-6 mt-4">
                   <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700 font-bold text-sm"><Star size={14} fill="currentColor" /> {activeProfile.rating}</div>
                   <div className={`text-xs font-bold px-2 py-1 rounded uppercase ${activeProfile.status === 'available' ? 'bg-green-100 text-green-700' : activeProfile.status === 'busy' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{activeProfile.status}</div>
                   
                   {/* Badge for Daily Rate */}
                   {activeProfile.type === 'motoboy' && activeProfile.acceptsDailyRate && (
                     <div className="text-[10px] font-bold px-2 py-1 rounded bg-purple-100 text-purple-700 flex items-center gap-1 border border-purple-200">
                        <Briefcase size={10} /> Aceita Diária
                     </div>
                   )}
                 </div>

                 {currentUser ? (
                   <div className="space-y-3">
                     {activeProfile.pixKey && (
                      <div className={`p-3 rounded-lg border flex items-center justify-between ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                        <div>
                          <p className={`text-[10px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>CHAVE PIX</p>
                          <code className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>{activeProfile.pixKey}</code>
                        </div>
                        <ShieldCheck size={16} className="text-green-500" />
                      </div>
                     )}
                     
                     {/* Proposal Input & Daily Rate Toggle */}
                     <div className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-orange-50 border-orange-100'}`}>
                        {activeProfile.type === 'motoboy' && activeProfile.acceptsDailyRate && (
                          <div className="flex items-center justify-between mb-3 bg-white/50 p-2 rounded">
                            <label className="text-xs font-bold flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" checked={isDailyRate} onChange={e => setIsDailyRate(e.target.checked)} className="accent-purple-600 w-4 h-4"/>
                               Solicitar Diária
                            </label>
                            {isDailyRate && <span className="text-[10px] font-bold text-purple-600">R$ 81,50 - 301,50</span>}
                          </div>
                        )}

                        <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-slate-400' : 'text-orange-800'}`}>
                          {isDailyRate ? 'Valor da Diária (R$)' : 'Valor da Corrida (R$)'}
                        </label>
                        <input 
                          type="number" 
                          placeholder={isDailyRate ? "Entre 81.50 e 301.50" : "Ex: 25.00"}
                          value={proposalPrice}
                          onChange={(e) => setProposalPrice(e.target.value)}
                          className={`w-full p-2 rounded border focus:border-orange-500 outline-none ${darkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-orange-200'}`}
                        />
                        <p className={`text-[10px] mt-1 flex justify-between ${darkMode ? 'text-slate-500' : 'text-orange-700/70'}`}>
                           <span>{isDailyRate ? 'Valor sujeito a aprovação.' : 'Defina o valor para confirmação.'}</span>
                           {isDailyRate && <span className="font-bold text-red-500">+ R$ 1,50 Taxa</span>}
                        </p>
                     </div>

                     <button 
                       onClick={() => handleHire(activeProfile)}
                       className={`w-full text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg transition-all active:scale-[0.98]
                         ${isDailyRate ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}
                       `}
                     >
                       <span className="relative flex h-3 w-3"><span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDailyRate ? 'bg-purple-400' : 'bg-green-400'}`}></span><span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span></span>
                       {isDailyRate ? 'Solicitar Diária' : 'Chamar Agora'}
                     </button>
                   </div>
                 ) : (
                   <div className={`border p-4 rounded-xl text-center ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-orange-50 border-orange-100'}`}>
                     <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-slate-400' : 'text-orange-800'}`}>Faça login para ver contatos e contratar este profissional.</p>
                     <button onClick={() => { setOnboardingType(undefined); setShowOnboarding(true); }} className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-orange-600">Criar Conta Grátis</button>
                   </div>
                 )}
               </div>
             </div>
          </div>
        )}
      </div>

      {currentUser && currentUser.type === 'motoboy' && (
        <div className={`border-t flex shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[1000] ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <StatusButton status="offline" current={currentUser.status} />
          <StatusButton status="available" current={currentUser.status} />
          <StatusButton status="busy" current={currentUser.status} />
        </div>
      )}

      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} onComplete={handleLogin} initialType={onboardingType} />}
      
      {/* Passing handleSimulateDelivery to Dashboard for testing XP */}
      {currentUser && showDashboard && <MotoboyDashboard user={currentUser} onClose={() => setShowDashboard(false)} onSimulateJob={handleSimulateDelivery} />}
    </div>
  );
}