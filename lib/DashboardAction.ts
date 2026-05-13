import type { DashboardFact } from './DashboardFact';
import type { DashboardVar } from './DashboardVar';

export type VarDashboardAction = {
  type: 'var';
  name: string;
} & DashboardVar;

export type FactDashboardAction = {
  type: 'fact';
  name: string;
} & DashboardFact;

export type NavigateDashboardAction = {
  type: 'navigate';
  href: string;
  replace?: boolean;
};

export type DashboardAction = { type: string; [key: string]: unknown };
