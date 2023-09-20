import { Client, Events, TextChannel } from 'discord.js';
import { XMLParser } from 'fast-xml-parser';
import { Utility } from '../../typings/index.js';
import axios from 'axios';

type LatestVideo = {
    id: string,
    author: {
        name: string,
        uri: string
    },
    title: string,
    link: string
}

const youtubeWatcher: Utility = {
    name: 'youtubeWatcher',
    event: Events.ClientReady,
    cache: {
        refresh: true,
        announcementChannels: [],
        channels: [],
    },
    async execute(client: Client) {
        runWatcher(client);
        setInterval(async () => {
            runWatcher(client)
        }, 30 * 60 * 1000);
    }
}

async function runWatcher(client: Client) {
    console.log('running');
    const cache = client.util.get('youtubeWatcher')?.cache
    if (!cache) return

    if (cache.refresh) {
        console.log('refreshing cache', cache.refresh);

        const channels = await client.db
            .selectFrom('youtube_channels')
            .selectAll()
            .execute();

        cache.channels = channels;
        cache.refresh = false;
    }

    cache.channels.forEach((channel: any, index: number) => {
        setTimeout(async () => {
            const latestVideo = await getLatestVideo(channel.channel_id);

            if (latestVideo.id !== channel.latest_video) {
                console.log(`${latestVideo.author.name} has a new video, updating stored values and sending to announcement channel!`);

                cache!.channels[index].latest_video = latestVideo.id;
                await client.db
                    .updateTable('youtube_channels')
                    .set({
                        latest_video: latestVideo.id
                    })
                    .where("channel_id", "=", channel.channel_id)
                    .execute();

                announceVideo(client, channel.guild_id, latestVideo)
            }
        }, index * 5000)
    });
}

async function getLatestVideo(channelId: string): Promise<LatestVideo> {
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
            };
        });
}

async function announceVideo(client: Client, guildId: string, latestVideo: LatestVideo) {
    await client.guilds.fetch(guildId)
        .then(async (guild) => {
            return guild.channels.cache.find((channel) => {
                return channel.name === 'new-videos';
            })
        })
        .then((channel) => {
            (channel as TextChannel)
                .send(latestVideo.link)
                .catch((err) => { console.error(err) })
        })
        .catch(() => {})
}

export default youtubeWatcher;