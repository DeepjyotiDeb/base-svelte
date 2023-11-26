import { expect, test } from '@playwright/test';

test('redirects to home page', async ({ page }) => {
	await page.goto('/');
	await page.getByTestId('stream-bin').click();
	await expect(page).toHaveURL('http://localhost:4173');
	// await expect(page.getByRole('paragraph', { name: 'Stream-bin!' })).toBeVisible();
});

test('health-check', async ({ request }) => {
	const res = await request.get('api/health-check');
	expect(res.status() === 200);
});

test('single file upload', async ({ page }) => {
	await page.goto('/');
	await page.setInputFiles('#dropzone-file', 'src/lib/assets/cat1.webp');
	await expect(page.getByTestId('filename')).toContainText('cat1.webp');

	await page.getByTestId('remove-file').click();
	await expect(page.getByTestId('filename')).not.toContainText('cat1.webp');
});

test('multi file upload', async ({ page }) => {
	await page.goto('/');
	await page.setInputFiles('#dropzone-file', [
		'src/lib/assets/cat1.webp',
		'src/lib/assets/sun.svg'
	]);
	await expect(page.getByTestId('filename').nth(0)).toContainText('cat1.webp');
	await expect(page.getByTestId('filename').nth(1)).toContainText('sun.svg');

	await page.getByTestId('remove-file').nth(1).click();
	await expect(page.getByTestId('filename').nth(1)).not.toContainText('sun.svg');

	await page.getByTestId('remove-file').click();
	await expect(page.getByTestId('filename')).not.toContainText('cat1.webp');
	// await page.setInputFiles('#dropzone-file', []);
	await expect(page.getByTestId('nothing-uploaded')).toContainText('Nothing uploaded');
});
