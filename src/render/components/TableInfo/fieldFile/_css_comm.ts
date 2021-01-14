import styled from 'styled-components';
import { Form} from 'antd';
export let ShowData = styled.div<{}>`
    font-size: 14px;
    line-height: 1.5715;
    position: relative;
    border:1px solid #ccc;
  && {
    /* &:after{
      content:"";
      left:0;
      top:0;
      position:absolute;
      width:100%;
      height:100%;
      border:1px solid #ccc;
    } */

    /* border-left:none; */
    padding: 1vh;
  }
`;
export let FormView = styled(Form)<{ }>`
    flex: 1;
    display:flex;
    flex-flow:column nowrap;
    .sub-button-box{
      flex:1;
      button{
        margin-right:1vh;
      }
    }
    .ant-form-item-control-input{
      height:100%;
      .ant-form-item-control-input-content{
        height:100%;
      }
    }
`;
