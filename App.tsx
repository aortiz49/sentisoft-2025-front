import React from 'react';
import '#/atoms/styles/css/global.css';
import { Breadcrumbs } from './atoms/navigation';

const App: React.FC = () => {
    const breadcrumbs = [
        { content: 'Service catalog', action: () => console.log('Go 1') },
        { content: 'Plumbing', action: () => console.log('Go 2') },
        { content: 'Michael Strahan' },
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
            <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
    );
};

export default App;
