/* eslint-disable @typescript-eslint/no-namespace */
export {};
declare global {
	namespace Cypress {
		interface Chainable {
			dataTest(id: string): Chainable<JQuery<HTMLElement>>;
		}
	}
}
