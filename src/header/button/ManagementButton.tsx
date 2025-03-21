import React from "react";
import { Box } from "@mui/material";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";

interface ManagementButtonProps {
  onClick?: () => void;
}

export const ManagementButton: React.FC<ManagementButtonProps> = ({
  onClick,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      <ScreenSearchDesktopIcon sx={{ marginRight: "4px", color: "#757575" }} />
      <span>{"お気に入りを管理"}</span>
    </Box>
  );
};
