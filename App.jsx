import Navigation from './src/screens/navigator/Navigation.jsx';
import { AuthProvider } from './src/context/userAuth.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
