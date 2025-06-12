export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'konsultan_tani' | 'penyuluh';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  avatar?: string;
}

export interface UserStats {
  total: number;
  konsultanTani: number;
  penyuluh: number;
  admin: number;
}

export interface DashboardStats {
  totalHarvest?: number;
  weeklyProductivity?: number[];
  weatherAlerts?: WeatherAlert[];
  tasks?: Task[];
  reports?: Report[];
}

export interface WeatherAlert {
  id: number;
  type: 'rain' | 'drought' | 'storm' | 'heat';
  message: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
  timestamp: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: User;
  dueDate: string;
}

export interface Report {
  id: number;
  title: string;
  type: 'harvest' | 'field_condition' | 'weather' | 'pest';
  content: string;
  author: User;
  createdAt: string;
  isRead: boolean;
}

export interface FieldData {
  id: number;
  name: string;
  area: number;
  crop: string;
  location: [number, number];
  status: 'active' | 'harvest_ready' | 'maintenance';
}