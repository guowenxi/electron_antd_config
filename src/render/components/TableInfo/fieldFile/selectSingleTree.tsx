import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Link, connect, Dispatch } from 'umi';

import { Select as ASelect, Button,Modal } from 'antd';
const { Option } = ASelect;
import { Iconf, wrapContext } from '../TableInfo';
import { ShowData } from './_css_comm';
import { Form } from 'antd';


import { joinUrl } from '@/utils/utils';

import TreeBox from '../../TreeBox/TreeBox';
import MixinTable  from '../../MixinTable/MixinTable';




let AModal = styled(Modal)`
&& {
  width: 70vw !important;
  .select-tree-modal-box {
    width:100%;
    display:flex;
    margin-top:5vh;
    .tree-box-main-box{
      width:30%;
      margin-right:1vw;
    }
  }
}
`;


let NButton =styled(Button)`
  margin:1vh;
`





interface Ioptions {
  name:string,
  id:number
}
interface IconfSelect extends Iconf {
  placeholder?: string,
  relationType:string,
  options:Array<Ioptions>,
  defaultValue: string 
}
interface ISelect {
  dispatch?: Dispatch;
  conf: IconfSelect;
  name: string;
}



const SelectTree: React.FC<ISelect> = (props) => {
  const _ = props.conf;
  const name = props.name;

  const __=_.tableSetting?_.tableSetting:{}
  
  const [visible, setVISIBLE ]  = useState(false);/* 模态层状态 */
  const [OPTION,setOPTION]=useState([]);/* 树形数据 */
  const [selTreeListData,setSelTreeListData]=useState(_.defaultValue);
  const [tableData,setTableData]=useState([]);

  const selTree = () => {
    setVISIBLE(true);
  };


  /* 获取数据 */
  function filterData(namespace:string,conf:any){
    let _op = [];
    if(conf.relationType){
      _op = props[namespace][conf.relationType];
    }else if(conf.url){

      //暂不支持使用url地址
      // let data = useRequest({
      //   url:process.env.ROOT_URL_HTTP+joinUrl(conf.url,conf.params),
      //   method:"GET",
      // })
      // setOPTION(data.data);
    }else{
      _op = conf.options;
    }
    setOPTION(_op)
  }

    //只在初始化时进行加载
  useEffect(()=>{
    filterData('select',_);
  },[])



  /* 选中数据 */
  const onCheck=(data,info)=>{

    setSelTreeListData(info.checkedNodes);
    // if(Array.isArray(data.data[0].userList)){

    // }
    setTableData(info.checkedNodes[0].userList);
  } 
  /* 选中数据 */
  const onSelect=(data,info)=>{

    setSelTreeListData(data.list);
    if(Array.isArray(data.data[0].userList)){

    }
    setTableData(data.data);
  } 


  /* 取消弹框 */
  const cancelModal=()=>{
    setVISIBLE(false)
  }

  return (
    <wrapContext.Consumer>
      {(_data) => {
        switch (_data.state) {
          case 'default':
            return <ShowData>{VAL}</ShowData>;
            break;
          case 'edit':
            case "new" :
          case 'disabled':
            return (
              <Form.Item name={name} noStyle
              rules={props.rules}>
                <NButton onClick={selTree}>选择</NButton>
                <AModal visible={visible}   onOk={selTree} onCancel={cancelModal}>
                  <div className={['select-tree-modal-box']}>
                    <TreeBox data={OPTION}
                    selectable={false}
                     onCheck={onCheck}
                     onSelect={onSelect}
                      checkedTreeKeys={selTreeListData}  className={['tree-box-main-box']}></TreeBox>
                    <MixinTable columns={__.columnList}  data={tableData}  handle={[
                      {type:"popconfirm",
                      bolName:"删除",
                      click:(text,record,search)=>{
                          tableData.map((item,idx)=>{
                            if(item.key==text.key){
                              tableData.splice(idx,1)
                            }
                          })
                          setTableData(tableData);
                          search.reset();
                      },
                      config:{
                        okText:"确认",
                        cancelText:"取消",
                        title:"是否确认删除？"
                      }},
                    ]} changeKey={tableData}></MixinTable>
                  </div>
                </AModal>
              </Form.Item>
            );
            break;
        }
      }}
    </wrapContext.Consumer>
  );
};
export default connect(({
  select
}) => ({
  select
}))(SelectTree);
