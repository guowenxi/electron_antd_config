import React, { useState, useEffect, useContext } from 'react';
import { Input } from 'antd';
import styled, { ThemeProvider } from 'styled-components';
import { Icon } from 'antd';
import { Form } from 'antd';
import { useUpdateEffect } from 'ahooks';
import { FormComponentProps } from 'antd/lib/form';
import { useDynamicList } from 'ahooks';
import { Link, connect, Dispatch } from 'umi';
import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
  } from '@ant-design/icons';


let FromList = styled(Form.Item)`
  && {
    height:100%;
    padding: 1vh;
    border:1px solid #ccc;
  }
  .items{
      margin:5px 0;
  }

`;



const DynamicList: React.FC<Iinput> = (props) => {
  const theme = useContext(wrapContext);
  const { list,resetList ,insert, remove, getKey, push } = useDynamicList([]);
  const _ = props.conf;
  const name = props.name;
  const Row = (index: number, item: any) => {
    return (
        <div className="items" key={getKey(index)}>
        <Input style={{ width: 300 }}
       placeholder={_.placeholder}
       value= {item[_.keyName]}
      //   defaultValue={item[_.keyName]}
        onChange={(e)=>{
            var _list = list;
            _list[index][_.keyName] =  e.target.value;
            resetList(_list);
            theme.form.setFields([{
              name:name,
              value:_list
            }])
        }}
         />
      {list.length > 1 && (
        <MinusCircleOutlined
          style={{ marginLeft: 8 }}
          onClick={() =>
              {
              const _list = remove(index)

          }}
        />
      )}
      <PlusCircleOutlined
        style={{ marginLeft: 8 }}
        onClick={() => {
          insert(index+1,{})
        }}
      />
        </div>

    );
  };
  const filterData = (props) => {
    const data = theme.form.getFieldsValue();
    resetList(data[name].length==0 ? [{}] : data[name])
    return data[name];
  };

  //只在初始化时进行加载
  useEffect(() => {
    filterData(props);
  }, []);
  //只在初始化时进行加载
  useUpdateEffect(() => {
    theme.form.setFields([{
        name:name,
        value:list
      }])
  }, [list]);

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
              <FromList name={name} rules={props.rules} >

                  {list.map((ele, index) => {
                  return Row(index, ele);
                })}

              </FromList>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(DynamicList);
