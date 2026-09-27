"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Updates a specific setting in the singleton settings row (ID: 1).
 * Uses upsert logic to ensure the row exists.
 */
export async function updateSetting(key: string, value: string | boolean) {
  try {
    // We enforce ID=1 for the singleton settings row
    await db
      .insert(settings)
      .values({ id: 1, [key]: value })
      .onConflictDoUpdate({
        target: settings.id,
        set: { [key]: value },
      });

    revalidatePath("/"); // Revalidate globally as settings might affect layout/theme
    return { success: true };
  } catch (error) {
    console.error(`Failed to update setting [${key}]:`, error);
    return { success: false, error: "Failed to persist setting" };
  }
}

/**
 * Retrieves the current settings. Returns default object if not found.
 */
export async function getSettings() {
  try {
    const result = await db.select().from(settings).where(eq(settings.id, 1));

    if (result.length > 0) {
      return result[0];
    }

    // Default settings matching schema defaults
    return {
      language: "en",
      exportLanguage: "original",
      theme: "system",
      reducedMotion: false,
      notifications: true,
      developerMode: false,
      metadata: {},
    };
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    // Return safe defaults on error
    return {
      language: "en",
      exportLanguage: "original",
      theme: "system",
      reducedMotion: false,
      notifications: true,
      developerMode: false,
      metadata: {},
    };
  }
}
