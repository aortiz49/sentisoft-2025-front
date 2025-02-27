import {keyframes} from "styled-components";

export const pulse = (multiplier: number = 1) => keyframes`
  0% {
    transform: translateY(0);
  }
  15% {
    transform: translateY(${-4 * multiplier}px);
  }
  30% {
    transform: translateY(${3 * multiplier}px);
  }
  50% {
    transform: translateY(${-1 * multiplier}px);
  }
  70% {
    transform: translateY(0);
  }
`;
