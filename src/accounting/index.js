/**
 * Account Management System - Node.js Port
 * Ported from COBOL: main.cob, operations.cob, data.cob
 * 
 * This application provides a student account management interface with
 * balance viewing, credit, and debit operations while enforcing
 * business rules such as overdraft prevention.
 */

let promptInstance = null;

function getPrompt() {
  if (!promptInstance) {
    promptInstance = require('prompt-sync')();
  }
  return promptInstance;
}

// ============================================================================
// DATA MODULE - Equivalent to data.cob (DataProgram)
// ============================================================================
// Handles persistent storage and data operations (READ/WRITE)

class DataModule {
  constructor() {
    // STORAGE-BALANCE from data.cob - initial balance of $1000.00
    // Format: PIC 9(6)V99 (6 digits total, 2 decimal places)
    this.storageBalance = 1000.00;
  }

  /**
   * READ operation - Retrieve current balance from storage
   * Equivalent to CALL 'DataProgram' USING 'READ', BALANCE
   * @returns {number} Current account balance
   */
  read() {
    return this.storageBalance;
  }

  /**
   * WRITE operation - Persist updated balance to storage
   * Equivalent to CALL 'DataProgram' USING 'WRITE', BALANCE
   * @param {number} newBalance - The new balance value to store
   */
  write(newBalance) {
    // Maintain precision to 2 decimal places
    this.storageBalance = Math.round(newBalance * 100) / 100;
  }

  /**
   * Format balance for display
   * Matches COBOL display format: PIC 9(6)V99
   * @param {number} balance - Balance value to format
   * @returns {string} Formatted balance string (e.g., "001000.00")
   */
  formatBalance(balance) {
    return balance.toFixed(2).padStart(9, '0');
  }
}

// ============================================================================
// OPERATIONS MODULE - Equivalent to operations.cob (Operations Program)
// ============================================================================
// Handles business logic for account operations (TOTAL, CREDIT, DEBIT)

class OperationsModule {
  constructor(dataModule) {
    this.data = dataModule;
  }

  /**
   * TOTAL operation - View current account balance
   * Equivalent to OPERATION-TYPE = 'TOTAL '
   */
  viewBalance() {
    const balance = this.data.read();
    const formattedBalance = this.data.formatBalance(balance);
    console.log(`Current balance: ${formattedBalance}`);
  }

  /**
   * CREDIT operation - Deposit funds into account
   * Equivalent to OPERATION-TYPE = 'CREDIT'
   * 
   * Business Logic:
   * 1. Prompt user for credit amount
   * 2. Read current balance
   * 3. Add amount to balance (no limit validation)
   * 4. Write updated balance to storage
   * 5. Display new balance
   */
  creditAccount() {
    const prompt = getPrompt();
    const amountInput = prompt('Enter credit amount: ');
    const amount = parseFloat(amountInput);

    // Validate numeric input
    if (isNaN(amount) || amount <= 0) {
      console.log('Invalid amount. Please enter a positive number.');
      return;
    }

    // READ operation from DataProgram
    const currentBalance = this.data.read();

    // ADD AMOUNT TO BALANCE
    const newBalance = currentBalance + amount;

    // WRITE operation to DataProgram
    this.data.write(newBalance);

    // Display result
    const formattedBalance = this.data.formatBalance(newBalance);
    console.log(`Amount credited. New balance: ${formattedBalance}`);
  }

  /**
   * DEBIT operation - Withdraw funds from account
   * Equivalent to OPERATION-TYPE = 'DEBIT '
   * 
   * Business Logic:
   * 1. Prompt user for debit amount
   * 2. Read current balance
   * 3. Validate sufficient funds (balance >= amount)
   * 4. If valid: subtract amount and write new balance
   * 5. If insufficient: display error message, no change to balance
   * 
   * Overdraft Prevention: Debit is only allowed if balance >= requested amount
   */
  debitAccount() {
    const prompt = getPrompt();
    const amountInput = prompt('Enter debit amount: ');
    const amount = parseFloat(amountInput);

    // Validate numeric input
    if (isNaN(amount) || amount <= 0) {
      console.log('Invalid amount. Please enter a positive number.');
      return;
    }

    // READ operation from DataProgram
    const currentBalance = this.data.read();

    // VALIDATION: Check sufficient funds
    // IF FINAL-BALANCE >= AMOUNT THEN...
    if (currentBalance >= amount) {
      // SUBTRACT AMOUNT FROM BALANCE
      const newBalance = currentBalance - amount;

      // WRITE operation to DataProgram
      this.data.write(newBalance);

      // Display result
      const formattedBalance = this.data.formatBalance(newBalance);
      console.log(`Amount debited. New balance: ${formattedBalance}`);
    } else {
      // ELSE... Display insufficient funds error
      console.log('Insufficient funds for this debit.');
    }
  }
}

// ============================================================================
// UI MODULE - Equivalent to main.cob (MainProgram)
// ============================================================================
// Handles menu display and user interaction

class UIModule {
  constructor(operationsModule) {
    this.operations = operationsModule;
    this.continueFlag = true;
  }

  /**
   * Display main menu and get user choice
   * Equivalent to main.cob MAIN-LOGIC procedure
   * 
   * Menu Options:
   * 1. View Balance - calls Operations 'TOTAL '
   * 2. Credit Account - calls Operations 'CREDIT'
   * 3. Debit Account - calls Operations 'DEBIT '
   * 4. Exit - terminates program
   */
  displayMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
  }

  /**
   * Get user choice from menu
   * @returns {string} User's menu selection
   */
  getUserChoice() {
    const prompt = getPrompt();
    return prompt('Enter your choice (1-4): ');
  }

  /**
   * Process user menu choice and route to appropriate operation
   * Equivalent to EVALUATE USER-CHOICE in main.cob
   * @param {string} choice - User's menu selection (1, 2, 3, or 4)
   */
  processChoice(choice) {
    switch (choice) {
      case '1':
        // WHEN 1: CALL 'Operations' USING 'TOTAL '
        this.operations.viewBalance();
        break;
      case '2':
        // WHEN 2: CALL 'Operations' USING 'CREDIT'
        this.operations.creditAccount();
        break;
      case '3':
        // WHEN 3: CALL 'Operations' USING 'DEBIT '
        this.operations.debitAccount();
        break;
      case '4':
        // WHEN 4: MOVE 'NO' TO CONTINUE-FLAG
        this.continueFlag = false;
        break;
      default:
        // WHEN OTHER: Display invalid choice message
        console.log('Invalid choice, please select 1-4.');
    }
  }

  /**
   * Main application loop
   * Equivalent to PERFORM UNTIL CONTINUE-FLAG = 'NO' in main.cob
   */
  run() {
    // PERFORM UNTIL CONTINUE-FLAG = 'NO'
    while (this.continueFlag) {
      this.displayMenu();
      const choice = this.getUserChoice();
      this.processChoice(choice);
    }

    // Program exit
    console.log('Exiting the program. Goodbye!');
  }
}

// ============================================================================
// APPLICATION STARTUP
// ============================================================================
// Equivalent to PROGRAM-ID and STOP RUN in main.cob

function main() {
  try {
    // Initialize modules (bottom-up: data → operations → ui)
    const dataModule = new DataModule();
    const operationsModule = new OperationsModule(dataModule);
    const uiModule = new UIModule(operationsModule);

    // Run main program loop
    uiModule.run();
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

// ============================================================================
// MODULE EXPORTS (for testing)
// ============================================================================

module.exports = {
  DataModule,
  OperationsModule,
  UIModule,
  main
};

// Start application (only if run directly, not imported)
if (require.main === module) {
  main();
}
