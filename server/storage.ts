import { 
  users, members, memberPoints, vouchers, promos, bills, voucherClaims, campaigns,
  type User, type InsertUser, type LoginUser, type Member, type InsertMember,
  type MemberPoints, type Voucher, type InsertVoucher,
  type Promo, type InsertPromo, type Bill, type InsertBill,
  type VoucherClaim, type ClaimVoucherRequest, type Campaign, type InsertCampaign
} from "@shared/schema";
import { requireDb } from "./db";
import { eq, and, desc, asc, gte, lte, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  loginUser(username: string, password: string): Promise<{ user: Omit<User, 'password'>; error?: string } | null>;
  resetFailedAttempts(userId: string): Promise<void>;
  incrementFailedAttempts(userId: string): Promise<void>;
  
  // Member methods
  getMember(id: string): Promise<Member | undefined>;
  getMemberByWhatsApp(noWhatsApp: string): Promise<Member | undefined>;
  createMember(member: InsertMember & { pin: string }): Promise<Member>;
  loginMember(noWhatsApp: string, pin: string): Promise<{ member: Member; error?: string } | null>;
  resetMemberFailedAttempts(memberId: string): Promise<void>;
  incrementMemberFailedAttempts(memberId: string): Promise<void>;
  updateMember(id: string, member: Partial<Omit<InsertMember, 'pin'>>): Promise<Member>;
  deleteMember(id: string): Promise<void>;
  
  // Member points methods
  getMemberPoints(memberId: string): Promise<MemberPoints | undefined>;
  initializeMemberPoints(memberId: string): Promise<MemberPoints>;
  updateMemberPoints(memberId: string, totalPoints: number): Promise<MemberPoints>;
  
  // Voucher methods (Admin)
  createVoucher(voucher: InsertVoucher, createdBy: string): Promise<Voucher>;
  getVouchers(): Promise<Voucher[]>;
  getActiveVouchers(): Promise<Voucher[]>;
  getVoucher(id: string): Promise<Voucher | undefined>;
  updateVoucher(id: string, voucher: Partial<InsertVoucher>): Promise<Voucher>;
  deleteVoucher(id: string): Promise<void>;
  
  // Promo methods (Admin)
  createPromo(promo: InsertPromo, createdBy: string): Promise<Promo>;
  getPromos(): Promise<Promo[]>;
  getActivePromos(): Promise<Promo[]>;
  getPromo(id: string): Promise<Promo | undefined>;
  updatePromo(id: string, promo: Partial<InsertPromo>): Promise<Promo>;
  deletePromo(id: string): Promise<void>;
  
  // Bill methods (Kasir)
  createBillAndAwardPoints(bill: InsertBill, processedBy: string): Promise<Bill>;
  getMemberBills(memberId: string): Promise<Bill[]>;
  
  // Voucher claim methods
  claimVoucher(memberId: string, voucherId: string): Promise<VoucherClaim>;
  getMemberVoucherClaims(memberId: string): Promise<VoucherClaim[]>;
  redeemVoucherClaim(claimId: string): Promise<VoucherClaim>;
  
  // Admin methods - Data member dan riwayat transaksi
  getAllMembers(): Promise<Array<Omit<Member, 'pinHash'> & { totalPoints: number; billsCount: number }>>;
  getAllBills(): Promise<Array<Bill & { memberName: string; memberWhatsApp: string }>>;
  
  // Kasir methods - Voucher claims management
  getAllVoucherClaims(): Promise<Array<VoucherClaim & { voucherTitle: string; memberName: string; memberWhatsApp: string }>>;
  
  // Consolidated member dashboard data (optimized single query)
  getMemberDashboard(memberId: string): Promise<{
    member: Omit<Member, 'pinHash'>;
    points: number;
    voucherClaims: Array<VoucherClaim & { voucherTitle: string }>;
    recentBills: Bill[];
  }>;
  
  // Campaign methods (Admin) - Popup for landing page
  createCampaign(campaign: InsertCampaign, imagePath: string, createdBy: string): Promise<Campaign>;
  getCampaigns(): Promise<Campaign[]>;
  getActiveCampaign(): Promise<Campaign | undefined>;
  updateCampaignStatus(id: string, status: 'active' | 'inactive'): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;
  incrementCampaignViewCount(id: string): Promise<void>;

  getAdminStats(): Promise<{
    totalMembers: number;
    activeVouchers: number;
    activePromos: number;
    totalBills: number;
    pendingVoucherClaims: number;
    staffCount: number;
    hasActiveCampaign: boolean;
  }>;
  getStaffUsers(): Promise<Array<Omit<User, "password">>>;
  deleteStaffUser(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await requireDb().select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await requireDb().select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const saltRounds = 12;
    const password = await bcrypt.hash(insertUser.password, saltRounds);
    
    const [user] = await requireDb()
      .insert(users)
      .values({
        ...insertUser,
        password,
      })
      .returning();
    return user;
  }

  async loginUser(username: string, password: string): Promise<{ 
    user: Omit<User, 'password'>; 
    error?: string;
    locked?: boolean;
    lockTimeRemaining?: number;
    attemptsRemaining?: number;
  } | null> {
    const [user] = await requireDb()
      .select()
      .from(users)
      .where(eq(users.username, username));
    
    if (!user) {
      return null;
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const lockTimeRemaining = new Date(user.lockedUntil).getTime() - Date.now();
      const minutesLeft = Math.ceil(lockTimeRemaining / (1000 * 60));
      return { 
        user: this.sanitizeUser(user), 
        error: `Akun dikunci. Coba lagi dalam ${minutesLeft} menit.`,
        locked: true,
        lockTimeRemaining
      };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      await this.incrementFailedAttempts(user.id);
      const newFailedAttempts = user.failedAttempts + 1;
      
      if (newFailedAttempts >= 5) {
        return { 
          user: this.sanitizeUser(user), 
          error: 'Terlalu banyak percobaan gagal. Akun dikunci selama 15 menit.',
          locked: true,
          lockTimeRemaining: 15 * 60 * 1000 // 15 minutes in ms
        };
      }
      
      return { 
        user: this.sanitizeUser(user), 
        error: `Password salah. Sisa percobaan: ${5 - newFailedAttempts}`,
        attemptsRemaining: 5 - newFailedAttempts
      };
    }

    // Reset failed attempts on successful login
    if (user.failedAttempts > 0 || user.lockedUntil) {
      await this.resetFailedAttempts(user.id);
    }

    return { user: this.sanitizeUser(user) };
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    await requireDb()
      .update(users)
      .set({ failedAttempts: 0, lockedUntil: null })
      .where(eq(users.id, userId));
  }

  async incrementFailedAttempts(userId: string): Promise<void> {
    const [user] = await requireDb().select().from(users).where(eq(users.id, userId));
    
    if (!user) return;

    const newFailedAttempts = user.failedAttempts + 1;
    const updates: Partial<User> = { failedAttempts: newFailedAttempts };

    // Lock account for 15 minutes after 5 failed attempts
    if (newFailedAttempts >= 5) {
      const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      updates.lockedUntil = lockUntil;
    }

    await requireDb()
      .update(users)
      .set(updates)
      .where(eq(users.id, userId));
  }

  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  // Member methods
  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await requireDb().select().from(members).where(eq(members.id, id));
    return member || undefined;
  }

  async getMemberByWhatsApp(noWhatsApp: string): Promise<Member | undefined> {
    const [member] = await requireDb().select().from(members).where(eq(members.noWhatsApp, noWhatsApp));
    return member || undefined;
  }

  async createMember(insertMember: InsertMember & { pin: string }): Promise<Member> {
    // Hash the PIN before storing
    const saltRounds = 12;
    const pinHash = await bcrypt.hash(insertMember.pin, saltRounds);
    
    const { pin, ...memberData } = insertMember;
    const [member] = await requireDb()
      .insert(members)
      .values({
        ...memberData,
        pinHash,
      })
      .returning();
    return member;
  }

  async loginMember(noWhatsApp: string, pin: string): Promise<{ member: Member; error?: string } | null> {
    const [member] = await requireDb()
      .select()
      .from(members)
      .where(eq(members.noWhatsApp, noWhatsApp));
    
    if (!member) {
      return null;
    }

    // Check if account is locked
    if (member.lockedUntil && new Date(member.lockedUntil) > new Date()) {
      const minutesLeft = Math.ceil((new Date(member.lockedUntil).getTime() - Date.now()) / (1000 * 60));
      return { member, error: `Akun dikunci. Coba lagi dalam ${minutesLeft} menit.` };
    }

    // Verify PIN
    const isValid = await bcrypt.compare(pin, member.pinHash);
    
    if (!isValid) {
      await this.incrementMemberFailedAttempts(member.id);
      const newFailedAttempts = member.failedAttempts + 1;
      
      if (newFailedAttempts >= 5) {
        return { member, error: 'Terlalu banyak percobaan gagal. Akun dikunci selama 15 menit.' };
      }
      
      return { member, error: `PIN salah. Sisa percobaan: ${5 - newFailedAttempts}` };
    }

    // Reset failed attempts on successful login
    if (member.failedAttempts > 0 || member.lockedUntil) {
      await this.resetMemberFailedAttempts(member.id);
    }

    return { member };
  }

  async resetMemberFailedAttempts(memberId: string): Promise<void> {
    await requireDb()
      .update(members)
      .set({ failedAttempts: 0, lockedUntil: null })
      .where(eq(members.id, memberId));
  }

  async incrementMemberFailedAttempts(memberId: string): Promise<void> {
    const [member] = await requireDb().select().from(members).where(eq(members.id, memberId));
    
    if (!member) return;

    const newFailedAttempts = member.failedAttempts + 1;
    const updates: Partial<Member> = { failedAttempts: newFailedAttempts };

    // Lock account for 15 minutes after 5 failed attempts
    if (newFailedAttempts >= 5) {
      const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      updates.lockedUntil = lockUntil;
    }

    await requireDb()
      .update(members)
      .set(updates)
      .where(eq(members.id, memberId));
  }

  async updateMember(id: string, updateData: Partial<Omit<InsertMember, 'pin'>>): Promise<Member> {
    const [updatedMember] = await requireDb()
      .update(members)
      .set(updateData)
      .where(eq(members.id, id))
      .returning();
    
    if (!updatedMember) {
      throw new Error('Member tidak ditemukan atau gagal diperbarui');
    }
    
    return updatedMember;
  }

  async deleteMember(id: string): Promise<void> {
    // Delete related records first (foreign key constraints)
    await requireDb().delete(memberPoints).where(eq(memberPoints.memberId, id));
    await requireDb().delete(bills).where(eq(bills.memberId, id));
    await requireDb().delete(voucherClaims).where(eq(voucherClaims.memberId, id));
    
    // Delete the member
    const result = await requireDb().delete(members).where(eq(members.id, id));
    
    // Verify deletion was successful
    if (!result.rowCount) {
      throw new Error('Member tidak ditemukan');
    }
  }

  // Member points methods
  async getMemberPoints(memberId: string): Promise<MemberPoints | undefined> {
    const [points] = await requireDb().select().from(memberPoints).where(eq(memberPoints.memberId, memberId));
    return points || undefined;
  }

  async initializeMemberPoints(memberId: string): Promise<MemberPoints> {
    const [points] = await requireDb()
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
    const [points] = await requireDb()
      .update(memberPoints)
      .set({ totalPoints, updatedAt: new Date() })
      .where(eq(memberPoints.memberId, memberId))
      .returning();
    return points;
  }

  // Voucher methods (Admin)
  async createVoucher(voucher: InsertVoucher, createdBy: string): Promise<Voucher> {
    const [newVoucher] = await requireDb()
      .insert(vouchers)
      .values({
        title: voucher.title,
        description: voucher.description,
        pointsCost: voucher.pointsCost,
        validFrom: new Date(voucher.validFrom),
        validUntil: new Date(voucher.validUntil),
        isActive: voucher.isActive ?? true,
        createdBy,
      })
      .returning();
    return newVoucher;
  }

  async getVouchers(): Promise<Voucher[]> {
    return await requireDb().select().from(vouchers).orderBy(desc(vouchers.createdAt));
  }

  async getActiveVouchers(): Promise<Voucher[]> {
    const now = new Date();
    return await requireDb()
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
    const [voucher] = await requireDb().select().from(vouchers).where(eq(vouchers.id, id));
    return voucher || undefined;
  }

  async updateVoucher(id: string, voucherData: Partial<InsertVoucher>): Promise<Voucher> {
    const { validFrom, validUntil, ...rest } = voucherData;
    const [updatedVoucher] = await requireDb()
      .update(vouchers)
      .set({
        ...rest,
        ...(validFrom !== undefined && { validFrom: new Date(validFrom) }),
        ...(validUntil !== undefined && { validUntil: new Date(validUntil) }),
      })
      .where(eq(vouchers.id, id))
      .returning();
      
    if (!updatedVoucher) {
      throw new Error('Voucher tidak ditemukan');
    }
    
    return updatedVoucher;
  }

  async deleteVoucher(id: string): Promise<void> {
    // First check if voucher exists
    const voucher = await this.getVoucher(id);
    if (!voucher) {
      throw new Error('Voucher tidak ditemukan');
    }

    // Check if voucher has any claims before deleting
    const claims = await requireDb().select().from(voucherClaims).where(eq(voucherClaims.voucherId, id));
    if (claims.length > 0) {
      throw new Error('Tidak dapat menghapus voucher yang sudah diklaim oleh member');
    }

    // Delete the voucher
    const result = await requireDb().delete(vouchers).where(eq(vouchers.id, id));
    
    // Verify deletion was successful
    if (!result.rowCount) {
      throw new Error('Gagal menghapus voucher');
    }
  }

  // Promo methods (Admin)
  async createPromo(promo: InsertPromo, createdBy: string): Promise<Promo> {
    const [newPromo] = await requireDb()
      .insert(promos)
      .values({
        title: promo.title,
        description: promo.description,
        validFrom: new Date(promo.validFrom),
        validUntil: new Date(promo.validUntil),
        isActive: promo.isActive ?? true,
        createdBy,
      })
      .returning();
    return newPromo;
  }

  async getPromos(): Promise<Promo[]> {
    return await requireDb().select().from(promos).orderBy(desc(promos.createdAt));
  }

  async getActivePromos(): Promise<Promo[]> {
    const now = new Date();
    return await requireDb()
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
    const [promo] = await requireDb().select().from(promos).where(eq(promos.id, id));
    return promo || undefined;
  }

  async updatePromo(id: string, promoData: Partial<InsertPromo>): Promise<Promo> {
    const { validFrom, validUntil, ...rest } = promoData;
    const [updatedPromo] = await requireDb()
      .update(promos)
      .set({
        ...rest,
        ...(validFrom !== undefined && { validFrom: new Date(validFrom) }),
        ...(validUntil !== undefined && { validUntil: new Date(validUntil) }),
      })
      .where(eq(promos.id, id))
      .returning();
      
    if (!updatedPromo) {
      throw new Error('Promo tidak ditemukan');
    }
    
    return updatedPromo;
  }

  async deletePromo(id: string): Promise<void> {
    // First check if promo exists
    const promo = await this.getPromo(id);
    if (!promo) {
      throw new Error('Promo tidak ditemukan');
    }

    // Delete the promo (promos don't have related data like voucher claims)
    const result = await requireDb().delete(promos).where(eq(promos.id, id));
    
    // Verify deletion was successful
    if (!result.rowCount) {
      throw new Error('Gagal menghapus promo');
    }
  }

  // Bill methods (Kasir) - Transactional point awarding
  async createBillAndAwardPoints(bill: InsertBill, processedBy: string): Promise<Bill> {
    return await requireDb().transaction(async (tx) => {
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
    return await requireDb().select().from(bills).where(eq(bills.memberId, memberId)).orderBy(desc(bills.createdAt));
  }

  // Voucher claim methods - Transactional voucher claiming
  async claimVoucher(memberId: string, voucherId: string): Promise<VoucherClaim> {
    return await requireDb().transaction(async (tx) => {
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
    return await requireDb().select().from(voucherClaims).where(eq(voucherClaims.memberId, memberId)).orderBy(desc(voucherClaims.claimedAt));
  }

  async redeemVoucherClaim(claimId: string): Promise<VoucherClaim> {
    const [claim] = await requireDb()
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
  async getAllMembers(): Promise<Array<Omit<Member, 'pinHash'> & { totalPoints: number; billsCount: number }>> {
    const result = await requireDb()
      .select({
        id: members.id,
        namaLengkap: members.namaLengkap,
        jenisKelamin: members.jenisKelamin,
        noWhatsApp: members.noWhatsApp,
        tanggalLahir: members.tanggalLahir,
        kodePos: members.kodePos,
        // Exclude pinHash for security
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
    
    return result as Array<Omit<Member, 'pinHash'> & { totalPoints: number; billsCount: number }>;
  }

  async getAllBills(): Promise<Array<Bill & { memberName: string; memberWhatsApp: string }>> {
    const result = await requireDb()
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

  // Kasir methods - Voucher claims management
  async getAllVoucherClaims(): Promise<Array<VoucherClaim & { voucherTitle: string; memberName: string; memberWhatsApp: string }>> {
    const result = await requireDb()
      .select({
        id: voucherClaims.id,
        voucherId: voucherClaims.voucherId,
        memberId: voucherClaims.memberId,
        pointsUsed: voucherClaims.pointsUsed,
        status: voucherClaims.status,
        claimedAt: voucherClaims.claimedAt,
        redeemedAt: voucherClaims.redeemedAt,
        voucherTitle: vouchers.title,
        memberName: members.namaLengkap,
        memberWhatsApp: members.noWhatsApp,
      })
      .from(voucherClaims)
      .leftJoin(vouchers, eq(voucherClaims.voucherId, vouchers.id))
      .leftJoin(members, eq(voucherClaims.memberId, members.id))
      .orderBy(desc(voucherClaims.claimedAt));
    
    return result as Array<VoucherClaim & { voucherTitle: string; memberName: string; memberWhatsApp: string }>;
  }

  // Consolidated member dashboard - single optimized call
  async getMemberDashboard(memberId: string): Promise<{
    member: Omit<Member, 'pinHash'>;
    points: number;
    voucherClaims: Array<VoucherClaim & { voucherTitle: string }>;
    recentBills: Bill[];
  }> {
    // Execute all queries in parallel for maximum performance
    const [member, memberPointsRecord, claims, recentBills] = await Promise.all([
      // Get member info (without pinHash)
      requireDb().select({
        id: members.id,
        namaLengkap: members.namaLengkap,
        jenisKelamin: members.jenisKelamin,
        noWhatsApp: members.noWhatsApp,
        tanggalLahir: members.tanggalLahir,
        kodePos: members.kodePos,
        failedAttempts: members.failedAttempts,
        lockedUntil: members.lockedUntil,
        createdAt: members.createdAt,
      }).from(members).where(eq(members.id, memberId)).limit(1),
      
      // Get member points
      requireDb().select().from(memberPoints).where(eq(memberPoints.memberId, memberId)).limit(1),
      
      // Get voucher claims with voucher titles (last 20)
      requireDb().select({
        id: voucherClaims.id,
        voucherId: voucherClaims.voucherId,
        memberId: voucherClaims.memberId,
        pointsUsed: voucherClaims.pointsUsed,
        status: voucherClaims.status,
        claimedAt: voucherClaims.claimedAt,
        redeemedAt: voucherClaims.redeemedAt,
        voucherTitle: vouchers.title,
      })
      .from(voucherClaims)
      .leftJoin(vouchers, eq(voucherClaims.voucherId, vouchers.id))
      .where(eq(voucherClaims.memberId, memberId))
      .orderBy(desc(voucherClaims.claimedAt))
      .limit(20),
      
      // Get recent bills (last 10)
      requireDb().select()
        .from(bills)
        .where(eq(bills.memberId, memberId))
        .orderBy(desc(bills.createdAt))
        .limit(10)
    ]);

    if (!member[0]) {
      throw new Error('Member tidak ditemukan');
    }

    return {
      member: member[0],
      points: memberPointsRecord[0]?.totalPoints ?? 0,
      voucherClaims: claims as Array<VoucherClaim & { voucherTitle: string }>,
      recentBills: recentBills
    };
  }

  // Campaign methods - Popup for landing page
  async createCampaign(campaign: InsertCampaign, imagePath: string, createdBy: string): Promise<Campaign> {
    const [newCampaign] = await requireDb()
      .insert(campaigns)
      .values({
        title: campaign.title,
        imagePath,
        validFrom: new Date(campaign.validFrom),
        validUntil: new Date(campaign.validUntil),
        status: 'inactive', // Always start as inactive
        createdBy,
      })
      .returning();
    
    return newCampaign;
  }

  async getCampaigns(): Promise<Campaign[]> {
    const result = await requireDb()
      .select()
      .from(campaigns)
      .orderBy(desc(campaigns.createdAt));
    
    return result;
  }

  async getActiveCampaign(): Promise<Campaign | undefined> {
    const now = new Date();
    const [campaign] = await requireDb()
      .select()
      .from(campaigns)
      .where(
        and(
          eq(campaigns.status, 'active'),
          lte(campaigns.validFrom, now),
          gte(campaigns.validUntil, now)
        )
      )
      .limit(1);
    
    return campaign || undefined;
  }

  async updateCampaignStatus(id: string, status: 'active' | 'inactive'): Promise<Campaign> {
    // If setting to active, first set all others to inactive (only 1 active allowed)
    if (status === 'active') {
      await requireDb()
        .update(campaigns)
        .set({ status: 'inactive' })
        .where(eq(campaigns.status, 'active'));
    }

    const [updated] = await requireDb()
      .update(campaigns)
      .set({ status })
      .where(eq(campaigns.id, id))
      .returning();
    
    if (!updated) {
      throw new Error('Campaign tidak ditemukan');
    }
    
    return updated;
  }

  async deleteCampaign(id: string): Promise<void> {
    const result = await requireDb().delete(campaigns).where(eq(campaigns.id, id));
    
    // Verify deletion was successful
    if (!result.rowCount) {
      throw new Error('Campaign tidak ditemukan');
    }
  }

  async incrementCampaignViewCount(id: string): Promise<void> {
    await requireDb()
      .update(campaigns)
      .set({ viewCount: sql`${campaigns.viewCount} + 1` })
      .where(eq(campaigns.id, id));
  }

  async getAdminStats() {
    const [[memberRow], [billRow], [claimRow], [staffRow]] = await Promise.all([
      requireDb().select({ count: sql<number>`count(*)::int` }).from(members),
      requireDb().select({ count: sql<number>`count(*)::int` }).from(bills),
      requireDb()
        .select({ count: sql<number>`count(*)::int` })
        .from(voucherClaims)
        .where(eq(voucherClaims.status, "claimed")),
      requireDb().select({ count: sql<number>`count(*)::int` }).from(users),
    ]);

    const [activeVouchers, activePromos, activeCampaign] = await Promise.all([
      this.getActiveVouchers(),
      this.getActivePromos(),
      this.getActiveCampaign(),
    ]);

    return {
      totalMembers: memberRow?.count ?? 0,
      activeVouchers: activeVouchers.length,
      activePromos: activePromos.length,
      totalBills: billRow?.count ?? 0,
      pendingVoucherClaims: claimRow?.count ?? 0,
      staffCount: staffRow?.count ?? 0,
      hasActiveCampaign: !!activeCampaign,
    };
  }

  async getStaffUsers(): Promise<Array<Omit<User, "password">>> {
    const rows = await requireDb()
      .select({
        id: users.id,
        username: users.username,
        role: users.role,
        failedAttempts: users.failedAttempts,
        lockedUntil: users.lockedUntil,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return rows;
  }

  async deleteStaffUser(id: string): Promise<void> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    if (user.role === "admin") {
      const [adminCount] = await requireDb()
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(eq(users.role, "admin"));
      if ((adminCount?.count ?? 0) <= 1) {
        throw new Error("Tidak dapat menghapus admin terakhir");
      }
    }

    const [billUsage] = await requireDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(bills)
      .where(eq(bills.processedBy, id));
    if ((billUsage?.count ?? 0) > 0) {
      throw new Error("User memiliki riwayat transaksi dan tidak dapat dihapus");
    }

    const result = await requireDb().delete(users).where(eq(users.id, id));
    if (!result.rowCount) {
      throw new Error("Gagal menghapus user");
    }
  }
}

export const storage = new DatabaseStorage();
