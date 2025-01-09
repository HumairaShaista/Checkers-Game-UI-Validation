# **Checkers-Game-UI-Validation**

## **Overview**
This project is designed for UI validation of the Checkers Game using the **Page Object Model (POM)** approach. It simplifies the management and reusability of code for testing the application's user interface.

---

## **Folder Structure**

### **1. Pages**
- Located in the `/pages` folder.
- Contains page-specific classes representing individual UI components or sections.
- All pages extend the `BasePage` class, which includes common reusable methods.

### **2. BasePage**
- The `BasePage` contains methods shared across all page classes.

### **3. Tests**
- Tests are defined in:
  ```plaintext
  /tests/checkers.test.js
  ```
- This file contains test cases validating the functionality of the Checkers Game UI.

### **4. Configuration**
- The Playwright configuration is located at:
  ```plaintext
  /playwright.config.js
  ```
- Includes settings such as test timeout, browsers, test directory, and more.

---

## **Key Files**

| File/Folder Path                                     | Purpose                                         |
|------------------------------------------------------|------------------------------------------------|
| `/pages/`                                            | Holds all the page classes.                    |
| `/pages/BasePage.js`                                 | Common methods shared by all page classes.     |
| `/tests/checkers.test.js`                            | Contains test cases for the Checkers Game UI.  |
| `/playwright.config.js`                              | Configuration for the Playwright test runner.  |

---

## **Technologies Used**
- **Playwright**: For browser automation and testing.
- **JavaScript/Node.js**: Core language for the framework.

---
