import styled, { keyframes } from "styled-components";

const loading = keyframes`
  from {
    background-position: 0 0;
    /* rotate: 0; */
  }

  to {
    background-position: 100% 100%;
    /* rotate: 360deg; */
  }
`;

const Form = styled.form`
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  border: 5px solid white;
  padding: 20px;
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 600;
  width: 50%;
  margin: auto;
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input,
  select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid black;
    &:focus {
      outline: 0;
      border-color: ${props => props.theme.green};
    }
  }
  button,
  input[type="submit"] {
    width: auto;
    background: ${props => props.theme.phthalo};
    color: white;
    border: 0;
    font-size: 2rem;
    font-weight: 600;
    padding: 0.5rem 1.2rem;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  fieldset {
    padding: 0;

    &[player="false"] {
      border: 0;
      border-color: ${props => props.theme.phthalo};
    }

    &[player="true"] {
      border: 1;
    }

    &[disabled] {
      opacity: 0.5;
    }

    &[aria-busy="true"]::before {
      background-size: 50% auto;
      animation: ${loading} 0.5s linear infinite;
    }
  }
`;

export default Form;
