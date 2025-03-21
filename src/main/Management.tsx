import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { followList, FollowItem } from "../store/follow";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export const Management: React.FC = () => {
  const [list, setList] = useRecoilState<FollowItem[]>(followList);

  const handleDelete = (channelId: string) => {
    setList((prevList) => {
      // チャンネルを削除した新しいリストを作成
      const newList = prevList.filter((item) => item.channelId !== channelId);

      if (SECRET_KEY) {
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify({ followList: newList }),
          SECRET_KEY
        ).toString();
        localStorage.setItem("Livers", encryptedData);
      } else {
        console.error("Secret key is not defined");
      }

      return newList;
    });
  };

  return (
    <StyledVideoContainer>
      {list.map((item, index) => (
        <StyledCardWrapper key={index}>
          <StyledLink
            href={`https://www.youtube.com/${item.handle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledVideoCard>
              <ThumbnailContainer>
                <StyledThumbnail
                  src={item.thumbnailUrl}
                  alt={`${item.thumbnailUrl} thumbnail`}
                />
              </ThumbnailContainer>
              <StyledTitleContainer>
                <StyledTitle>{item.channelName}</StyledTitle>
              </StyledTitleContainer>
            </StyledVideoCard>
          </StyledLink>
          <StyledIconButton onClick={() => handleDelete(item.channelId)}>
            <DeleteIconStyled />
          </StyledIconButton>
        </StyledCardWrapper>
      ))}
    </StyledVideoContainer>
  );
};

const StyledCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(15% - 16px);
  @media (max-width: 768px) {
    width: calc(50% - 16px);
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const StyledTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
  padding: 0;
`;

const StyledVideoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 16px;
  padding: 16px;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  width: 100%;
`;

const StyledVideoCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const ThumbnailContainer = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* 正方形にする */
  background-color: #000;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
`;

const StyledTitle = styled.h3`
  margin: 8px 0;
  font-size: 1rem;
  text-align: center;
  white-space: normal;
  overflow-wrap: break-word;
`;

const StyledIconButton = styled(IconButton)`
  padding: 0;
`;

const DeleteIconStyled = styled(DeleteIcon)`
  color: white;
`;
