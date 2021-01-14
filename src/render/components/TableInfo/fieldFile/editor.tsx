import React, { useState, useEffect,useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';

import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';

import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'

import { Form } from 'antd';
let MBraftEditor = styled(BraftEditor)`
  overflow:hidden;
  && {
    height:100%;
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

  const handleChange=(editorState)=>{
    theme.form.setFieldsValue({
      [name]:editorState.toHTML(),
    });


  }
  return (
    <wrapContext.Consumer>
      {(_data) => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{_.defaultValue || '　'}</ShowData>;
            break;
          case 'edit':
          case 'new':
          case 'disabled':
            return (
              <Form.Item name={name} rules={props.rules}>
 <MBraftEditor
            value={_.defaultValue}
            onChange={handleChange}
          />
              </Form.Item>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(Input);
