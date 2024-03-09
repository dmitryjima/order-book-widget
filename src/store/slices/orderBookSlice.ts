/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@reduxjs/toolkit/query';
import { TBookResponseFieldTrading } from '../../types';

type TBookItem = {
  count: number;
  amount: number;
  total: number;
  price: number;
};

const initialOrderBookState: {
  bids: TBookItem[];
  asks: TBookItem[];
} = {
  bids: [],
  asks: [],
};

const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState: initialOrderBookState,
  reducers: {
    setupOrderBook(state, action) {
      const { snapshot } = action.payload;

      state.bids = [];
      state.asks = [];

      snapshot.forEach(([price, count, amount]: TBookResponseFieldTrading) => {
        const obj = {
          count: count,
          amount: amount,
          total: Math.abs(amount) * count,
          price: price,
        };

        if (count > 0) {
          if (amount > 0) {
            state.bids.push(obj);
          } else {
            state.asks.push(obj);
          }
        }
      });
    },
    updateOrderBook(state, action) {
      const { message } = action.payload;
      const updatedBids: TBookItem[] = [];
      const updatedAsks: TBookItem[] = [];

      const [price, count, amount] = message;

      const obj = { price, count, amount, total: Math.abs(amount) * count };

      if (count === 0) {
        state.bids = state.bids.filter((bid) => bid.price !== price);
        state.asks = state.asks.filter((ask) => ask.price !== price);
      } else if (amount > 0) {
        const existingBidIndex = state.bids.findIndex(
          (bid) => bid.price === price
        );
        if (existingBidIndex !== -1) {
          state.bids[existingBidIndex] = obj;
        } else {
          updatedBids.push(obj);
        }
      } else if (amount < 0) {
        const existingAskIndex = state.asks.findIndex(
          (ask) => ask.price === price
        );
        if (existingAskIndex !== -1) {
          state.asks[existingAskIndex] = obj;
        } else {
          updatedAsks.push(obj);
        }
      }

      state.bids = [...state.bids, ...updatedBids];
      state.asks = [...state.asks, ...updatedAsks];
    },
  },
});

export const { updateOrderBook, setupOrderBook } = orderBookSlice.actions;
// @ts-ignore
export const selectOrderBook = (state: RootState) => state.orderBook;
export default orderBookSlice.reducer;
