import axios from 'axios';
import { FollowItem } from "../store/follow";

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

export async function GetUser(input: string): Promise<FollowItem | null> {
  if (input.includes('@')) {
    const match = input.match(/@[%\w\W]+/);
    if (match && match[0]) {
      const decodedHandle = decodeURIComponent(match[0]);
      return await getChannelInfoByHandle(decodedHandle.substring(1));
    } else {
      console.log('無効なハンドルです。');
      return null;
    }
  } else {
    const videoIdMatch = input.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (videoId) {
      return await getUserByVideoId(videoId);
    } else {
      console.log('無効な入力です。');
      return null;
    }
  }
}

async function getUserByVideoId(videoId: string): Promise<FollowItem | null> {
  try {
    const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        id: videoId,
        key: apiKey,
      },
    });

    if (videoResponse.data.items && videoResponse.data.items.length > 0) {
      const channelId = videoResponse.data.items[0].snippet.channelId;
      return await getChannelInfo(channelId);
    } else {
      console.log('動画が見つかりませんでした。');
      return null;
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return null;
  }
}

async function getChannelInfo(channelId: string): Promise<FollowItem | null> {
  try {
    const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet',
        id: channelId,
        key: apiKey,
      },
    });

    if (channelResponse.data.items && channelResponse.data.items.length > 0) {
      const channelData = channelResponse.data.items[0].snippet;
      const customUrl = decodeURIComponent(channelData.customUrl || '@notavailable');
      const channelTitle = channelData.title;
      const thumbnailUrl = channelData.thumbnails.high.url;

      const result: FollowItem = {
        handle: customUrl,
        channelName: channelTitle,
        channelId: channelId,
        thumbnailUrl: thumbnailUrl,
      };

      console.log(`Channel Info: Handle - ${result.handle}, Name - ${result.channelName}, Thumbnail - ${result.thumbnailUrl}`);
      return result;
    } else {
      console.log('チャンネルが見つかりませんでした。');
      return null;
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return null;
  }
}

async function getChannelInfoByHandle(handle: string): Promise<FollowItem | null> {
  try {
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: handle,
        type: 'channel',
        maxResults: 1,
        key: apiKey,
      },
    });

    if (searchResponse.data.items && searchResponse.data.items.length > 0) {
      const channelId = searchResponse.data.items[0].id.channelId;
      return await getChannelInfo(channelId);
    } else {
      console.log('チャンネルが見つかりませんでした。');
      return null;
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return null;
  }
}