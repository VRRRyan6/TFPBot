import { Events } from 'discord.js';
import { XMLParser } from 'fast-xml-parser';
import { Utility } from '../../types';
import YoutubeChannel from '../../models/youtubeChannel';
import axios from 'axios';

const youtubeWatcher: Utility = {
    name: 'youtubeWatcher',
    event: Events.ClientReady,
    cache: {
        refresh: true,
        data: []
    },
    async execute() {
        if (this.cache?.refresh) {
            const channels = await YoutubeChannel.findAll();

            this.cache.data = channels;
            this.cache.refresh = false;
        }

        let toAnnounce = [];
        this.cache?.data.forEach(async (channel: YoutubeChannel, _) => {
            const latestVideo = await getLatestVideo(channel.channelId);

            if (latestVideo.id !== channel.latestVideo) {
                await channel.update({
                    latestVideo: latestVideo.id
                });
                toAnnounce.push(latestVideo);
            }
        })
    }
}

async function getLatestVideo(channelId: string): Promise<{
    id: string,
    author: {
        name: string,
        uri: string
    },
    title: string,
    link: string
}> {
    return axios.get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
        .then((res) => {
            // When node doesn't have DOM -_-
            const parser = new XMLParser({
                attributeNamePrefix: '',
                ignoreAttributes: false 
            });
            const parsedData = parser.parse(res.data).feed;
            // Sort through videos to make sure we get the right latest video
            const latestVideo = parsedData.entry.sort((a: any, b: any) => {
                let aPubDate = new Date(a.pubDate || 0).getTime();
                let bPubDate = new Date(b.pubDate || 0).getTime();
                return bPubDate - aPubDate;
            })[0];

            return {
                id: latestVideo.id,
                author: latestVideo.author,
                title: latestVideo.title,
                link: latestVideo.link.href
            }
        });
}

export default youtubeWatcher;