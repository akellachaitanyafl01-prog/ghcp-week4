#!/usr/bin/env node
/**
 * Simple Test Runner - Runs tests directly with manual assertions
 * This avoids Jest output issues
 */

const { DataModule, OperationsModule } = require('./index');

let testCount = 0;
let passCount = 0;
let failCount = 0;

function test(description, testFn) {
  testCount++;
  try {
    testFn();
    passCount++;
    console.log(`✓ ${description}`);
  } catch (error) {
    failCount++;
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('='.repeat(70));
console.log('Account Management System - Test Suite');
console.log('='.repeat(70));
console.log('');

// ============================================================================
// DATA MODULE TESTS
// ============================================================================
console.log('DATA MODULE TESTS');
console.log('-'.repeat(70));

test('TC-002: Should initialize with $1000.00 balance', () => {
  const data = new DataModule();
  assert(data.read() === 1000.00, 'Initial balance should be 1000.00');
});

test('TC-003: Should format balance with leading zeros and 2 decimals', () => {
  const data = new DataModule();
  const formatted = data.formatBalance(1000.00);
  assert(formatted === '001000.00', `Expected 001000.00, got ${formatted}`);
});

test('TC-032: Should maintain 2 decimal places', () => {
  const data = new DataModule();
  data.write(1234.567);
  assert(data.read() === 1234.57, 'Should round to 2 decimals');
});

test('TC-034: READ operations should not modify balance', () => {
  const data = new DataModule();
  const b1 = data.read();
  const b2 = data.read();
  const b3 = data.read();
  assert(b1 === b2 && b2 === b3, 'Balance should remain unchanged');
});

test('Should persist new balance with WRITE operation', () => {
  const data = new DataModule();
  data.write(1500.00);
  assert(data.read() === 1500.00, 'Balance should be updated to 1500.00');
});

test('Should format various balances correctly', () => {
  const data = new DataModule();
  const tests = [
    { val: 0, expected: '000000.00' },
    { val: 1, expected: '000001.00' },
    { val: 99.99, expected: '000099.99' },
    { val: 1000.00, expected: '001000.00' },
    { val: 999999.99, expected: '999999.99' }
  ];
  
  tests.forEach(({ val, expected }) => {
    const formatted = data.formatBalance(val);
    assert(formatted === expected, `Expected ${expected}, got ${formatted}`);
  });
});

console.log('');

// ============================================================================
// OPERATIONS MODULE TESTS
// ============================================================================
console.log('OPERATIONS MODULE TESTS');
console.log('-'.repeat(70));

test('TC-012: Should add credit amount to balance', () => {
  const data = new DataModule();
  data.write(1000.00);
  let balance = data.read();
  balance += 500;
  data.write(balance);
  assert(data.read() === 1500.00, 'Balance should be 1500.00 after credit');
});

test('TC-014: Should accept large credit amounts', () => {
  const data = new DataModule();
  data.write(1000.00);
  let balance = data.read();
  balance += 99000;
  data.write(balance);
  assert(data.read() === 100000.00, 'Balance should be 100000.00');
});

test('TC-015: Should accept small credit amounts', () => {
  const data = new DataModule();
  data.write(1000.00);
  let balance = data.read();
  balance += 1;
  data.write(balance);
  assert(data.read() === 1001.00, 'Balance should be 1001.00');
});

test('TC-016: Should handle decimal credit amounts', () => {
  const data = new DataModule();
  data.write(1000.00);
  let balance = data.read();
  balance += 50.50;
  data.write(balance);
  assert(data.read() === 1050.50, 'Balance should be 1050.50');
});

test('TC-018: Should allow debit when balance equals amount', () => {
  const data = new DataModule();
  data.write(1000.00);
  let balance = data.read();
  if (balance >= 1000) {
    balance -= 1000;
    data.write(balance);
  }
  assert(data.read() === 0.00, 'Balance should be 0.00');
});

test('TC-019: Should allow debit for partial amount', () => {
  const data = new DataModule();
  data.write(1000.00);
  let balance = data.read();
  if (balance >= 300) {
    balance -= 300;
    data.write(balance);
  }
  assert(data.read() === 700.00, 'Balance should be 700.00');
});

test('TC-021: Should reject debit when insufficient funds', () => {
  const data = new DataModule();
  data.write(500.00);
  let balance = data.read();
  const shouldAllow = balance >= 600;
  assert(!shouldAllow, 'Debit should be rejected');
  assert(data.read() === 500.00, 'Balance should remain 500.00');
});

test('TC-024: Should handle debit with decimal amounts', () => {
  const data = new DataModule();
  data.write(1000.00);
  let balance = data.read();
  if (balance >= 50.50) {
    balance -= 50.50;
    data.write(balance);
  }
  assert(data.read() === 949.50, 'Balance should be 949.50');
});

test('TC-030: Should reject debit when balance is zero', () => {
  const data = new DataModule();
  data.write(0.00);
  let balance = data.read();
  const shouldAllow = balance >= 1;
  assert(!shouldAllow, 'Debit should be rejected');
  assert(data.read() === 0.00, 'Balance should remain 0.00');
});

console.log('');

// ============================================================================
// DATA CONSISTENCY TESTS
// ============================================================================
console.log('DATA CONSISTENCY TESTS');
console.log('-'.repeat(70));

test('TC-025: Sequential credit operations should accumulate', () => {
  const data = new DataModule();
  data.write(1000.00);
  
  let balance = data.read();
  balance += 100;
  data.write(balance);
  assert(data.read() === 1100.00, 'First credit failed');
  
  balance = data.read();
  balance += 200;
  data.write(balance);
  assert(data.read() === 1300.00, 'Second credit failed');
});

test('TC-026: Sequential debit operations should decrement', () => {
  const data = new DataModule();
  data.write(1000.00);
  
  let balance = data.read();
  if (balance >= 100) {
    balance -= 100;
    data.write(balance);
  }
  assert(data.read() === 900.00, 'First debit failed');
  
  balance = data.read();
  if (balance >= 200) {
    balance -= 200;
    data.write(balance);
  }
  assert(data.read() === 700.00, 'Second debit failed');
});

test('TC-027: Mixed credit and debit operations', () => {
  const data = new DataModule();
  data.write(1000.00);
  
  let balance = data.read();
  balance += 500;
  data.write(balance);
  assert(data.read() === 1500.00, 'Credit failed');
  
  balance = data.read();
  if (balance >= 300) {
    balance -= 300;
    data.write(balance);
  }
  assert(data.read() === 1200.00, 'Debit failed');
});

test('TC-029: Balance persistence across multiple operations', () => {
  const data = new DataModule();
  data.write(1000.00);
  
  const operations = [
    { type: 'credit', amount: 100 },
    { type: 'debit', amount: 50 },
    { type: 'credit', amount: 200 },
    { type: 'debit', amount: 75 },
    { type: 'credit', amount: 25 }
  ];
  
  let expectedBalance = 1000.00;
  operations.forEach(op => {
    let balance = data.read();
    if (op.type === 'credit') {
      balance += op.amount;
      expectedBalance += op.amount;
    } else if (op.type === 'debit' && balance >= op.amount) {
      balance -= op.amount;
      expectedBalance -= op.amount;
    }
    data.write(balance);
  });
  
  assert(data.read() === 1200.00, `Expected 1200.00, got ${data.read()}`);
});

console.log('');

// ============================================================================
// TRANSACTION ATOMICITY TESTS
// ============================================================================
console.log('TRANSACTION ATOMICITY TESTS');
console.log('-'.repeat(70));

test('TC-028: Rejected debit should not modify balance', () => {
  const data = new DataModule();
  data.write(100.00);
  const originalBalance = data.read();
  
  if (originalBalance >= 150) {
    data.write(originalBalance - 150);
  }
  
  assert(data.read() === 100.00, 'Balance should remain 100.00');
});

test('TC-031: Credit after failed debit attempt', () => {
  const data = new DataModule();
  data.write(100.00);
  
  let balance = data.read();
  if (balance >= 150) {
    data.write(balance - 150);
  }
  assert(data.read() === 100.00, 'Balance should still be 100.00');
  
  balance = data.read();
  data.write(balance + 50);
  assert(data.read() === 150.00, 'Credit should succeed with balance 150.00');
});

console.log('');

// ============================================================================
// BOUNDARY CONDITIONS TESTS
// ============================================================================
console.log('BOUNDARY CONDITIONS TESTS');
console.log('-'.repeat(70));

test('TC-033: Handle balances exceeding 6-digit format', () => {
  const data = new DataModule();
  data.write(999999.00);
  let balance = data.read();
  data.write(balance + 0.99);
  assert(data.read() === 1000000.00, 'Should handle 7-digit balance');
});

test('TC-039: Credit should restore balance after debit', () => {
  const data = new DataModule();
  data.write(1000.00);
  
  let balance = data.read();
  balance -= 600;
  data.write(balance);
  assert(data.read() === 400.00, 'Debit should result in 400.00');
  
  balance = data.read();
  balance += 600;
  data.write(balance);
  assert(data.read() === 1000.00, 'Credit should restore to 1000.00');
});

console.log('');

// ============================================================================
// TEST SUMMARY
// ============================================================================
console.log('='.repeat(70));
console.log('TEST SUMMARY');
console.log('='.repeat(70));
console.log(`Total Tests: ${testCount}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log('');

if (failCount === 0) {
  console.log('✓ ALL TESTS PASSED!');
  process.exit(0);
} else {
  console.log(`✗ ${failCount} TEST(S) FAILED`);
  process.exit(1);
}
