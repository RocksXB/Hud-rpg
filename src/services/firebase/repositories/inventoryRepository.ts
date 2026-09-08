import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import type { OwnedItem } from "../../../types/domain";
import { db } from "../app";
export const inventoryRepository = {
  async list(uid: string, pageSize = 40): Promise<OwnedItem[]> {
    const snapshot = await getDocs(query(collection(db, "players", uid, "inventory"), orderBy("acquiredAt", "desc"), limit(pageSize)));
    return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as OwnedItem);
  },
};
