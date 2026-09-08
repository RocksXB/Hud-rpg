import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../app";
export const itemRequestRepository = {
  create(uid: string, requestedName: string, notes: string, requestedItemId: string | null = null) {
    return addDoc(collection(db, "itemRequests"), { requesterUid: uid, requestedItemId, requestedName: requestedName.trim(), notes: notes.trim(), status: "pending", createdAt: serverTimestamp(), reviewedAt: null, reviewedBy: null, rejectionReason: null });
  },
};
