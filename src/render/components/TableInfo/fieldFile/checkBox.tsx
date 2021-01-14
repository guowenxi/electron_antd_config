import React, { useState, useEffect,useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { Checkbox  as ACheckbox  } from 'antd';
import { Iconf, wrapContext } from '../TableInfo';
import {ShowData} from './_css_comm';


import {
  Form,
} from 'antd';
let Minput = styled(ACheckbox)`
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

const Input: React.FC<Iinput> = (props) => {
  const _ = props.conf;
  const name = props.name;
  const theme = useContext(wrapContext);
  const [valueData,setValueData]=useState("")

  useEffect(() => {
    var value=theme.form.getFieldValue(name);
    setValueData(value)
  }, [])

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
            rules={props.rules}
            >
                <Minput
                   style={_.style}
              disabled={_data.state === 'disabled' ? true : false}
              placeholder={_.placeholder}
              size={_.size}
              value={valueData}
              checked={valueData}
              onChange={(val:any)=>{
                let checkedStatus=val.target.checked;
                theme.form.setFieldsValue({
                  [name]:checkedStatus
                })
                setValueData(checkedStatus);
                if(_.relateNames){
                  _data.focus$.emit({
                    relateNames:_.relateNames,
                    relatekeys:_.relatekeys,
                    type:_.clickType ? _.clickType  : "onChange",
                    value:val
                  })
                }
              }}
            >{_.displayName?_.displayName:''}</Minput>
                 
            </Form.Item>
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(Input);
