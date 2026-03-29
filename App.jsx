import { SafeAreaProvider } from 'react-native-safe-area-context'
import Login from './src/login/Login.jsx'

export default function App() {
  return (
    <SafeAreaProvider>
      <Login />
    </SafeAreaProvider>
  )
}
