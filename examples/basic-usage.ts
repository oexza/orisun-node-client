import { EventStoreClient, Event, WriteResult } from '../src';

async function basicUsageExample() {
  // Create a client instance with keep-alive options and load balancing
  const client = new EventStoreClient({
    // Option 1: Single host and port
    host: 'localhost',
    port: 5005,
    
    // Option 2: Multiple hosts for load balancing
    // host: 'eventstore1.example.com,eventstore2.example.com,eventstore3.example.com',
    // port: 5005,
    
    // Option 3: DNS-based load balancing
    // target: 'dns:///eventstore.example.com:5005',
    
    username: 'admin',
    password: 'changeit',
    
    // Load balancing policy
    loadBalancingPolicy: 'round_robin', // or 'pick_first'
    

    
    // Logging configuration
    enableLogging: true, // Enable logging (set to false in production if you want to minimize output)
    logger: console, // Use the default console logger (you can provide a custom logger)
    

    
    // Keep-alive options for maintaining long-lived connections
    keepaliveTimeMs: 30000, // Send keep-alive ping every 30 seconds
    keepaliveTimeoutMs: 10000, // Wait 10 seconds for ping response before considering connection dead
    keepalivePermitWithoutCalls: true // Allow keep-alive pings even when there are no active calls
  });

  try {
    console.log('Connecting to Orisun Event Store...');
    
    // Perform health check to verify connection
    console.log('Performing health check...');
    const isHealthy = await client.healthCheck();
    if (isHealthy) {
      console.log('Health check passed - connection is healthy');
    } else {
      console.log('Health check failed - but continuing with operations...');
    }

    // Define some sample events with proper UUIDs
    const events = [
      {
        eventId: crypto.randomUUID(),
        eventType: 'UserCreated',
        data: {
          userId: 'user-123',
          email: 'john.doe@example.com',
          name: 'John Doe'
        },
        metadata: {
          source: 'user-service',
          version: '1.0'
        }
      },
      {
        eventId: crypto.randomUUID(),
        eventType: 'UserEmailUpdated',
        data: {
          userId: 'user-123',
          oldEmail: 'john.doe@example.com',
          newEmail: 'john.doe@newdomain.com'
        },
        metadata: {
          source: 'user-service',
          version: '1.0'
        }
      }
    ];

    // Save events to a stream with unique name
    const streamName = `user-${Date.now()}`;
    console.log(`Saving events to stream: ${streamName}...`);
    const writeResult: WriteResult = await client.saveEvents({
      boundary: 'orisun_test_2',
      stream: {
        name: streamName,
        expectedVersion: -1 // Expecting stream to be new
      },
      events: events
    });
    console.log('Events saved successfully!');
    console.log('Log position:', writeResult.logPosition);
    console.log('New stream version:', writeResult.newStreamVersion);

    // Read events from the stream
    console.log(`Reading events from stream: ${streamName}...`);
    const retrievedEvents = await client.getEvents({
      boundary: 'orisun_test_2',
      stream: {
        name: streamName
      }
    });
    
    console.log(`Retrieved ${retrievedEvents.length} events:`);
    retrievedEvents.forEach((event, index) => {
      console.log(`Event ${index + 1}:`, {
        eventId: event.eventId,
        eventType: event.eventType,
        data: event.data,
        version: event.version,
        dateCreated: event.dateCreated
      });
    });

    // Subscribe to events (this will run indefinitely)
    console.log(`\nSubscribing to events from stream '${streamName}'...`);
    const subscription = client.subscribeToEvents(
      {
        stream: streamName,
        subscriberName: 'example-subscriber',
        boundary: 'orisun_test_2'
      },
      (event: Event) => {
        console.log('Received event:', {
          eventId: event.eventId,
          eventType: event.eventType,
          data: event.data,
          version: event.version
        });
      },
      (error: Error) => {
        console.error('Subscription error:', error);
      }
    );

    // Let the subscription run for a few seconds
    setTimeout(() => {
      console.log('Closing subscription...');
      subscription.cancel();
      client.close();
      console.log('Example completed!');
    }, 5000);

  } catch (error) {
    console.error('Error:', error);
    client.close();
  }
}

// Run the example
if (require.main === module) {
  basicUsageExample().catch(console.error);
}

export { basicUsageExample };