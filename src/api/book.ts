import { REST_URL } from '.';
import {
  TBookResponseFieldTrading,
  TFetchableSymbol,
  TPrecisionRate,
} from '../types';

export async function fetchBook(
  symbol: TFetchableSymbol = 'tBTCUSD',
  precision: TPrecisionRate = 'P2',
  len: number = 25
): Promise<TBookResponseFieldTrading[]> {
  try {
    const res = await fetch(
      `${REST_URL}/book/${symbol}/${precision}?len=${len}`,
      {
        method: 'GET',
        // mode: 'cors',
        headers: { accept: 'application/json' },
      }
    );

    console.log(res);

    const parsedRes = await res.json();

    if (parsedRes) {
      return parsedRes;
    }

    throw new Error('No response');
  } catch (err) {
    console.error(err);
    throw new Error((err as Error).message);
  }
}
