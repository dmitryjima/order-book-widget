import styled from 'styled-components';
import { useAppSelector } from '../../../store/hooks';
import { useMemo } from 'react';

const Asks = () => {
  const asks = useAppSelector((state) => state.orderBook.asks);
  const asksSorted = useMemo(
    () => asks.slice().sort((a, b) => a.total - b.total),
    [asks]
  );
  const maxTotal = useMemo(() => {
    return asksSorted[asksSorted.length - 1]?.total
      ? asksSorted[asksSorted.length - 1].total
      : 0;
  }, [asksSorted]);

  return (
    <SContainter>
      <SHeader>
        <SHeaderField>PRICE</SHeaderField>
        <SHeaderField>TOTAL</SHeaderField>
        <SHeaderField>AMOUNT</SHeaderField>
        <SHeaderField>COUNT</SHeaderField>
      </SHeader>
      {asksSorted.map((ask) => (
        <SAsk key={ask.price}>
          <div
            className='pseudoBefore'
            style={{
              transform: `scaleX(${(ask.total / maxTotal) * 100}%)`,
            }}
          />
          <SAskField>{ask.price}</SAskField>
          <SAskField>
            {ask.total.toString().length < 6
              ? ask.total
              : ask.total.toString().slice(0, 6)}
          </SAskField>
          <SAskField>
            {' '}
            {ask.amount.toString().length < 6
              ? ask.amount * -1
              : (ask.amount * -1).toString().slice(0, 6)}
          </SAskField>
          <SAskField>{ask.count}</SAskField>
        </SAsk>
      ))}
    </SContainter>
  );
};

export default Asks;

const SContainter = styled.div`
  display: flex;
  flex-direction: column;

  width: 50%;
`;

const SHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  gap: 1rem;
`;

const SHeaderField = styled.div`
  width: 20%;
`;

const SAsk = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  gap: 1rem;

  position: relative;

  .pseudoBefore {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: #7a0604;
    z-index: 1;

    transform-origin: left;
    transition: 0.1s linear;
  }
`;

const SAskField = styled.div`
  width: 20%;
  z-index: 2;
`;
