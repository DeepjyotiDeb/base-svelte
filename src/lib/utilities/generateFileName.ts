export function extractFileNameFromUrl(url: string) {
	const parts = url.split('/');
	const fileNamePart = parts[parts.length - 1]; // Get the last part of the URL
	const decodedFileName = decodeURIComponent(fileNamePart); // Decode any URL-encoded characters

	// Use regular expression to extract the file name
	const match = decodedFileName.match(/([^?#]+)(\?|#|$)/);
	if (match) {
		return match[1];
	} else {
		return null;
	}
}
