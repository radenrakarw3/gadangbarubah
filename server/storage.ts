import { users, members, type User, type InsertUser, type Member, type InsertMember } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Member methods
  getMember(id: string): Promise<Member | undefined>;
  getMemberByWhatsApp(noWhatsApp: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  loginMember(noWhatsApp: string, pin: string): Promise<Member | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Member methods
  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member || undefined;
  }

  async getMemberByWhatsApp(noWhatsApp: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.noWhatsApp, noWhatsApp));
    return member || undefined;
  }

  async createMember(insertMember: InsertMember & { pin: string }): Promise<Member> {
    // Hash the PIN before storing
    const saltRounds = 12;
    const pinHash = await bcrypt.hash(insertMember.pin, saltRounds);
    
    const { pin, ...memberData } = insertMember;
    const [member] = await db
      .insert(members)
      .values({
        ...memberData,
        pinHash,
      })
      .returning();
    return member;
  }

  async loginMember(noWhatsApp: string, pin: string): Promise<Member | undefined> {
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.noWhatsApp, noWhatsApp));
    
    if (member && await bcrypt.compare(pin, member.pinHash)) {
      return member;
    }
    return undefined;
  }
}

export const storage = new DatabaseStorage();
