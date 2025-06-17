'use client';

import { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [prefillGroupId, setPrefillGroupId] = useState(null);

  return (
    <EmployeeContext.Provider value={{ prefillGroupId, setPrefillGroupId }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => useContext(EmployeeContext);
