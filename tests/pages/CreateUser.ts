import {Page, Locator, test, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CreateUserForm extends BasePage {

    readonly nameInput: Locator
    readonly emailInput: Locator
    readonly phoneInput: Locator

    readonly saveButton: Locator
    readonly deleteButton: Locator

    //!--Error Notice--!!
    readonly userNameRequiredNotice: Locator
    readonly emailRequiredNotice: Locator
    readonly phoneNumberRequiredNotice: Locator

    readonly userNameExistsError: Locator

    readonly emailFormatError: Locator
    readonly emailDuplicateError: Locator

    readonly phoneNumberFormatError: Locator
    readonly phoneNumberDuplicateError: Locator

    readonly serverError:Locator

    //!--Success Notice--!!
    readonly successNotice: Locator

    constructor(page: Page) {
        super(page);
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.phoneInput = page.getByRole('textbox', { name: 'Phone Number' });
        this.saveButton = page.getByRole('button', { name: 'SAVE' });
        this.deleteButton = page.getByRole('button', { name: 'DELETE' });

        //!--Error Notice--!!
        this.userNameRequiredNotice = page.getByText('Name is required');
        this.emailRequiredNotice = page.getByText('Email is required');
        this.phoneNumberRequiredNotice = page.getByText('Phone number is required');


        this.serverError = page.getByText(/internal server error/i)

        //!--Success Notice--!1
        this.successNotice = page.getByText('User created successfully');
    }

    async verifyUIElements(){
        const elements = [
            { name: 'Create User Nav Tab', locator: this.createUserTab },
            { name: 'List Users Nav Tab', locator: this.listUsersTab },
            { name: 'Name Input', locator: this.nameInput },
            { name: 'Email Input', locator: this.emailInput },
            { name: 'Phone Input', locator: this.phoneInput },
            { name: 'Save Button', locator: this.saveButton },
            { name: 'Delete Button', locator: this.deleteButton },
        ]
        
        for(const el of elements){
            await test.step(`${el.name} is visible`, async() => {
                await expect(el.locator).toBeVisible();
            })
        }
    }

    async fillForm({name = '', email = '', phone = ''}) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.phoneInput.fill(phone);
    }

    async generateUserData() {
        function generate4LetterCode() {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let code = '';
            for (let i = 0; i < 4; i++) {
            code += letters.charAt(Math.floor(Math.random() * letters.length));
            }
            return code;
        }

        function generateRandomPhoneNumber() {
            let phone = '';
            for (let i = 0; i < 10; i++) {
                phone += Math.floor(Math.random() * 10);
            }
            return phone;
        }

        const code = generate4LetterCode();
        const phone = generateRandomPhoneNumber();

        return {
            name: `Test User${code}`,
            email: `testuser${code.toLowerCase()}@example.com`,
            phone: `${phone}`,
            id: ''
        };
    }


}