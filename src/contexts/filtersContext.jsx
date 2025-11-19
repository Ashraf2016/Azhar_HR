import { createContext, useContext, useState, useEffect } from "react";

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState(() => {
    const saved = sessionStorage.getItem("filters");
    return saved
      ? JSON.parse(saved)
      : {
          nameQuery: "",
          nidQuery: "",
          ufnQuery: "",
          selectedCollege: "",
          selectedDepartment: "",
          selectedDegree: "",
          workStatus: "2",
        };
  });

  useEffect(() => {
    sessionStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);
