interface AdminAuthState {
  isAdmin: boolean;
  adminRole: string | null;
  permissions: string[];
  timestamp: number;
  email: string;
}

export class AdminAuth {
  private static readonly KEY = "gigup_admin_auth_v2";

  static set(adminState: AdminAuthState): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.KEY, JSON.stringify(adminState));
    } catch (error) {
      console.error("Failed to save admin state:", error);
    }
  }

  static get(): AdminAuthState | null {
    if (typeof window === "undefined") return null;

    try {
      const cached = localStorage.getItem(this.KEY);
      if (!cached) return null;

      const data = JSON.parse(cached) as AdminAuthState;

      // Check if cache is valid (5 minutes)
      const isExpired = Date.now() - data.timestamp > 5 * 60 * 1000;
      if (isExpired) {
        this.clear();
        return null;
      }

      return data;
    } catch (error) {
      this.clear();
      return null;
    }
  }

  static clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.KEY);
  }

  static isAdmin(): boolean {
    const state = this.get();
    return state?.isAdmin === true;
  }

  static getRole(): string | null {
    return this.get()?.adminRole || null;
  }
}
