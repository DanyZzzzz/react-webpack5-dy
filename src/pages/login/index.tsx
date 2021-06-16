import { PathLink } from '@/Component/Route/PathLink';
import React, { FC, useEffect } from 'react';

const Login: FC = () => {
    useEffect(() => {
        console.log(222);
    }, []);
    return (
        <div>
            123213123213213
            <PathLink to="/main" componentPath="pages/main/index">
                main
            </PathLink>
        </div>
    );
};
export default Login;
