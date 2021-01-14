import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { InputNumber as AInputNumber } from 'antd';
import { Iconf ,wrapContext} from '../TableInfo';
import { Form } from 'antd';
import {ShowData} from './_css_comm';
let MInputNumber = styled(AInputNumber)`
  .ant-input-number-input {
    height: auto;
    padding: 0 11px 0 0;
  }
  && {
    width: 100%;
    padding: 1vh;
  }
`;

interface IconfInputNumber extends Iconf {
  min?: number;
  max?: number;
  defaultValue?: number;
  decimalSeparator?: string;
}

interface InputNumber {
  dispatch?: Dispatch;
  conf: IconfInputNumber;
  name: string;
}

const InputNumber: React.FC<InputNumber> = (props) => {
  const _ = props.conf;
  const name = props.name;


  useEffect(() => {}, []);
  return (
    <wrapContext.Consumer>
      {(_data) => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{_.defaultValue || '　'}</ShowData>;
            break;
          case 'edit':
            case 'new':
          case 'disabled':
            return (
              <Form.Item name={name} 
              rules={props.rules}>
              <MInputNumber
              style={_.style}
              min={_.min ? _.min : 0}
               max={_.max ? _.max : 9999}
               disabled={_data.state === 'disabled' ? true : false}
                size={_.size} />
            </Form.Item>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};

export default InputNumber;
// export default connect(({  }: ConnectState) => ({

// }))(Input);
