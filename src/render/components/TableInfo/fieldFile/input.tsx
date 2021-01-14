import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { Input as AInput } from 'antd';
import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';

import { Form } from 'antd';
let Minput = styled(AInput)`
  && {
    height:100%;
    padding: 1vh;
  }
`;

interface IconfInput extends Iconf {
  placeholder?: string;
}
interface Iinput {
  dispatch?: Dispatch;
  conf: IconfInput;
  name: string;
}

const Input: React.FC<Iinput> = (props) => {
  const _ = props.conf;
  const name = props.name;

  
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
              <Form.Item name={name} rules={props.rules}>
                <Minput
                  style={_.style}
                  disabled={_data.state === 'disabled' ? true : false}
                  placeholder={_.placeholder}
                  size={_.size}
                />
              </Form.Item>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(Input);
