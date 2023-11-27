// describe('Health check', () => {
// 	it('Api is live', () => {
// 		cy.request('GET', 'api/health-check').then((res) => {
// 			expect(res.status).to.eq(200);
// 		});
// 		// cy.visit('/'); // change URL to match your dev URL
// 	});
// });

describe('File E2E Upload', () => {
	beforeEach(() => {
		// cy.intercept('index.svelte?svelte&type=style&lang.css').as('svelte');
		cy.visit('/');
		cy.wait(2000);
		// cy.wait('@svelte');
	});
	it('uploads a file', () => {
		cy.visit('/');
		cy.dataTest('nothing-uploaded').contains('Nothing uploaded');
		// cy.get('[data-testid="dropzone-file"]').
		cy.dataTest('dropzone-file').selectFile(
			['cypress/fixtures/cat1.webp', 'cypress/fixtures/sun.svg', 'cypress/fixtures/example.json'],
			{ force: true }
		);
		cy.wait(5000);
		cy.get('[data-testid="filename"]').contains('cat1.webp');
		cy.get('[data-testid="upload"]').click();

		cy.get('[data-testid="go"]').click();
		cy.get('[data-testid="cat1.webp"]').contains('cat1.webp');
	});
});
