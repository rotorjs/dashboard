export function dashboardVarInterest(name: string): string {
  return `dashboard://var/${encodeURIComponent(name)}`;
}

export function dashboardFactInterest(name: string): string {
  return `dashboard://fact/${encodeURIComponent(name)}`;
}
