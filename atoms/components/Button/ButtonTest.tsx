import React from 'react';
import { Button } from '#/atoms/components/Button';
import { H1 } from '#/atoms/typography';

const sizes = ['extraSmall', 'small', 'medium', 'large'] as const;
const variants = ['solid', 'outlined', 'text'] as const;
const states = [
    'default',
    'success',
    'danger',
    'warning',
    'contrast',
    'darkVariant',
] as const;

const ButtonTest: React.FC = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                gap: '20px',
            }}
        >
            <H1>Button Variations</H1>
            <div
                style={{
                    display: 'flex',
                    gap: '20px',
                }}
            >
                {sizes.map((size) => (
                    <div
                        key={size}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        <H1>{size}</H1>
                        {variants.map((variant) =>
                            states.map((state) => (
                                <Button
                                    key={`${size}-${variant}-${state}`}
                                    size={size}
                                    variant={variant}
                                    state={state}
                                    onClick={() =>
                                        console.log(
                                            `${size}-${variant}-${state} clicked`
                                        )
                                    }
                                >
                                    {`${variant} - ${state}`}
                                </Button>
                            ))
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ButtonTest;
