export interface Task {
  id: number;
  subjectClave: string;
  title: string;
  desc: string;
  due: string;
  completed: boolean;
  fileData?: string | null;
}

export interface Resource {
  id: number;
  subjectClave: string;
  type: 'pdf' | 'link' | 'video' | 'other';
  title: string;
  author: string;
  link: string;
  fileData?: string | null;
  unit: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Admin {
  email: string;
  password: string;
  createdAt: string;
}

export interface AppState {
  tasks: Task[];
  resources: Resource[];
  admins: Admin[];
}

export interface Subject {
  clave: string;
  nombre: string;
  color: string;
  profesor?: string;
  horario?: ScheduleSlot[];
}

export interface ScheduleSlot {
  dia: number; // 0-6 (Domingo-Sábado)
  horaInicio: string;
  horaFin: string;
  aula?: string;
}

export interface User {
  email: string;
  nombre: string;
  avatar?: string;
}
