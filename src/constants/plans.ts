export interface Plan {
  id: string;
  name: string;
  price: string | number;
  ram: string;
  cpu: string;
  storage: string;
  ssd?: string;
  throughput?: string;
  ports?: string;
  type: 'minecraft' | 'vps';
  highlight?: boolean;
  order: number;
  isTrial?: boolean;
  backups?: string;
  db?: string;
  ddos?: string;
  players?: string;
}

export const MINECRAFT_PLANS: Plan[] = [
  { 
    id: 'trial', 
    name: "Dev Sandbox", 
    price: "0", 
    ram: "4GB RAM", 
    storage: "100GB SSD", 
    cpu: "150% CPU", 
    ports: "1 Additional Port", 
    backups: "0 Backup Limit", 
    db: "1 Database", 
    ddos: "Standard Protection", 
    players: "Testing Only", 
    isTrial: true, 
    type: 'minecraft', 
    order: 0 
  },
  { 
    id: 'p1', 
    name: "Core-01 Pioneer", 
    price: "130", 
    ram: "2GB RAM", 
    storage: "75GB NVMe", 
    cpu: "100% CPU (Xeon E-2288G)", 
    ports: "3 Additional Ports", 
    backups: "1 Backup Slots", 
    db: "1 Database", 
    ddos: "10 Gbps EdgeGuard", 
    players: "15-25 Slots", 
    type: 'minecraft', 
    order: 1 
  },
  { 
    id: 'p2', 
    name: "Elite-02 Titan", 
    price: "260", 
    ram: "4GB RAM", 
    storage: "120GB NVMe", 
    cpu: "200% CPU (Xeon E-2288G)", 
    ports: "5 Additional Ports", 
    backups: "2 Backup Slots", 
    db: "3 Databases", 
    ddos: "Enterprise Protection", 
    players: "40-60 Slots", 
    highlight: true, 
    type: 'minecraft', 
    order: 2 
  },
  { 
    id: 'p3', 
    name: "Overlord-03 Supreme", 
    price: "390", 
    ram: "8GB RAM", 
    storage: "200GB NVMe", 
    cpu: "400% CPU (Xeon E-2288G)", 
    ports: "Unlimited Ports", 
    backups: "5 Backup Slots", 
    db: "Unlimited Databases", 
    ddos: "Quantum DDoS Shield", 
    players: "100+ Slots", 
    type: 'minecraft', 
    order: 3 
  }
];

export const VPS_PLANS: Plan[] = [
  { 
    id: 'v1', 
    name: "D-Node Alpha", 
    price: "240", 
    ram: "4GB DDR4 ECC", 
    cpu: "2 vCores (Xeon Scalable)", 
    type: 'vps', 
    storage: '60GB NVMe Gen4', 
    ports: '1 Dedicated IPv4', 
    order: 0 
  },
  { 
    id: 'v2', 
    name: "D-Node Gamma", 
    price: "480", 
    ram: "8GB DDR4 ECC", 
    cpu: "4 vCores (Xeon Scalable)", 
    type: 'vps', 
    storage: '120GB NVMe Gen4', 
    ports: '1 Dedicated IPv4', 
    highlight: true, 
    order: 1 
  },
  { 
    id: 'v3', 
    name: "D-Node Omega", 
    price: "960", 
    ram: "16GB DDR4 ECC", 
    cpu: "8 vCores (Xeon Scalable)", 
    type: 'vps', 
    storage: '250GB NVMe Gen4', 
    ports: '1 Dedicated IPv4', 
    order: 2 
  }
];

export const ALL_PLANS = [...MINECRAFT_PLANS, ...VPS_PLANS];
