import styled from 'styled-components';
export const GlobalTitle = styled.div`
        font-size:1.5vh;
        line-height:3vh;
        position:relative;
        margin-bottom:1vh;
        &::after{
            content:"";
        }
`;

export const TopBtnWrap  =styled.div`
  position:absolute;

  display: flex;
  align-items: flex-start;
  padding-top: 0.1vw;
  z-index:1000;
  .topBtn {
    margin-right:2vh;
  }
`;

export const TableBox = styled.div`
.top-box{
  padding: 0 1.04vw;
  margin: 1.85vh 0 2.04vh;
}
.first-span{
  line-height: 36px;
  height: 36px;
  border-radius: 4px;
  color: #fff;
  background: #1572e8;
  margin-right: 10px;
  padding: 0 10px;
  cursor: pointer;
  &:hover{
    opacity: .8;
  }
  &:last-child{
    margin-right: 0;
  }
}
`;
export const ButtonBox = styled.span`
  a{
    padding:0 11px;
  }
`;
