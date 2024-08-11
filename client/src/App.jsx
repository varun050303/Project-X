import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import { AuthProvider } from './providers/AuthProvider';
import GoogleCallback from "./components/OAuth/GoogleCallback";

function App() {

  return (

    <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/google/callback" element={<GoogleCallback />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </div>

  )
}

export default App
