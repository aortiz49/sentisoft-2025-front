import styled, { FlattenSimpleInterpolation, css } from 'styled-components';

import { pulse } from '#/atoms/styles/animations/pulse';
import { Size } from '#/atoms/styles/constants/size';
import { Hue, Value, getColor, getWhite } from '#/atoms/styles/palette';
import { DURATION } from '#/atoms/styles/constants';

export type StyleProps = {
    /**
     * Size of the dots.
     */
    size: Size;
    /**
     * When 'true', dots backgound hue value is set to 200.
     */
    inverted: boolean;
    /**
     * Dots color.
     */
    hue: Hue;
    /**
     * The hue value for the dots.
     * (default 700)
     */
    hueValue: Value;
};

type DotProps = {
    delayMultiplier: number;
} & StyleProps;

const TRANSITION_DURATION = DURATION.transition.medium * 2.5;
const DELAY = TRANSITION_DURATION / 8;

const SIZES: { [key in Size]: FlattenSimpleInterpolation } = {
    small: css`
        width: 4px;
        height: 4px;
        margin: 0 1px;
        animation-name: ${pulse(0.75)};
    `,
    medium: css`
        width: 8px;
        height: 8px;
        margin: 0 3px;
        animation-name: ${pulse(1)};
    `,
    large: css`
        width: 12px;
        height: 12px;
        margin: 0 6px;
        animation-name: ${pulse(2)};
    `,
};

export const Container = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
`;

export const Dot = styled.span<DotProps>`
    flex: 0 1 auto;
    border-radius: 100px;
    animation: ${pulse(1)} ${TRANSITION_DURATION}ms ease infinite;

    ${(props) => css`
        ${SIZES[props.size]}
        animation-delay: ${DELAY * props.delayMultiplier}ms;
        background: ${props.inverted
            ? getWhite()
            : getColor(props.hue, props.hueValue)};
    `}
`;
