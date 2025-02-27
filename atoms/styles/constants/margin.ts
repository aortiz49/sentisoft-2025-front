import { css } from 'styled-components';

import { Side } from '#/utils/types';

export type Margin = Partial<Record<Side, number>>;

export const DEFAULT_MARGIN_IN_PX: Margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

export const getMarginBySide = (side: Side, margin?: number) => {
    return margin !== undefined ? margin : DEFAULT_MARGIN_IN_PX[side];
};

export const marginStyles = (margin?: Margin) => {
    const top = getMarginBySide('top', margin?.top);
    const right = getMarginBySide('right', margin?.right);
    const bottom = getMarginBySide('bottom', margin?.bottom);
    const left = getMarginBySide('left', margin?.left);
    return css`
        margin: ${top}px ${right}px ${bottom}px ${left}px;
    `;
};
