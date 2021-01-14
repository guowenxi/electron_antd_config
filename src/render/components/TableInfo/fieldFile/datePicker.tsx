import React, { useState, useEffect, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { DatePicker  as ADatePicker  } from 'antd';
import { Iconf, wrapContext } from '../TableInfo';
import {ShowData} from './_css_comm';
import moment from 'moment';
import {
  Form,
} from 'antd';
let MDatePicker = styled(ADatePicker)`

  width:100%;
  && {
    padding: 1vh;
  }


`;



interface IconfInput extends Iconf {
  placeholder?: string;
  disabledDate ?: object  | string;
  disabledTime ?: object  | string;
  showTime ?: boolean;
}
interface Iinput {
  dispatch?: Dispatch;
  conf: IconfInput;
  name: string;
}

const DatePicker: React.FC<Iinput> = (props) => {
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
               <MDatePicker 
                  style={_.style}
                  showTime={_.showTime}
                  disabledDate ={(current)=>{
                    if(typeof _.disabledDate === "function"){
                      return _.disabledDate(current)
                    }else if(_.disabledDate  === '>'){
                      return current &&  current > moment().endOf('day').subtract(1, 'days');
                    }else if(_.disabledDate === '<'){
                      return current &&  current < moment().endOf('day').subtract(1, 'days');
                    }
                  }}
                disabledTime ={_.showTime && _.disabledTime ? _.disabledTime  : null}
               disabled={_data.state === 'disabled' ? true : false}
               format={_.showTime?  'YYYY/MM/DD HH:mm:ss'  :  'YYYY/MM/DD'}
                />
            </Form.Item>
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(DatePicker);
