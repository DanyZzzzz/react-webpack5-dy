import React, { FC, useEffect } from 'react';

const C: FC = () => {
    useEffect(() => {
        console.log('c');
    }, []);
    return <div>C</div>;
};
export default C;
