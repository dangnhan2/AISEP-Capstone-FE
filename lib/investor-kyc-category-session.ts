export type InvestorCategory = "INSTITUTIONAL" | "INDIVIDUAL_ANGEL";

export const INVESTOR_KYC_CATEGORY_SESSION_KEY = "investor-kyc-category";

export function sanitizeInvestorCategory(
  value?: string | null,
): InvestorCategory | null {
  if (value === "INSTITUTIONAL" || value === "INDIVIDUAL_ANGEL") {
    return value;
  }
  return null;
}

export function readInvestorKycCategorySession(): InvestorCategory | null {
  if (typeof window === "undefined") return null;
  return sanitizeInvestorCategory(window.sessionStorage.getItem(INVESTOR_KYC_CATEGORY_SESSION_KEY));
}

export function writeInvestorKycCategorySession(value?: string | null) {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeInvestorCategory(value);
  if (!sanitized) {
    window.sessionStorage.removeItem(INVESTOR_KYC_CATEGORY_SESSION_KEY);
    return;
  }
  window.sessionStorage.setItem(INVESTOR_KYC_CATEGORY_SESSION_KEY, sanitized);
}

export function clearInvestorKycCategorySession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(INVESTOR_KYC_CATEGORY_SESSION_KEY);
}
