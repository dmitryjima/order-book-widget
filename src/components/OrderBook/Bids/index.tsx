import styled from 'styled-components';
import { useAppSelector } from '../../../store/hooks';
import { useMemo } from 'react';

const Bids = () => {
  const bids = useAppSelector((state) => state.orderBook.bids);
  const bidsSorted = useMemo(
    () => bids.slice().sort((a, b) => a.total - b.total),
    [bids]
  );
  const maxTotal = useMemo(() => {
    return bidsSorted[bidsSorted.length - 1]?.total
      ? bidsSorted[bidsSorted.length - 1].total
      : 0;
  }, [bidsSorted]);

  return (
    <SContainter>
      <SHeader>
        <SHeaderField>COUNT</SHeaderField>
        <SHeaderField>AMOUNT</SHeaderField>
        <SHeaderField>TOTAL</SHeaderField>
        <SHeaderField>PRICE</SHeaderField>
      </SHeader>
      {bidsSorted.map((bid) => (
        <SBid key={bid.price}>
          <div
            className='pseudoBefore'
            style={{
              transform: `scaleX(${(bid.total / maxTotal) * 100}%)`,
            }}
          />
          <SBidField>{bid.count}</SBidField>
          <SBidField>
            {bid.amount.toString().length < 6
              ? bid.amount
              : bid.amount.toString().slice(0, 6)}
          </SBidField>
          <SBidField>
            {bid.total.toString().length < 6
              ? bid.total
              : bid.total.toString().slice(0, 6)}
          </SBidField>
          <SBidField>{bid.price}</SBidField>
        </SBid>
      ))}
    </SContainter>
  );
};

export default Bids;

const SContainter = styled.div`
  display: flex;
  flex-direction: column;

  width: 50%;
`;

const SHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  gap: 1rem;
`;

const SHeaderField = styled.div`
  width: 20%;
`;

const SBid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  gap: 1rem;

  position: relative;

  .pseudoBefore {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: #077259;
    z-index: 1;

    transform-origin: right;
    transition: 0.1s linear;
  }
`;

const SBidField = styled.div`
  width: 20%;
  z-index: 2;
`;
