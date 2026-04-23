import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateHeroBg() {
  const imageUrl = "https://i.pinimg.com/originals/d5/3b/01/d53b014d86a6b6761bf649a0ed813c2b.png";
  
  // Try to find if HERO_BG already exists
  const q = query(collection(db, "assets"), where("key", "==", "HERO_BG"));
  const snap = await getDocs(q);
  
  if (!snap.empty) {
    const assetDoc = snap.docs[0];
    await setDoc(doc(db, "assets", assetDoc.id), {
      key: "HERO_BG",
      url: imageUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("Updated existing HERO_BG asset");
  } else {
    // Create new
    await setDoc(doc(collection(db, "assets")), {
      key: "HERO_BG",
      url: imageUrl,
      updatedAt: new Date().toISOString()
    });
    console.log("Created new HERO_BG asset");
  }
}

updateHeroBg().catch(console.error);
