import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Settings, 
  LogOut, 
  Flame,
  Wine,
  Shield,
  MenuSquare,
  Download,
  Heart,
  Moon,
  Sun
} from 'lucide-react';

const MobileMenu = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [typedText, setTypedText] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Aplicar el modo oscuro al montar el componente
    const isDark = localStorage.getItem('darkMode') === 'true';
    applyDarkMode(isDark);
    setDarkMode(isDark);

    // Escuchar cambios en la preferencia del sistema solo si no hay valor en localStorage
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        const newDarkMode = e.matches;
        applyDarkMode(newDarkMode);
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
      }
    };

    // Aplicar preferencia del sistema si no hay valor en localStorage
    if (localStorage.getItem('darkMode') === null) {
      handleChange(mediaQuery);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const greeting = user?.username ? `Hola, ${user.username}` : 'Hola, ¿cómo estás?';
    
    const typeGreeting = async () => {
      setTypedText('');
      if (isOpen) {
        for (let i = 0; i <= greeting.length; i++) {
          setTypedText(greeting.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    };
    typeGreeting();
  }, [user, isOpen]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Comprobar si la app ya está instalada
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone;
    setIsInstallable(!isStandalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    applyDarkMode(newDarkMode);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } else {
      navigate('/download');
    }
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    onClose();
  };

  const handleCategorySearch = (category) => {
    navigate(`/search?category=${category}`);
    onClose();
  };

  const categories = [
    { 
      name: 'Tendencia', 
      icon: <Flame className="w-5 h-5 text-orange-500" />, 
      path: 'trending' 
    },
    { 
      name: 'Para ellos', 
      icon: <User className="w-5 h-5 text-blue-500" />, 
      path: 'for-him' 
    },
    { 
      name: 'Para ellas', 
      icon: <User className="w-5 h-5 text-pink-500" />, 
      path: 'for-her' 
    },
    { 
      name: 'Restaurantes', 
      icon: <MenuSquare className="w-5 h-5 text-red-500" />, 
      path: 'restaurants' 
    },
    { 
      name: 'Seguros', 
      icon: <Shield className="w-5 h-5 text-green-500" />, 
      path: 'insurance' 
    },
    { 
      name: 'Pasar el rato', 
      icon: <Wine className="w-5 h-5 text-purple-500" />, 
      path: 'entertainment' 
    }
  ];

  const buttonClasses = "w-full bg-gray-900 hover:bg-gray-800 dark:bg-primary-dark dark:hover:bg-primary-dark/90 text-white px-4 py-2 rounded-full text-sm transition-all";

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-white dark:bg-gray-900 text-gray-900 dark:text-white
          shadow-lg`}
      >
        {/* Header Section */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <div className="text-lg font-medium">
            <span className="dark:text-white text-gray-900">
              {typedText && (
                <span className="text-[#09FDFD]">
                  {typedText}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(100%-64px)] p-6 space-y-6">
          {/* Join Findout Button */}
          <div className="space-y-2">
            <Link to="/register-business" className="block" onClick={onClose}>
              <button className={buttonClasses}>
                <span className="flex items-center justify-center space-x-2">
                  <span className="flex-1 text-center">Unirme a Findout</span>
                  <Heart className="w-4 h-4 text-primary dark:text-gray-900" />
                </span>
              </button>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Registra tu negocio
            </p>
          </div>

          {/* Orders Link */}
          <div className="space-y-4">
            <Link 
              to="/orders" 
              className="flex items-center space-x-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" 
              onClick={onClose}
            >
              <div className="w-5 flex justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span>Ver mi pedido</span>
            </Link>
          </div>

          {/* Categories Section */}
          <div className="pt-4">
            <div className="text-lg font-medium mb-4">Descubre</div>
            <div className="space-y-4">
              {categories.map((category) => (
                <button
                  key={category.path}
                  onClick={() => handleCategorySearch(category.path)}
                  className="flex items-center space-x-4 w-full text-left text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="w-5 flex justify-center">
                    {category.icon}
                  </div>
                  <span>{category.name}</span>
                </button>
              ))}

              {/* Install/Download App Button */}
              <button 
                onClick={handleInstallClick}
                className={buttonClasses}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span className="flex-1 text-center">
                    {isInstallable ? 'Instalar App' : 'Descargar App'}
                  </span>
                  <Download className="w-4 h-4 text-primary dark:text-gray-900" />
                </span>
              </button>
            </div>
          </div>

          {/* Settings Section */}
          <div className="pt-4 space-y-4">
            <Link 
              to="/profile" 
              className="flex items-center space-x-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" 
              onClick={onClose}
            >
              <div className="w-5 flex justify-center">
                <User className="w-5 h-5" />
              </div>
              <span>Perfil</span>
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center space-x-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" 
              onClick={onClose}
            >
              <div className="w-5 flex justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <span>Configuración</span>
            </Link>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center space-x-4 w-full text-left text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <div className="w-5 flex justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileMenu;