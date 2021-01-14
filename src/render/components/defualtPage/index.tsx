import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Form, Spin, Table, Radio,Drawer } from 'antd';
import { Icommon } from '@/models/common';
import { Iselect } from '@/models/select';
import { connect, history } from 'umi';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { filterKeys } from '@/utils/utils';

import commonStyle from '@/common.less';
import { AProps } from '@/globalTyping';

import { TopBtnWrap, TableBox, ButtonBox } from '@/globalStyled';

const { Column } = Table;
import columns from './columns';
import detailsList from './detailsList';


import { permissionContext } from '../../../layouts/BasicLayout';
import styled from 'styled-components';
import SearchMore from '@/components/SearchMore/SearchMore';
import TableInfo from '@/components/TableInfo/TableInfo';
import styles from './style.less';

interface Props extends AProps {
  common: any;
  select: any;
}

const table: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const [dawerVisible,setDawerVisible]=useState(false);/* 弹框是否显示 */

  const [detailsInfo,setDetailsInfo]=useState({});/* 表格详情 */

  const [rowSelectedData,setRowSelectedData]=useState({});/* 表格行选中数据 */

  const { dispatch } = props;

  //默认加载的数据
  const getTableData = (
    { current, pageSize }: PaginatedParams[0],
    formData: Object,
  ): Promise<{}> => {
    return dispatch({
      type: 'common/requestData',
      url: '/fyDataService/DataDock/getPetitionEventList',
      payload: {
        pageNo: current,
        pageSize: pageSize,
        ...filterKeys(formData),
      },
      callback: (_data: any) => {},
    });
  };

  const { tableProps, search, loading } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form,
  });

  const { submit, reset } = search;

  const searchList = [
    { title: '关键字', type: 'input', key: 'keyword', placeholder: '请输入关键字' },
  ];

  //-------------------------------状态操作-------------------------------

  useEffect(() => {
    props.common.socket1.onmessage = function (data: any) {

    };
  }, []);


  /* 行选中 */
 const rowSelect = (record: { [k: string]: any }, index?: number): any => {
    return {
      onClick: (e) => {
        setRowSelectedData(record);
        setDawerVisible(true)
        getDetailsInfo(record);
       },
    };
  }

  /* 获取详情 */
  const getDetailsInfo=(record)=>{
    dispatch({
      type: 'common/requestData',
      url: '/fyDataService/DataDock/getPetitionEventDetailById',
      payload: {
        id:record.id
      },
      callback: (_data: any) => {
        setDetailsInfo(_data?_data:{})
      },
    });
  }

  return (
    <permissionContext.Consumer>
      {(_data) => {
        return (
          <TableBox className={commonStyle['right-main-box']}>
            <Spin spinning={loading}>
              <div className={`${commonStyle['top-box']}`}>
                <TopBtnWrap>
                  {/* <Button onClick={exportDataExcel} type='primary' className="topBtn">excel导出</Button> */}
                </TopBtnWrap>
                <SearchMore
                  form={form}
                  hasMore={true}
                  searchList={searchList}
                  submit={submit}
                  reset={reset}
                ></SearchMore>
              </div>
              <div className={commonStyle['bottom-box']}>
              
                <Table
                  rowKey="id"
                  {...tableProps}
                  //如果要对列表进行多选的时候可以打开
                  // rowSelection={{
                  //   type: 'checkbox',
                  //   selectedRowKeys: SELECTROWKEYS,
                  //   onChange: (selectedRowKeys: any, selectedRows) => {
                  //     setSELECTROWKEYS(selectedRowKeys)
                  //   }
                  // }}
                  //如果当前行可选中则放开
                  onRow={rowSelect}
                  className={`virtual-table  ${styles['scroll-table-box']}`}
                  rowClassName={(record) => (record.id === rowSelectedData.id ? styles['select-bg-color'] : '')}
                >
                  {columns(props, tableProps).map((i: any, index: any) => {
                        return (
                          <Column
                            {...i}
                            onCell={(): any => ({ width: i.width })}
                            onHeaderCell={(): any => ({ width: i.width })}
                          ></Column>
                        );
                      })}
                </Table>

                <Drawer
                  title="详情"
                  placement="right"
                  width="56vw"
                  closable={true}
                  onClose={() => {
                    setDawerVisible(false);
                    setDetailsInfo({})
                  }}
                  visible={dawerVisible}
                  destroyOnClose={true}
                >
                  <TableInfo
                      border="true"
                      data={detailsList}
                      detail={detailsInfo}
                      state={"disabled"}
                      onCancel={() => {
                        setDawerVisible(false);
                        setDetailsInfo({})
                      }}
                    ></TableInfo>
                </Drawer>
              </div>
            </Spin>
          </TableBox>
        );
      }}
    </permissionContext.Consumer>
  );
};

export default connect(({ common, select }: { common: Icommon; select: Iselect }) => ({
  common,
  select,
}))(table);
