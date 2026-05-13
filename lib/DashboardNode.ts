export type ErrorDashboardNode = {
  type: 'error';
  id?: string;
  error: unknown;
};

export type DashboardNode = {
  type: string;
  id?: string;
  [key: string]: unknown;
};
