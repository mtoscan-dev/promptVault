"use server";

import { db } from "@/db";
import { tags, tagDimensions, promptTags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- DIMENSIONS ---

export async function createDimension(data: {
  id: string; // ID is manually set (e.g. 'complexity', 'priority')
  nameEn: string;
  nameEs: string;
  descriptionEn?: string;
  descriptionEs?: string;
  color?: string;
  icon?: string;
}) {
  try {
    await db.insert(tagDimensions).values({
      id: data.id.toLowerCase().trim(),
      nameEn: data.nameEn,
      nameEs: data.nameEs,
      descriptionEn: data.descriptionEn,
      descriptionEs: data.descriptionEs,
      color: data.color || "gray",
      icon: data.icon || "tag",
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create dimension:", error);
    return { success: false, error: "Failed to create dimension" };
  }
}

export async function updateDimension(
  id: string,
  data: {
    nameEn?: string;
    nameEs?: string;
    descriptionEn?: string;
    descriptionEs?: string;
    color?: string;
    icon?: string;
  },
) {
  try {
    await db.update(tagDimensions).set(data).where(eq(tagDimensions.id, id));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update dimension:", error);
    return { success: false, error: "Failed to update dimension" };
  }
}

export async function deleteDimension(id: string) {
  try {
    // Delete dimension (cascade will handle tags if configured, but let's be safe)
    // Note: Our schema has cascade on DELETE for tags -> dimension, so deleting dimension deletes tags.
    // And promptTags -> tag also cascades.
    await db.delete(tagDimensions).where(eq(tagDimensions.id, id));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete dimension:", error);
    return { success: false, error: "Failed to delete dimension" };
  }
}

// --- TAGS ---

export async function createTag(data: {
  slug: string;
  dimensionId: string;
  nameEn: string;
  nameEs: string;
  descriptionEn?: string;
  descriptionEs?: string;
}) {
  try {
    await db.insert(tags).values({
      slug: data.slug.toLowerCase().trim(),
      dimensionId: data.dimensionId,
      nameEn: data.nameEn,
      nameEs: data.nameEs,
      descriptionEn: data.descriptionEn,
      descriptionEs: data.descriptionEs,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create tag:", error);
    return {
      success: false,
      error: "Failed to create tag. Slug might be duplicate.",
    };
  }
}

export async function updateTag(
  id: string, // UUID
  data: {
    slug?: string;
    dimensionId?: string;
    nameEn?: string;
    nameEs?: string;
    descriptionEn?: string;
    descriptionEs?: string;
  },
) {
  try {
    await db.update(tags).set(data).where(eq(tags.id, id));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update tag:", error);
    return { success: false, error: "Failed to update tag" };
  }
}

export async function deleteTag(id: string) {
  try {
    await db.delete(tags).where(eq(tags.id, id));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete tag:", error);
    return { success: false, error: "Failed to delete tag" };
  }
}
