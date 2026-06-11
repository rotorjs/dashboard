export type VarDashboardAction = {
  type: 'var';
  name: string;
  value: unknown;
  exposed?: boolean;
};

export type FactDashboardAction = {
  type: 'fact';
  name: string;
  value: unknown;
};

export type NavigateDashboardAction = {
  type: 'navigate';
  href: string;
  replace?: boolean;
};

export type SyncDashboardAction = { type: 'sync' };

export type DashboardAction = { type: string; [key: string]: unknown };
