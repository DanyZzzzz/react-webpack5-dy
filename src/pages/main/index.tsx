import React, { FC } from 'react';
import { PathLink } from '@/Component/Route/PathLink';
import { RouterView } from '@/Component/Route/router';

const Main: FC = () => {
    return (
        <div>
            asdasd
            <PathLink to="/main/c" componentPath="pages/main/c/index">
                C
            </PathLink>
            <PathLink to="/main/b" componentPath="pages/main/b/index">
                B
            </PathLink>
            <PathLink to="/main/a" componentPath="pages/main/a/index">
                A
            </PathLink>
            <RouterView />
        </div>
    );
};
export default Main;
