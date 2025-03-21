import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRecoilState } from "recoil";
import { followList, FollowItem } from "../../store/follow";
import { GetUser } from "../../function/Getuser";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export const AddButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [list, setList] = useRecoilState(followList);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUrl("");
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleAddButtonClick = async () => {
    try {
      const result: FollowItem | null = await GetUser(url);
      if (result !== null) {
        const newList = [...list, result];
        setList(newList);

        if (!SECRET_KEY) {
          console.error("Secret key is not defined");
          return;
        }

        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify({ followList: newList }),
          SECRET_KEY
        ).toString();
        localStorage.setItem("Livers", encryptedData);

        handleClose();
      } else {
        alert("ユーザーが見つかりませんでした");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div>
      <Box
        onClick={handleClickOpen}
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <FavoriteIcon
          sx={{
            marginRight: "8px",
            color: "#f06292",
            textShadow: "1px 1px 2px #c2185b",
            filter: `drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.3))`,
          }}
        />
        配信者を追加
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            width: "60%",
            maxWidth: "none",
          },
        }}
      >
        <DialogTitle id="form-dialog-title">URLを入力してください</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            value={url}
            onChange={handleUrlChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              borderRadius: "20px",
              borderColor: "#f50057",
              color: "#f50057",
              "&:hover": {
                borderColor: "#c51162",
                backgroundColor: "#f8bbd0",
              },
            }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleAddButtonClick}
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={{
              borderRadius: "20px",
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#388e3c",
              },
            }}
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
