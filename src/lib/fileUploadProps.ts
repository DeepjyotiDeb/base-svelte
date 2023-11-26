interface FileProps {
	id: string;
	file: File;
	presignedUrl: string;
	viewSize: string;
	loadingProgress: number;
}

export type { FileProps };

// ACCESS_ID = AKIA4Q2OPXMYGAVXWSDY
// SECRET_KEY = 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
// REGION = ap - south - 1
// BUCKET = stream - bin
// TABLENAME = stream - table