'use client';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  margin: 4.8rem auto;
  width: 6.4rem;
  height: 6.4rem;
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${rotate} 1.5s linear infinite;
`;

export default Spinner;
