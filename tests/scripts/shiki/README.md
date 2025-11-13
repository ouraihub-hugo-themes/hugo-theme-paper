# Shiki Scripts Tests

This directory contains tests for the Shiki preprocessing scripts located in `scripts/shiki/`.

## Test Files

### cache.test.ts
Tests for the `ShikiCache` class that handles caching of Shiki-processed code blocks.

**Coverage:**
- Cache initialization
- Get and set operations
- Memory and disk persistence
- Cache expiration
- Cleanup operations
- Statistics tracking

**Test Count:** 12 tests

### markdown-scanner.test.ts
Tests for the `MarkdownScanner` class that scans Markdown files and extracts code blocks.

**Coverage:**
- File scanning with glob patterns
- Code block extraction
- Meta information parsing
- Line number tracking
- Modified file detection

**Test Count:** 13 tests

### processor.test.ts
Tests for the `ShikiProcessor` class that processes code blocks using Shiki.

**Coverage:**
- Code block processing
- Language support
- Theme configuration
- Transformer integration
- Parallel processing
- Error handling

**Test Count:** 13 tests

### fileName-transformer.test.ts
Tests for the `transformerFileName` Shiki transformer that adds file name labels.

**Coverage:**
- File name display
- Style variants (v1, v2)
- Dot indicator options
- CSS custom properties
- Meta parsing
- Edge cases

**Test Count:** 16 tests

## Running Tests

### Run all Shiki tests
```bash
pnpm test:run tests/scripts/shiki/
```

### Run specific test file
```bash
pnpm test:run tests/scripts/shiki/cache.test.ts
```

### Run with coverage
```bash
pnpm test:coverage tests/scripts/shiki/
```

### Run in watch mode
```bash
pnpm test tests/scripts/shiki/
```

## Test Statistics

- **Total Test Files:** 4
- **Total Tests:** 54
- **All tests passing:** ✅

## Test Organization

Tests are organized to mirror the structure of the source files:

```
scripts/shiki/
├── cache.ts                    → tests/scripts/shiki/cache.test.ts
├── markdown-scanner.ts         → tests/scripts/shiki/markdown-scanner.test.ts
├── processor.ts                → tests/scripts/shiki/processor.test.ts
├── fileName-transformer.ts     → tests/scripts/shiki/fileName-transformer.test.ts
└── types.ts                    (type definitions, no tests needed)
```

## Test Patterns

### Unit Tests
- Test individual functions and methods
- Mock external dependencies when needed
- Use temporary directories for file operations

### Integration Tests
- Test interaction between components
- Use real Shiki library for processing
- Verify actual HTML output

### Cleanup
All tests properly clean up after themselves:
- Remove temporary files and directories
- Clear caches
- No side effects between tests

## Dependencies

Tests use:
- **Vitest** - Test framework
- **Shiki** - Syntax highlighting library
- **Node.js fs/promises** - File system operations
- **glob** - File pattern matching

## Notes

1. **Temporary Files**: Tests create temporary directories (`.test-*`) that are automatically cleaned up
2. **Async Operations**: All file operations are async and properly awaited
3. **Error Handling**: Tests verify both success and error cases
4. **Performance**: Tests use short timeouts for cache expiration to speed up testing
5. **Isolation**: Each test is independent and doesn't affect others

## Future Improvements

- [ ] Add performance benchmarks
- [ ] Add tests for `build.ts` and `index.ts`
- [ ] Add integration tests with Hugo
- [ ] Add tests for error recovery scenarios
- [ ] Add tests for concurrent processing limits
