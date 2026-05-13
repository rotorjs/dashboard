export function dashboardVarInterest(name: string): string {
  return `dashboards:var:${encodeURIComponent(name)}`;
}

export function dashboardFactInterest(name: string): string {
  return `dashboards:fact:${encodeURIComponent(name)}`;
}
