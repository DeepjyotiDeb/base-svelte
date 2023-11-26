import FileUpload from './components/FileUpload.svelte';
import { render, screen } from '@testing-library/svelte'
import FileList from './components/FileList.svelte';

// describe('sum test', () => {
// 	it('adds 1 + 2 to equal 3', () => {
// 		expect(1 + 2).toBe(3);
// 	});
// });

describe('File upload', () => {
	it('shows file upload', () => {
		const handleFileInput = () => { }
		render(FileUpload, { props: { handleFileInput } })
	})
})

describe('File List', async () => {
	it('shows file upload', async () => {
		const file = new File(["a random file"], "filename.txt", { type: "text/plain" })
		const userFile = {
			id: crypto.randomUUID(),
			file,
			presignedUrl: 'ad4t',
			viewSize: '22',
			loadingProgress: 0,
		}
		const removeFile = () => { }

		const { getByTestId } = render(FileList, { props: { userFile, removeFile } })

		expect(getByTestId('file-object')).toBeInTheDocument()
	})
})