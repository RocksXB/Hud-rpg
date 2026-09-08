import { doc, getDoc } from "firebase/firestore";
import { db } from "../app";
export const adminRepository = { async isAdmin(uid: string): Promise<boolean> { return (await getDoc(doc(db, "admins", uid))).exists(); } };
