import { PathLink } from '@/Component/Route/PathLink';
import { Button } from 'antd';
import React, { FC, useEffect } from 'react';
import { useModule } from '@/Component/Redux/index';

const Login: FC = () => {
    const { TestModule } = useModule();
    useEffect(() => {
        console.log(222);
    }, []);
    return (
        <div>
            123213123213213
            <Button
                onClick={() => {
                    TestModule.updataNumber(6);
                }}
            >
                {TestModule.num}
            </Button>
            <PathLink to="/main" componentPath="pages/main/index">
                main
            </PathLink>
        </div>
    );
};
export default Login;
