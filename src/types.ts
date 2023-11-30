
export type ChannelData = {
    name: string;
    type: string;
    unit: string;
    min: number;
    Q1: number;
    median: number;
    Q3: number;
    max: number;
}

export type LoadingProps = {
    setLoading: (loading: boolean) => void;
}