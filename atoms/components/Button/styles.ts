import styled, { FlattenSimpleInterpolation, css } from 'styled-components';

import {
    BORDER_RADIUS,
    PHONE_WIDTH,
    STYLE_DURATION,
} from '#/atoms/styles/constants/';
import { Size } from '#/atoms/styles/constants/size';
import { Hue, getColor, getWhite } from '#/atoms/styles/palette';

import {
    ButtonDefaultStyleProps,
    ButtonHueState,
    ButtonVariant,
} from './types';

type StyleProps = {
    /**
     * Button color
     */
    hue?: Hue;
} & ButtonDefaultStyleProps;

type ButtonSize = {
    default: FlattenSimpleInterpolation;
};

const SIZES: { [key in Size | 'extraSmall']: ButtonSize } = {
    extraSmall: {
        default: css`
            padding: 4px 8px;
        `,
    },
    small: {
        default: css`
            padding: 5px 12px;
        `,
    },
    medium: {
        default: css`
            padding: 7px 16px;
        `,
    },
    large: {
        default: css`
            padding: 11px 24px;
        `,
    },
};

const solidStyles = (hue: Hue, state: ButtonHueState) => {
    const contrast = state === 'contrast';

    return css`
        color: ${contrast ? getColor(hue, 600) : getWhite()};
        background: ${contrast
            ? getWhite()
            : getColor(hue, state === 'darkVariant' ? 900 : 600)};

        &:hover,
        &:focus,
        &:active {
            background: ${contrast
                ? getColor('neutral', 300)
                : getColor(hue, state === 'darkVariant' ? 800 : 700)};
        }
    `;
};

const textStyles = (hue: Hue, state: ButtonHueState) => css`
    color: ${getColor(
        hue,
        state === 'darkVariant' ? 900 : state === 'contrast' ? 300 : 600
    )};
    background: transparent;
    border: 1px solid transparent;

    &:focus,
    &:hover,
    &:active {
        border-radius: ${BORDER_RADIUS.medium};
        background: ${getColor(
            state === 'darkVariant' || state === 'contrast' ? 'purple' : hue,
            state === 'contrast' ? 600 : 100
        )};
        color: ${getColor(
            state === 'darkVariant' || state === 'contrast' ? 'purple' : hue,
            state === 'contrast' ? 100 : 600
        )};
    }
`;

const outlinedStyles = (hue: Hue, state: ButtonHueState) => css`
    color: ${getColor(hue, state === 'darkVariant' ? 700 : 600)};
    border-color: ${getColor(hue, 400)};
    background: transparent;

    &:hover,
    &:focus,
    &:active {
        border-color: ${getColor(hue, 400)};
        background: ${getColor(hue, 100)};
        color: ${getColor(hue, hue === 'neutral' ? 900 : 600)};
    }
`;

const secondaryStyles = () => css`
    color: ${getColor('neutral', 900)};
    border-color: ${getColor('neutral', 500)};
    background: transparent;

    &:hover,
    &:focus,
    &:active {
        background: ${getColor('neutral', 200)};
    }
`;

const typeStyles = (
    hue: Hue,
    state: ButtonHueState
): { [key in ButtonVariant]: FlattenSimpleInterpolation } => {
    return {
        outlined: outlinedStyles(hue, state),
        solid: solidStyles(hue, state),
        text: textStyles(hue, state),
        secondary: secondaryStyles(),
    };
};

export const Container = styled.button<
    StyleProps & {
        internalLoading: boolean;
        state: ButtonHueState;
    }
>`
    display: inline-flex;
    font-weight: 500;
    font-size: 14px;
    border-radius: ${BORDER_RADIUS.medium};
    border: 1px solid ${(props) => getColor(props.hue || 'purple', 600)};
    cursor: pointer;
    position: relative;
    align-items: center;

    &:focus {
        outline: 0;
    }

    ${({ size }) => {
        return SIZES[size || 'medium'].default;
    }}

    ${({ hue, state, variant }) =>
        typeStyles(hue || 'purple', state)[variant || 'outlined']}

    ${({ fullWidth }) =>
        fullWidth &&
        css`
            display: block;
            width: 100%;
        `};

    ${({ noWrap }) =>
        noWrap &&
        css`
            white-space: nowrap;
        `};

    ${({ disabled, variant }) =>
        disabled &&
        css`
            &,
            &:hover,
            &:focus {
                background: transparent;
                border-color: ${variant === 'text'
                    ? 'transparent'
                    : getColor('neutral', 400)};
                color: ${getColor('neutral', 500)};
                cursor: not-allowed;
                ${variant === 'solid' &&
                css`
                    background: ${getColor('neutral', 400)};
                    color: ${getColor('neutral', 700)};
                `}
            }
        `};

    ${({ internalLoading, hue, variant }) =>
        internalLoading &&
        css`
            &,
            &:hover,
            &:focus {
                border-color: ${getColor(hue || 'purple', 300)};
                background: ${variant === 'solid' &&
                getColor(hue || 'purple', 300)};
            }
        `};

    ${({ size }) => css`
        @media all and (max-width: ${PHONE_WIDTH}px) {
            display: block;
            font-size: ${size === 'extraSmall' ? '14px' : '18px'};
            border-radius: ${BORDER_RADIUS.medium};
            width: 100%;
        }
    `}
`;

export const Content = styled.span<{ hide: boolean }>`
    display: inline-flex;
    align-items: center;
    opacity: 1;
    transition: opacity ${STYLE_DURATION.transition.short} linear;

    ${({ hide }) =>
        hide &&
        css`
            opacity: 0;
        `};
`;

export const SpinnerWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
`;
