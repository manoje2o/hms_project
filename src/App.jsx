import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import PatientPage from './pages/patient';
import Signin from './pages/auth/Signin';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css'; 
import HospitalPage from './pages/settings/hospitals';
import Role from './pages/role';
import Prescription from './pages/prescription';
import Dashboard from './pages/dashboard';
import Member from './pages/members';
import Invoice from './pages/invoice';
import Inventary from './pages/inventary';
import Expanse from './pages/expense';
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/" element={< Layout/>}>
          <Route path="home" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patient" element={<PatientPage />} />
          <Route path="hospital" element={<HospitalPage />} />
          <Route path="role" element={<Role/>} />
          <Route path="prescription" element={<Prescription/>} />
          <Route path="newmember" element={<Member/>} />
          <Route path="invoice" element={<Invoice/>} />
          <Route path="inventary" element={<Inventary/>} />
          <Route path="expanse" element={<Expanse/>} />
        </Route>
      </Routes>
      <Toaster  />
    </>
  );
};

export default App;
