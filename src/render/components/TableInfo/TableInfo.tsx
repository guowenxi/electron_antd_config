import React, { useEffect,useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ContentItem from './item';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Button, Input, Space } from 'antd';
import { Link, connect, Dispatch } from 'umi';
import { useEventEmitter } from 'ahooks';
import moment from 'moment/moment';
import { FormView } from './fieldFile/_css_comm';
import { indexOf } from 'lodash';
import { SettingIcon } from '@/styled'
import GridLayout from 'react-grid-layout'
export const wrapContext = React.createContext({ state: '' });
export let WrapBox = styled(Scrollbars)<{ minHeight?: string; itemWidth?: string }>`

  box-shadow: ${(props) => (props.border ? `0 0 0 1px #ccc` : `0`)};
`;

export let CssContentItem = styled(ContentItem)<{ toggle?: boolean}>`
  display: ${(props) => (props.toggle  ? 'none' : 'flex')};
`;
let TableTitle = styled.div<{ lineColor?: string}>`
  width:100%;
  height:45px;
  line-height: 45px;
  padding: 0 3vh;
  position:relative;
  text-indent:10px;
  display:flex;
  &:before{
    content:"";
    left:1vh;
    position:absolute;
    width:5px;
    height:40%;
    top:50%;
    transform:translateY(-50%);
    background:${(props) => (props.lineColor ? props.lineColor : `#000` )};
  }
`

export interface Iconf {
  disabled: boolean;
  size?: 'large' | 'middle' | 'small';
  style: {
    width: string;
  };
}

export interface Ifield {
  col?: 7;
  type?: 'input' | 'inputNumber';
  props?: Iconf;
  name?: string;
}

export interface IitemData {
  name?: string;
  width?: string;
  height?: string;
  label: {
    name: string;
    col?: number;
    style?: { [k: string]: any };
  };
  field: Ifield;
  rules?: [
    {
      required: boolean;
      message: string;
    },
  ];
}

interface TableInfoProps {
  data: Array<IitemData>;
  state?: 'new' | 'edit' | 'default' | 'disabled' | undefined;
  onValuesChange: (changedValues: any, allValues: any) => void;
}

// const filterData =(data)=>{
//   let _list = [];
//   data.map(function(item,idx){
//     item.i = `_${idx}`;
//     item.x = 0;
//     item.y = 0;
//     item.w = 1;
//     item.h = 1;
//     _list.push(item)
//   })
//   return data ;
// }

const TableInfo: React.FC = (props: TableInfoProps) => {
  const { dispatch,children, detail, data, state, buttons, border, onSubmit, onCancel } = props;
  const focus$ = useEventEmitter();
  const event$ = useEventEmitter();


  const [DATALIST, setDATALIST]  = useState([]);
  
  useEffect(() => {
    setDATALIST(data)
  }, [data]);


  function fiterData(data, key) {
    //如果是时间字段 则进行时间字段过滤
    if (Date.parse(data) && isNaN(data) && key.toUpperCase().indexOf('TIME') >= 0) {
      return moment(data);
    } else {
      return data;
    }
  }
  const setDefualtVal = (info) => {
    if (Object.keys(info) === '{}') return;
    let list = [];
    function formatData(data, pkey) {
      for (var key in data) {
        if (data[key] === null) {
          list[key] = data[key];
        } else if (typeof data[key] !== 'object' || data[key].constructor !== Object) {
          //如果有父级则进行.进行标记
          if (pkey) {
            //先将数据过滤 如果有附带子集的数据 则改成"xx.xx"格式
            list[`${pkey}.${key}`] = fiterData(data[key], key);
          } else {
            //默认的字段过滤
            list[key] = fiterData(data[key], key);
          }
        } else {
          formatData(data[key], key);
        }
      }
    }
    formatData(info);

    if (list.hasOwnProperty('longitude')) {
      form.setFields([
        {
          name: 'lnglat',
          value: [list.longitude, list.latitude],
        },
      ]);
    } else if (list.hasOwnProperty('x')) {
      form.setFields([
        {
          name: 'lnglat',
          value: [list.x, list.y],
        },
      ]);
    }

    form.setFieldsValue(list);
  };
  const [form] = Form.useForm();

  focus$.useSubscription((data) => {
   
    switch(data.type){
        case "toggle":
          let _list = [];
          DATALIST.map(function(item,idx){
            if(data.relateNames.indexOf(item.name) >=0){
              item.toggle = !item.toggle;
              if(!item.toggle){
                if(item.field.props.requiredStatus!=undefined || item.field.props.requiredStatus!=null){
                  item.rules[0].required=item.field.props.requiredStatus
                }
              }else{
                item.rules[0].required=false;
              }
            }
            item.i = idx;
            _list.push(item)
          })
          setDATALIST(_list);

          break;
          case "onChange":
            event$.emit(data);
            break;
    }

  });

  useEffect(() => {
    //如果有detail 则认为是带默认值的,进行数据过滤处理并赋值
    if (Object.keys(detail).length && state !== 'new') {
      setDefualtVal(detail);
    } else {
      form.resetFields();
    }
  }, [detail]);

  const onFinish = (data) => {
    props.onSubmit(data);
  };

  const onReset = (data) => {
    form.resetFields();
  };

  const cancel = (data) => {
    props.onCancel(data);
  };

  //默认过滤初始值
  const initialValues_fn = (data: Array<IitemData>) => {
    let list: Array<IitemData> = [];
    data && data.forEach((item: any) => {
      item.field ? list[item.name] = item.field.props.defaultValue : null;
    });
    return list;
  };
  // 回调传出form的值改变
  function onValuesChange(changedValues: any, allValues: any): void {
    // props.onValuesChange(changedValues, allValues);
  }

  return (
    <wrapContext.Provider value={{ state: state, form: form, focus$: focus$, event$: event$ }}>
      <SettingIcon style={{right: '46px',top:'15px'}} onClick={(event)=>{
            dispatch({
              type: 'common/save',
              payload: {
                modal_info: true,
                DATALIST:DATALIST
              }
            })
      }}></SettingIcon>
      <FormView
        form={form}
        onFinish={onFinish}
        initialValues={initialValues_fn(data)}
        onValuesChange={onValuesChange}
      >
          <WrapBox border={border}>
          {/* <GridLayout className='layout' layout={LAYOUT} cols={24} rowHeight={24} width={1350}> */}
            { DATALIST && DATALIST.map((item, idx) => {
              if(item.type ==='title'){
                return <TableTitle lineColor={item.lineColor}>{item.text}</TableTitle>
              }else{
                return <CssContentItem key={`_${idx}`} _item={item} toggle={item.toggle}></CssContentItem>;
              }
            })}
            {
              children
            }
            {/* </GridLayout> */}
          </WrapBox>
        <Space className="sub-button-box">
          {buttons && buttons.map((item, idx) => {
            return (
              <Button htmlType="submit" type={item.type ? item.type : "primary"} onClick={item.click.bind(form)}>
                {item.name}
              </Button>
            );
          })}
          {onSubmit && (
            <Button htmlType="submit" type="primary">
              确定
            </Button>
          )}
          {onCancel && (
            <Button type="primary" onClick={cancel}>
              取消
            </Button>
          )}
        </Space>
      </FormView>
    </wrapContext.Provider>
  );
};

export default connect(({}) => ({}))(TableInfo);
