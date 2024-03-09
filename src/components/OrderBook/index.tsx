/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { WS_URL } from '../../api';
import {
  TBookResponseFieldTrading,
  TFetchableSymbol,
  TPrecisionRate,
} from '../../types';
import { useAppDispatch } from '../../store/hooks';
import {
  setupOrderBook,
  updateOrderBook,
} from '../../store/slices/orderBookSlice';

import Bids from './Bids';
import Asks from './Asks';

const OrderBook: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();

  // Could be used for more precise controls and options
  const [socketStatus, setSocketStatus] = useState<
    'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
  >('CONNECTING');
  const [symbol, setSymbol] = useState<TFetchableSymbol>('tBTCUSD');
  const [precision, setPrecision] = useState<TPrecisionRate>('P3');
  const [frequency, setFrequency] = useState<'F0' | 'F1'>('F0');
  const [length, setLength] = useState<'1' | '25' | '100' | '250'>('25');

  const incrementPrecision = useCallback(() => {
    setPrecision((curr) => {
      let level = parseInt((curr as string).charAt(1));
      if (level + 1 > 5) {
        return curr;
      } else {
        level += 1;
      }
      return `P${level}` as TPrecisionRate;
    });
  }, []);

  const decrementPrecision = useCallback(() => {
    setPrecision((curr) => {
      let level = parseInt((curr as string).charAt(1));
      if (level - 1 < 0) {
        return curr;
      } else {
        level -= 1;
      }
      return `P${level}` as TPrecisionRate;
    });
  }, []);

  useEffect(() => {
    const w = new WebSocket(WS_URL);

    const messageHandler = (msg: MessageEvent<any>) => {
      if (msg.data) {
        const parsedData = JSON.parse(msg.data);
        if (parsedData[1] && parsedData[1]?.length === 3) {
          // Update
          const updateData: TBookResponseFieldTrading = parsedData[1];
          dispatch(updateOrderBook({ message: updateData }));
        } else if (
          parsedData[1] &&
          Array.isArray(parsedData[1]) &&
          parsedData[1].length > 3
        ) {
          // Snapshot
          dispatch(setupOrderBook({ snapshot: parsedData[1] }));
        }
      }
    };

    w.addEventListener('open', (e) => {
      // console.log('Connection Open);
      setSocketStatus('CONNECTED');
    });

    w.addEventListener('close', (e) => {
      // console.log('Connection Closed);
      setSocketStatus('DISCONNECTED');
    });

    w.addEventListener('message', messageHandler);

    const msg = JSON.stringify({
      event: 'subscribe',
      channel: 'book',
      symbol: symbol,
      prec: precision,
      freq: frequency,
      len: length,
    });

    w.addEventListener('open', () => w.send(msg));

    w.onerror = (err) => {
      setSocketStatus('ERROR');
      w.close();
    };

    return () => {
      w.removeEventListener('message', messageHandler);
      w.close();
    };
  }, [dispatch, frequency, length, precision, symbol]);

  return (
    <SContainer>
      <SHeader>
        <SHeaderTitle>
          <span className='headerTitle__spanBold'>ORDER BOOK</span>
          <span className='headerTitle__spanRegular'>BTC/USD</span>
        </SHeaderTitle>
        <SHeaderControls>
          <div>Socket Status: {socketStatus}</div>
          <div>
            Current Frequency:
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'F1' | 'F0')}
            >
              <option value={'F1'}>F1</option>
              <option value={'F0'}>F0</option>
            </select>
          </div>
          <div>Current Precision: {precision}</div>
          <button
            aria-label='Decrement Precision'
            className='headerControls__button'
            onClick={decrementPrecision}
          >
            .0
          </button>
          <button
            aria-label='Increment Precision'
            className='headerControls__button'
            onClick={incrementPrecision}
          >
            .00
          </button>
        </SHeaderControls>
      </SHeader>
      <SBody>
        {/* Order Book - Bids
				The order book shows you the public orders. 'Bids' are orders to buy at a given price. */}
        <Bids />
        {/* Order Book - Asks
				'Asks' are orders placed to sell at a given price. */}
        <Asks />
      </SBody>
    </SContainer>
  );
};

export default OrderBook;

const SContainer = styled.div`
  background-color: rgb(16, 35, 49);

  padding: 8px;

  width: 100%;
`;

const SHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid rgba(100, 100, 100, 0.3);
`;

const SHeaderTitle = styled.div`
  .headerTitle__spanBold {
    font-size: 0.9rem;
    font-weight: 400;

    text-transform: uppercase;
    line-height: 20px;
    margin-right: 4px;
  }
  .headerTitle__spanRegular {
    font-size: 0.9rem;
    font-weight: 300;

    text-transform: uppercase;
    line-height: 20px;
    margin-right: 4px;
  }
`;

const SHeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  .headerControls__button {
    color: inherit;

    display: flex;
    background-color: transparent;
  }
`;

const SBody = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;

  min-height: 600px;
  transition: 0.1s linear;
`;
