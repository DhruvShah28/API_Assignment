const getYoutubeVideos = async (query) => {
        const apiKey = process.env.YOUTUBEKEY;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        return data.items.map(video => ({
                title: video.snippet.title,
                videoId: video.id.videoId,
                videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                thumbnail: video.snippet.thumbnails.medium.url,
                channelTitle: video.snippet.channelTitle
        }));

};

module.exports = { getYoutubeVideos };
