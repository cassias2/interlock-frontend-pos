export interface InterlockData {
  id: number;
  lote: string;
  part_number: string | null;
  sn_he: string;
  result: string | null;
  ready: number;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  user: string;
}

export interface AdminInterlockRequest {
  sn_he: string;
  lote: string;
  status: string | null;
  part_number: string;
  matricula: string;
  password: string;
}

export interface InterlockRequest {
  user: string;
  sn_he: string;
  part_number: string;
  lote: string;
}

export interface InterlockResponse {
  count: number;
  data: InterlockData[];
  ready: number;
  status?: number;
  message?: string;
  passAndIgnore: number;
}

export interface InterlockUserSession {
  user: InterlockUserData;
  count: number;
  lote: string;
  partnumber: string;
  ready: number;
  serial: string;
  passAndIgnore: number;
}

export interface InterlockUserData {
  id?: number;
  name?: string;
  matricula: string;
  password: string;
  role?: number;
}

export interface InterlockUserError {
  message: string;
  status: number;
}

export interface InterlockData {
  snValue: string;
  partNumberValue: string;
  lotValue: string;
  status: string | null;
  result: string | null;
}
