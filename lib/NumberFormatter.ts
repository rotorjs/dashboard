import type { DashboardStateReducer } from './DashboardStateReducer';
import { dashboardLocaleFact } from './facts';
import { dashboardFactInterest } from './interests';

export type UnitFormat = {
  value?: string;
  spacing?: 'none' | 'gap';
  position?: 'left' | 'right';
};

export type NumberFormat = {
  locale?: Intl.UnicodeBCP47LocaleIdentifier;
  type?: never;
  unit?: UnitFormat | string;
};

export type NumberFormatterInit = {
  reducer?: DashboardStateReducer;
  locale?: Intl.UnicodeBCP47LocaleIdentifier;
};

export class NumberFormatter {
  #init;

  constructor(init?: NumberFormatterInit) {
    this.#init = init ?? {};
  }

  getLocale(format?: NumberFormat): string | undefined {
    if (format?.locale) return format.locale;

    if (this.#init?.locale) return this.#init.locale;

    const engineLocale =
      this.#init?.reducer?.engine.getFact(dashboardLocaleFact)?.value;
    this.#init?.reducer?.addInterest(
      dashboardFactInterest(dashboardLocaleFact),
    );
    return typeof engineLocale === 'string' ? engineLocale : undefined;
  }

  getFormat(format?: NumberFormat): Intl.NumberFormat {
    return new Intl.NumberFormat(this.getLocale(format));
  }

  format(value: number, format?: NumberFormat) {
    switch (format?.type) {
      default: {
        const formattedValue = this.getFormat(format).format(value);
        return withUnit(formattedValue, format);
      }
    }
  }
}

function withUnit(value: string, format?: NumberFormat): string {
  let unit: string | undefined;
  if (typeof format?.unit === 'string') unit = format.unit;
  else unit = format?.unit?.value;

  if (!unit) return value;

  let space;
  switch ((format!.unit as UnitFormat).spacing) {
    case 'none':
      space = '';
      break;
    case 'gap':
    default:
      space = '\xa0';
      break;
  }

  switch ((format!.unit as UnitFormat).position) {
    case 'left':
      return `${unit}${space}${value}`;
    case 'right':
    default:
      return `${value}${space}${unit}`;
  }
}
