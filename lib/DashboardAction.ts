export type VarDashboardAction = {
  type: 'var';
  name: string;
  value: unknown;
  exposed?: boolean;
};

export type NavigateDashboardAction = {
  type: 'navigate';
  href: string;
  replace?: boolean;
};

export type GenericDashboardAction = {
  type: string;
  [key: string]: unknown;
};

export type DashboardAction =
  | VarDashboardAction
  | NavigateDashboardAction
  | GenericDashboardAction;
