import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { TimePicker  as ATimePicker  } from 'antd';
import { Iconf, wrapContext } from '../TableInfo';
import {ShowData} from './_css_comm';

import {
  Form,
} from 'antd';
let MTimePicker = styled(ATimePicker)`

  width:100%;
  && {
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

const TimePicker: React.FC<Iinput> = (props) => {
  const _ = props.conf;
  const name = props.name;

  return (
    <wrapContext.Consumer>

      {(_data) => {
        switch(_data.state){
            case "default" :
            return <ShowData>{_.defaultValue || "　" }</ShowData>;
            break;
            case "edit" :
              case "new" :
            case "disabled" :
            return <Form.Item name={name}
            rules={props.rules}>
               <MTimePicker 
              style={_.style}
               disabled={_data.state === 'disabled' ? true : false}
                />
            </Form.Item>
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(TimePicker);
