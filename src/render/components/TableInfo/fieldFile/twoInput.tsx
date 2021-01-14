import React, { useState, useEffect, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { InputNumber as AInputNumber, Select as ASelect } from 'antd';
import { Iconf, wrapContext } from '../TableInfo';
import { Form } from 'antd';
import { ShowData } from './_css_comm';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Input as AInput } from 'antd';

const { Option } = ASelect;

let MInputNumber = styled(AInputNumber)`
  .ant-input-number-input {
    height: auto;
    padding: 0 11px 0 0;
  }
  && {
    width: 100%;
    padding: 1vh;
  }
  // .contentItem_twoInput_main{
  //   display:flex;
  //   width:100%;
  // }
  // .contentItem_twoInput{
  //   padding:0 1vw;
  //   position:relative;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  // }
`;

let MSelect = styled(ASelect)`
  .ant-select-selector {
    height: 100% !important;
    padding: 0 11px 0 0;
  }
  && {
    width: 100%;
    /* padding: 1vh; */
  }
`;

interface IconfInputNumber extends Iconf {
  min?: number;
  max?: number;
  defaultValue?: number;
  decimalSeparator?: string;
}

interface InputNumber {
  dispatch?: Dispatch;
  conf: IconfInputNumber;
  name: string;
}

const InputNumber: React.FC<InputNumber> = (props) => {
  const [inputArr, setinputArr] = useState([{ name: '', num: '' }]);
  const theme = useContext(wrapContext);

  const [OPTION,setOPTION]=useState([]);

  const _ = props.conf;
  const name = props.name;
  useEffect(() => {
    var list:any=theme.form.getFieldValue([name]) || inputArr;
    setinputArr(list)
  },[]);
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
              <Form.Item
                name={name}
                // rules={props.rules}
                rules={[
                  () => ({
                    validator(rule, value, callback) {
                      if (props.rules[0].required) {
                        for (var i = 0; i < value.length; i++) {
                          if (value[i].name == '' || !value[i].num || value[i].num == '') {
                            return Promise.reject(props.rules[0].message);
                          }
                        }
                      }
                      callback();
                    },
                  }),
                ]}
              >
                {inputArr.map((item, index) => (
                  <div
                    key={index}
                    style={{ display: 'flex', border: '1px solid #d9d9d9', padding: '1vh 0' }}
                    className="contentItem_twoInput_main"
                  >
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex' }}>
                        <span
                          style={{
                            width: '7vw',
                            textAlign: 'center',
                            background: '#ebebeb',
                            padding: '1vh 0',
                          }}
                        >
                          车队关键字
                        </span>
                        <MSelect
                          disabled={_data.state === 'disabled' ? true : false}
                          placeholder={_.placeholder}
                          size={_.size}
                          value={item.name}
                          onChange={(value:any,data:any) => {
                            item.name = data.title;
                            item.id=value;
                            setinputArr([...inputArr]);
                            theme.form.setFieldsValue({ [name]: inputArr })
                          }}
                        >
                          {_.options.map((item01:any, index01: number) => {
                            return (
                              <Option title={item01.name} value={item01.id} key={index01.toString()}>
                                {item01.name}
                              </Option>
                            );
                          })}
                        </MSelect>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <span
                          style={{
                            width: '7vw',
                            textAlign: 'center',
                            background: '#ebebeb',
                            padding: '1vh 0',
                          }}
                        >
                          电子票数量
                        </span>
                        {
                          _data.state === 'disabled'?<div style={{
                            width:'100%',
                            padding:'1vh 0',
                            'border':'1px solid #d9d9d9',
                            'padding-left':'18px',
                            color:'rgba(0, 0, 0, 0.25)'
                          }}>{item.num}</div>  :<MInputNumber
                          // style={_.style}
                          // min={_.min ? _.min : 0}
                          // max={_.max ? _.max : 9999}
                          disabled={_data.state === 'disabled' ? true : false}
                          placeholder={_.placeholderTwo}
                          size={_.size}
                          value={item.num}
                          onChange={(e) => {
                            item.num = e;
                            setinputArr([...inputArr]);
                            theme.form.setFieldsValue({ [name]: inputArr })
                          }}
                        />
                        }
                      

                      </div>
                    </div>

                   {
                     _data.state === 'disabled'?null:<div
                     style={{
                       padding: '0 1vw',
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center',
                     }}
                     className="contentItem_twoInput"
                   >
                     {inputArr.length == index + 1 ? (
                       <PlusCircleOutlined
                         onClick={() => {
                           setinputArr(inputArr.concat([{ name: '', num: '' }]));
                         }}
                         style={{ fontSize: '30px', color: '#08c', cursor: 'pointer' }}
                       />
                     ) : (
                       <MinusCircleOutlined
                         onClick={() => {
                           inputArr.splice(index, 1);
                           setinputArr([...inputArr]);
                         }}
                         style={{ fontSize: '30px', color: '#08c', cursor: 'pointer' }}
                       />
                     )}
                   </div>
                   }  

                    
                  </div>
                ))}
              </Form.Item>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};

export default InputNumber;
// export default connect(({  }: ConnectState) => ({

// }))(Input);
