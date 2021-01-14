import React, { useState, useEffect,useMemo } from 'react';
import thisStyle from './SearchMore.less';
import { DatePicker, Input, Select, Button, InputNumber, TimePicker } from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import moment from 'moment/moment';
import styled from 'styled-components';
import { Form } from 'antd';
const ContentBox = styled.div`
position: relative;
left:0;
width: 100%;
.top-btn-box{
    display: flex;
    flex-flow: row;
    justify-content: flex-end;

  }
  .search-box{
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    margin-top: 1vh;
  }
  .search-item{
    display: flex;
    min-width: 20%;
    margin-bottom: 1vh;
    height: 30px;
    line-height: 30px;
  }
  .title{
    .text-align-justify();
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 5vw;
    &:after{
      content: "";
      width: 100%;
      display: inline-block;
    }
  }

  .right-side-box{
    flex: 1;
    margin-right: 2vw;
    .select-box{
      width: 100%;
    }
    .range-picker{
      width: 100% !important;
    }
  }
  .number-interval{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .input-number-item{
      width: 45% !important;
    }

  }
  .btn{
    float:right;
    padding: 0 1vw;
    margin-right: 10px;
    cursor: pointer;
    height: 32px;
  }
  .btn-box{
    display: flex;
    justify-content: center;
    &:last-child{
      margin-right: 0;
    }
  }
`;
const MoreSearchBox = styled(Form)`
position: relative;
left:0;
width: 100%;

`;


const AnimateDivSearch = styled(Form)`
  margin-right: 1vw !important;
  width: 200px;
  float: right;
  transition: all 300ms;
  overflow: hidden;

  width: ${(props) => (props.state ? '0' : '200px')};
  opacity: ${(props) => (props.state ? '0' : '100')};
`;
const AnimateDiv = styled.div`
  overflow: hidden;
  transform-origin: top;
  display: ${(props) => (props.state ? 'block' : 'none')};
`;
const { Search } = Input;

const SearchMore: React.FC = (props) => {
  const { dispatch,searchList,submit,reset,form,hasMore,selectSgiTypeListFn } = props;

  const [STATE, setSTATE] = useState(false);
  const [KEYWORD, setKEYWORD] = useState();

  /*是否进行高级刷选*/
  const changeModel = () => {
    form.resetFields();
    setSTATE(!STATE);
    reset()
  };
  const onFinish = (data) => {
    submit(data)
  };
  const sureSearch = (data) => {
    submit(data)
  };

  const onReset = (data) => {
    form.resetFields();
    reset()
  };



  useMemo(() => {
    //如果不存在高级搜索

  }, []);


  //默认过滤初始值
  const initialValues_fn = (data: Array<IitemData>) => {
    let list: Array<IitemData> = [];
    // data.forEach((item:any)=>{
    //   list[item.name]=;
    // });
    return list;
  };

  return (
    <ContentBox >

        <div className='top-btn-box'>
        <div className='right-side-item'>
        {
        hasMore ? 
          <Button
            className='btn'
            onClick={changeModel}
            size="small"
            type="primary"
          >
            {STATE ? '收起筛选' : '高级筛选'}
          </Button>
          :null
      }
            <AnimateDivSearch state={STATE.toString()} form={form}>
              <Form.Item name={"keyWord"} noStyle>
                  <Search
                        placeholder="关键字查询"
                        onSearch={sureSearch}
                        style={{ width: 200 }}
                        className='search-item-top'
                      />
              </Form.Item>
          </AnimateDivSearch>
        </div>
      </div>

<AnimateDiv state={STATE}>
        <MoreSearchBox
          form={form}
          // onFinish={onFinish}
          initialValues={initialValues_fn(searchList)}

        >
          <ul className='search-box'>
            {Array.isArray(searchList)
              ? searchList.map((item, idx) => {
                  return (
                    <li key={idx} className='search-item'>
                      <span className='title'>{item.title}</span>
                      <div className='right-side-box'>
                        {/*如果是输入框*/}
                        {item.type == 'input' ? (
                          <Form.Item name={item.key} noStyle>
                            <Input placeholder={item.placeholder} />
                          </Form.Item>
                        ) : null}

                        {/*如果是选择框*/}
                        {item.type == 'select' ? (
                          <Form.Item name={item.key} noStyle>
                            <Select
                              placeholder={item.placeholder}
                              className='select-box'
                              showSearch
                              filterOption={(input, option) => {
                                return (
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                            >
                              {Array.isArray(item.filterList)
                                ? item.filterList.map((item01, index01) => {
                                    return (
                                      <Select.Option
                                        key={index01.toString()}
                                        title={item01.name}
                                        value={item.sendType ? item01[item.sendType] : item01.name}
                                      >
                                        {item01.name}
                                      </Select.Option>
                                    );
                                  })
                                : null}
                            </Select>
                          </Form.Item>
                        ) : null}

                        {/*如果是连级选择框*/}
                        {item.type == 'selectLevel1' ? (
                          <Form.Item name={item.key} noStyle>
                            <Select
                              placeholder={item.placeholder}
                              className='select-box'
                              showSearch
                              onChange={(value)=>{
                                selectSgiTypeListFn(value)
                              }}
                              filterOption={(input, option) => {
                                return (
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                            >
                              {Array.isArray(item.filterList)
                                ? item.filterList.map((item01, index01) => {
                                    return (
                                      <Select.Option
                                        key={index01.toString()}
                                        title={item01.name}
                                        value={item.sendType ? item01[item.sendType] : item01.name}
                                      >
                                        {item01.name}
                                      </Select.Option>
                                    );
                                  })
                                : null}
                            </Select>
                          </Form.Item>
                        ) : null}
                        {/*如果是日期周期*/}
                        {item.type == 'period' ? (
                          <Form.Item name={item.key} noStyle>
                            <RangePicker
                                // showTime={{ format: 'HH:mm:ss' }}
                                // format="YYYY-MM-DD HH:mm:ss"
                                format="YYYY-MM-DD"
                                placeholder={['开始时间', '结束时间']}
                                className='range-picker'
                              />
                          </Form.Item>
                        ) : null}

                        {/*如果是数字区间*/}
                        {item.type == 'number-interval' ? (
                          <div className='number-interval'>
                            <Form.Item name={item.key[0]} noStyle>
                              <InputNumber
                                placeholder={item.placeholder[0]}
                                min={0}
                                className='input-number-item'
                              />
                            </Form.Item>
                            <span className='text-icon'>~</span>
                            <Form.Item name={item.key[1]} noStyle>
                              <InputNumber
                                placeholder={item.placeholder[1]}
                                min={0}
                                className='input-number-item'
                              />
                            </Form.Item>
                          </div>
                        ) : null}

                        {/*如果是数字*/}
                        {item.type == 'input-number' ? (
                          <Form.Item name={item.key} noStyle>
                            <InputNumber
                              placeholder={item.placeholder}
                              min={0}
                              className='input-number'
                            />
                          </Form.Item>
                        ) : null}

                        {/*如果是时间段*/}
                        {item.type == 'time-period' ? (
                          <div className='time-period'>
                            <Form.Item name={item.key[0]} noStyle>
                              <TimePicker format={'HH:mm'} />
                            </Form.Item>
                            <span className='text-icon'>~</span>
                            <Form.Item name={item.key[1]} noStyle>
                              <TimePicker format={'HH:mm'} />
                            </Form.Item>
                          </div>
                        ) : null}

                        {/*如果是选择月份*/}
                        {item.type == 'month-period' ? (
                          <div className='time-period'>
                            <Form.Item name={item.key[0]} noStyle>
                              <DatePicker picker="month" format="YYYY-MM"/>
                            </Form.Item>
                          </div>
                        ) : null}

                      </div>
                    </li>
                  );
                })
              : null}
          </ul>
          <div className='btn-box'>
            <Button
              className='btn'
              onClick={onReset}
              size="small"
              type="primary"
              ghost
            >
              重置
            </Button>
            <Button className='btn' size="small"
             type="primary" 
            // htmlType="submit" 
            onClick={onFinish}
            >
              查询
            </Button>
          </div>
        </MoreSearchBox>
      </AnimateDiv>
    </ContentBox>
  );
};

export default SearchMore;
