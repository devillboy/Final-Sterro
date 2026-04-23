import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fallbackMinecraftPlans = [
  { id: 'mc-1', name: 'Starter Node', price: 249, ram: '2GB', storage: '10GB NVMe', cpu: '1 vCore', ports: '1 Port', order: 1, type: 'minecraft' },
  { id: 'mc-2', name: 'Performance Node', price: 469, ram: '4GB', storage: '20GB NVMe', cpu: '2 vCores', ports: '2 Ports', highlight: true, order: 2, type: 'minecraft' },
  { id: 'mc-3', name: 'Extreme Node', price: 900, ram: '8GB', storage: '40GB NVMe', cpu: '3 vCores', ports: '3 Ports', order: 3, type: 'minecraft' }
];

const fallbackVpsPlans = [
  { id: 'vps-1', name: 'XEON Starter', price: 599, ram: '2GB', storage: '20GB NVMe', cpu: '2 vCores', ports: 'Full Root', order: 1, type: 'vps' },
  { id: 'vps-2', name: 'XEON Pro', price: 899, ram: '4GB', storage: '40GB NVMe', cpu: '4 vCores', ports: 'Full Root', highlight: true, order: 2, type: 'vps' },
  { id: 'vps-3', name: 'XEON Ultra', price: 1599, ram: '8GB', storage: '80GB NVMe', cpu: '6 vCores', ports: 'Full Root', order: 3, type: 'vps' }
];

async function seed() {
  for (const plan of fallbackMinecraftPlans) {
    await setDoc(doc(db, 'plans', plan.id), plan);
    console.log(`Seeded ${plan.id}`);
  }
  for (const plan of fallbackVpsPlans) {
    await setDoc(doc(db, 'plans', plan.id), plan);
    console.log(`Seeded ${plan.id}`);
  }
  console.log("Done seeding plans!");
  process.exit(0);
}

seed();
