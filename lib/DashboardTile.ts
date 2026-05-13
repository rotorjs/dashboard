export type ErrorDashboardTile = { type: 'Error'; error: unknown };

export type DashboardTile = { type: string; [key: string]: unknown };
