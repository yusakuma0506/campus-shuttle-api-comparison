export type Bus = {
  id: number;
  bus_number: string;
  name: string;
  status: string;
  route_id: number | null;
  created_at?: string;
  updated_at?: string;
  route?: {
    id: number;
    name: string;
    description: string | null;
  } | null;
};

export type BusDetail = Bus;
