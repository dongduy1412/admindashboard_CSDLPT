import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Khutro from './pages/Khutro';
import Phongtro from './pages/Phongtro';
import Khachthue from './pages/Khachthue';
import Hopdong from './pages/Hopdong';
import Hoadon from './pages/Hoadon';
import Nguoidung from './pages/Nguoidung';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/khutro" element={<Khutro />} />
                      <Route path="/phongtro" element={<Phongtro />} />
                      <Route path="/khachthue" element={<Khachthue />} />
                      <Route path="/hopdong" element={<Hopdong />} />
                      <Route path="/hoadon" element={<Hoadon />} />
                      <Route path="/nguoidung" element={<Nguoidung />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
