import { IStageMasterItem } from "@/services/master/master.api";

// This matches the old hardcoded labels for backward compatibility if needed,
// but we should prioritize the master data from the API.
const LEGACY_STAGE_LABELS: Record<string, string> = {
    "0": "Hạt giống (Idea)", 
    "1": "Tiền ươm mầm (Pre-Seed)", 
    "2": "Ươm mầm (Seed)", 
    "3": "Series A", 
    "4": "Series B", 
    "5": "Series C+", 
    "6": "Tăng trưởng (Growth)",
    "Idea": "Hạt giống (Idea)", 
    "PreSeed": "Tiền ươm mầm (Pre-Seed)", 
    "Seed": "Ươm mầm (Seed)", 
    "SeriesA": "Series A", 
    "SeriesB": "Series B", 
    "SeriesC": "Series C+", 
    "Growth": "Tăng trưởng (Growth)"
};

export function getStageDisplay(
    stageId: number | string | undefined | null,
    stageName: string | undefined | null,
    stagesMaster: IStageMasterItem[]
): string {
    const idStr = String(stageId ?? "");
    const nameStr = String(stageName ?? "");

    // 1. Try to find in master data by ID
    if (stageId != null) {
        const match = stagesMaster.find(s => s.stageId === Number(stageId));
        if (match) return match.stageName;
    }

    // 2. Try to find in master data by Name
    if (nameStr) {
        const match = stagesMaster.find(s => s.stageName.toLowerCase() === nameStr.toLowerCase());
        if (match) return match.stageName;
    }

    // 3. Fallback to legacy hardcoded labels if master data doesn't have it (e.g. inactive stage)
    const legacyLabel = LEGACY_STAGE_LABELS[idStr] || LEGACY_STAGE_LABELS[nameStr];
    if (legacyLabel) return legacyLabel;

    // 4. Final fallback to raw name
    return nameStr || idStr || "—";
}
