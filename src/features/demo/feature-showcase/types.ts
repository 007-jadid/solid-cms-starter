// Shared types for demo showcase

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive" | "pending";
  department: string;
  salary: number;
  joinDate: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  rating: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  createdAt: string;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  tags: string[];
}

export interface DynamicFormData {
  employmentType: string;
  companyName: string;
  position: string;
  salary: number;
  freelanceRate: number;
  projectType: string;
}
