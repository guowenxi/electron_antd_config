import React, { useState, useEffect,useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { useRequest } from 'ahooks';
import { Select as ASelect } from 'antd';
const { Option } = ASelect;
import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';

import { EventEmitter } from 'ahooks/lib/useEventEmitter';

import { joinUrl } from '@/utils/utils';



let MSelect = styled(ASelect)`
  && {
    width:100%;
    height:43px;
    .ant-select-selector{
      height:100%;
    }
    .ant-select-selection-search-input{
      height:100% !important;
    }
    .ant-select-selection-item{
      line-height:43px;
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
  defaultValue: string 
}
interface ISelect {
  dispatch?: Dispatch;
  conf: IconfSelect;
  name: string;
}

const Select: React.FC<ISelect> = (props) => {
  const _ = props.conf;
  const name = props.name;
  const { dispatch } = props;
  const theme = useContext(wrapContext);
  const [OPTION, setOPTION ]  = useState([]);
  const [VAL, setVAL]  = useState("　");

  async function filterData(namespace:string,conf:any){
    let _op = [];
    if(conf.relationType){
      _op = props[namespace][conf.relationType];
    }else if(conf.url){

      const data = await dispatch({
        type: 'common/requestData',
        url: conf.url,
        method: 'GET',
        payload: {
          ...conf.params
        },
      })

      if(conf.keyName){
          data.map(function(item,idx){
            item.name = item[conf.keyName];
            item.id = item[conf.idName];
          })
      }


      // const { data, error, loading } = useRequest()
      _op = data;
    }else{
      _op = conf.options;
    }
    setOPTION(_op);
    filterDefaultValue(_op,_.defaultValue)
  }

  function filterDefaultValue(OPTION:Array<Ioptions>,id:string){
        if(Number(id)){
         let val =  OPTION.find(function(item){
            return Number(item.id) ===Number(id);
          })
          setVAL(val.name)
        }
  }
    //只在初始化时进行加载
  useEffect(()=>{
    filterData("select",_)
  },[])

  theme.event$.useSubscription((data) => {
    const i= data.relateNames.indexOf(name);
    if(i>=0){
      switch(data.type){
          case "onChange":
            if(!_.params) return ;
            _.params[data.relatekeys[i]] = data.value;
            theme.form.setFieldsValue({
              [name]:[],
            });
            if(_.optionsKeyName){
              _.optionsList.map((item:any,index:nueber)=>{
                if(item[_.keyName]===data.value){
                  setOPTION(item[_.optionsKeyName]);
                }
              })
            }else{
              filterData("select",_)
            }
            break;
      }
    }
  });




  ///relateNames

  return (
    <wrapContext.Consumer>
      {(_data) => {
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
                 <MSelect
                placeholder={_.placeholder}
                showSearch
                disabled={_data.state === 'disabled' ? true : false}
                onChange={(val)=>{
                  if(_.relateNames){
                    _data.focus$.emit({
                      relateNames:_.relateNames,
                      relatekeys:_.relatekeys,
                      type:_.clickType ? _.clickType  : "onChange",
                      value:val
                    })
                  }
                }}
                filterOption={(input, option) =>{
                  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }} 
                >
                  {
                    OPTION.map((item,idx:number)=>{
                      return  <Option title={item.name} value={item.id}>{item.name}</Option>
                    })
                  }
                </MSelect>
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
}))(Select);
