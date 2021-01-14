import React from 'react'
import { connect, Route } from 'umi'
import styled from 'styled-components'
import _ from 'lodash'
import { useState, useMemo, useEffect } from 'react'
import {
  Modal,
  Input
} from 'antd'
const { Search } = Input
import { useToggle, useUnmount, useAntdTable ,useUpdateEffect  } from 'ahooks'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
const { ipcRenderer } = require('electron')
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import ModalConfig  from '@/components/ModalConfig/index'
let monacoInstance;


const WrapEdit = styled.div`
width:100%;
height:50vh;
`

const ModalTable :React.FC = (props) => {

  const { dispatch ,onSubmit ,modalId } = props;
  const { modal_table  ,configType ,configData_configPage} = props.common;
  const handleOk = function(){
    try{
      let code = "";
      code = monacoInstance.getValue();//获取实例数据
      filterCode(code)
      // monacoInstance.cancel();//使用完成销毁实例
      dispatch({
        type: 'common/save',
        payload: {
          configData_configPage:Object.assign(configData_configPage,{columns:code})
        }
      })
      onSubmit(Object.assign(configData_configPage,{columns:code}))
     }catch(err){
      alert(err)
       return err;
     }
    dispatch({
      type: 'common/save',
      payload: {
        modal_table: false,
      }
    })
  };
   const handleCancel = ()=>{
     try{
      // monacoInstance.cancel();//使用完成销毁实例
     }catch(err){
       alert(err)
       return err;
     }
    dispatch({
      type: 'common/save',
      payload: {
        modal_table: false,
      }
    })
  }

  const filterCode = (code)=>{

    // let t = code.slice(code.match(/\[/).index,code.match(/\]/).index)
    // t = JSON.parse(t);
    return ;
  }
  useUpdateEffect(() => {
    
    if( modal_table){
      console.log(configData_configPage.columns);
      if(monacoInstance){
        monacoInstance.setValue(configData_configPage.columns);
        return ;
      }
      monacoInstance=monaco.editor.create(document.getElementById("monaco"),{
        value:configData_configPage.columns,
        language:"javascript",
        theme: "vs-dark",
        })
    }
  }, [modal_table])

  useUnmount(() => {
    monacoInstance = null;
  }, [])

  const onSearchRouter = value => {
    
  }

  return <ModalConfig  modalId = {modalId} modalKey={'modal_table'} handleOk={(data)=>{
    handleOk()
    dispatch({
      type: 'common/save',
      payload: {
        modal_table: false,
      }
    })
    }}>
    <Search
  style={{marginBottom:'2vh'}}
    placeholder='输入接口'
    defaultValue="http://"
    allowClear
    enterButton='绑定接口数据'
    size='middle'
    onSearch={onSearchRouter}
  />
<WrapEdit id="monaco"></WrapEdit>
  </ModalConfig>
};

export default connect(({ common }: any) => ({
  common
}))(ModalTable)