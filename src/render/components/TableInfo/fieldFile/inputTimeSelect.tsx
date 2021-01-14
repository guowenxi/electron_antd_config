import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';
import { InputNumber as AInputNumber } from 'antd';
import { DatePicker as ADatePicker } from 'antd';
import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import moment from 'moment';
import { Form } from 'antd';
let FlexBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;
let MInputNumber = styled(AInputNumber)`
  .ant-input-number-input {
    height: auto;
    padding: 0 11px 0 0;
  }
  flex: 2;
  && {
    width: 100%;
    padding: 1vh;
  }
`;
let MDatePicker = styled(ADatePicker)`
  flex: 1;
  && {
    height: 100%;
    padding: 1vh;
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

let defaultValueData:number=0;

const Input: React.FC<Iinput> = (props) => {
  const _ = props.conf;
  const name = props.name;
  const { dispatch } = props;
  const [NOWDATE, setNOWDATE] = useState(moment(new Date(), 'YYYY-MM-DD'));

 

  async function changeData(params: any) {
    if (!params) params = 0;
    const data = await dispatch({
      type: 'common/requestData',
      url: _.url,
      method: 'GET',
      payload: {
        limitNum: params,
        beginDate: moment().format('YYYY-MM-DD'),
      },
    });

    setNOWDATE(moment(data));
  }

  /* 获取当前值 */
  const getCurrentValue=(data)=>{
   let value:any=data.getFieldValue(name);
   defaultValueData=value;
  }

  useEffect(()=>{
    if(defaultValueData!=undefined || defaultValueData!=null){
      changeData(defaultValueData);
    }
  },[defaultValueData])
 

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
              <FlexBox>
                <Form.Item name={name} rules={props.rules}>
                  <MInputNumber
                    onChange={(e) => {
                      changeData(e);
                    }}
                    style={_.style}
                    disabled={_data.state === 'disabled' ? true : false}
                    placeholder={_.placeholder}
                    size={_.size}
                    min={0}
                  />
                </Form.Item>
                <MDatePicker disabled value={NOWDATE} />
                {getCurrentValue(_data.form)}
              </FlexBox>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({}) => ({}))(Input);
