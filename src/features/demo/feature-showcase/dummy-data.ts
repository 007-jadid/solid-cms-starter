import type { Order, OrderItem, Product, User } from "./types";

// Generate dummy users
export const dummyUsers: User[] = [
  {
    id: "usr_001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    role: "admin",
    status: "active",
    department: "Engineering",
    salary: 95000,
    joinDate: "2022-01-15",
  },
  {
    id: "usr_002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    role: "editor",
    status: "active",
    department: "Marketing",
    salary: 72000,
    joinDate: "2022-03-22",
  },
  {
    id: "usr_003",
    firstName: "Michael",
    lastName: "Brown",
    email: "m.brown@example.com",
    role: "viewer",
    status: "inactive",
    department: "Sales",
    salary: 65000,
    joinDate: "2021-11-08",
  },
  {
    id: "usr_004",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.d@example.com",
    role: "editor",
    status: "active",
    department: "Design",
    salary: 78000,
    joinDate: "2023-02-14",
  },
  {
    id: "usr_005",
    firstName: "David",
    lastName: "Wilson",
    email: "d.wilson@example.com",
    role: "admin",
    status: "pending",
    department: "Engineering",
    salary: 105000,
    joinDate: "2023-06-01",
  },
  {
    id: "usr_006",
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.a@example.com",
    role: "viewer",
    status: "active",
    department: "HR",
    salary: 58000,
    joinDate: "2022-08-20",
  },
  {
    id: "usr_007",
    firstName: "James",
    lastName: "Taylor",
    email: "j.taylor@example.com",
    role: "editor",
    status: "active",
    department: "Marketing",
    salary: 69000,
    joinDate: "2021-05-12",
  },
  {
    id: "usr_008",
    firstName: "Jennifer",
    lastName: "Martinez",
    email: "jen.m@example.com",
    role: "viewer",
    status: "inactive",
    department: "Support",
    salary: 52000,
    joinDate: "2022-12-03",
  },
  {
    id: "usr_009",
    firstName: "Robert",
    lastName: "Garcia",
    email: "r.garcia@example.com",
    role: "admin",
    status: "active",
    department: "Engineering",
    salary: 112000,
    joinDate: "2020-09-18",
  },
  {
    id: "usr_010",
    firstName: "Amanda",
    lastName: "Lee",
    email: "a.lee@example.com",
    role: "editor",
    status: "pending",
    department: "Design",
    salary: 75000,
    joinDate: "2023-07-25",
  },
];

// Generate dummy products
export const dummyProducts: Product[] = [
  {
    id: "prod_001",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 149.99,
    stock: 45,
    status: "in_stock",
    rating: 4.5,
    createdAt: "2023-01-10",
  },
  {
    id: "prod_002",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    price: 299.99,
    stock: 12,
    status: "low_stock",
    rating: 4.8,
    createdAt: "2023-02-15",
  },
  {
    id: "prod_003",
    name: "4K Ultra HD Monitor",
    category: "Electronics",
    price: 449.99,
    stock: 0,
    status: "out_of_stock",
    rating: 4.7,
    createdAt: "2023-03-20",
  },
  {
    id: "prod_004",
    name: "Mechanical Gaming Keyboard",
    category: "Electronics",
    price: 129.99,
    stock: 78,
    status: "in_stock",
    rating: 4.6,
    createdAt: "2023-04-05",
  },
  {
    id: "prod_005",
    name: "Standing Desk Converter",
    category: "Furniture",
    price: 199.99,
    stock: 23,
    status: "in_stock",
    rating: 4.3,
    createdAt: "2023-05-12",
  },
  {
    id: "prod_006",
    name: "Portable SSD 1TB",
    category: "Storage",
    price: 89.99,
    stock: 156,
    status: "in_stock",
    rating: 4.9,
    createdAt: "2023-06-18",
  },
  {
    id: "prod_007",
    name: "Webcam HD 1080p",
    category: "Electronics",
    price: 79.99,
    stock: 8,
    status: "low_stock",
    rating: 4.2,
    createdAt: "2023-07-22",
  },
  {
    id: "prod_008",
    name: "USB-C Hub 7-in-1",
    category: "Accessories",
    price: 49.99,
    stock: 234,
    status: "in_stock",
    rating: 4.4,
    createdAt: "2023-08-30",
  },
];

// Generate dummy orders with items
const orderItems1: OrderItem[] = [
  {
    id: "item_001",
    productName: "Wireless Bluetooth Headphones",
    quantity: 2,
    unitPrice: 149.99,
    total: 299.98,
  },
  { id: "item_002", productName: "USB-C Hub 7-in-1", quantity: 1, unitPrice: 49.99, total: 49.99 },
];

const orderItems2: OrderItem[] = [
  {
    id: "item_003",
    productName: "Ergonomic Office Chair",
    quantity: 1,
    unitPrice: 299.99,
    total: 299.99,
  },
  {
    id: "item_004",
    productName: "Standing Desk Converter",
    quantity: 1,
    unitPrice: 199.99,
    total: 199.99,
  },
  {
    id: "item_005",
    productName: "4K Ultra HD Monitor",
    quantity: 2,
    unitPrice: 449.99,
    total: 899.98,
  },
];

const orderItems3: OrderItem[] = [
  {
    id: "item_006",
    productName: "Mechanical Gaming Keyboard",
    quantity: 1,
    unitPrice: 129.99,
    total: 129.99,
  },
];

const orderItems4: OrderItem[] = [
  { id: "item_007", productName: "Portable SSD 1TB", quantity: 3, unitPrice: 89.99, total: 269.97 },
  { id: "item_008", productName: "Webcam HD 1080p", quantity: 1, unitPrice: 79.99, total: 79.99 },
];

export const dummyOrders: Order[] = [
  {
    id: "ord_001",
    customerName: "Alice Cooper",
    email: "alice@example.com",
    status: "delivered",
    total: 349.97,
    items: orderItems1,
    createdAt: "2024-01-05",
  },
  {
    id: "ord_002",
    customerName: "Bob Williams",
    email: "bob.w@example.com",
    status: "processing",
    total: 1399.96,
    items: orderItems2,
    createdAt: "2024-01-08",
  },
  {
    id: "ord_003",
    customerName: "Carol White",
    email: "carol@example.com",
    status: "shipped",
    total: 129.99,
    items: orderItems3,
    createdAt: "2024-01-10",
  },
  {
    id: "ord_004",
    customerName: "Dan Miller",
    email: "dan.m@example.com",
    status: "pending",
    total: 349.96,
    items: orderItems4,
    createdAt: "2024-01-12",
  },
  {
    id: "ord_005",
    customerName: "Eve Thomas",
    email: "eve.t@example.com",
    status: "cancelled",
    total: 449.99,
    items: [
      {
        id: "item_009",
        productName: "4K Ultra HD Monitor",
        quantity: 1,
        unitPrice: 449.99,
        total: 449.99,
      },
    ],
    createdAt: "2024-01-15",
  },
];

// Filter options for demos
export const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
];

export const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

export const departmentOptions = [
  { label: "Engineering", value: "Engineering" },
  { label: "Marketing", value: "Marketing" },
  { label: "Sales", value: "Sales" },
  { label: "Design", value: "Design" },
  { label: "HR", value: "HR" },
  { label: "Support", value: "Support" },
];

export const categoryOptions = [
  { label: "Electronics", value: "Electronics" },
  { label: "Furniture", value: "Furniture" },
  { label: "Storage", value: "Storage" },
  { label: "Accessories", value: "Accessories" },
];

export const productStatusOptions = [
  { label: "In Stock", value: "in_stock" },
  { label: "Low Stock", value: "low_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
];

export const orderStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];
