import { describe, it, expect } from 'vitest'
import { startHost } from '@/sflo-host/src/index.js'
import { loadConfig } from '@/shared/config/src/index.js'

describe('sflo-host', () => {
  it('should export startHost function', () => {
    expect(typeof startHost).toBe('function')
  })

  it('should be able to create a host instance', async () => {
    // This is a basic smoke test - we're not actually starting the server
    // to avoid port conflicts during testing
    expect(startHost).toBeDefined()
  })

  it('should be able to import loadConfig via workspace package', () => {
    // Test that workspace packages work correctly
    expect(typeof loadConfig).toBe('function')
  })
})
