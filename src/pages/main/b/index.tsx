import { myTimer } from '@/module/UserModule';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import React, { FC } from 'react';

const B: FC = () => {
    const TimerView = observer(({ timer }: any) => <Button onClick={() => timer.reset()}>已过秒数：{timer.secondsPassed}</Button>);
    return (
        <div>
            bb
            <Button
                onClick={() => {
                    myTimer.increase();
                }}
            >
                点击即可+1
            </Button>
            <TimerView timer={myTimer} />
            <p>{myTimer.secondsPassed}</p>
        </div>
    );
};
export default B;
