import { Events } from 'discord.js';
import axios from 'axios';
import { simplify, parse } from 'txml';

module.exports = {
    name: 'youtubeWatcher',
    event: Events.ClientReady,
    async execute() {
        const video = await axios.get('https://www.youtube.com/feeds/videos.xml?channel_id=UCXuqSBlHAE6Xw-yeJA0Tunw')
            .then((res) => {
                const feed = simplify(parse(res.data)).feed;
                return feed.entry[0].id
            });
        console.log(video)
    }
}
