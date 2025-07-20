import {
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronRight,
} from "lucide-react";
import person from "../assets/person.png";

const EmployeeCard = ({ employee, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer border border-gray-200 hover:border-blue-300"
      onClick={() => onClick(employee)}
      dir="rtl"
    >
      <div className="bg-white flex items-center space-x-reverse space-x-4">
        {/* <User size={24} /> */}

        <img
          src={person}
          alt={employee.member_name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {employee.name || "Known"}
          </h3>
          <p className="text-blue-600 font-medium mb-1">{employee.job_title}</p>
          <p className="text-gray-600 text-sm">{employee.department_name}</p>
        </div>
        <div className="text-gray-400">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
