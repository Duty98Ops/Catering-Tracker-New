# Security Specification & Invariants

## 1. Data Invariants
- Each transaction must have a valid non-empty `item`, non-negative numeric `amount`, non-empty `supplier`, valid `category`, and valid `status`.
- String fields are bounded with `.size()` constraints to prevent denial-of-wallet resource attacks.
- Transactions, trash, and suppliers collections are protected with validation helpers.

## 2. Payloads & Validation Rules
- Transaction amounts cannot be negative or NaN.
- Strings cannot exceed specified lengths (item <= 200, notes <= 500).
- Operations must validate schema integrity before writes.
