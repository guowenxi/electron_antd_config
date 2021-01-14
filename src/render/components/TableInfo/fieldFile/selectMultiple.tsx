import React, { useState, useEffect ,useContext} from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { useRequest } from 'ahooks';
import { Select as ASelect } from 'antd';
const { Option } = ASelect;
import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';


import { joinUrl } from '@/utils/utils';





let MSelect = styled(ASelect)`
  && {
    width:100%;
    height:100%;
    .ant-select-selector{
      height:100%;
      padding:1vh;
    }
    .ant-select-selection-search-input{
      height:100% !important;
    }
    .ant-select-selection-item{
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

  theme.event$.useSubscription((data) => {
    const i= data.relateNames.indexOf(name);
    if(i>=0){
      _.params[data.relatekeys[i]] = data.value;
      theme.form.setFieldsValue({
        [name]:[],
      });
      filterData("select",_)
    }
  });

  async function filterData(namespace:string,conf:any){
    let _op = [];
    if(conf.relationType){
      _op = props[namespace][conf.relationType];
    }else if(conf.url){
      //暂不支持使用url地址 ---
      //已修复 可以使用url地址
      //select组件需要copy代码片段过去
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
                 initialValue="null"
                 mode="multiple"
                placeholder={_.placeholder}
                showSearch
                disabled={_data.state === 'disabled' ? true : false}
                onChange={(val)=>{
                }}
                filterOption={(input, option) =>{
                  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }}
                >
                  {
                    OPTION.map((item,idx:number)=>{
                      return  <Option title={item.name} value={item.id.toString()}>{item.name}</Option>
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
