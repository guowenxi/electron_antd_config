import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import loadable from '@loadable/component'
import { IitemData } from './TableInfo';
import  './fieldFile';
import lodash from  'lodash';

import { Form } from 'antd';

let Label = styled.div<{ col?: string | number }>`
  flex: ${(props) => (props.col ? props.col : 3)};
  position: relative;
  /* ::after{
    content:"*";
    position: absolute;
    left:0;
    top:0;
    color:red;
  } */
`;

let Field = styled.div<{ col?: string | number }>`

  flex: ${(props) => (props.col ? props.col : 7)};
`;

let Item = styled.div<{ minHeight?: string; itemWidth?: string }>`
  display: flex;
  flex-flow: row;
  float: left;
  width: ${(props) => `${props.itemWidth}%`};
  .required{
    color:red;
  }
  .contentItem-name {
    text-align: center;
    max-width: 5.21vw;
    min-width: 5.21vw;
    padding: 1vh 0;
    border: 1px solid #d9d9d9;
    background: #ebebeb;
  }
  .ant-form-item{
    height:100%;
    margin-bottom:0 ;
  }
  .ant-form-item-explain{
    ::after{
      content:"";
      position:absolute;
      width:5px;
      height:5px;
      transform:rotate(45deg);
      top:-3px;
      border-left:1px solid #ccc;
      border-top:1px solid #ccc;
      z-index:111;
      background:#fff;
    }
    left:0;
    top:calc(100% + 5px);
    z-index:100;
          position: absolute;
        /* width: 100%; */
        background: #fff;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    .default-field{
      border:1px solid #ccc;
      padding: 1vh;
    }
  .contentItem-val {
    position: relative;
    min-height: ${(props) => props.minHeight ? `${props.minHeight}` : 'auto'};
    /* border: 1px solid #d9d9d9; */
    textarea {
      border: none;
      padding: 0;
      outline: none;
      font-size: 0.83vw;

      &:focus {
        border: none;
      }
    }
  }
`;


interface props {
  _item: IitemData;
}

export default class ContentItem extends Component<props> {

  filter_type(type: string, _: IitemData) {

    //如果是默认数据 不可编辑的
    if(type ==='default'){
      return <div>{_.field.props.defaultValue || "　" }</div>
    }

    //如果是可编辑的
    //每次新增组件的话需要在TableInfo的 index内进行绑定
    let Dom = require(`@fieldFile`)[lodash.camelCase(type)].default;



    return <Dom {..._} focus$={this.props.focus$} conf ={_.field.props}></Dom>

  }


  render() {

    const _ = this.props._item;
    return (
      <Item className={this.props.className} style={_.style} minHeight={_.height} itemWidth={_.width}
      >
        {/* 左侧 */}
        <Label style={_.label.style == ''? {} : _.label.style}  col={_.label.col}  className="contentItem-name" >
          {
            _.rules[0].required ?
            <span className="required">*</span> :null
          }
          {_.label.name}
        </Label>
        {/* 右侧 */}
        <Field col={_.field.col} className="contentItem-val">
              {_.costomNode || this.filter_type(_.field.type,_)}
        </Field>
      </Item>
    );
  }
}

interface Dprops extends IitemData{

}
export const DefaultItem :React.FC<Dprops> = (props) => {
  return (
    <Item className={props.className} minHeight={props.height} itemWidth={props.width}>
      {/* 左侧 */}
      <Label col={props.label.col}  className="contentItem-name" >
        {props.label.name}
      </Label>
      {/* 右侧 */}
      <Field col={props.field.col} className="contentItem-val default-field" >
        {props.field.name}
      </Field>
    </Item>
  );
};
