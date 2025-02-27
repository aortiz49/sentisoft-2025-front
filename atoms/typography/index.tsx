import { FC, PropsWithChildren as WithChildren } from 'react';
import styled, { css } from 'styled-components';

import { Hue, Value, getColor } from '#/atoms/styles/palette';

export type TypographyBaseProps = {
    inheritColor?: boolean;
    hue?: Hue;
    hueValue?: Value;
    weight?: 300 | 400 | 500 | 600 | 700 | 800;
    display?: 'inline' | 'inline-block' | 'block';
    stretch?: 'normal' | 'expanded';
    spaced?: boolean;
};

export type ParagraphVariant =
    | 'body10'
    | 'body12'
    | 'body14'
    | 'body16'
    | 'body18'
    | 'button12'
    | 'button14'
    | 'button16'
    | 'button18'
    | 'caption'
    | 'labelText'
    | 'helpText'
    | 'dataText'
    | 'menuText';
export type ParagraphProps = {
    variant?: ParagraphVariant;
};

const DEFAULT_DISPLAY = 'block';
const DEFAULT_HUE = 'neutral';
const DEFAULT_VALUE = 900;
const DEFAULT_WEIGHT_PARAGRAPH = 400;
const DEFAULT_VARIANT = 'body16';

const baseStyles = css<TypographyBaseProps>`
    margin: 0;

    &:first-child {
        margin-top: 0;
    }

    &:last-child {
        margin-bottom: 0;
    }

    ${({ stretch }) => css`
        font-stretch: ${stretch || 'normal'};
    `}

    ${({
        inheritColor = false,
        hue = DEFAULT_HUE,
        hueValue = DEFAULT_VALUE,
        display = DEFAULT_DISPLAY,
    }) =>
        css`
            color: ${inheritColor
                ? 'inherit'
                : getColor(hue || DEFAULT_HUE, hueValue || DEFAULT_VALUE)};
            display: ${display};
        `}
`;

export const H1 = styled.h1`
    ${baseStyles}
    font-size: 36px;
    line-height: 40px;

    ${({ weight }) => css`
        font-weight: ${weight || 600};
    `}

    ${({ spaced = false }) =>
        spaced &&
        css`
            margin-top: 48px;
            margin-bottom: 8px;
        `}
`;

export const H2 = styled.h2`
    ${baseStyles}
    font-size: 28px;
    line-height: 36px;

    ${({ weight }) => css`
        font-weight: ${weight || 600};
    `}

    ${({ spaced = false }) =>
        spaced &&
        css`
            margin-top: 32px;
            margin-bottom: 8px;
        `}
`;

export const H3 = styled.h3`
    ${baseStyles}
    font-size: 24px;
    line-height: 32px;

    ${({ weight }) => css`
        font-weight: ${weight || 600};
    `}

    ${({ spaced = false }) =>
        spaced &&
        css`
            margin-top: 24px;
            margin-bottom: 8px;
        `}
`;

export const H4 = styled.h4`
    ${baseStyles}
    font-size: 20px;
    line-height: 28px;

    ${({ weight }) => css`
        font-weight: ${weight || 600};
    `}

    ${({ spaced = false }) =>
        spaced &&
        css`
            margin-top: 24px;
            margin-bottom: 8px;
        `}
`;

export const H5 = styled.h5`
    ${baseStyles}
    font-size: 18px;
    line-height: 24px;

    ${({ weight }) => css`
        font-weight: ${weight || 500};
    `}

    ${({ spaced = false }) =>
        spaced &&
        css`
            margin-top: 12px;
            margin-bottom: 8px;
        `}
`;

export const H6 = styled.h6`
    ${baseStyles}
    font-size: 16px;
    line-height: 18px;

    ${({ weight }) => css`
        font-weight: ${weight || 500};
    `}

    ${({ spaced = false }) =>
        spaced &&
        css`
            margin-top: 12px;
            margin-bottom: 8px;
        `}
`;

export const P = styled.div<TypographyBaseProps & ParagraphProps>`
    ${baseStyles}

    ${({ weight }) => css`
        font-weight: ${weight || DEFAULT_WEIGHT_PARAGRAPH};
    `}

    ${({ variant = DEFAULT_VARIANT }) =>
        variant === 'body10'
            ? css`
                  font-size: 10px;
                  line-height: 12px;
              `
            : variant === 'body12'
            ? css`
                  font-size: 12px;
                  line-height: 16px;
              `
            : variant === 'body14'
            ? css`
                  font-size: 14px;
                  line-height: 20px;
              `
            : variant === 'body16'
            ? css`
                  font-size: 16px;
                  line-height: 20px;
              `
            : variant === 'body18'
            ? css`
                  font-size: 18px;
                  line-height: 22px;
              `
            : variant === 'button12'
            ? css`
                  font-size: 12px;
                  font-weight: 500;
                  line-height: 16px;
              `
            : variant === 'button14'
            ? css`
                  font-size: 14px;
                  font-weight: 500;
                  line-height: 20px;
              `
            : variant === 'button16'
            ? css`
                  font-size: 16px;
                  font-weight: 500;
                  line-height: 24px;
              `
            : variant === 'button18'
            ? css`
                  font-size: 18px;
                  font-weight: 500;
                  line-height: 28px;
              `
            : variant === 'labelText'
            ? css`
                  font-size: 14px;
                  font-weight: 500;
                  line-height: 20px;
              `
            : variant === 'caption'
            ? css`
                  font-size: 12px;
                  line-height: 20px;
              `
            : variant === 'helpText'
            ? css`
                  font-size: 12px;
                  line-height: 16px;
              `
            : variant === 'dataText'
            ? css`
                  font-size: 36px;
                  line-height: 36px;
              `
            : variant === 'menuText'
            ? css`
                  font-size: 14px;
                  line-height: 18px;
              `
            : undefined}

  ${({ spaced = false }) =>
        spaced &&
        css`
            margin-bottom: 12px;
        `}
`;

export const Body10: FC<WithChildren<TypographyBaseProps & ParagraphProps>> = ({
    children,
    ...props
}) => (
    <P {...props} variant='body10'>
        {children}
    </P>
);

export const Body12: FC<WithChildren<TypographyBaseProps & ParagraphProps>> = ({
    children,
    ...props
}) => (
    <P {...props} variant='body12'>
        {children}
    </P>
);

export const Body14: FC<WithChildren<TypographyBaseProps & ParagraphProps>> = ({
    children,
    ...props
}) => (
    <P {...props} variant='body14'>
        {children}
    </P>
);

export const Body16: FC<WithChildren<TypographyBaseProps & ParagraphProps>> = ({
    children,
    ...props
}) => (
    <P {...props} variant='body16'>
        {children}
    </P>
);

export const Body18: FC<WithChildren<TypographyBaseProps & ParagraphProps>> = ({
    children,
    ...props
}) => (
    <P {...props} variant='body18'>
        {children}
    </P>
);

export const Button14: FC<
    WithChildren<TypographyBaseProps & ParagraphProps>
> = ({ children, ...props }) => (
    <P {...props} variant='button14'>
        {children}
    </P>
);

export const Button16: FC<
    WithChildren<TypographyBaseProps & ParagraphProps>
> = ({ children, ...props }) => (
    <P {...props} variant='button16'>
        {children}
    </P>
);

export const Button18: FC<
    WithChildren<TypographyBaseProps & ParagraphProps>
> = ({ children, ...props }) => (
    <P {...props} variant='button18'>
        {children}
    </P>
);

export const LabelText: FC<
    WithChildren<TypographyBaseProps & ParagraphProps>
> = ({ children, ...props }) => (
    <P {...props} variant='labelText'>
        {children}
    </P>
);
export const Caption: FC<
    WithChildren<TypographyBaseProps & ParagraphProps>
> = ({ children, ...props }) => (
    <P {...props} variant='caption'>
        {children}
    </P>
);
export const HelpText: FC<
    WithChildren<TypographyBaseProps & ParagraphProps>
> = ({ children, ...props }) => (
    <P {...props} variant='helpText'>
        {children}
    </P>
);
export const DataText: FC<
    WithChildren<TypographyBaseProps & ParagraphProps>
> = ({ children, ...props }) => (
    <P {...props} variant='dataText'>
        {children}
    </P>
);
export const MenuText: FC<
    WithChildren<TypographyBaseProps & ParagraphProps>
> = ({ children, ...props }) => (
    <P {...props} variant='menuText'>
        {children}
    </P>
);

export const Em = styled.em`
    ${baseStyles}

    ${({ weight }) => css`
        font-weight: ${weight || 500};
    `}

    display: inline;
    font-variant: italic;
`;

export const Small = styled.small`
    ${baseStyles}

    display: inline;
`;

export const Blockquote = styled.blockquote`
    ${baseStyles}
    border-left: 1px solid ${getColor('neutral', 300)};
    padding: 4px 12px;
`;

export const BaselineFix = styled.span`
    transform: translateY(-1px);
    display: inline-block;
`;
