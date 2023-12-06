import React from "react";
import styled from "styled-components";
export const ErrorText = ({ children }) => {
    return (
        <Wrapper>
            {children}
        </Wrapper>
    )
}
const Wrapper = styled.p`
    color:red;
    font-size: 12px;
    text-align: center;
    margin: 10px 0;
`;    