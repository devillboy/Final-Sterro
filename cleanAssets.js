import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanUpBrokenAssets() {
  const q = query(collection(db, "assets"), where("key", "==", "HERO_BG"));
  const snap = await getDocs(q);
  
  if (!snap.empty) {
    for (const d of snap.docs) {
      await deleteDoc(doc(db, "assets", d.id));
      console.log(`Deleted broken HERO_BG asset document ${d.id} from database`);
    }
  } else {
    console.log("No HERO_BG asset found in database, clean slate.");
  }
}

cleanUpBrokenAssets().catch(console.error);
