import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { VideoGallery } from "./main/VideoGallery";
import { Management } from "./main/Management";
import { Infoheader } from "./header/Infoheader";
import { useSetRecoilState } from "recoil";
import { followList } from "./store/follow";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export default function App() {
  const [activeContent, setActiveContent] = useState<
    "videoGallery" | "management"
  >("management");

  const navigate = useNavigate();

  const setFollowList = useSetRecoilState(followList);

  useEffect(() => {
    if (!SECRET_KEY) {
      console.error("SECRET_KEY is not defined.");
      return;
    }

    const encryptedData = localStorage.getItem("Livers");
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedString)
          throw new Error("Decryption returned empty string.");

        const decryptedData = JSON.parse(decryptedString);

        if (decryptedData && Array.isArray(decryptedData.followList)) {
          setFollowList(decryptedData.followList);
        } else {
          console.warn(
            "Decrypted data does not have expected structure:",
            decryptedData
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            "Failed to decrypt or parse stored data:",
            error.message
          );
        } else {
          console.error("An unknown error occurred:", error);
        }
      }
    } else {
      console.warn("No encrypted data found in local storage.");
    }
  }, [setFollowList]);

  useEffect(() => {
    // activeContentの値に基づいてナビゲートする
    if (activeContent === "videoGallery") {
      navigate("/videoGallery");
    } else if (activeContent === "management") {
      navigate("/Management");
    }
  }, [activeContent, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "98vh",
        bgcolor: "black",
        color: "white",
      }}
    >
      <Box
        component="header"
        sx={{
          width: "100%",
          height: "5%",
          bgcolor: "grey.900",
          boxShadow: 1,
          borderBottom: "2px solid black",
          zIndex: 1100,
          position: "sticky",
          top: 0,
          color: "white",
        }}
      >
        {/* トップバー */}
        <Infoheader setActiveContent={setActiveContent} />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          paddingLeft: 2,
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* メインコンテンツ */}
        {activeContent === "videoGallery" && <VideoGallery />}
        {activeContent === "management" && <Management />}
      </Box>
    </Box>
  );
}
