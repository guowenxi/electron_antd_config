import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { useRequest, useDynamicList, useUpdateEffect, useUpdateLayoutEffect } from 'ahooks';
import { Select as ASelect } from 'antd';
import { Input ,message } from 'antd';
const { Option } = ASelect;
import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';
import { CloseCircleTwoTone, PlusSquareTwoTone } from '@ant-design/icons';
import { joinUrl } from '@/utils/utils';

let MSelect = styled(ASelect)`
  float: left;
  width: 100%;
`;
let WrapBox = styled(Form.Item)`
  float: left;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
`;
let Circle = styled.div`
  float: left;
  font-weight: bold;
  font-size: 22px;
  line-height: 19px;
  position: relative;
  color: rgb(255, 255, 255);
`;
let Add = styled(PlusSquareTwoTone)`
  font-size: 18px;
  position: absolute;
  top: -5px;
  right: -7px;
  color: #ec2828;
  cursor: pointer;
`;
let Close = styled(CloseCircleTwoTone)`
  font-size: 18px;
  position: absolute;
  top: -5px;
  right: -7px;
  color: #ec2828;
  cursor: pointer;
`;
let Inputs = styled(Input)`
  && {
    min-width: 110px;
    text-align: left !important;
    /* margin-left: 10px; */
    letter-spacing: 6px;
    font-weight: bold;
  }
`;
let PlateSelect = styled.div`
  min-width: 110px;
  font-weight: bold;
  float: left;
  background: #3a93f8;
  border-radius: 6px;
  height: 40px;
  margin: 1vh;
  display: flex;
  position: relative;
  padding: 10px;
  text-align: center;
  color: #fff;
  letter-spacing: 3px;
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 96%;
    height: 33px;
    border: 1px solid #fff;
    border-radius: 3px;
  }
  input {
    color: #fff;
    max-width: 20px;
    min-width: 20px;
    border: none;
    background: transparent;
    padding: 0 !important;
  }
`;

let PlateSelectBox = styled.div`
  width: 100%;
  float: left;
`;
let PlateList = styled.div`
  width: 100%;
  float: left;
`;

interface Ioptions {
  name: string;
  id: number;
}
interface IconfSelect extends Iconf {
  placeholder?: string;
  relationType: string;
  options: Array<Ioptions>;
  defaultValue: string;
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
  const [INPUT, setINPUT] = useState('浙C');
  const { list, resetList, remove, getKey, push } = useDynamicList([]);
  useUpdateEffect(() => {
    theme.form.setFieldsValue({
      [name]: list,
    });
  }, [list]);
  useEffect(() => {
    const data = theme.form.getFieldsValue();
    resetList(data[name] === '' ? [] : data[name]);
  }, []);
  return (
    <wrapContext.Consumer>
      {(_data) => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{VAL}</ShowData>;
            break;
          case 'edit':
          case 'new':
          case 'disabled':
            return (
              <WrapBox name={name}>
                {_data.state != 'disabled' ? (
                  <PlateSelectBox>
                    <PlateSelect>
                      <Input.Group>
                        {/* <Input maxLength="1"/>
                      <Input maxLength="1"/>
                      <Circle>·</Circle> */}
                        <Inputs
                          maxLength="7"
                          value={INPUT}
                          onChange={(e) => {
                            setINPUT(e.target.value);
                            // theme.form.setFieldsValue({
                            //   [name]: e.target.value,
                            // });
                          }}
                        />
                      </Input.Group>
                      <Add
                        onClick={() => {
                          if (INPUT.length === 7) {
                            push(INPUT.toUpperCase());
                            setINPUT('浙C');
                          }else{
                            message.error('请输入完整的车牌信息');
                          }
                        }}
                      />
                    </PlateSelect>
                  </PlateSelectBox>
                ) : null}
                <PlateList>
                  {list.map((item, idx) => {
                    return (
                      <PlateSelect keys={idx}>
                        {
                        _data.state != 'disabled'?
                          <Close onClick={() => remove(idx)} twoToneColor="#ec2828" /> :null
                        }
                        {item}
                      </PlateSelect>
                    );
                  })}
                </PlateList>
              </WrapBox>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({ select }) => ({
  select,
}))(Select);
