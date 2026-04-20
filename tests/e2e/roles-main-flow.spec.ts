import { expect, test, type Page, type Route } from "@playwright/test";

type UserRole = "Startup" | "Investor" | "Advisor" | "Staff" | "Admin";

const jsonOk = (data: unknown) => ({
  status: 200,
  contentType: "application/json",
  body: JSON.stringify({ success: true, isSuccess: true, data }),
});

async function mockCoreApis(page: Page) {
  await page.route("**/api/**", async (route: Route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes("/api/auth/login") && method === "POST") {
      return route.fulfill(
        jsonOk({
          accessToken: "mock-token",
          info: {
            userId: 999,
            email: "investor@example.com",
            userType: "Investor",
            roles: ["Investor"],
          },
        }),
      );
    }

    if (url.includes("/api/startups/me")) {
      return route.fulfill(
        jsonOk({
          id: 101,
          profileStatus: "Approved",
          companyName: "E2E Startup",
        }),
      );
    }

    if (/\/api\/startups\/\d+/.test(url) && !url.includes("/investors/")) {
      return route.fulfill(
        jsonOk({
          startupID: 1,
          companyName: "E2E Startup One",
          oneLiner: "AI productivity platform",
          profileStatus: "Approved",
          stage: "Seed",
          industryName: "SaaS",
          parentIndustryName: "Technology",
          country: "Vietnam",
          location: "Ho Chi Minh City",
          fundingAmountSought: 500000,
          currentFundingRaised: 120000,
          canRequestConnection: true,
        }),
      );
    }

    if (url.includes("/api/startups/investors/") && /\/api\/startups\/investors\/\d+/.test(url)) {
      return route.fulfill(
        jsonOk({
          investorID: 1,
          fullName: "E2E Investor Detail",
          investorType: "INSTITUTIONAL",
          bio: "Focused on early-stage B2B startups.",
          preferredStages: ["Seed"],
          preferredIndustries: ["SaaS"],
          profileStatus: "Approved",
          acceptingConnections: true,
          canRequestConnection: true,
          location: "Ho Chi Minh City",
          country: "Vietnam",
        }),
      );
    }

    if (url.includes("/api/startups/investors")) {
      return route.fulfill(
        jsonOk({
          items: [
            {
              investorID: 1,
              fullName: "E2E Investor One",
              investorType: "INSTITUTIONAL",
              preferredIndustries: ["SaaS"],
              preferredStages: ["Seed"],
              profileStatus: "Approved",
              canRequestConnection: true,
            },
          ],
          paging: { totalItems: 1, totalPages: 1, page: 1, pageSize: 10 },
        }),
      );
    }

    if (url.includes("/api/startups/me/team-members")) {
      return route.fulfill(jsonOk([]));
    }

    if (url.includes("/api/investors/me") && !url.includes("watchlist") && !url.includes("preferences")) {
      return route.fulfill(
        jsonOk({
          profileStatus: "Approved",
          fullName: "E2E Investor",
          acceptingConnections: true,
        }),
      );
    }

    if (url.includes("/api/investors/me/watchlist")) {
      return route.fulfill(jsonOk({ items: [], paging: { totalItems: 0 } }));
    }

    if (url.includes("/api/investors/search")) {
      return route.fulfill(
        jsonOk({
          items: [
            {
              startupID: 1,
              companyName: "E2E Startup One",
              stage: "Seed",
              industryName: "SaaS",
              parentIndustryName: "Technology",
              aiScore: 82,
              profileStatus: "Approved",
              canRequestConnection: true,
            },
          ],
          paging: { totalItems: 1, totalPages: 1, page: 1, pageSize: 20 },
        }),
      );
    }

    if (url.includes("/api/advisors/me")) {
      return route.fulfill(
        jsonOk({
          profileStatus: "Approved",
          fullName: "E2E Advisor",
          title: "Mentor",
        }),
      );
    }

    if (url.includes("/api/mentorships") || url.includes("/api/mentorships/sessions")) {
      return route.fulfill(jsonOk({ items: [], paging: { totalItems: 0 } }));
    }

    if (url.includes("/api/users")) {
      return route.fulfill(jsonOk([]));
    }

    if (url.includes("/api/wallets/me")) {
      return route.fulfill(
        jsonOk({
          walletId: 1,
          advisorId: 999,
          balance: 1500000,
          totalEarned: 3500000,
          totalWithdrawn: 2000000,
          bankAccountNumber: "123456789",
          bankBin: "970415",
          bankName: "VietinBank",
          createdAt: "2026-04-20T00:00:00.000Z",
        }),
      );
    }

    if (url.includes("/api/wallets/") && url.includes("/transactions")) {
      return route.fulfill(
        jsonOk({
          items: [],
          paging: { totalItems: 0, totalPages: 1, page: 1, pageSize: 10 },
        }),
      );
    }

    if (url.includes("/api/connections/sent") || url.includes("/api/connections/received")) {
      return route.fulfill(
        jsonOk({
          items: [],
          paging: { totalItems: 0, totalPages: 1, page: 1, pageSize: 20 },
        }),
      );
    }

    if (url.includes("/api/admin/audit-logs")) {
      return route.fulfill(jsonOk({ items: [], paging: { totalItems: 0 } }));
    }

    if (
      url.includes("/api/master/") ||
      url.includes("/api/documents") ||
      url.includes("/api/document") ||
      url.includes("/api/ai/")
    ) {
      return route.fulfill(jsonOk([]));
    }

    return route.fulfill(jsonOk([]));
  });
}

async function bootstrapAuth(page: Page, role: UserRole) {
  await page.addInitScript(
    ({ activeRole }) => {
      const user = {
        userID: 999,
        email: "e2e@example.com",
        fullName: `E2E ${activeRole}`,
        userType: activeRole,
        roles: [activeRole],
        isActive: true,
      };

      localStorage.setItem("accessToken", "e2e-token");
      localStorage.setItem("user", JSON.stringify(user));

      if (activeRole === "Advisor") {
        localStorage.setItem("aisep_advisor_onboarding_completed", "true");
      }
    },
    { activeRole: role },
  );
}

test.describe("Role Main Flows Smoke", () => {
  test("login: success redirects to investor dashboard", async ({ page }) => {
    await mockCoreApis(page);

    await page.goto("/auth/login");
    await page.locator('input[type="email"]').fill("investor@example.com");
    await page.locator('input[type="password"]').fill("password123");
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/investor$/);
    await expect(page.locator('a[href="/investor/startups"]').first()).toBeVisible();
  });

  test("startup: dashboard and documents", async ({ page }) => {
    await mockCoreApis(page);
    await bootstrapAuth(page, "Startup");

    await page.goto("/startup");
    await expect(page).toHaveURL(/\/startup$/);
    await expect(page.getByRole("heading", { name: "AISEP Startup Platform" })).toBeVisible();

    await page.goto("/startup/documents");
    await expect(page).toHaveURL(/\/startup\/documents$/);
  });

  test("investor: dashboard and startups", async ({ page }) => {
    await mockCoreApis(page);
    await bootstrapAuth(page, "Investor");

    await page.goto("/investor");
    await expect(page).toHaveURL(/\/investor$/);
    await expect(page.locator('a[href="/investor/startups"]').first()).toBeVisible();

    await page.goto("/investor/startups");
    await expect(page).toHaveURL(/\/investor\/startups$/);
  });

  test("investor: view startup detail", async ({ page }) => {
    await mockCoreApis(page);
    await bootstrapAuth(page, "Investor");

    await page.goto("/investor/startups/1");
    await expect(page).toHaveURL(/\/investor\/startups\/1$/);
    await expect(page.getByText("E2E Startup One").first()).toBeVisible();
  });

  test("advisor: dashboard and requests", async ({ page }) => {
    await mockCoreApis(page);
    await bootstrapAuth(page, "Advisor");

    await page.goto("/advisor");
    await expect(page).toHaveURL(/\/advisor$/);
    await expect(page.getByRole("heading", { name: "Advisor Dashboard" })).toBeVisible();

    await page.goto("/advisor/requests");
    await expect(page).toHaveURL(/\/advisor\/requests$/);
  });

  test("advisor: view wallet", async ({ page }) => {
    await mockCoreApis(page);
    await bootstrapAuth(page, "Advisor");

    await page.goto("/advisor/wallet");
    await expect(page).toHaveURL(/\/advisor\/wallet$/);
  });

  test("startup: view investors list", async ({ page }) => {
    await mockCoreApis(page);
    await bootstrapAuth(page, "Startup");

    await page.goto("/startup/investors");
    await expect(page).toHaveURL(/\/startup\/investors$/);
  });

  test("startup: view investor detail", async ({ page }) => {
    await mockCoreApis(page);
    await bootstrapAuth(page, "Startup");

    await page.goto("/startup/investors/1");
    await expect(page).toHaveURL(/\/startup\/investors\/1$/);
    await expect(page.getByText("E2E Investor Detail").first()).toBeVisible();
  });

  test("staff: dashboard and kyc", async ({ page }) => {
    await mockCoreApis(page);
    await bootstrapAuth(page, "Staff");

    await page.goto("/staff");
    await expect(page).toHaveURL(/\/staff$/);
    await expect(page.getByText("System Health")).toBeVisible();

    await page.goto("/staff/kyc");
    await expect(page).toHaveURL(/\/staff\/kyc$/);
  });

  test("admin: dashboard and users", async ({ page }) => {
    await mockCoreApis(page);
    await bootstrapAuth(page, "Admin");

    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/dashboard$/);
    await expect(page.getByText("Quick Access")).toBeVisible();

    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/admin\/users$/);
  });
});
