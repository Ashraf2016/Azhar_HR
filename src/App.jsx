import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmployeeListPage from "./pages/EmployeeListPage";
import CreateUserPage from "./pages/CreateUserPage";
import EmployeeProfilePage from "./pages/EmployeeProfilePage";
import UserPermissions from "./pages/UserPermissions";
import PDFGenerator from "./PdfGenerator";
import { IsLoggedInProvider } from "./contexts/isLoggedIn";

const App = () => {
  return (
    <Router>
      <IsLoggedInProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar onLogoClick={() => {}} />
          <Routes>
            <Route path="/" element={<EmployeeListPage />} />
            <Route path="/profile/:employeeId" element={<EmployeeProfilePage />} />
            <Route path="/pdf" element={<PDFGenerator />} />
            <Route path="/createUser" element={<CreateUserPage />} />
            <Route path="/permissions" element={<UserPermissions />} />
          </Routes>
        </div>
      </IsLoggedInProvider>
    </Router>
  );
};

export default App;

