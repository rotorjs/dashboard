export type ErrorDashboardTile = { type: 'Error'; error: unknown };

export type GenericDashboardTile = {
  type: string;
  [key: string]: unknown;
};

export type DashboardTile = ErrorDashboardTile | GenericDashboardTile;
