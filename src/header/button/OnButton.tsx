import React, { useCallback, useEffect, useState, ReactNode } from "react";
import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import { fetchYoutubeStreams } from "../../function/crawl";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  followList,
  videoListState,
  VideoData,
  FollowItem,
} from "../../store/follow";

interface OnButtonProps {
  onClick?: () => void;
  isTransitionFromManagement?: boolean;
  children?: ReactNode;
}

export const OnButton: React.FC<OnButtonProps> = ({
  onClick,
  children,
  isTransitionFromManagement = false,
}) => {
  const FollowList = useRecoilValue<FollowItem[]>(followList);
  const setVideoList = useSetRecoilState(videoListState);

  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const handleClick = useCallback(async () => {
    if (onClick) onClick();

    const currentTime = Date.now();
    const timeSinceLastFetch = currentTime - lastFetchTime;

    if (!isTransitionFromManagement && timeSinceLastFetch < 5 * 60 * 1000) {
      const remainingTime = 5 * 60 * 1000 - timeSinceLastFetch;
      setRemainingTime(remainingTime);
      setDialogOpen(true);
      return;
    }

    try {
      const videoPromises = FollowList.map((item) =>
        fetchYoutubeStreams([item])
      );
      const videosArray = await Promise.all(videoPromises);

      const allVideos = videosArray
        .flat()
        .filter((video): video is VideoData => video !== undefined);

      if (allVideos.length > 0) {
        setVideoList(allVideos);
        console.log("ライブ配信動画:", allVideos);
      } else {
        console.log("ライブ配信は見つかりませんでした。");
      }

      setLastFetchTime(currentTime);
    } catch (error) {
      console.error("ライブ配信取得エラー:", error);
    }
  }, [
    FollowList,
    setVideoList,
    lastFetchTime,
    onClick,
    isTransitionFromManagement,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleClick();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [handleClick]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (dialogOpen && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(timer);
            setDialogOpen(false);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [dialogOpen, remainingTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}分${seconds}秒`;
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogContent>
          <Typography variant="body1">
            {`次回手動更新まで、残り ${formatTime(remainingTime)}.`}
          </Typography>
        </DialogContent>
      </Dialog>
      <Box
        onClick={handleClick}
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <BoltIcon sx={{ marginRight: "4px", color: "#f9a825" }} />
        {children || "ライブ配信をチェック"}
      </Box>
    </div>
  );
};
