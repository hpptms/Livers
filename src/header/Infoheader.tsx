import React from "react";
import styled from "styled-components";
import { Container, Box } from "@mui/material";
import nameImage from "../img/logo.png";
import { AddButton } from "./button/AddButton";
import { ManagementButton } from "./button/ManagementButton";
import { OnButton } from "./button/OnButton";

// コンポーネントの定義
const CenteredDiv: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CenteredDivContainer>
    <CenteredDivContent>{children}</CenteredDivContent>
  </CenteredDivContainer>
);

interface SideProps {
  setActiveContent: (content: "videoGallery" | "management") => void;
}

export const Infoheader: React.FC<SideProps> = ({ setActiveContent }) => {
  return (
    <Container disableGutters maxWidth={false}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            marginLeft: "18px",
            marginRight: "auto",
          }}
        >
          <img
            src={nameImage}
            alt="Name"
            style={{
              height: "50px",
              width: "auto",
              maxWidth: "100%",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <CenteredDiv>
            <AddButton />
          </CenteredDiv>
          <CenteredDiv>
            <OnButton onClick={() => setActiveContent("videoGallery")} />
          </CenteredDiv>
          <CenteredDiv>
            <ManagementButton onClick={() => setActiveContent("management")} />
          </CenteredDiv>
        </Box>
      </Box>
    </Container>
  );
};

const CenteredDivContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenteredDivContent = styled.div`
  padding: 10px; /* 内側の余白を追加 */
  display: inline-flex; /* インラインフレックスを使用して中央揃え */
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transform: translate(-3px, -3px);
  }
`;
