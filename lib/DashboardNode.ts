export type ErrorDashboardNode = { type: 'error'; error: unknown };

export type DashboardNode = { type: string; [key: string]: unknown };
