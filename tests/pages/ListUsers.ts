import {Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ListUsersPage extends BasePage {
    readonly userItem: Locator;
    readonly userListItems: Locator;
    readonly editButton: Locator;
    readonly deleteButton: Locator;
    readonly userName: Locator;
    readonly userEmailId: Locator;

    constructor(page: Page) {
        super(page);

        this.userItem = page.locator('li.MuiListItem-root');

        this.userListItems = page.locator('li.MuiListItem-root'); // locator for each user list item
        this.editButton = page.locator('li a:has-text("Edit")'); // locator for the Edit button
        this.deleteButton = page.locator('li button:has-text("Delete")'); // locator for the Delete button
        this.userName = page.locator('li .MuiListItemText-primary'); // locator for the user name
        this.userEmailId = page.locator('li .MuiListItemText-secondary'); // locator for user email & ID
    }

    async verifyUserElements(index){
        // await expect(this.userListItems.nth(index)).toBeVisible();
        await expect(this.editButton.nth(index)).toBeVisible();
        await expect(this.deleteButton.nth(index)).toBeVisible();
        await expect(this.userName.nth(index)).toBeVisible();
        await expect(this.userEmailId.nth(index)).toBeVisible();
    }

    async userCount(){
        const count = await this.userListItems.count();
        return count;
    }

    async verifyUsersListElements(){
        const count = await this.userListItems.count();
        for (let i = 0; i < count; i++) {
            await this.verifyUserElements(i);
        }
    }

}