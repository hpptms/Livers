import axios from 'axios';
import { VideoData } from "../store/follow";

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

interface VideoSnippet {
  title: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
}

interface VideoItem {
  id: { videoId: string };
  snippet: VideoSnippet;
}

interface VideosApiResponseItem {
  id: string;
  liveStreamingDetails: {
    concurrentViewers?: string;
    actualStartTime?: string;
  };
}

interface YouTubeApiResponse {
  items: VideoItem[];
}

interface VideosApiResponse {
  items: VideosApiResponseItem[];
}

export async function fetchYoutubeStreams(followList: any[]) {
  console.log("クロールを実行しました");
  try {
    const channelId = followList.length > 0 ? followList[0].channelId : null;

    if (!channelId) {
      console.log("channelIdが見つかりません。");
      return;
    }

    // 検索APIを使用してライブ動画のIDを取得
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${apiKey}`;
    const searchResponse = await axios.get<YouTubeApiResponse>(searchUrl);
    const videos = searchResponse.data.items;

    // 取得した動画IDで詳細情報APIを呼び出し
    const videoIds = videos.map((video: VideoItem) => video.id.videoId).join(',');

    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoIds}&key=${apiKey}`;
    const videosResponse = await axios.get<VideosApiResponse>(videosUrl);

    // 動画IDごとにストリーミング情報をマップ
    const liveDetailsMap = new Map(
      videosResponse.data.items.map(item => [item.id, item.liveStreamingDetails])
    );

    // 各ビデオアイテムに対し、タイトル・URLなどの情報と共にリスナー数・配信時間を付加
    return videos.map((video: VideoItem): VideoData => {
      const liveDetail = liveDetailsMap.get(video.id.videoId);

      return {
        title: video.snippet.title,
        thumbnailUrl: video.snippet.thumbnails.high.url,
        link: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        listener: liveDetail?.concurrentViewers || 'N/A', // リスナー数
        time: liveDetail?.actualStartTime || 'N/A', // 配信開始時間
      };
    });
  } catch (error) {
    console.error("YouTubeデータの取得中にエラーが発生しました:", error);
  }
}