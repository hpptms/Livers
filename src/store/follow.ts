import { atom } from 'recoil';

//チャンネル保存
export type FollowItem = {
  handle: string;
  channelName: string; 
  channelId: string;
  thumbnailUrl: string;
};

export const followList = atom<FollowItem[]>({
  key: 'followList',
  default: [],
});

//ライブ配信情報
export type VideoData ={
  title: string;
  thumbnailUrl: string;
  link: string;
  listener: string;
  time: string;
}

export const videoListState = atom<VideoData[]>({
  key: 'videoListState',
  default: [],
});