import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { videoListState } from "../store/follow";

export const VideoGallery = () => {
  const videos = useRecoilValue(videoListState);

  const calculateElapsedTime = (startTime: string | Date) => {
    const now = new Date();
    const start = new Date(startTime);

    if (isNaN(start.getTime())) {
      return "無効な開始時間";
    }

    const diff = now.getTime() - start.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}時間 ${minutes}分`;
  };

  return (
    <StyledVideoContainer>
      {videos.map((video, index) => (
        <StyledVideoCard
          key={index}
          href={video.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ThumbnailContainer>
            <StyledThumbnail
              src={video.thumbnailUrl}
              alt={`${video.title} thumbnail`}
            />
          </ThumbnailContainer>
          <InfoContainer>
            <StyledTitle>{video.title}</StyledTitle>
            <StyledInfo>リスナー数: {video.listener}</StyledInfo>
            <StyledInfo>
              配信経過時間: {calculateElapsedTime(video.time)}
            </StyledInfo>
          </InfoContainer>
        </StyledVideoCard>
      ))}
    </StyledVideoContainer>
  );
};

const StyledVideoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 16px;
  padding-top: 16px;
`;

const StyledVideoCard = styled.a`
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  width: calc(20% - 16px);
  @media (max-width: 768px) {
    width: calc(50% - 16px);
  }
  @media (max-width: 480px) {
    width: 100%;
  }
  display: flex;
  flex-direction: column;
`;

const ThumbnailContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9; /* アスペクト比を維持 */
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const StyledThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* カバー全体を埋めるように */
  position: absolute;
  top: 0;
  left: 0;
`;

const InfoContainer = styled.div`
  padding: 8px;
  text-align: center;
`;

const StyledTitle = styled.h3`
  margin: 8px 0;
  font-size: 1rem;
  text-align: center;
  white-space: normal;
  overflow-wrap: break-word;
`;

const StyledInfo = styled.p`
  margin: 4px 0;
  font-size: 0.875rem;
  color: #555;
`;
