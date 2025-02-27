import { PropsWithChildren as WithChildren } from 'react';

import { Spinner } from '#/atoms/components/feedback';
import { BaselineFix, P } from '#/atoms/typography';

import { HUES_BY_STATE, TYPOGRAPHY_VARIANTS_BY_SIZE } from './constants';
import { Container, Content, SpinnerWrapper } from './styles';
import { ButtonProps } from './types';

export const Button = ({
    disabled = false,
    size = 'medium',
    state = 'default',
    type = 'button',
    variant = 'outlined',
    fullWidth,
    onClick,
    loading,
    noWrap,
    children,
    ...otherProps
}: WithChildren<ButtonProps>) => {
    return (
        <Container
            {...otherProps}
            type={type}
            variant={variant}
            disabled={disabled || loading}
            hue={HUES_BY_STATE[state]}
            onClick={onClick}
            internalLoading={!!loading}
            size={size}
            fullWidth={fullWidth}
            noWrap={noWrap}
            state={state}
        >
            <Content hide={!!loading}>
                {children && (
                    <P inheritColor variant={TYPOGRAPHY_VARIANTS_BY_SIZE[size]}>
                        <BaselineFix>{children}</BaselineFix>
                    </P>
                )}
            </Content>
            <SpinnerWrapper>
                {loading && (
                    <Spinner
                        size='small'
                        hue={HUES_BY_STATE[state]}
                        hueValue={500}
                    />
                )}
            </SpinnerWrapper>
        </Container>
    );
};
