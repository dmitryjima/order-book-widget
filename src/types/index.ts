export const FETCHABLE_SYMBOLS = [
  // Trading only
  'tBTCUSD',
  'tETHUSD',
] as const;
export type TFetchableSymbol = (typeof FETCHABLE_SYMBOLS)[number];

export type TBookResponseFieldTrading = [
  // PRICE
  number,
  // COUNT
  number,
  // AMOUNT
  number
];

export const PRECISION_RATES = ['P0', 'P1', 'P2', 'P3', 'P4', 'R0'] as const;
export type TPrecisionRate = (typeof PRECISION_RATES)[number];
