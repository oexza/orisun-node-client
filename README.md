# Orisun Event Store - Node.js Client

A Node.js client library for interacting with the Orisun Event Store, providing a simple and intuitive API for event sourcing operations.

## Features

- **Event Storage**: Save events with Command Context Consistency
- **Event Retrieval**: Read events by content criteria and position
- **Latest Context Reads**: Fetch the latest event per criterion from one consistency snapshot
- **Event Subscriptions**: Subscribe to real-time event streams
- **Multi-tenancy**: Support for boundary-based tenant isolation
- **TypeScript Support**: Full TypeScript definitions included
- **gRPC Communication**: High-performance gRPC protocol
- **Authentication**: Built-in support for basic authentication
- **Load Balancing**: Support for multiple hosts and DNS-based load balancing
- **Resilience**: Built-in connection management and error handling
- **Logging**: Configurable logging for debugging and monitoring

## Installation

### Install from GitHub

Add to your `package.json`:

```json
{
  "dependencies": {
    "@orisun/eventstore-client": "github:oexza/Orisun#main"
  }
}
```

Then run:

```bash
npm install
```

Or install directly:

```bash
npm install github:oexza/Orisun#main
```

The client will be installed from the `clients/node` directory in the repository (as specified in the package.json `repository.directory` field).

### From npm (Coming Soon)

We're planning to publish to npm as `@orisun/eventstore-client` soon.

## Importing the Client

### TypeScript / ES6 Modules

```typescript
import { EventStoreClient } from '@orisun/eventstore-client';

// Or import specific types
import { EventStoreClient, Event, EventToSave } from '@orisun/eventstore-client';
```

### CommonJS / Node.js

```javascript
const { EventStoreClient } = require('@orisun/eventstore-client');

// Or using destructuring for multiple imports
const { EventStoreClient, Event, EventToSave } = require('@orisun/eventstore-client');
```

### Default Import (Alternative)

```typescript
import EventStoreClient from '@orisun/eventstore-client';
```

## Quick Start

```typescript
import { EventStoreClient } from '@orisun/eventstore-client';

// Create a client
const client = new EventStoreClient({
  // Connection options (choose one approach)
  
  // Option 1: Single server
  host: 'localhost',
  port: 5005,
  
  // Option 2: Multiple hosts for load balancing
  // host: 'eventstore1.example.com,eventstore2.example.com,eventstore3.example.com',
  // port: 5005,
  
  // Option 3: DNS-based load balancing
  // target: 'dns:///eventstore.example.com:5005',
  
  // Authentication
  username: 'admin',
  password: 'changeit',
  
  // Load balancing configuration
  loadBalancingPolicy: 'round_robin', // or 'pick_first'
  

  
  // Logging configuration
  enableLogging: true, // Enable or disable logging
  logger: console, // Custom logger (must implement debug, info, warn, error methods)
});

const accountCriteria = {
  criteria: [
    { tags: [{ key: 'account_id', value: 'acct-1' }] }
  ]
};

// Save events with Command Context Consistency
const write = await client.saveEvents({
  boundary: 'accounts',
  query: {
    expectedPosition: { commitPosition: -1, preparePosition: -1 },
    subsetQuery: accountCriteria
  },
  events: [{
    eventId: 'acct-1-opened',
    eventType: 'AccountOpened',
    data: { account_id: 'acct-1', balance: 0 }
  }]
});

// Read events by criteria
const events = await client.getEvents({
  boundary: 'accounts',
  query: accountCriteria,
  count: 100,
  direction: 'ASC'
});

// Read the latest event per criterion for carried-state command decisions
const latest = await client.getLatestByCriteria({
  boundary: 'accounts',
  criteria: accountCriteria.criteria
});
const expectedPosition = latest.contextPosition;

// Subscribe to events
const subscription = client.subscribeToEvents(
  { subscriberName: 'account-projector', boundary: 'accounts' },
  (event) => console.log('Received:', event)
);
```

## API Reference

### EventStoreClient

#### Constructor

```typescript
new EventStoreClient(options?: EventStoreClientOptions)
```

**Options:**
- `host` (string): Server hostname or comma-separated list of hosts for load balancing (default: 'localhost')
- `port` (number): Server port (default: 5005)
- `target` (string): Alternative to host:port. A fully qualified gRPC target string (e.g., 'dns:///eventstore.example.com:5005')
- `credentials` (grpc.ChannelCredentials): gRPC credentials (default: insecure)
- `username` (string): Authentication username (default: 'admin')
- `password` (string): Authentication password (default: 'changeit')
- `loadBalancingPolicy` (string): Load balancing strategy - 'round_robin' or 'pick_first' (default: 'round_robin')

- `enableLogging` (boolean): Enable or disable logging (default: false)
- `logger` (object): Custom logger implementation
  - Must implement `debug`, `info`, `warn`, and `error` methods

#### Methods

##### saveEvents(request: SaveEventsRequest): Promise<WriteResult>

Save events with Command Context Consistency.

```typescript
const result = await client.saveEvents({
  boundary: 'orders',
  query: {
    expectedPosition: { commitPosition: 12, preparePosition: 8 },
    subsetQuery: {
      criteria: [
        { tags: [{ key: 'customer_id', value: 'c-1' }] }
      ]
    }
  },
  events: [
    {
      eventId: 'order-456-shipped',
      eventType: 'OrderShipped',
      data: { order_id: 'order-456', customer_id: 'c-1', tracking_number: 'TRK123' },
      metadata: { source: 'shipping-service' }
    }
  ]
});
```

##### getEvents(request: GetEventsRequest): Promise<Event[]>

Retrieve events by boundary, criteria, and position.

```typescript
// Get events for one account
const allEvents = await client.getEvents({
  boundary: 'accounts',
  query: {
    criteria: [
      { tags: [{ key: 'account_id', value: 'acct-1' }] }
    ]
  },
  count: 100,
  direction: 'ASC'
});

// Page forward from a position
const recentEvents = await client.getEvents({
  boundary: 'accounts',
  fromPosition: { commitPosition: 100, preparePosition: 42 },
  count: 100,
  direction: 'ASC'
});
```

##### getLatestByCriteria(request: GetLatestByCriteriaRequest): Promise<GetLatestByCriteriaResponse>

Retrieve the latest event matching each criterion from one server-side snapshot. Use `contextPosition` as the next `SaveEvents.query.expectedPosition` with the same combined criteria.

```typescript
const latest = await client.getLatestByCriteria({
  boundary: 'accounts',
  criteria: [
    { tags: [{ key: 'account_id', value: 'acct-1' }] },
    { tags: [{ key: 'account_id', value: 'acct-2' }] }
  ]
});

const acct1 = latest.results[0].event;
const expectedPosition = latest.contextPosition;
```

##### subscribeToEvents(request: SubscribeRequest, onEvent: (event: Event) => void, onError?: (error: Error) => void): grpc.ClientReadableStream

Subscribe to catch-up and live events.

```typescript
const subscription = client.subscribeToEvents(
  {
    subscriberName: 'account-projector',
    boundary: 'accounts'
  },
  (event) => {
    console.log('New event:', event.eventType, event.data);
  },
  (error) => {
    console.error('Subscription error:', error);
  }
);

// Subscribe to all events from a specific position
const allStreamsSubscription = client.subscribeToEvents(
  {
    subscriberName: 'account-projector',
    afterPosition: { commitPosition: 1000, preparePosition: 1000 },
    boundary: 'accounts'
  },
  (event) => {
    console.log('Event:', event);
  }
);

// Cancel subscription
subscription.cancel();
```

##### healthCheck(): Promise<boolean>

Check if the client can connect to the event store.

```typescript
const isHealthy = await client.healthCheck();
if (!isHealthy) {
  console.error('Event store is not accessible');
}
```

##### close(): void

Close the client connection.

```typescript
client.close();
```

### Types

```typescript
interface Event {
  eventId: string;
  eventType: string;
  data: any;
  metadata?: Record<string, any>;
  position: Position;
  dateCreated: string;
}

interface EventToSave {
  eventId: string;
  eventType: string;
  data: any;
  metadata?: Record<string, any>;
}

interface Position {
  commitPosition: number;
  preparePosition: number;
}

interface Tag {
  key: string;
  value: string;
}

interface Criterion {
  tags: Tag[];
}

interface Query {
  criteria: Criterion[];
}

interface SaveEventsRequest {
  boundary: string;
  query: {
    expectedPosition: Position;
    subsetQuery?: Query;
  };
  events: EventToSave[];
}

interface GetEventsRequest {
  boundary: string;
  query?: Query;
  fromPosition?: Position;
  count?: number;
  direction?: 'ASC' | 'DESC';
}

interface GetLatestByCriteriaRequest {
  boundary: string;
  criteria: Criterion[];
}

interface SubscribeRequest {
  subscriberName: string;
  boundary: string;
  afterPosition?: Position;
  query?: Query;
}
```

## Examples

### Carried-State Command

```typescript
import { EventStoreClient, Query } from '@orisun/eventstore-client';

class AccountLedger {
  private client: EventStoreClient;
  private boundary = 'accounts';

  constructor() {
    this.client = new EventStoreClient({
      host: 'localhost',
      port: 5005,
      username: 'admin',
      password: 'changeit'
    });
  }

  private accountQuery(accountId: string): Query {
    return {
      criteria: [
        { tags: [{ key: 'account_id', value: accountId }] }
      ]
    };
  }

  async open(accountId: string) {
    const query = this.accountQuery(accountId);
    await this.client.saveEvents({
      boundary: this.boundary,
      query: {
        expectedPosition: { commitPosition: -1, preparePosition: -1 },
        subsetQuery: query
      },
      events: [{
        eventId: `${accountId}-opened`,
        eventType: 'AccountOpened',
        data: { account_id: accountId, balance: 0 }
      }]
    });
  }

  async debit(accountId: string, amount: number) {
    const query = this.accountQuery(accountId);
    const latest = await this.client.getLatestByCriteria({
      boundary: this.boundary,
      criteria: query.criteria
    });

    const currentBalance = latest.results[0].event?.data.balance ?? 0;
    if (currentBalance < amount) {
      throw new Error('Insufficient funds');
    }

    await this.client.saveEvents({
      boundary: this.boundary,
      query: {
        expectedPosition: latest.contextPosition,
        subsetQuery: query
      },
      events: [{
        eventId: `${accountId}-debit-${Date.now()}`,
        eventType: 'MoneyDebited',
        data: {
          account_id: accountId,
          amount,
          balance: currentBalance - amount
        }
      }]
    });
  }
}
```

### Event Processing with Subscriptions

```typescript
import { EventStoreClient, Event } from '@orisun/eventstore-client';

class EventProcessor {
  private client: EventStoreClient;

  constructor() {
    this.client = new EventStoreClient({
      host: 'localhost',
      port: 5005,
      username: 'admin',
      password: 'changeit'
    });
  }

  startProcessing(boundary: string) {
    // Subscribe to all events in the boundary
    this.client.subscribeToEvents(
      { subscriberName: 'projector', boundary },
      this.handleEvent.bind(this),
      this.handleError.bind(this)
    );
  }

  private async handleEvent(event: Event) {
    console.log(`Processing event: ${event.eventType}`);
    
    switch (event.eventType) {
      case 'UserCreated':
        await this.sendWelcomeEmail(event.data);
        break;
      case 'OrderPlaced':
        await this.processPayment(event.data);
        break;
      default:
        console.log(`Unknown event type: ${event.eventType}`);
    }
  }

  private handleError(error: Error) {
    console.error('Event processing error:', error);
    // Implement error handling
  }

  private async sendWelcomeEmail(userData: any) {
    // Email sending logic
    console.log(`Sending welcome email to ${userData.email}`);
  }

  private async processPayment(orderData: any) {
    // Payment processing logic
    console.log(`Processing payment for order ${orderData.orderId}`);
  }
}
```

## Error Handling

The client throws standard JavaScript errors for various failure scenarios:

```typescript
try {
  await client.saveEvents({
    boundary: 'accounts',
    query: {
      expectedPosition: { commitPosition: 12, preparePosition: 12 },
      subsetQuery: {
        criteria: [
          { tags: [{ key: 'account_id', value: 'acct-1' }] }
        ]
      }
    },
    events: [{
      eventId: 'acct-1-debit',
      eventType: 'MoneyDebited',
      data: { account_id: 'acct-1', amount: 50, balance: 10 }
    }]
  });
} catch (error) {
  if (error.message.includes('AlreadyExists')) {
    console.error('Concurrency conflict - re-read the context and retry');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Development

### Building

```bash
npm run build
```

### Running Examples

```bash
npm run example
```

### Testing

```bash
npm test
```

### Generating Protocol Buffers

If you need to regenerate the protocol buffer definitions:

```bash
npm run generate-proto
```

## License

MIT
