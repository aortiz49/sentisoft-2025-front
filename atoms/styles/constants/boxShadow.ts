import { getColor, getRgba, getWhite } from '../palette';

export const BOX_SHADOW = {
    card: `0px 4px 16px ${getRgba('neutral', 900, 0.05)}`,
    dropdown: `0 6px 20px ${getRgba('neutral', 900, 0.15)}`,
    snackbar: `0 6px 20px ${getRgba('neutral', 900, 0.15)}`,
    navigation: `0 4px 8px ${getRgba('neutral', 900, 0.05)}`,
    websiteNavigation: `0 8px 24px ${getRgba('neutral', 900, 0.08)}`,
    imageFrame: `0 0 8px 5px ${getRgba('neutral', 900, 0.05)}`,
    search: `0px 0px 0px 3px ${getColor('purple', 300)}`,
};

export const BORDER_BOX_SHADOW = {
    rest: `inset 0 0 0 1px ${getColor('neutral', 500)}`,
    hover: `inset 0 0 0 1px ${getColor('neutral', 600)}`,
    focus: `inset 0 0 0 2px ${getColor('purple', 600)}`,
    restError: `inset 0 0 0 1px ${getColor('red', 400)}`,
    hoverError: `inset 0 0 0 1px ${getColor('red', 600)}`,
    focusError: `inset 0 0 0 2px ${getColor('red', 600)}`,
    disabled: `inset 0 0 0 1px ${getColor('neutral', 200)}`,
};

export const OUTLINE_BOX_SHADOW = {
    purple: `0 0 0 3px ${getColor('purple', 300)}`,
    red: `0 0 0 3px ${getColor('red', 300)}`,
    white: `0 0 0 2px ${getWhite()};`,
    neutral: `0 0 0 3px ${getColor('neutral', 300)}`,
};

export const DOUBLE_OUTLINE_BOX_SHADOW = {
    normal: `${BORDER_BOX_SHADOW.focus}, ${OUTLINE_BOX_SHADOW.purple}`,
    error: `${BORDER_BOX_SHADOW.focusError}, ${OUTLINE_BOX_SHADOW.red}`,
};
