import styled, { keyframes } from "styled-components";

const DropDown = styled.div`
  position: absolute;
  width: 100%;
  z-index: 2;
  border: 1px solid ${props => props.theme.lightgrey};
`;

const DropDownTeam = styled.div`
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  background: ${props => (props.highlighted ? "#f7f7f7" : "white")};
  transition: all 0.2s;
  ${props => (props.highlighted ? "padding-left: 2rem;" : null)};
  display: flex;
  align-items: center;
  border-left: 10px solid
    ${props => (props.highlighted ? props.theme.lightgrey : "white")};
`;

const SearchStyles = styled.div`
  position: relative;
  input {
    width: 100%;
    border: 0;
  }
`;

export { DropDown, DropDownTeam, SearchStyles };
