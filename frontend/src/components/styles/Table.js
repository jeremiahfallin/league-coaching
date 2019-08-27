import styled from "styled-components";

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
  border: 1px solid ${props => props.theme.offWhite};
  thead {
    font-size: 10px;
  }
  td,
  th {
    border-bottom: 1px solid ${props => props.theme.offWhite};
    border-right: 1px solid ${props => props.theme.offWhite};
    border-left: 1px solid ${props => props.theme.offWhite};
    valign: bottom;
    padding: 5px;
    position: relative;
    label {
      padding: 10px 5px;
      display: block;
    }
  }
  tr {
    &:hover {
      background: ${props => props.theme.grey};
    }
  }
`;

export default Table;
