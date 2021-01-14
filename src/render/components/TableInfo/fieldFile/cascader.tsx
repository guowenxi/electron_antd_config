import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';

import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';

import { Cascader as ACascader } from 'antd';
import { joinUrl } from '@/utils/utils';

import request from '@/utils/request';
const rbacToken = Window['rbacToken'];
let MCascader = styled(ACascader)`
  && {
    width: 100%;
    height: 43px;
    .ant-cascader-input {
      height: 100%;
    }
  }
`;

interface Ioptions {
  name: string;
  id: number;
}
interface IconfInput extends Iconf {
  placeholder?: string;
  relationType: string;
  parentKeyName: string;
  options: Array<Ioptions>;
}
interface ICascader {
  dispatch?: Dispatch;
  conf: IconfInput;
  name: string;
}

const Cascader: React.FC<ICascader> = (props) => {
  const { dispatch } = props;
  const _ = props.conf;
  const name = props.name;

  const [VAL, setVAL] = useState('　');
  const [OPTION, setOPTION] = useState([{ name: 1, id: 1 }]);
  async function filterData(namespace: string, conf: any) {
    let _op = [];
    if (conf.relationList) {
      const i = conf.relationList[0];

      _op = await request(process.env.ROOT_URL_HTTP + i.url, {
        method: 'GET',
        params: {
          ...i.payload,
          rbacToken: rbacToken,
        },
      });
      _op = _op.data;
      //  dispatch({
      //   type: `${i.type}/getData`,
      //   url: i.url,
      //   name: i.name,
      //   payload: i.payload,
      //   callback:(data)=>{
      //     _op = data;
      //   }
      // });

      //暂不支持使用url地址
      // let data = useRequest({
      //   url:process.env.ROOT_URL_HTTP+joinUrl(conf.url,conf.params),
      //   method:"GET",
      // })
      // setOPTION(data.data);
    } else {
      _op = conf.options;
    }
    setOPTION(filterListData(_op,1));
    // filterDefaultValue(_op,_.defaultValue)
  }

  function filterDefaultValue(OPTION: Array<Ioptions>, id: string) {
    if (Number(id)) {
      let val = OPTION.find(function (item) {
        return Number(item.id) === Number(id);
      });
      setVAL(val.name);
    }
  }
  //只在初始化时进行加载
  useEffect(() => {
    filterData('select', _);
  }, []);

  const loadData = async (selectedOptions) => {
    const idx = selectedOptions.length - 1;
    const sel = selectedOptions[idx];
    if (!_.relationList[idx + 1]) {
      return;
    }
    const i = _.relationList[idx + 1];

    const children = await request(process.env.ROOT_URL_HTTP + i.url, {
      method: 'GET',
      params: {
        [_.parentKeyName ?  _.parentKeyName : 'id']: sel.id,
        ...i.payload,
        rbacToken: rbacToken,
      },
    });
    sel.children = filterListData(children.data);
    setOPTION(OPTION.slice());
  };
  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };
  const filterListData = (data,state)=>{
     return  data.map(function (item) {
      item.isLeaf = false;
      if(_.keyName)  item.name=item[_.keyName];
      return item;
    })
  }

  return (
    <wrapContext.Consumer>
      {(_data) => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{VAL}</ShowData>;
            break;
          case 'edit':
          case 'disabled':
            return (
              <Form.Item name={name} rules={props.rules}>
                <MCascader
                  style={_.style}
                  disabled={_data.state === 'disabled' ? true : false}
                  fieldNames={{ label: 'name', value: 'id' }}
                  displayRender={(label, selectedOptions) => {
                    if (label.join) {
                      return label.join(' / ');
                    } else {
                      return label;
                    }
                  }}
                  options={OPTION}
                  loadData={loadData}
                  onChange={onChange}
                  changeOnSelect
                ></MCascader>
              </Form.Item>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({ select }) => ({
  select,
}))(Cascader);
