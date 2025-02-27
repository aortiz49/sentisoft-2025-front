export type Size = 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge';
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type PaddingStyle = 'horizontal' | 'vertical' | 'full';
export type PositionalAlignment =
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'baseline'
    | 'stretch';
export type DistributedAlignment =
    | 'space-around'
    | 'space-between'
    | 'space-evenly';

export type FlexAlignment = PositionalAlignment | DistributedAlignment;
export const SIZES_IN_PX: { [size in Size]: number } = {
    extraSmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 24,
};

export type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export type Dimensions = [number, number];

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type StrokeLinecap = 'butt' | 'round' | 'square' | 'inherit';
