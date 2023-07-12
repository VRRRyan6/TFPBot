import { Table, Column, Model } from 'sequelize-typescript';

@Table
class YoutubeChannel extends Model {
    @Column
    declare channelId: string;

    @Column
    declare latestVideo: string

    @Column
    declare addedBy: string
}

export default YoutubeChannel