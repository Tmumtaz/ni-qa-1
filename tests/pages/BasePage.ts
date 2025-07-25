import {expect, Page, Locator } from "@playwright/test";


export class BasePage {
    readonly page: Page;

    readonly createUserTab: Locator
    readonly listUsersTab: Locator
    

    constructor(page: Page) {
        this.page = page;

        this.createUserTab = page.getByRole('tab', { name: 'CREATE USER' });
        this.listUsersTab = page.getByRole('tab', { name: 'LIST USERS' });
    }

    async verifyNavTabActive(tab: Locator) {
    // Check if the 'aria-selected' attribute is set to 'true'
    await expect(tab).toHaveAttribute('aria-selected', 'true');
}
}