const firstNames = [
  "Alex",
  "Sarah",
  "Mike",
  "Emma",
  "James",
  "Olivia",
  "Liam",
  "Sophia",
  "Noah",
  "Ava",
  "Ethan",
  "Mia",
  "Lucas",
  "Isabella",
  "Mason",
  "Charlotte",
  "Logan",
  "Amelia",
  "Aiden",
  "Harper",
  "Elijah",
  "Luna",
  "Jacob",
  "Ella",
  "William",
  "Chloe",
  "Daniel",
  "Grace",
  "Henry",
  "Layla",
  "Sebastian",
  "Riley",
  "Jack",
  "Zoey",
  "Owen",
  "Nora",
  "Samuel",
  "Lily",
  "Ryan",
  "Eleanor",
  "Nathan",
  "Hannah",
  "Leo",
  "Stella",
  "Adam",
  "Violet",
  "Aaron",
  "Aurora",
  "Ian",
  "Penelope",
];

const lastNames = [
  "Rivera",
  "Chen",
  "Ross",
  "Kumar",
  "Anderson",
  "Martinez",
  "Thompson",
  "Nakamura",
  "Williams",
  "Garcia",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
  "Johnson",
  "Lee",
  "White",
  "Harris",
  "Clark",
  "Lewis",
  "Robinson",
  "Walker",
  "Hall",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Hill",
  "Green",
  "Adams",
  "Baker",
  "Nelson",
  "Carter",
  "Mitchell",
  "Perez",
  "Roberts",
  "Turner",
  "Phillips",
  "Campbell",
  "Parker",
  "Evans",
  "Edwards",
  "Collins",
  "Stewart",
  "Morris",
  "Murphy",
  "Cook",
];

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "Support",
  "HR",
  "Finance",
  "Design",
  "Product",
];

const roles = ["admin", "editor", "viewer"] as const;
const statuses = ["active", "inactive", "suspended"] as const;

export interface User {
  id: string;
  name: string;
  email: string;
  role: (typeof roles)[number];
  status: (typeof statuses)[number];
  department: string;
  joinDate: string;
  lastActive: string;
  avatar: string;
  phone: string;
  bio: string;
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const MOCK_USERS: User[] = Array.from({ length: 50 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[i % lastNames.length];
  const joinDate = new Date(2023, 0, 1 + i * 7);
  const lastActive = new Date(Date.now() - i * 3600000 * 4);

  return {
    id: String(i + 1),
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    department: departments[i % departments.length],
    joinDate: formatDate(joinDate),
    lastActive: formatDate(lastActive),
    avatar: `${first[0]}${last[0]}`,
    phone: `+1 (555) ${String(100 + i).padStart(3, "0")}-${String(1000 + i * 13).slice(-4)}`,
    bio: `${first} is a ${roles[i % roles.length]} in the ${departments[i % departments.length]} department.`,
  };
});
