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
let monacoInstance;

const WrapEdit = styled.div`
width:100%;
height:50vh;
`

const ModalConfig :React.FC = (props) => {

  const { dispatch ,handleOk,handleCancel ,modalId ,modalKey} = props;
  const { configStauts  ,configType ,configData_configPage} = props.common;

  return <Modal
  title="设置"
  width="1220px"
  visible={modalId}
  onOk={()=>{
    handleOk();
  }}
  onCancel={()=>{
    handleCancel ? handleCancel() :null ;
    dispatch({
      type: 'common/save',
      payload: {
        [modalKey]: false,
      }
    })
  }}
>
  {props.children}
</Modal>
};

export default connect(({ common }: any) => ({
  common
}))(ModalConfig)