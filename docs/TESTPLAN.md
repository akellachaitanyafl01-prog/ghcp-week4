# COBOL Account Management System - Test Plan

## Overview
This document outlines the comprehensive test plan for the COBOL Account Management System. The test plan covers all business logic, transaction flows, data validation, and error handling scenarios. These test cases will be used to validate the system with business stakeholders and serve as the basis for creating unit and integration tests in the Node.js migration.

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Application Startup | None | 1. Launch the executable `./accountsystem` | Menu displays with options 1-4 and prompt for user choice | | | |
| TC-002 | Initial Balance on First Load | Application started for the first time | 1. Select option 1 (View Balance) | Display shows "Current balance: 001000.00" (initial balance of $1000.00) | | | |
| TC-003 | View Balance - Display Format | Account has balance of $1000.00 | 1. Select option 1 (View Balance) | Balance displays in format PIC 9(6)V99 with leading zeros and 2 decimal places (001000.00) | | | |
| TC-004 | Menu Navigation - Valid Choice 1 | Menu is displayed | 1. Enter "1" 2. System processes View Balance operation | Operation executes without error; displays current balance | | | |
| TC-005 | Menu Navigation - Valid Choice 2 | Menu is displayed | 1. Enter "2" 2. System processes Credit Account operation | Operation executes; prompts for credit amount | | | |
| TC-006 | Menu Navigation - Valid Choice 3 | Menu is displayed | 1. Enter "3" 2. System processes Debit Account operation | Operation executes; prompts for debit amount | | | |
| TC-007 | Menu Navigation - Valid Choice 4 | Menu is displayed | 1. Enter "4" 2. System processes Exit operation | Application displays "Exiting the program. Goodbye!" and terminates | | | |
| TC-008 | Menu Navigation - Invalid Choice (0) | Menu is displayed | 1. Enter "0" 2. System evaluates choice | Error message "Invalid choice, please select 1-4." displays; menu re-displays | | | |
| TC-009 | Menu Navigation - Invalid Choice (5) | Menu is displayed | 1. Enter "5" 2. System evaluates choice | Error message "Invalid choice, please select 1-4." displays; menu re-displays | | | |
| TC-010 | Menu Navigation - Invalid Choice (9) | Menu is displayed | 1. Enter "9" 2. System evaluates choice | Error message "Invalid choice, please select 1-4." displays; menu re-displays | | | |
| TC-011 | Menu Loop Continuation | Initial menu displayed | 1. Select option 1 (View Balance) 2. View displayed 3. Menu re-displays 4. Select option 4 (Exit) | Menu continuously re-displays after each valid operation until Exit is selected | | | |
| TC-012 | Credit - Valid Amount | Current balance is $1000.00 | 1. Select option 2 (Credit Account) 2. Prompt displays "Enter credit amount:" 3. Enter "500" | Amount is added to balance | | | |
| TC-013 | Credit - Confirm New Balance | Current balance is $1000.00, Credit amount is $500.00 | 1. Select option 2 2. Enter "500" 3. View new balance | Display shows "New balance: 001500.00" (1000.00 + 500.00) | | | |
| TC-014 | Credit - Large Amount | Current balance is $1000.00 | 1. Select option 2 2. Enter "99000" | Amount is added; new balance becomes 100000.00 without error | | | |
| TC-015 | Credit - Small Amount | Current balance is $1000.00 | 1. Select option 2 2. Enter "1" | Amount is added; new balance becomes 1001.00 | | | |
| TC-016 | Credit - Decimal Amount | Current balance is $1000.00 | 1. Select option 2 2. Enter amount with cents (e.g., "50.50") | System accepts decimal and new balance reflects addition with 2 decimal precision | | | |
| TC-017 | Credit - No Maximum Validation | Current balance is $900,000.00 | 1. Select option 2 2. Enter "500000" | Credit is accepted despite potentially exceeding normal limits (no validation in system) | | | |
| TC-018 | Debit - Sufficient Funds (Exact Amount) | Current balance is $1000.00 | 1. Select option 3 (Debit Account) 2. Prompt displays "Enter debit amount:" 3. Enter "1000" | Debit is allowed; new balance becomes 000000.00 | | | |
| TC-019 | Debit - Sufficient Funds (Partial Amount) | Current balance is $1000.00 | 1. Select option 3 2. Enter "300" | Debit is allowed; new balance becomes 000700.00 | | | |
| TC-020 | Debit - Sufficient Funds (Small Amount) | Current balance is $1000.00 | 1. Select option 3 2. Enter "1" | Debit is allowed; new balance becomes 000999.00 | | | |
| TC-021 | Debit - Insufficient Funds | Current balance is $500.00 | 1. Select option 3 2. Enter "600" | System displays "Insufficient funds for this debit." Error message; no debit occurs; balance remains 000500.00 | | | |
| TC-022 | Debit - Insufficient Funds (Exceed by 1) | Current balance is $1000.00 | 1. Select option 3 2. Enter "1001" | System displays "Insufficient funds for this debit." Error message; balance remains 001000.00 | | | |
| TC-023 | Debit - Allow When Balance Equals Amount | Current balance is $500.00 | 1. Select option 3 2. Enter "500" | Debit is allowed (balance >= amount); new balance becomes 000000.00 | | | |
| TC-024 | Debit - With Decimal Amount | Current balance is $1000.00 | 1. Select option 3 2. Enter "50.50" | System processes decimal amounts; if sufficient funds, debit is applied with 2 decimal precision | | | |
| TC-025 | Data Consistency - Sequential Credit Operations | Initial balance $1000.00 | 1. Select option 2, Enter "100" 2. Select option 1 to view balance 3. Select option 2, Enter "200" 4. Select option 1 to view balance | After first credit: 001100.00. After second credit: 001300.00. Balance correctly accumulates. | | | |
| TC-026 | Data Consistency - Sequential Debit Operations | Initial balance $1000.00 | 1. Select option 3, Enter "100" 2. Select option 1 to view balance 3. Select option 3, Enter "200" 4. Select option 1 to view balance | After first debit: 000900.00. After second debit: 000700.00. Balance correctly decrements. | | | |
| TC-027 | Data Consistency - Mixed Operations | Initial balance $1000.00 | 1. Select option 2, Enter "500" 2. Select option 3, Enter "300" 3. Select option 1 to view balance | After credit: 001500.00. After debit: 001200.00. Balance is correctly maintained. | | | |
| TC-028 | Transaction Atomicity - Debit Rejected | Current balance is $100.00 | 1. Select option 3, Enter "150" 2. System rejects debit with insufficient funds message 3. Select option 1 to view balance | Balance remains 000100.00; no partial debit occurs; transaction is atomic | | | |
| TC-029 | Balance Persistence Across Operations | Balance is $750.00 after initial operations | 1. Perform 5 consecutive menu operations (mix of view, credit, debit) 2. Check balance after each operation | Balance correctly reflects all operations in sequence; no data loss between operations | | | |
| TC-030 | Debit Validation - Boundary Condition (Zero Balance) | Balance has been reduced to $0.00 | 1. Select option 3 2. Enter "1" | System displays "Insufficient funds for this debit." Error message; balance remains 000000.00 | | | |
| TC-031 | Credit After Debit Failure | Current balance is $100.00; failed debit attempt for $150 | 1. Attempt debit of $150 (fails) 2. Select option 2 (Credit) 3. Enter "50" | Credit operation succeeds; new balance becomes 000150.00; no data corruption from previous failed operation | | | |
| TC-032 | Precision - 2 Decimal Places Maintained | Any balance value | 1. Perform credit/debit operations with decimal amounts 2. View balance | All displayed balances show exactly 2 decimal places (e.g., 001234.56, not 001234.5 or 001234.567) | | | |
| TC-033 | Maximum Balance (Non-Breaking) | Balance approaches maximum (PIC 9(6)V99) | 1. Current balance is $999999.00 2. Select option 2 3. Enter "0.99" | New balance becomes 1000000.00 (exceeds format but system does not prevent) | | | |
| TC-034 | View Balance - No Side Effects | Current balance is $1000.00 | 1. Select option 1 to view balance multiple times (5 times) 2. No other operations performed 3. View balance one final time | Balance remains 001000.00 throughout; read operation has no side effects on stored value | | | |
| TC-035 | Menu Display Consistency | Application is running | 1. After each operation, verify menu displays | Menu displays identically after each operation with options 1-4 and prompt "Enter your choice (1-4):" | | | |
| TC-036 | Exit Operation Graceful Termination | Any state in the application | 1. Select option 4 from menu | System displays "Exiting the program. Goodbye!" message and application terminates cleanly | | | |
| TC-037 | No Data Loss on Exit | Balance is $1500.00 after operations | 1. Perform credit/debit operations 2. Note the final balance 3. Select option 4 and exit | Final balance is correctly reflected before exit; if application were restarted (with persistence), this balance would be available | | | |
| TC-038 | Multiple Credit Transactions with Large Amounts | Initial balance $1000.00 | 1. Credit $50000 2. Credit $75000 3. Credit $100000 4. View balance | Final balance is 226000.00; system handles large cumulative credits | | | |
| TC-039 | Debit Followed by Credit (Restoration) | Initial balance $1000.00 | 1. Debit $600 (balance becomes $400) 2. Credit $600 (balance becomes $1000) 3. View balance | Balance returns to 001000.00; credit successfully restores balance to original | | | |
| TC-040 | Input Validation - Non-Numeric Menu Choice | Menu is displayed | 1. Enter "A" or other non-numeric input | System evaluates as invalid choice (not 1-4); displays error message; menu re-displays | | | |

---

## Test Summary

**Total Test Cases:** 40

**Coverage Areas:**
- Application Lifecycle (Startup, Exit): TC-001, TC-007, TC-036, TC-037
- Menu Navigation & Validation: TC-004 to TC-010
- Menu Loop Functionality: TC-011
- View Balance Operations: TC-002, TC-003, TC-034
- Credit Operations: TC-012 to TC-017
- Debit Operations: TC-018 to TC-024
- Data Consistency: TC-025 to TC-029
- Transaction Atomicity: TC-028, TC-031
- Balance Precision: TC-032
- Boundary Conditions: TC-030, TC-033, TC-039
- System Consistency: TC-035
- Input Validation: TC-040

---

## Business Rules Validation

| Business Rule | Related Test Cases | Validation Status |
|---|---|---|
| Initial balance is $1000.00 | TC-002, TC-027 | |
| Credit operations add funds without limit | TC-012 to TC-017, TC-038 | |
| Debit operations subtract funds only if sufficient balance | TC-018 to TC-024, TC-030 | |
| Overdraft prevention (balance >= debit amount) | TC-021, TC-022, TC-030 | |
| Balance precision maintained at 2 decimal places | TC-032 | |
| All balance reads use DataProgram | TC-002, TC-034 | |
| All balance writes use DataProgram | TC-012 to TC-024 | |
| Transaction atomicity for debit operations | TC-028, TC-031 | |
| Menu loop continues until exit | TC-011 | |
| No data loss between operations | TC-025 to TC-029 | |

---

## Notes for Node.js Migration

When creating unit and integration tests for the Node.js application based on this test plan, consider:

1. **Module Structure:** Map COBOL programs to Node.js modules (main → UI handler, operations → business logic service, data → data access layer)
2. **State Management:** Implement persistent storage (database or file-based) instead of in-memory WORKING-STORAGE
3. **API Layer:** Create REST endpoints for balance view, credit, and debit operations
4. **Error Handling:** Implement proper HTTP status codes and structured error responses
5. **Input Validation:** Add comprehensive input validation at API level (amount ranges, decimal validation, etc.)
6. **Testing Framework:** Use Jest or Mocha for unit tests; Supertest for API integration tests
7. **Test Data:** Create fixtures for various balance states to support test case execution
8. **Concurrency:** Address potential race conditions in multi-user scenarios not present in synchronous COBOL
9. **Persistence:** Implement transaction handling to ensure data consistency across multiple operations
10. **Logging:** Add comprehensive logging for audit trail and debugging

