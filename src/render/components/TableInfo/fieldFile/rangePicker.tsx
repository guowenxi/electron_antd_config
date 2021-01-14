import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { DatePicker as _DatePicker } from 'antd';
import { Iconf, wrapContext } from '../TableInfo';
import {ShowData} from './_css_comm';


const ARangePicker = _DatePicker.RangePicker;

import {
  Form,
} from 'antd';
let MRangePicker = styled(ARangePicker)`

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

const RangePicker: React.FC<Iinput> = (props) => {
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
            return <Form.Item name={name} noStyle
            rules={props.rules}>
               <MRangePicker 
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
export default connect(({}) => ({}))(RangePicker);
