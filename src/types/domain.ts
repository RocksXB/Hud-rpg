import type { Timestamp } from "firebase/firestore";

export type SystemState = "NORMAL" | "COMBAT" | "CRITICAL" | "EVENT" | "SYSTEM";
export type ZoneType = "safe" | "contested" | "combat";
export type Condition = "stable" | "wounded" | "critical" | "incapacitated";
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "unique" | "legendary";
export type EquipmentSlot = "head" | "chest" | "hands" | "legs" | "feet" | "weapon" | "accessory-1" | "accessory-2";
export type QuestStatus = "active" | "complete" | "failed";
export type RequestStatus = "pending" | "approved" | "rejected";
export type SystemNotificationType = "info" | "reward" | "quest" | "warning" | "critical" | "level-up" | "item" | "title" | "guild" | "party" | "world";

export interface Stats { str: number; agi: number; vit: number; int: number; dex: number; luk: number }
export interface Player {
  uid: string; playerId: string; displayName: string | null; characterCreated: boolean;
  raceId: string | null; classId: string | null; level: number; xp: number;
  hp: number; maxHp: number; mp: number; maxMp: number; condition: Condition;
  locationId: string | null; regionId: string | null; zoneType: ZoneType;
  guildId: string | null; partyId: string | null; activeTitleId: string | null;
  avatarUrl: string | null; appearance: Record<string, string>; stats: Stats;
  createdAt: Timestamp | null; updatedAt: Timestamp | null; schemaVersion: number;
}
export interface Item { id: string; name: string; description: string; category: string; rarity: Rarity; imageUrl: string | null; stackable: boolean; equipmentSlot: EquipmentSlot | null; metadata: Record<string, unknown> }
export interface OwnedItem { id: string; itemId: string; nameSnapshot: string; rarity: Rarity; quantity: number; equipped: boolean; equippedSlot: EquipmentSlot | null; acquiredAt: Timestamp | null; metadata: Record<string, unknown> }
export interface Quest { id: string; title: string; status: QuestStatus; progress: number; objective: string; priority: number; rewards: Record<string, unknown>; assignedAt: Timestamp | null; completedAt: Timestamp | null }
export interface Skill { id: string; name: string; description: string; type: string; rank: string | null; origin: string | null; requirements: string[]; state: "locked" | "available" | "active" }
export interface Title { id: string; name: string; description: string; bonus: string | null; origin: string }
export interface Guild { id: string; name: string; tag: string; description: string; leaderUid: string; status: "pending" | "active" | "rejected"; createdAt: Timestamp | null; approvedAt: Timestamp | null; approvedBy: string | null }
export interface GuildMember { uid: string; displayName: string; role: string; isNpc: boolean; joinedAt: Timestamp | null }
export interface Party { id: string; name: string; leaderUid: string; createdAt: Timestamp | null }
export interface PlayerNotification { id: string; type: SystemNotificationType; title: string; message: string; priority: number; read: boolean; createdAt: Timestamp | null; readAt: Timestamp | null; metadata: Record<string, unknown> }
export interface ItemRequest { id: string; requesterUid: string; requestedItemId: string | null; requestedName: string; notes: string; status: RequestStatus; createdAt: Timestamp | null; reviewedAt: Timestamp | null; reviewedBy: string | null; rejectionReason: string | null }
