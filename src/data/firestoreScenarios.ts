import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "../firebase";
import type { Scenario } from "../types/scenario";

const scenariosDocument = doc(db, "appData", "scenarios");

type ScenarioDocumentData = {
  items?: unknown;
};

export async function loadScenariosFromFirestore(): Promise<Scenario[] | null> {
  const snapshot = await getDoc(scenariosDocument);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as ScenarioDocumentData;

  if (!Array.isArray(data.items)) {
    return null;
  }

  return data.items as Scenario[];
}

export async function saveScenariosToFirestore(
  scenarios: Scenario[]
): Promise<void> {
  await setDoc(scenariosDocument, {
    items: scenarios,
    updatedAt: serverTimestamp(),
  });
}
