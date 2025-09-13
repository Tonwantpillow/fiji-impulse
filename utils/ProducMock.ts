import { Product } from "./Product";

export const ProductsMock: Product[] = [
  {
    id: 1,
    name: "Nano-Tech Sealer 8inch",
    price: 590.00,
    imageUrl: "/images/sealer.jpg",
    description: "The BEST sealer in the market, with nano-technology to ensure the best quality seal every time.",
    
  },
  {
    id: 2,
    name: "Industrial Heat Gun Pro",
    price: 1250.50,
    imageUrl: "/images/sealer.jpg",
    description: "A professional-grade heat gun for shrinking, sealing, and plastic welding. Features variable temperature control.",
  },
  {
    id: 3,
    name: "Precision Digital Scale",
    price: 850.00,
    imageUrl: "/images/sealer.jpg",
    description: "Measures up to 5kg with 0.1g accuracy. Perfect for kitchens, labs, and workshops.",
  },
  {
    id: 4,
    name: "Automatic Label Applicator",
    price: 4500.00,
    imageUrl: "/images/sealer.jpg",
    description: "Speeds up your packaging process. Applies labels smoothly and accurately on any flat surface.",
  },
  {
    id: 5,
    name: "Ergonomic Box Cutter (10-pack)",
    price: 350.00,
    imageUrl: "/images/sealer.jpg",
    description: "Safety-first design with a comfortable grip and retractable ceramic blade that lasts longer than steel.",
  },
  {
    id: 6,
    name: "Vacuum Chamber Machine",
    price: 8990.00,
    imageUrl: "/images/sealer.jpg",
    description: "Extends shelf life and protects sensitive items. Ideal for food, electronics, and medical supplies.",
  },
  {
    id: 7,
    name: "Heavy-Duty Packing Tape Dispenser",
    price: 420.00,
    imageUrl: "/images/sealer.jpg",
    description: "Makes packing boxes faster and easier. Built with a durable metal frame and an adjustable brake.",
  },
  {
    id: 8,
    name: "Anti-Static Bubble Wrap Roll (50m)",
    price: 750.00,
    imageUrl: "/images/sealer.jpg",
    description: "Protects sensitive electronic components from static discharge and physical impact during shipping.",
  },
  {
    id: 9,
    name: "Portable Barcode Scanner",
    price: 3200.00,
    imageUrl: "/images/sealer.jpg",
    description: "Wireless and lightweight for efficient inventory management. Compatible with all major barcode types.",
  },
  {
    id: 10,
    name: "Silica Gel Desiccant Packets (100-pack)",
    price: 250.00,
    imageUrl: "/images/sealer.jpg",
    description: "Absorbs moisture to keep your products dry and safe from humidity damage.",
  },
  {
    id: 11,
    name: "Thermal Shipping Label Printer",
    price: 5500.00,
    imageUrl: "/images/sealer.jpg",
    description: "High-speed direct thermal printing for 4x6 shipping labels. No ink or toner needed.",
  },
  {
    id: 12,
    name: "Eco-Friendly Void Fill (10kg Bag)",
    price: 990.00,
    imageUrl: "/images/sealer.jpg",
    description: "Biodegradable packing peanuts made from corn starch. Protects your items and the environment.",
  },
];

const getAllProducts = (): Product[] => {
  return ProductsMock;
}

const getProuctByID = (id : number): Product | undefined => {
  return ProductsMock.find((prod) => prod.id === id);
}

export { getAllProducts, getProuctByID};