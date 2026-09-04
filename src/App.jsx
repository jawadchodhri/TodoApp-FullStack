import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './Component/Header';
import TodoPanel from './Component/TodoPanel';
import AuthModal from './Component/AuthModal';
import { Loader2 } from 'lucide-react';

function MainApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-blue-500">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased">
      <Header />
      {user ? <TodoPanel /> : <AuthModal />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}