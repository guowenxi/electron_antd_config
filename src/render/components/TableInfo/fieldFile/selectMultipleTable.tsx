import React, { useState, useEffect,useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';

import { Select as ASelect,Button,Modal,Tag  } from 'antd';
const { Option } = ASelect;
import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';
import MixinTable from '@components/MixinTable/MixinTable';


import { joinUrl } from '@/utils/utils';
import Search from 'antd/lib/input/Search';

import {useList} from 'react-use'

let SelectTableBox= styled.div`
border:1px solid #ccc;
  display:flex;
  align-items:center;
  .select-main-box{
    display:flex;
    flex-flow:row  wrap;
    .select-item-box{
      margin:1vh;
    }
  }
`;

let NButton=styled(Button)`
  margin:0 1vh;
`

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



let AModal = styled(Modal)`
&& {
  width: 70vw !important;
  .select-tree-modal-box {
    width:100%;
    display:flex;
    .tree-box-main-box{
      width:30%;
      margin-right:1vw;
    }
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

  const __ =_.tableSetting?_.tableSetting:{}
  const theme = useContext(wrapContext);
  const [OPTION, {set, push}] = useList();
  const [VAL, setVAL]  = useState();
  const [VISIBLE,setVISIBLE]=useState(false);
  const [SELECTROWKEYS, setSELECTROWKEYS] = useState();
  function filterData(namespace:string,conf:any){
    let _op = [];
    let data=theme.form.getFieldValue();
    _op = data[_.itemKey]?data[_.itemKey]:[];
    let value=data[name]?data[name]:[]
    set(_op);
    setVAL(value)
  }

    //只在初始化时进行加载
  useEffect(()=>{
    filterData("select",_)
  },[])

  /* 删除 */
  const deleteTableData=(item,index)=>{
    OPTION.splice(index,1);
    VAL.splice(index,1);
    set(OPTION);
    setVAL(VAL);
  }


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
              <Form.Item name={name} noStyle
              rules={props.rules}>
                <SelectTableBox>
                    <div className="select-main-box">
                      {
                          Array.isArray(OPTION)?OPTION.map((item,idx:number)=>{
                            return  <Tag 
                            className="select-item-box"
                            // closable
                            // onClose={e => {
                            //   e.preventDefault();
                            //   deleteTableData(item,idx)
                            // }}
                            >{item.name}</Tag>
                          }):""
                  }
                    </div>
                     {/* <MSelect
                     value={VAL}
                      mode="multiple"
                      placeholder={_.placeholder}
                      showSearch
                      disabled={_data.state === 'disabled' ? true : false}
                      filterOption={(input, option) =>{
                        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                      open={false}
                    >
                        {
                    Array.isArray(OPTION)?OPTION.map((item,idx:number)=>{
                      return  <Option title={item.name} value={item.id.toString()}>{item.name}</Option>
                    }):""
                  }
                  </MSelect> */}

                  <NButton  type="primary" onClick={()=>(setVISIBLE(true))} >
                    {_.btnText}
                  </NButton>
              </SelectTableBox>

                <AModal title={_.modalTitle} visible={VISIBLE}
                 onOk={()=>{
                  const ids = [];
                  const data = SELECTROWKEYS.map((item,idx)=>{
                    ids.push(__.idKey ? item[__.idKey] :item.id);
                    return {
                      ...item,
                      name:__.nameKey ? item[__.nameKey] : item.name,
                      id:__.idKey ? item[__.idKey] :item.id,
                    }
                  });

                  //////////
                  theme.form.setFieldsValue({
                    [name]:ids,
                  });
                  ////////
                  set(data),
                  setVAL(ids),
                  setVISIBLE(false);
                 }}
                 onCancel={()=>(setVISIBLE(false))}>
                  <MixinTable url={__.url}
                  changeKey={VISIBLE}
                   params={__.params} 
                  columns={__.columnsList}
                  rowSelection={(res,data)=>{
                    res.map((item01,index01)=>{
                      OPTION.map((item02,index02)=>{
                        if(item01===item02.id){
                          data[index01]=item02;
                        }
                      })
                    })
                    setSELECTROWKEYS(data);
                    // setOPTION(data);
                    // setVAL(data)
                  }}
                  rowKey="item" 
                  defaultValue={VAL}
                      ></MixinTable>
                </AModal>

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
