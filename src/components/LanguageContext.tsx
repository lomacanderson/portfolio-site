import React, { createContext, useState, useContext } from 'react';

type LanguageContextType = {
  selLanguage: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  selLanguage: '',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selLanguage, setLanguage] = useState('');
  return (
    <LanguageContext.Provider value={{ selLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
