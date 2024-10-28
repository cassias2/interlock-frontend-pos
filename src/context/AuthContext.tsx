"use client";

import { createContext, useState } from "react";

export interface AuthData {
  matricula: string;
  setMatricula: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const initialData: AuthData = {
  matricula: "",
  setMatricula: () => {},
  password: "",
  setPassword: () => {},
  error: "",
  setError: () => {},
};

export const AuthContext = createContext(initialData);

interface Props {
  children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
  const [matricula, setMatricula] = useState(initialData.matricula);
  const [password, setPassword] = useState(initialData.password);
  const [error, setError] = useState(initialData.error);

  return (
    <AuthContext.Provider
      value={{
        matricula,
        setMatricula,
        password,
        setPassword,
        error,
        setError,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
