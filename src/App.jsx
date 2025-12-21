import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { useEffect } from "react";
import { setNavigate } from "./navigate";

import Navbar from "./components/Navbar";

// Pages
import EmployeeListPage from "./pages/EmployeeListPage";
import CreateUserPage from "./pages/CreateUserPage";
import EmployeeProfilePage from "./pages/EmployeeProfilePage";
import AssistantsPage from "./pages/AssistantsPage";
import Promotion from "./pages/procedures/Promotion";
import EndService from "./pages/procedures/EndService";
import Termination from "./pages/Termination";
import EmployeeHolidaysPage from "./pages/statements/HolidaysPage";
import CreateNewHoliday from "./pages/procedures/CreateNewHoliday";
import EmployeePunishmentsPage from './pages/statements/EmployeePunishmentsPage';
import AddPunishmentPage from './pages/procedures/AddPunishmentPage';
import EmployeeCareersPage from "./pages/statements/CareersPage";
import EmployeeDeputationPage from "./pages/statements/DeputationPage";
import EmployeeAllStatesPage from "./pages/statements/AllStatePage";
import RolesManagementPage from "./pages/RolesManagementPage";
import UsersListPage from "./pages/UsersListPage";
import Statistics from "./pages/Statistics";
import Review from "./pages/procedures/AdminReviewPage";
import CreateDeputationPage from './pages/procedures/CreateDeputationPage';
import ChangePassword from "./pages/ChangePassword";
import UserPermissions from "./pages/UserPermissions";
import UserPermission from "./pages/UserPermission2";
import PDFGenerator from "./PdfGenerator";
import SecondmentPage from "./pages/procedures/SecondmentPage";
import SecondmentPageState from "./pages/statements/SecondmentPageState";

// Contexts
import { IsLoggedInProvider } from "./contexts/isLoggedinContext";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { FiltersProvider } from "./contexts/FiltersContext";
import LeadersListPage from "./pages/LeadersListPage";
import LoginPage from "./components/LoginPage";
import LeadersCategories from "./pages/LeadersCategories";


// ================= App Wrapper =================
const AppWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <App />;
};


// ================= App =================
const App = () => {
  return (
    <IsLoggedInProvider>
      <PermissionsProvider>
        <FiltersProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar onLogoClick={() => {}} />

            <Routes>
              <Route path="/" element={<EmployeeListPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/leaders" element={<LeadersListPage />} />
              <Route path="/leaders-categories" element={<LeadersCategories />} />
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

              <Route path="/roles" element={<RolesManagementPage />} />
              <Route path="/users" element={<UsersListPage />} />
              <Route path="/statistics" element={<Statistics />} />

              {/* الاعارات */}
              <Route path="/deputation/add/:employeeID" element={<CreateDeputationPage />} />
              <Route path="/deputation/edit/:employeeID/:serialNumber" element={<CreateDeputationPage />} />

              {/* الاجازات */}
              <Route path="/holidays/add/:employeeID" element={<CreateNewHoliday />} />
              <Route path="/holidays/edit/:employeeID/:serialNumber" element={<CreateNewHoliday />} />

              {/* الانتدابات */}
              <Route path="/secondment/add/:employeeID" element={<SecondmentPage />} />
              <Route path="/secondment/edit/:employeeID/:serialNumber" element={<SecondmentPage />} />
              <Route path="/secondment/:employeeID" element={<SecondmentPageState />} />
            </Routes>
          </div>
        </FiltersProvider>
      </PermissionsProvider>
    </IsLoggedInProvider>
  );
};


// ================= Root =================
const RootApp = () => (
  <Router>
    <ScrollToTop />
    <AppWrapper />
  </Router>
);

export default RootApp;
