interface FileUploadProps {
	handleDrop: (e: DragEvent) => void;
	handleFileInput: (e: Event) => void;
}

interface FileProps {
	id: string;
	file: File;
	presignedUrl: string;
	viewSize: string;
	loadingProgress: number;
}

export type { FileUploadProps, FileProps };
