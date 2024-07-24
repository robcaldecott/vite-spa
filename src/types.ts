export interface Session {
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Summary {
  count: number;
  oems: number;
  value: number;
}

export interface Vehicle {
  id: string;
  vrm: string;
  manufacturer: string;
  model: string;
  type: string;
  fuel: string;
  color: string;
  vin: string;
  mileage: number;
  registrationDate: string;
  price: string;
}

export interface Chart {
  key: string;
  value: number;
}
