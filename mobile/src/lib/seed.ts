import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// row and col place each table on the floor map
const TABLES = [
  { name: "T1", seats: 2, row: 1, col: 1 },
  { name: "T2", seats: 2, row: 1, col: 2 },
  { name: "T3", seats: 4, row: 1, col: 3 },
  { name: "T4", seats: 4, row: 1, col: 4 },
  { name: "T5", seats: 4, row: 2, col: 1 },
  { name: "T6", seats: 4, row: 2, col: 2 },
  { name: "T7", seats: 6, row: 2, col: 3 },
  { name: "T8", seats: 6, row: 2, col: 4 },
  { name: "T9", seats: 8, row: 3, col: 1 },
  { name: "T10", seats: 8, row: 3, col: 2 },
  { name: "T11", seats: 2, row: 3, col: 3 },
  { name: "T12", seats: 2, row: 3, col: 4 },
];

export async function seedTables() {
  await Promise.all(
    TABLES.map((t) => setDoc(doc(db, "tables", t.name), { ...t, status: "free" }))
  );
}

const MENU = [
  { id: "m01", name: "Crispy Calamari", description: "Lightly fried squid with garlic mayo", price: 1450, category: "Starters" },
  { id: "m02", name: "Seafood Soup", description: "Prawns, fish and herbs in a light broth", price: 1200, category: "Starters" },
  { id: "m03", name: "Garlic Bread", description: "Toasted with herb butter", price: 650, category: "Starters" },
  { id: "m04", name: "Grilled Fish", description: "Catch of the day with lemon butter and vegetables", price: 2400, category: "Mains" },
  { id: "m05", name: "Garlic Butter Prawns", description: "Tiger prawns with rice and salad", price: 2800, category: "Mains" },
  { id: "m06", name: "Chicken Kottu", description: "Chopped roti with vegetables and egg", price: 1500, category: "Mains" },
  { id: "m07", name: "Pasta Alfredo", description: "Creamy sauce with chicken and parmesan", price: 1800, category: "Mains" },
  { id: "m08", name: "Fresh Lime Juice", description: "Chilled, with or without sugar", price: 450, category: "Drinks" },
  { id: "m09", name: "Iced Coffee", description: "Cold brew with milk", price: 600, category: "Drinks" },
  { id: "m10", name: "Ginger Beer", description: "House made", price: 500, category: "Drinks" },
  { id: "m11", name: "Watalappan", description: "Coconut custard with jaggery and cardamom", price: 700, category: "Desserts" },
  { id: "m12", name: "Chocolate Brownie", description: "Warm, with vanilla ice cream", price: 850, category: "Desserts" },
];

export async function seedMenu() {
  await Promise.all(
    MENU.map(({ id, ...item }) => setDoc(doc(db, "menu", id), { ...item, available: true }))
  );
}