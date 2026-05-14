export type DashboardNode = {
  type: string;
  id?: string;
  [key: string]: unknown;
};

export type ErrorDashboardNode = {
  type: 'error';
  id?: string;
  error: unknown;
};

export type DashboardLayoutNode = DashboardNode;

export type ErrorDashboardLayoutNode = ErrorDashboardNode;

export type DashboardLayoutConfig = unknown;

export type DashboardTileNode = DashboardNode & {
  layout?: DashboardLayoutConfig;
};

export type ErrorDashboardTileNode = ErrorDashboardNode & {
  layout?: DashboardLayoutConfig;
};
