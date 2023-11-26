import { expect, test } from '@playwright/test';

test('health-check', async ({ request }) => {
	const res = await request.get('api/health-check');
	expect(res.status() === 200);
});

// test('single file upload and removal', async ({ page }) => {
// 	await page.goto('/');
// 	await page.setInputFiles('#dropzone-file', 'src/lib/assets/cat1.webp');
// 	await expect(page.getByTestId('filename')).toContainText('cat1.webp');

// 	await page.getByTestId('remove-file').click();
// 	await expect(page.getByTestId('nothing-uploaded')).toContainText('Nothing uploaded');
// });

test('single file upload', async ({ page }) => {
	await page.goto('/');
	await page.getByTestId('dropzone-file').setInputFiles('src/lib/assets/cat1.webp');
	await expect(page.getByTestId('filename')).toContainText('cat1.webp');

	await page.getByTestId('upload').click()

	// await expect(page.getByTestId('upload-complete')).toContainText('Upload complete');
});

test('multi file upload and removal', async ({ page }) => {
	await page.goto('/');
	await page.setInputFiles('#dropzone-file', [
		'src/lib/assets/cat1.webp',
		'src/lib/assets/sun.svg'
	]);
	await expect(page.getByTestId('filename').nth(0)).toContainText('cat1.webp');
	await expect(page.getByTestId('filename').nth(1)).toContainText('sun.svg');

	await page.getByTestId('remove-file').nth(0).click();
	await expect(page.getByTestId('filename').nth(0)).toContainText('sun.svg');

	await page.getByTestId('remove-file').click();
	await expect(page.getByTestId('nothing-uploaded')).toContainText('Nothing uploaded');
});

test('multi file upload and download', async ({ page }) => {
	await page.goto('/');
	await page.setInputFiles('#dropzone-file', [
		'src/lib/assets/cat1.webp',
		'src/lib/assets/sun.svg',
		// 'src/lib/assets/muniyaDidiBirthday.mp4'
	]);
	await expect(page.getByTestId('filename').nth(0)).toContainText('cat1.webp');
	await expect(page.getByTestId('filename').nth(1)).toContainText('sun.svg');

	await page.getByTestId('upload').click()

	await expect(page.getByTestId('upload-complete').nth(0)).toContainText('Upload complete');
	await expect(page.getByTestId('upload-complete').nth(1)).toContainText('Upload complete');


	await page.getByTestId('go-to-download').waitFor()

	expect(page.getByTestId('go-to-download')).toContainText('Go');
	await page.getByTestId('go').click()
	await page.waitForURL('/**');

	await expect(page.getByTestId('cat1.webp')).toContainText('cat1.webp')

	// const downloadPromise = page.waitForEvent('download');
	// await page.getByText('Download').nth(0).click();
	// const download = await downloadPromise;

	// Wait for the download process to complete and save the downloaded file somewhere.
	// await download.saveAs('/' + download.suggestedFilename())
});
