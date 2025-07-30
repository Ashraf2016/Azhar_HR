import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmployeeListPage from "./pages/EmployeeListPage";
import CreateUserPage from "./pages/CreateUserPage";
import EmployeeProfilePage from "./pages/EmployeeProfilePage";
import UserPermissions from "./pages/UserPermissions";
import UserPermission from "./pages/UserPermission2";
import PDFGenerator from "./PdfGenerator";
import { IsLoggedInProvider } from "./contexts/isLoggedinContext";

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
            <Route path="/permission" element={<UserPermission />} />
          </Routes>
        </div>
      </IsLoggedInProvider>
    </Router>
  );
};

export default App;

