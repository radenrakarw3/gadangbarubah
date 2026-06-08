import {
  users,
  campaigns,
  reservations,
  cateringInquiries,
  menuCategories,
  menuItems,
  type User,
  type InsertUser,
  type InsertReservation,
  type Reservation,
  type InsertCampaign,
  type Campaign,
  type CateringInquiry,
  type InsertMenuCategory,
  type UpdateMenuCategory,
  type MenuCategory,
  type InsertMenuItem,
  type UpdateMenuItem,
  type MenuItem,
} from "@shared/schema";
import type { CateringInquiryType } from "@shared/catering";
import {
  canTransition,
  isReservationStatus,
  type ReservationStatus,
} from "@shared/reservation-status";
import { requireDb } from "./db";
import { eq, and, desc, asc, gte, lte, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { todayISOInWIB } from "@shared/reservation-utils";

export type ReservationFilters = {
  date?: string;
  status?: ReservationStatus | "cancelled";
  outlet?: string;
};

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  loginUser(
    username: string,
    password: string,
  ): Promise<{
    user: Omit<User, "password">;
    error?: string;
    locked?: boolean;
    lockTimeRemaining?: number;
    attemptsRemaining?: number;
  } | null>;
  resetFailedAttempts(userId: string): Promise<void>;
  incrementFailedAttempts(userId: string): Promise<void>;

  createReservation(data: InsertReservation): Promise<Reservation>;
  getReservations(filters?: ReservationFilters): Promise<Reservation[]>;
  getReservationById(id: string): Promise<Reservation | undefined>;
  updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation>;
  updateReservationNotification(
    id: string,
    patch: {
      customerNotifyOk?: boolean | null;
      customerNotifyError?: string | null;
      customerNotifyAt?: Date;
      staffNotifyOk?: boolean | null;
      staffNotifyError?: string | null;
      staffNotifyAt?: Date;
    },
  ): Promise<void>;

  createCateringInquiry(data: {
    nama: string;
    noWhatsApp: string;
    email?: string;
    tipeLayanan: CateringInquiryType;
    pax: number;
  }): Promise<CateringInquiry>;
  getCateringInquiries(): Promise<CateringInquiry[]>;

  createCampaign(campaign: InsertCampaign, imagePath: string, createdBy: string): Promise<Campaign>;
  getCampaigns(): Promise<Campaign[]>;
  getActiveCampaign(): Promise<Campaign | undefined>;
  updateCampaignStatus(id: string, status: "active" | "inactive"): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;
  incrementCampaignViewCount(id: string): Promise<void>;

  getMenuCategories(): Promise<MenuCategory[]>;
  createMenuCategory(data: InsertMenuCategory): Promise<MenuCategory>;
  updateMenuCategory(id: string, data: UpdateMenuCategory): Promise<MenuCategory>;
  deleteMenuCategory(id: string): Promise<void>;
  getMenuCategoryItemCount(categoryId: string): Promise<number>;

  getMenuItems(): Promise<(MenuItem & { categoryNameId: string; categoryNameEn: string })[]>;
  getPublicMenu(): Promise<
    Array<MenuCategory & { items: MenuItem[] }>
  >;
  getFeaturedMenuItems(limit?: number): Promise<MenuItem[]>;
  createMenuItem(data: InsertMenuItem, imagePath: string): Promise<MenuItem>;
  updateMenuItem(id: string, data: UpdateMenuItem): Promise<MenuItem>;
  updateMenuItemImage(id: string, imagePath: string): Promise<MenuItem>;
  updateMenuItemStatus(
    id: string,
    patch: { isActive?: boolean; isFeatured?: boolean },
  ): Promise<MenuItem>;
  deleteMenuItem(id: string): Promise<MenuItem | undefined>;
  getMenuItemById(id: string): Promise<MenuItem | undefined>;

  getAdminStats(outlet?: string): Promise<{
    totalReservations: number;
    pendingReservations: number;
    confirmedReservations: number;
    staffCount: number;
    hasActiveCampaign: boolean;
    todayTotal: number;
    todayPending: number;
    todayConfirmed: number;
    todayArrived: number;
    todayDining: number;
    todayCompleted: number;
    currentlyDining: number;
  }>;
  getStaffUsers(): Promise<Array<Omit<User, "password">>>;
  deleteStaffUser(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private sanitizeUser(user: User): Omit<User, "password"> {
    const { password: _, ...sanitized } = user;
    return sanitized;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await requireDb().select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await requireDb().select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const password = await bcrypt.hash(insertUser.password, 12);
    const [user] = await requireDb()
      .insert(users)
      .values({ ...insertUser, password })
      .returning();
    return user;
  }

  async loginUser(username: string, password: string) {
    const [user] = await requireDb().select().from(users).where(eq(users.username, username));
    if (!user) return null;

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const lockTimeRemaining = new Date(user.lockedUntil).getTime() - Date.now();
      const minutesLeft = Math.ceil(lockTimeRemaining / (1000 * 60));
      return {
        user: this.sanitizeUser(user),
        error: `Akun dikunci. Coba lagi dalam ${minutesLeft} menit.`,
        locked: true,
        lockTimeRemaining,
      };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      await this.incrementFailedAttempts(user.id);
      const newFailedAttempts = user.failedAttempts + 1;
      if (newFailedAttempts >= 5) {
        return {
          user: this.sanitizeUser(user),
          error: "Terlalu banyak percobaan gagal. Akun dikunci selama 15 menit.",
          locked: true,
          lockTimeRemaining: 15 * 60 * 1000,
        };
      }
      return {
        user: this.sanitizeUser(user),
        error: `Password salah. Sisa percobaan: ${5 - newFailedAttempts}`,
        attemptsRemaining: 5 - newFailedAttempts,
      };
    }

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
    if (newFailedAttempts >= 5) {
      updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }

    await requireDb().update(users).set(updates).where(eq(users.id, userId));
  }

  async createReservation(data: InsertReservation): Promise<Reservation> {
    const [row] = await requireDb()
      .insert(reservations)
      .values({
        namaLengkap: data.namaLengkap,
        noWhatsApp: data.noWhatsApp,
        email: data.email || null,
        outlet: data.outlet,
        tanggalReservasi: data.tanggalReservasi,
        waktuReservasi: data.waktuReservasi,
        jumlahTamu: data.jumlahTamu,
        tipeMeja: data.tipeMeja,
        catatan: data.catatan || null,
        status: "pending",
      })
      .returning();
    return row;
  }

  async getReservations(filters?: ReservationFilters): Promise<Reservation[]> {
    const conditions = [];

    if (filters?.date) {
      conditions.push(eq(reservations.tanggalReservasi, filters.date));
    }

    if (filters?.status === "cancelled") {
      conditions.push(eq(reservations.status, "cancelled"));
    } else if (filters?.status) {
      conditions.push(eq(reservations.status, filters.status));
    }
    if (filters?.outlet) {
      conditions.push(eq(reservations.outlet, filters.outlet));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const orderBy =
      filters?.date && filters.status !== "cancelled"
        ? [asc(reservations.waktuReservasi), desc(reservations.createdAt)]
        : [desc(reservations.tanggalReservasi), desc(reservations.createdAt)];

    return requireDb()
      .select()
      .from(reservations)
      .where(whereClause)
      .orderBy(...orderBy);
  }

  async getReservationById(id: string): Promise<Reservation | undefined> {
    const [row] = await requireDb().select().from(reservations).where(eq(reservations.id, id));
    return row || undefined;
  }

  async updateReservationNotification(
    id: string,
    patch: {
      customerNotifyOk?: boolean | null;
      customerNotifyError?: string | null;
      customerNotifyAt?: Date;
      staffNotifyOk?: boolean | null;
      staffNotifyError?: string | null;
      staffNotifyAt?: Date;
    },
  ): Promise<void> {
    await requireDb().update(reservations).set(patch).where(eq(reservations.id, id));
  }

  async createCateringInquiry(data: {
    nama: string;
    noWhatsApp: string;
    email?: string;
    tipeLayanan: CateringInquiryType;
    pax: number;
  }): Promise<CateringInquiry> {
    const [row] = await requireDb()
      .insert(cateringInquiries)
      .values({
        nama: data.nama,
        noWhatsApp: data.noWhatsApp,
        email: data.email || null,
        tipeLayanan: data.tipeLayanan,
        pax: data.pax,
        status: "pending",
      })
      .returning();
    return row;
  }

  async getCateringInquiries(): Promise<CateringInquiry[]> {
    return requireDb()
      .select()
      .from(cateringInquiries)
      .orderBy(desc(cateringInquiries.createdAt));
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    const [existing] = await requireDb()
      .select()
      .from(reservations)
      .where(eq(reservations.id, id));

    if (!existing) throw new Error("Reservasi tidak ditemukan");

    const current = existing.status;
    if (!isReservationStatus(current)) {
      throw new Error("Status reservasi tidak valid");
    }

    if (current === status) return existing;

    if (!canTransition(current, status)) {
      throw new Error(
        `Tidak dapat mengubah status dari "${current}" ke "${status}"`,
      );
    }

    const now = new Date();
    const updates: Partial<Reservation> = {
      status,
      updatedAt: now,
    };

    if (status === "confirmed" && !existing.confirmedAt) {
      updates.confirmedAt = now;
    }
    if (status === "arrived" && !existing.arrivedAt) {
      updates.arrivedAt = now;
    }
    if (status === "dining" && !existing.diningAt) {
      updates.diningAt = now;
    }
    if (status === "completed" && !existing.completedAt) {
      updates.completedAt = now;
    }
    if (status === "cancelled" && !existing.cancelledAt) {
      updates.cancelledAt = now;
    }

    const [updated] = await requireDb()
      .update(reservations)
      .set(updates)
      .where(eq(reservations.id, id))
      .returning();

    if (!updated) throw new Error("Reservasi tidak ditemukan");
    return updated;
  }

  async createCampaign(campaign: InsertCampaign, imagePath: string, createdBy: string): Promise<Campaign> {
    const [newCampaign] = await requireDb()
      .insert(campaigns)
      .values({
        title: campaign.title,
        imagePath,
        validFrom: new Date(campaign.validFrom),
        validUntil: new Date(campaign.validUntil),
        status: "inactive",
        createdBy,
      })
      .returning();
    return newCampaign;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return requireDb().select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }

  async getActiveCampaign(): Promise<Campaign | undefined> {
    const now = new Date();
    const [campaign] = await requireDb()
      .select()
      .from(campaigns)
      .where(
        and(
          eq(campaigns.status, "active"),
          lte(campaigns.validFrom, now),
          gte(campaigns.validUntil, now),
        ),
      )
      .limit(1);
    return campaign || undefined;
  }

  async updateCampaignStatus(id: string, status: "active" | "inactive"): Promise<Campaign> {
    if (status === "active") {
      await requireDb()
        .update(campaigns)
        .set({ status: "inactive" })
        .where(eq(campaigns.status, "active"));
    }

    const [updated] = await requireDb()
      .update(campaigns)
      .set({ status })
      .where(eq(campaigns.id, id))
      .returning();
    if (!updated) throw new Error("Campaign tidak ditemukan");
    return updated;
  }

  async deleteCampaign(id: string): Promise<void> {
    const result = await requireDb().delete(campaigns).where(eq(campaigns.id, id));
    if (!result.rowCount) throw new Error("Campaign tidak ditemukan");
  }

  async incrementCampaignViewCount(id: string): Promise<void> {
    await requireDb()
      .update(campaigns)
      .set({ viewCount: sql`${campaigns.viewCount} + 1` })
      .where(eq(campaigns.id, id));
  }

  async getMenuCategories(): Promise<MenuCategory[]> {
    return requireDb()
      .select()
      .from(menuCategories)
      .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.nameId));
  }

  async createMenuCategory(data: InsertMenuCategory): Promise<MenuCategory> {
    const [created] = await requireDb()
      .insert(menuCategories)
      .values({
        nameId: data.nameId,
        nameEn: data.nameEn,
        slug: data.slug,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      })
      .returning();
    return created;
  }

  async updateMenuCategory(id: string, data: UpdateMenuCategory): Promise<MenuCategory> {
    const [updated] = await requireDb()
      .update(menuCategories)
      .set({
        ...(data.nameId !== undefined && { nameId: data.nameId }),
        ...(data.nameEn !== undefined && { nameEn: data.nameEn }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      })
      .where(eq(menuCategories.id, id))
      .returning();
    if (!updated) throw new Error("Kategori tidak ditemukan");
    return updated;
  }

  async getMenuCategoryItemCount(categoryId: string): Promise<number> {
    const [row] = await requireDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(menuItems)
      .where(eq(menuItems.categoryId, categoryId));
    return row?.count ?? 0;
  }

  async deleteMenuCategory(id: string): Promise<void> {
    const count = await this.getMenuCategoryItemCount(id);
    if (count > 0) {
      throw new Error("Kategori masih memiliki item menu. Hapus item terlebih dahulu.");
    }
    const result = await requireDb().delete(menuCategories).where(eq(menuCategories.id, id));
    if (!result.rowCount) throw new Error("Kategori tidak ditemukan");
  }

  async getMenuItems(): Promise<(MenuItem & { categoryNameId: string; categoryNameEn: string })[]> {
    const rows = await requireDb()
      .select({
        id: menuItems.id,
        categoryId: menuItems.categoryId,
        nameId: menuItems.nameId,
        nameEn: menuItems.nameEn,
        descriptionId: menuItems.descriptionId,
        descriptionEn: menuItems.descriptionEn,
        imagePath: menuItems.imagePath,
        tag: menuItems.tag,
        isFeatured: menuItems.isFeatured,
        isActive: menuItems.isActive,
        sortOrder: menuItems.sortOrder,
        createdAt: menuItems.createdAt,
        updatedAt: menuItems.updatedAt,
        categoryNameId: menuCategories.nameId,
        categoryNameEn: menuCategories.nameEn,
      })
      .from(menuItems)
      .innerJoin(menuCategories, eq(menuItems.categoryId, menuCategories.id))
      .orderBy(asc(menuCategories.sortOrder), asc(menuItems.sortOrder), asc(menuItems.nameId));
    return rows;
  }

  async getPublicMenu(): Promise<Array<MenuCategory & { items: MenuItem[] }>> {
    const categories = await requireDb()
      .select()
      .from(menuCategories)
      .where(eq(menuCategories.isActive, true))
      .orderBy(asc(menuCategories.sortOrder), asc(menuCategories.nameId));

    const items = await requireDb()
      .select()
      .from(menuItems)
      .where(eq(menuItems.isActive, true))
      .orderBy(asc(menuItems.sortOrder), asc(menuItems.nameId));

    return categories.map((category) => ({
      ...category,
      items: items.filter((item) => item.categoryId === category.id),
    }));
  }

  async getFeaturedMenuItems(limit = 8): Promise<MenuItem[]> {
    return requireDb()
      .select()
      .from(menuItems)
      .where(and(eq(menuItems.isFeatured, true), eq(menuItems.isActive, true)))
      .orderBy(asc(menuItems.sortOrder), asc(menuItems.nameId))
      .limit(limit);
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    const [item] = await requireDb().select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
    return item;
  }

  async createMenuItem(data: InsertMenuItem, imagePath: string): Promise<MenuItem> {
    const [created] = await requireDb()
      .insert(menuItems)
      .values({
        categoryId: data.categoryId,
        nameId: data.nameId,
        nameEn: data.nameEn,
        descriptionId: data.descriptionId,
        descriptionEn: data.descriptionEn,
        imagePath,
        tag: data.tag || null,
        isFeatured: data.isFeatured ?? false,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();
    return created;
  }

  async updateMenuItem(id: string, data: UpdateMenuItem): Promise<MenuItem> {
    const [updated] = await requireDb()
      .update(menuItems)
      .set({
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.nameId !== undefined && { nameId: data.nameId }),
        ...(data.nameEn !== undefined && { nameEn: data.nameEn }),
        ...(data.descriptionId !== undefined && { descriptionId: data.descriptionId }),
        ...(data.descriptionEn !== undefined && { descriptionEn: data.descriptionEn }),
        ...(data.tag !== undefined && { tag: data.tag || null }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        updatedAt: new Date(),
      })
      .where(eq(menuItems.id, id))
      .returning();
    if (!updated) throw new Error("Item menu tidak ditemukan");
    return updated;
  }

  async updateMenuItemImage(id: string, imagePath: string): Promise<MenuItem> {
    const [updated] = await requireDb()
      .update(menuItems)
      .set({ imagePath, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning();
    if (!updated) throw new Error("Item menu tidak ditemukan");
    return updated;
  }

  async updateMenuItemStatus(
    id: string,
    patch: { isActive?: boolean; isFeatured?: boolean },
  ): Promise<MenuItem> {
    const [updated] = await requireDb()
      .update(menuItems)
      .set({
        ...(patch.isActive !== undefined && { isActive: patch.isActive }),
        ...(patch.isFeatured !== undefined && { isFeatured: patch.isFeatured }),
        updatedAt: new Date(),
      })
      .where(eq(menuItems.id, id))
      .returning();
    if (!updated) throw new Error("Item menu tidak ditemukan");
    return updated;
  }

  async deleteMenuItem(id: string): Promise<MenuItem | undefined> {
    const [deleted] = await requireDb()
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning();
    return deleted;
  }

  async getAdminStats(outlet?: string) {
    const todayStr = todayISOInWIB();

    const countForToday = (status?: ReservationStatus) => {
      const conditions = [eq(reservations.tanggalReservasi, todayStr)];
      if (status) conditions.push(eq(reservations.status, status));
      if (outlet) conditions.push(eq(reservations.outlet, outlet));
      return requireDb()
        .select({ count: sql<number>`count(*)::int` })
        .from(reservations)
        .where(and(...conditions));
    };

    const baseReservationConditions = outlet ? [eq(reservations.outlet, outlet)] : [];

    const [
      [totalRow],
      [pendingRow],
      [confirmedRow],
      [staffRow],
      [todayTotalRow],
      [todayPendingRow],
      [todayConfirmedRow],
      [todayArrivedRow],
      [todayDiningRow],
      [todayCompletedRow],
    ] = await Promise.all([
      requireDb()
        .select({ count: sql<number>`count(*)::int` })
        .from(reservations)
        .where(baseReservationConditions.length ? and(...baseReservationConditions) : undefined),
      requireDb()
        .select({ count: sql<number>`count(*)::int` })
        .from(reservations)
        .where(and(eq(reservations.status, "pending"), ...(baseReservationConditions))),
      requireDb()
        .select({ count: sql<number>`count(*)::int` })
        .from(reservations)
        .where(and(eq(reservations.status, "confirmed"), ...(baseReservationConditions))),
      requireDb().select({ count: sql<number>`count(*)::int` }).from(users),
      countForToday(),
      countForToday("pending"),
      countForToday("confirmed"),
      countForToday("arrived"),
      countForToday("dining"),
      countForToday("completed"),
    ]);

    const activeCampaign = await this.getActiveCampaign();

    return {
      totalReservations: totalRow?.count ?? 0,
      pendingReservations: pendingRow?.count ?? 0,
      confirmedReservations: confirmedRow?.count ?? 0,
      staffCount: staffRow?.count ?? 0,
      hasActiveCampaign: !!activeCampaign,
      todayTotal: todayTotalRow?.count ?? 0,
      todayPending: todayPendingRow?.count ?? 0,
      todayConfirmed: todayConfirmedRow?.count ?? 0,
      todayArrived: todayArrivedRow?.count ?? 0,
      todayDining: todayDiningRow?.count ?? 0,
      todayCompleted: todayCompletedRow?.count ?? 0,
      currentlyDining: todayDiningRow?.count ?? 0,
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
    if (!user) throw new Error("User tidak ditemukan");

    if (user.role === "admin_main" || user.role === "admin") {
      const [adminCount] = await requireDb()
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(eq(users.role, "admin_main"));
      if ((adminCount?.count ?? 0) <= 1) {
        throw new Error("Tidak dapat menghapus admin terakhir");
      }
    }

    const result = await requireDb().delete(users).where(eq(users.id, id));
    if (!result.rowCount) throw new Error("Gagal menghapus user");
  }
}

export const storage = new DatabaseStorage();
