import React from 'react';
import thisStyle from './SearchMore.less'
import {  DatePicker,Input,Select,Button,InputNumber,TimePicker } from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import moment from 'moment/moment'
import styled from 'styled-components';



const AnimateDivSearch  = styled.div`
margin-right:1vw;
width:200px;
float:right;
  transition:all 300ms;
  overflow:hidden;
  width:${props => props.state ? '0' : '200px'};
  opacity:${props => props.state ? '0' : '100'};
`;
const AnimateDiv  = styled.div`
  overflow:hidden;
  transform-origin:top;
  display:${props => props.state ? 'block' : 'none'};
`;
const { Search } = Input;

class SearchMore extends React.Component {
  static defaultProps = {
    config: {}
  }

  constructor(props){
    super(props);
    this.state = {
      isMoreSearch:false,
      searchText:"",
      searchData:{}
    };
  }

  componentDidMount(){
    this.setState({
      searchText:""
    })
  }

  componentWillUnmount() {

  }
  componentWillReceiveProps (){


  }


  /*修改搜索字段*/
  changeValue=(type,value)=>{
    if(value==undefined){
      return
    }
    let searchData=this.state.searchData;
    searchData[type]=value.target?value.target.value:value;
    this.setState({
      searchData:searchData
    })
  }


  /*修改日期范围*/
  changeTimer=(start,end,date,dateString)=>{
    let searchData =  this.state.searchData;
    searchData[start] = dateString[0];
    searchData[end] = dateString[1];
    this.setState({
      searchData:searchData
    })
  }

  /*时间选择*/
  changeTimerPicker=(type,time,timeString)=>{
    let searchData=this.state.searchData;
    searchData[type]=timeString;
    this.setState({
      searchData:searchData
    })
  }



  /*关键字赋值*/
  changeSearchValue=(value)=>{
    if(value==undefined){
      return
    }
    this.setState({
      searchData:Object.assign(this.state.searchData,{keyWord:value.target?value.target.value:value})
    })
  }








  /*重置数据*/
  chongZhi=()=>{
    this.setState({
      searchData:{}
    })
  }

  /*关键字查询*/
  /*确定查询*/
  sureSearch=()=>{
    this.props.onChange(this.state.searchData)
  }


  /*是否进行高级刷选*/
  changeModel=()=>{
    this.setState({
      searchData:Object.assign(this.state.searchData,{keyWord:""}),
      isMoreSearch:!this.state.isMoreSearch
    })
  }

  render(){

    const {searchList}=this.props;/*搜索参数*/

    const {searchText  , isMoreSearch ,searchData }=this.state;

    return (
     <div className={`${thisStyle['content-box']}`}>

      <div className={`${thisStyle['top-btn-box']}`}>
        <div className={`${thisStyle['right-side-item']}`}>
        <Button  className={`${thisStyle['btn']}`}
                   onClick={this.changeModel.bind(this)}
                   size="small"
                   type="primary"
          >
            {isMoreSearch?'收起筛选':'高级筛选'}
          </Button>
          <AnimateDivSearch state = {isMoreSearch}>
          <Search
              placeholder="关键字查询"
              onSearch={this.sureSearch.bind(this)}
              style={{ width: 200 }}
              value={searchData.keyWord}
              onChange={this.changeSearchValue.bind(this)}
              className={`${thisStyle['search-item-top']}`}
            />
          </AnimateDivSearch>

        </div>
      </div>
      <AnimateDiv state = {isMoreSearch}>
        <div className={thisStyle['more-search-box']}>
<ul className={`${thisStyle['search-box']}`}>
           {
             Array.isArray(searchList)?searchList.map((item,idx)=>{
               return <li key={idx} className={`${thisStyle['search-item']}`}>
                 <span className={`${thisStyle['title']}`}>{item.title}</span>
                 <div className={`${thisStyle['right-side-box']}`}>

                   {/*如果是输入框*/}
                   {
                     item.type=="input"? <Input placeholder={item.placeholder} value={searchData[item.key]} onChange={this.changeValue.bind(this,item.key)}  />:null
                   }
                   {/*如果是日期周期*/}
                   {
                     item.type=="period"?<RangePicker     showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" onChange={this.changeTimer.bind(this,item.key[0],item.key[1])}  placeholder={['开始时间', '结束时间']} value={searchData[item.key[0]]?[moment(searchData[item.key[0]]),moment(searchData[item.key[1]])]:''}  className={`${thisStyle['range-picker']}`}/>:null
                   }

                   {/*如果是选择框*/}
                   {
                     item.type=="select"?   <Select
                       placeholder={item.placeholder}
                       value={searchData[item.key]}
                       onChange={this.changeValue.bind(this,item.key)}
                       className={`${`${thisStyle['select-box']}`}`}
                     >
                       {
                         Array.isArray(item.filterList)?item.filterList.map((item01,index01)=>{
                           return <Select.Option key={index01.toString()} value={item.sendType?item01[item.sendType]:item01.name}>{item01.name}</Select.Option>
                         }):null
                       }
                     </Select>:null
                   }


                   {/*如果是数字区间*/}
                   {
                     item.type=='number-interval'?<div className={`${thisStyle['number-interval']}`}>
                       <InputNumber placeholder={item.placeholder[0]} min={0} max={searchData[item.key[1]]}
                                    value={searchData[item.key[0]]}
                                    onChange={this.changeValue.bind(this,item.key[0])}
                                    className={`${thisStyle['input-number-item']}`}
                       />
                       <span className={`${thisStyle['text-icon']}`}>~</span>
                       <InputNumber placeholder={item.placeholder[0]}
                                    min={searchData[item.key[0]]}
                                    onChange={this.changeValue.bind(this,item.key[1])}
                                    value={searchData[item.key[1]]}
                                    className={`${thisStyle['input-number-item']}`}
                       />
                     </div>:null
                   }


                   {/*如果是数字*/}
                   {
                     item.type=='input-number'?  <InputNumber placeholder={item.placeholder} min={0} max={searchData[item.key]}
                                                              value={searchData[item.key]}
                                                              onChange={this.changeValue.bind(this,item.key)}
                                                              className={`${thisStyle['input-number']}`}
                     />:null
                   }


                   {/*如果是时间段*/}
                   {
                     item.type=='time-period'?<div className={`${thisStyle['time-period']}`}>
                       <TimePicker
                         defaultValue={searchData[item.key[0]]?moment(searchData[item.key[0]], 'HH:mm'):''}
                         value={searchData[item.key[0]]?moment(searchData[item.key[0]], 'HH:mm'):''}
                         placeholder={item.placeholder[0]}
                         onChange={this.changeTimerPicker.bind(this,item.key[0])}
                         format={'HH:mm'}
                       />
                       <span className={`${thisStyle['text-icon']}`}>~</span>
                       <TimePicker
                         defaultValue={searchData[item.key[1]]?moment(searchData[item.key[1]], 'HH:mm'):''}
                         value={searchData[item.key[1]]?moment(searchData[item.key[1]], 'HH:mm'):''}
                         placeholder={item.placeholder[1]}
                         onChange={this.changeTimerPicker.bind(this,item.key[1])}
                         format={'HH:mm'}
                       />
                     </div>:null
                   }
                 </div>
               </li>
             }):null
           }
         </ul>
           <div className={`${thisStyle['btn-box']}`}>
            <Button  className={`${thisStyle['btn']}`}
                    onClick={this.chongZhi.bind(this)}
                    size="small"
                    type="primary"
                    ghost
           >
            重置
           </Button>
           <Button  className={`${thisStyle['btn']}`}
                    onClick={this.sureSearch.bind(this)}
                    size="small"
                    type="primary"
           >
             查询
           </Button>
              </div>
        </div>

        </AnimateDiv>

     </div>
    )
  }
}
export default SearchMore;



