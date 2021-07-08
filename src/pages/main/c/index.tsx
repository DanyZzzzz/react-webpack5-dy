import { observable } from "mobx";
import { Button } from "antd";
import React, { FC, useEffect } from "react";
const C: FC = () => {
  useEffect(() => {
    const a = observable({ a: 2, n: { b: 2 } });
    console.log(a);
  }, []);
  return <div> </div>;
};
export default C;
