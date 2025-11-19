import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setNavigate } from "./navigate";

import Navbar from "./components/Navbar";
import EmployeeListPage from "./pages/EmployeeListPage";
import CreateUserPage from "./pages/CreateUserPage";
import EmployeeProfilePage from "./pages/EmployeeProfilePage";
import AssistantsPage from "./pages/AssistantsPage";
import Promotion from "./pages/Promotion";
import EndService from "./pages/EndService";
import Termination from "./pages/Termination";
import EmployeeHolidaysPage from "./pages/HolidaysPage";
import CreateNewHoliday from "./pages/CreateNewHoliday";
import EmployeePunishmentsPage from './pages/EmployeePunishmentsPage';
import AddPunishmentPage from './pages/AddPunishmentPage';
import EmployeeCareersPage from "./pages/CareersPage";
import EmployeeDeputationPage from "./pages/DeputationPage";
import EmployeeAllStatesPage from "./pages/AllStatePage";
import RolesManagementPage from "./pages/RolesManagementPage";
import Statistics from "./pages/Statistics";
import Review from "./pages/AdminReviewPage";
import CreateDeputationPage from './pages/CreateDeputationPage';
import ChangePassword from "./pages/ChangePassword";
import UserPermissions from "./pages/UserPermissions";
import UserPermission from "./pages/UserPermission2";
import PDFGenerator from "./PdfGenerator";
import { IsLoggedInProvider } from "./contexts/isLoggedinContext";
import { FiltersProvider } from "./contexts/filtersContext";
import SecondmentPage from "./pages/SecondmentPage";


// =============== App Wrapper ===============
// هنا نستخدم useNavigate ونمرره لـ navigate.js
const AppWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <App />;
};


// =============== App (Routes فقط بدون Router) ===============
const App = () => {
  return (
    <IsLoggedInProvider>
      <FiltersProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar onLogoClick={() => {}} />
          <Routes>
            <Route path="/" element={<EmployeeListPage />} />
            <Route path="/assignTA" element={<AssistantsPage />} />
            <Route path="/promotion/:employeeId" element={<Promotion />} />
            <Route path="/end_service/:employeeId" element={<EndService />} />
            <Route path="/terminate/:employeeId" element={<Termination />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/profile/:employeeId" element={<EmployeeProfilePage />} />
            <Route path="/pdf" element={<PDFGenerator />} />
            <Route path="/createUser" element={<CreateUserPage />} />

            <Route path="/holidays/:employeeID" element={<EmployeeHolidaysPage />} />
            <Route path="/review/:employeeID" element={<Review />} />

            <Route path="/punishments/:employeeID" element={<EmployeePunishmentsPage />} />
            <Route path="/punishments/add/:employeeID" element={<AddPunishmentPage />} />
            <Route path="/punishments/edit/:employeeID/:punishmentID" element={<AddPunishmentPage />} />

            <Route path="/careers/:employeeID" element={<EmployeeCareersPage />} />
            <Route path="/deputation/:employeeID" element={<EmployeeDeputationPage />} />
            <Route path="/allStates/:employeeID" element={<EmployeeAllStatesPage />} />

            <Route path="/holidays/:employeeID/create" element={<CreateNewHoliday />} />
            <Route path="/permissions" element={<UserPermissions />} />
            <Route path="/permission" element={<UserPermission />} />
            <Route path="/secondment" element={<SecondmentPage />} />
            <Route path="/roles" element={<RolesManagementPage />} />
            <Route path="/statistics" element={<Statistics />} />

            <Route path="/deputation/add/:employeeID" element={<CreateDeputationPage />} />
            <Route path="/deputation/edit/:employeeID/:serialNumber" element={<CreateDeputationPage />} />

            <Route path="/holidays/add/:employeeID" element={<CreateNewHoliday />} />
            <Route path="/holidays/edit/:employeeID/:serialNumber" element={<CreateNewHoliday />} />
          </Routes>
        </div>
      </FiltersProvider>
    </IsLoggedInProvider>
  );
};


// =============== Root Component ===============
const RootApp = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default RootApp;
