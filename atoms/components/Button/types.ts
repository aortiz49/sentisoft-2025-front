import { Size } from '#/atoms/styles/constants/size';
import { OnClickHandler } from '#/utils/types';

import { BUTTON_VARIANTS } from './constants';

export type ButtonProps = {
    /**
     * This emphasizes the state of the button: success/correct, danger/incorrect,
     * warning/almost or primary/default.
     */
    state?: ButtonHueState;
} & ButtonTypeProps &
    ButtonDefaultStyleProps;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export type ButtonHueState =
    | 'default'
    | 'success'
    | 'danger'
    | 'warning'
    | 'contrast'
    | 'darkVariant';

export type ButtonTypeProps =
    | {
          type?: 'button';
          onClick: OnClickHandler;
          disabled?: false;
      }
    | {
          type?: 'button';
          disabled: true;
          onClick?: OnClickHandler;
      }
    | {
          type: 'submit';
          onClick?: OnClickHandler;
      };

export type ButtonDefaultStyleProps = {
    /**
     * This emphasize the action of the button. "solid" are high-emphasis containing actions that are primary,
     * "outlined" is medium-emphasis containing actions that are important, but aren’t the primary action,
     * "text" are typically used for less-pronounced actions
     */
    variant?: ButtonVariant;
    /**
     * If "true", the button is not clickable
     */
    disabled?: boolean;
    /**
     * Indicates the button is still processing the click event
     */
    loading?: boolean;
    /**
     * Button size
     */
    size?: Size | 'extraSmall';
    /**
     * If "true", The button uses the full width of the parent
     */
    fullWidth?: boolean;
    /**
     * If "true", the button will not allow its label to wrap
     */
    noWrap?: boolean;
};
