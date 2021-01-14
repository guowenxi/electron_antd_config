import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { Input as AInput } from 'antd';
import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';

import { Form } from 'antd';
// let TableTitle = styled(AInput)`
//   && {
//     height:100%;
//     padding: 1vh;
//   }
// `;

interface IconfInput extends Iconf {
  placeholder?: string;
}
interface Iinput {
  dispatch?: Dispatch;
  conf: IconfInput;
  name: string;
}

const TableTitle: React.FC<Iinput> = (props) => {
  const _ = props.conf;
  const name = props.name;

  return (
    <wrapContext.Consumer>
      {(_data) => {
        return (
          <div>
            <div></div>
            {_.defaultValue}
          </div>
        );
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(TableTitle);
