export interface BatchWriteProps {
	items: { DownloadUrl: string; ContentType: string; ShortUrl: string; id: string; TTL: number }[];
}
