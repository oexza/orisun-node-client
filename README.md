# Orisun Node.js Client

TypeScript/Node.js client library for Orisun gRPC services.

## Installation

```bash
npm install orisun-node-client
```

## Usage

```typescript
import { OrisunClient } from 'orisun-node-client';

const client = new OrisunClient({
  host: 'localhost',
  port: 50051
});

// Use the client...
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test
```

## License

MIT
