import { 
  users, members, memberPoints, vouchers, promos, bills, voucherClaims,
  type User, type InsertUser, type Member, type InsertMember,
  type MemberPoints, type Voucher, type InsertVoucher,
  type Promo, type InsertPromo, type Bill, type InsertBill,
  type VoucherClaim, type ClaimVoucherRequest
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, gte, lte, sql } from "drizzle-orm";
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
  createMember(member: InsertMember & { pin: string }): Promise<Member>;
  loginMember(noWhatsApp: string, pin: string): Promise<Member | undefined>;
  
  // Member points methods
  getMemberPoints(memberId: string): Promise<MemberPoints | undefined>;
  initializeMemberPoints(memberId: string): Promise<MemberPoints>;
  updateMemberPoints(memberId: string, totalPoints: number): Promise<MemberPoints>;
  
  // Voucher methods (Admin)
  createVoucher(voucher: InsertVoucher, createdBy: string): Promise<Voucher>;
  getVouchers(): Promise<Voucher[]>;
  getActiveVouchers(): Promise<Voucher[]>;
  getVoucher(id: string): Promise<Voucher | undefined>;
  
  // Promo methods (Admin)
  createPromo(promo: InsertPromo, createdBy: string): Promise<Promo>;
  getPromos(): Promise<Promo[]>;
  getActivePromos(): Promise<Promo[]>;
  getPromo(id: string): Promise<Promo | undefined>;
  
  // Bill methods (Kasir)
  createBillAndAwardPoints(bill: InsertBill, processedBy: string): Promise<Bill>;
  getMemberBills(memberId: string): Promise<Bill[]>;
  
  // Voucher claim methods
  claimVoucher(memberId: string, voucherId: string): Promise<VoucherClaim>;
  getMemberVoucherClaims(memberId: string): Promise<VoucherClaim[]>;
  redeemVoucherClaim(claimId: string): Promise<VoucherClaim>;
  
  // Admin methods - Data member dan riwayat transaksi
  getAllMembers(): Promise<Array<Member & { totalPoints: number; billsCount: number }>>;
  getAllBills(): Promise<Array<Bill & { memberName: string; memberWhatsApp: string }>>;
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

  // Member points methods
  async getMemberPoints(memberId: string): Promise<MemberPoints | undefined> {
    const [points] = await db.select().from(memberPoints).where(eq(memberPoints.memberId, memberId));
    return points || undefined;
  }

  async initializeMemberPoints(memberId: string): Promise<MemberPoints> {
    const [points] = await db
      .insert(memberPoints)
      .values({ memberId, totalPoints: 0 })
      .onConflictDoNothing()
      .returning();
    
    if (points) {
      return points;
    }
    
    // If conflict occurred, return existing record
    return await this.getMemberPoints(memberId) as MemberPoints;
  }

  async updateMemberPoints(memberId: string, totalPoints: number): Promise<MemberPoints> {
    const [points] = await db
      .update(memberPoints)
      .set({ totalPoints, updatedAt: new Date() })
      .where(eq(memberPoints.memberId, memberId))
      .returning();
    return points;
  }

  // Voucher methods (Admin)
  async createVoucher(voucher: InsertVoucher, createdBy: string): Promise<Voucher> {
    const [newVoucher] = await db
      .insert(vouchers)
      .values({ ...voucher, createdBy })
      .returning();
    return newVoucher;
  }

  async getVouchers(): Promise<Voucher[]> {
    return await db.select().from(vouchers).orderBy(desc(vouchers.createdAt));
  }

  async getActiveVouchers(): Promise<Voucher[]> {
    const now = new Date();
    return await db
      .select()
      .from(vouchers)
      .where(
        and(
          eq(vouchers.isActive, true),
          lte(vouchers.validFrom, now),
          gte(vouchers.validUntil, now)
        )
      )
      .orderBy(asc(vouchers.validUntil));
  }

  async getVoucher(id: string): Promise<Voucher | undefined> {
    const [voucher] = await db.select().from(vouchers).where(eq(vouchers.id, id));
    return voucher || undefined;
  }

  // Promo methods (Admin)
  async createPromo(promo: InsertPromo, createdBy: string): Promise<Promo> {
    const [newPromo] = await db
      .insert(promos)
      .values({ ...promo, createdBy })
      .returning();
    return newPromo;
  }

  async getPromos(): Promise<Promo[]> {
    return await db.select().from(promos).orderBy(desc(promos.createdAt));
  }

  async getActivePromos(): Promise<Promo[]> {
    const now = new Date();
    return await db
      .select()
      .from(promos)
      .where(
        and(
          eq(promos.isActive, true),
          lte(promos.validFrom, now),
          gte(promos.validUntil, now)
        )
      )
      .orderBy(asc(promos.validUntil));
  }

  async getPromo(id: string): Promise<Promo | undefined> {
    const [promo] = await db.select().from(promos).where(eq(promos.id, id));
    return promo || undefined;
  }

  // Bill methods (Kasir) - Transactional point awarding
  async createBillAndAwardPoints(bill: InsertBill, processedBy: string): Promise<Bill> {
    return await db.transaction(async (tx) => {
      // Calculate points: 1 point per 1000 rupiah
      const pointsAwarded = Math.floor(bill.totalAmount / 1000);
      
      // Create bill record
      const [newBill] = await tx
        .insert(bills)
        .values({ ...bill, pointsAwarded, processedBy })
        .returning();
      
      // Initialize member points if not exists
      await tx
        .insert(memberPoints)
        .values({ memberId: bill.memberId, totalPoints: 0 })
        .onConflictDoNothing();
      
      // Update member points
      await tx
        .update(memberPoints)
        .set({
          totalPoints: sql`${memberPoints.totalPoints} + ${pointsAwarded}`,
          updatedAt: new Date()
        })
        .where(eq(memberPoints.memberId, bill.memberId));
      
      return newBill;
    });
  }

  async getMemberBills(memberId: string): Promise<Bill[]> {
    return await db.select().from(bills).where(eq(bills.memberId, memberId)).orderBy(desc(bills.createdAt));
  }

  // Voucher claim methods - Transactional voucher claiming
  async claimVoucher(memberId: string, voucherId: string): Promise<VoucherClaim> {
    return await db.transaction(async (tx) => {
      // Get voucher details
      const [voucher] = await tx.select().from(vouchers).where(eq(vouchers.id, voucherId));
      if (!voucher) {
        throw new Error('Voucher tidak ditemukan');
      }
      
      // Check voucher validity
      const now = new Date();
      if (!voucher.isActive || voucher.validFrom > now || voucher.validUntil < now) {
        throw new Error('Voucher tidak valid atau sudah expired');
      }
      
      // Get member points
      const [memberPointsRecord] = await tx.select().from(memberPoints).where(eq(memberPoints.memberId, memberId));
      if (!memberPointsRecord || memberPointsRecord.totalPoints < voucher.pointsCost) {
        throw new Error('Points tidak cukup');
      }
      
      // Create voucher claim
      const [claim] = await tx
        .insert(voucherClaims)
        .values({
          voucherId,
          memberId,
          pointsUsed: voucher.pointsCost,
          status: "claimed"
        })
        .returning();
      
      // Update member points
      await tx
        .update(memberPoints)
        .set({
          totalPoints: sql`${memberPoints.totalPoints} - ${voucher.pointsCost}`,
          updatedAt: new Date()
        })
        .where(eq(memberPoints.memberId, memberId));
      
      return claim;
    });
  }

  async getMemberVoucherClaims(memberId: string): Promise<VoucherClaim[]> {
    return await db.select().from(voucherClaims).where(eq(voucherClaims.memberId, memberId)).orderBy(desc(voucherClaims.claimedAt));
  }

  async redeemVoucherClaim(claimId: string): Promise<VoucherClaim> {
    const [claim] = await db
      .update(voucherClaims)
      .set({ status: "redeemed", redeemedAt: new Date() })
      .where(
        and(
          eq(voucherClaims.id, claimId),
          eq(voucherClaims.status, "claimed")
        )
      )
      .returning();
    
    if (!claim) {
      throw new Error('Voucher claim tidak ditemukan atau sudah ditebus');
    }
    
    return claim;
  }

  // Admin methods - Data member dan riwayat transaksi
  async getAllMembers(): Promise<Array<Member & { totalPoints: number; billsCount: number }>> {
    const result = await db
      .select({
        id: members.id,
        namaLengkap: members.namaLengkap,
        jenisKelamin: members.jenisKelamin,
        noWhatsApp: members.noWhatsApp,
        tanggalLahir: members.tanggalLahir,
        kodePos: members.kodePos,
        pinHash: members.pinHash,
        totalPoints: sql<number>`COALESCE(${memberPoints.totalPoints}, 0)`,
        billsCount: sql<number>`COALESCE(bill_counts.count, 0)`,
      })
      .from(members)
      .leftJoin(memberPoints, eq(members.id, memberPoints.memberId))
      .leftJoin(
        sql`(
          SELECT member_id, COUNT(*) as count 
          FROM ${bills} 
          GROUP BY member_id
        ) as bill_counts`,
        sql`${members.id} = bill_counts.member_id`
      )
      .orderBy(desc(members.id));
    
    return result as Array<Member & { totalPoints: number; billsCount: number }>;
  }

  async getAllBills(): Promise<Array<Bill & { memberName: string; memberWhatsApp: string }>> {
    const result = await db
      .select({
        id: bills.id,
        memberId: bills.memberId,
        totalAmount: bills.totalAmount,
        pointsAwarded: bills.pointsAwarded,
        processedBy: bills.processedBy,
        createdAt: bills.createdAt,
        memberName: members.namaLengkap,
        memberWhatsApp: members.noWhatsApp,
      })
      .from(bills)
      .leftJoin(members, eq(bills.memberId, members.id))
      .orderBy(desc(bills.createdAt));
    
    return result as Array<Bill & { memberName: string; memberWhatsApp: string }>;
  }
}

export const storage = new DatabaseStorage();
