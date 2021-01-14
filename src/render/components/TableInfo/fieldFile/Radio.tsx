import React, { useState, useEffect,useContext } from 'react';
import styled from 'styled-components';
import { connect, Dispatch } from 'umi';
import { Radio as ARadio } from 'antd';

import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';


let WRadio = styled(ARadio.Group)`
  width:100% !important;
  height:100% !important;
  border:1px solid #ccc;
`;

let MRadio = styled(ARadio)`
  && {
   float: left;
    /* height: 43px; */
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 10px;
    .ant-select-selector{
      height:100%;
    }
    .ant-select-selection-search-input{
      height:100% !important;
    }
  }
`;

interface Ioptions {
  name:string,
  id:number
}
interface IconfSelect extends Iconf {
  placeholder?: string,
  relationType:string,
  options:Array<Ioptions>,
  defaultValue: string ,
  relateNames:string,
  relatekeys:string,
  clickType:string,

}
interface IRadio {
  dispatch?: Dispatch;
  conf: IconfSelect;
  name: string;
  rules:string,
}

const Radio: React.FC<IRadio> = (props) => {
  const _ = props.conf;
  const name = props.name;
  const [OPTION, setOPTION ]  = useState([]);
  const [VAL]  = useState("　");
    //只在初始化时进行加载
  useEffect(()=>{
    setOPTION(_.options)
  },[])



  ///relateNames

  return (
    <wrapContext.Consumer>
      {(_data :any) => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{VAL}</ShowData>;
            break;
          case 'edit':
            case "new" :
          case 'disabled':
            return (
              <Form.Item name={name} 
              rules={props.rules}>
                <WRadio disabled={_data.state === 'disabled' ? true : false}
                onChange={(e)=>{
                  if(_.relateNames){
                    _data.focus$.emit({
                      relateNames:_.relateNames,
                      relatekeys:_.relatekeys,
                      type:_.clickType ? _.clickType  : "onChange",
                      value:e.target.value
                    })
                  }
                }}>
                  {OPTION.map((item,idx)=>{
                    return <MRadio keys={idx} value={item.id}>{item.name}</MRadio>
                  })}
                </WRadio>
              </Form.Item>

            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({
  select
}) => ({
  select
}))(Radio);
