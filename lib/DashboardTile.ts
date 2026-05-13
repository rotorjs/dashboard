export type ErrorDashboardTile = { type: 'error'; error: unknown };

export type DashboardTile = { type: string; [key: string]: unknown };
