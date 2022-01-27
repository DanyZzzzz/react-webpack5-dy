/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Button, Result } from 'antd';
import * as React from 'react';

const NoMatch = (props?: any): React.ReactElement => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="对不起，您访问的页面是空的."
            extra={
                <Button
                    type="primary"
                    onClick={(): void => {
                        props.history.replace('/');
                    }}
                >
                    返回首页
                </Button>
            }
        />
    );
};

export default NoMatch;
