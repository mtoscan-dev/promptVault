import { db } from "..";
import { personas, governance, prompts, promptTypeEnum } from "../schema";
import { eq, desc } from "drizzle-orm";
import { ForgePersona, ForgeRule, ForgeSkill } from "@/types/forge";

export const getForgeData = async () => {
  try {
    // Fetch Personas (Identities)
    const personasData = await db
      .select()
      .from(personas)
      .orderBy(desc(personas.createdAt));

    // Fetch Rules (Governance)
    const rulesData = await db
      .select()
      .from(governance)
      .orderBy(desc(governance.createdAt));

    // Fetch Skills (Prompts of type 'skill')
    const skillsData = await db
      .select()
      .from(prompts)
      .where(eq(prompts.type, "skill"))
      .orderBy(desc(prompts.createdAt));

    return {
      personas: personasData.map((p) => ({
        id: p.id,
        name: p.name,
        version: "v1.0", // Schema modification might be needed for versioning
        description: p.role || "No description",
        instructions: p.systemPrompt,
        avatarUrl: p.avatarUrl || undefined,
      })) as ForgePersona[],
      rules: rulesData.map((r) => ({
        id: r.id,
        name: r.title,
        description: r.type,
        instructions: r.content,
      })) as ForgeRule[],
      skills: skillsData.map((s) => ({
        id: s.id,
        name: s.titleEn,
        description: s.descriptionEn || "General Skill",
        instructions: s.content, // Content is now the instruction/prompt
      })) as ForgeSkill[],
    };
  } catch (error) {
    console.error("❌ CRITICAL: Failed to fetch Forge data:", error);
    return {
      personas: [],
      rules: [],
      skills: [],
    };
  }
};
