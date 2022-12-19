export interface IAudio {
    id: string;
    title: string;
    url: string;
    channelTitle: string;
    createdAt: Date;
    UpdatedAt: Date;
};

export interface IPlayList {
    id: string;
    title: string;
    url: string;
    description: string;
    videos: Array<IAudio>;
    createdAt: Date;
    UpdatedAt: Date;
};