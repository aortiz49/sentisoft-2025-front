import React, { useState } from 'react';
import '#/atoms/styles/css/global.css';
import { Breadcrumbs } from '#/atoms/navigation';
import { Button } from '#/atoms/components/Button';
import { Body16 } from '#/atoms/typography';

const App: React.FC = () => {
    const [displayMessage, setDisplayMessage] = useState(false);

    const breadcrumbs = [
        { content: 'Main route', action: () => console.log('Go 1') },
        { content: 'Subroute 1 ', action: () => console.log('Go 2') },
        { content: 'Resource' },
    ];
    return (
        <div
            style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                marginTop: '16px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button
                        type={'button'}
                        onClick={() => setDisplayMessage(true)}
                    >
                        Show message
                    </Button>
                    <Button
                        type={'button'}
                        onClick={() => setDisplayMessage(false)}
                    >
                        Hide message
                    </Button>
                </div>
                {displayMessage && (
                    <Body16 hue='green' hueValue={500}>
                        This is a test message
                    </Body16>
                )}
            </div>
        </div>
    );
};

export default App;
