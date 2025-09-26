export interface User {
  id: string;
  username: string;
  password: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user: User;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserData {
  user: User;
  notes: string[]; // IDs das notas do usuário
  tasks: string[]; // IDs das tarefas do usuário
}