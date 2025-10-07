import { EventStoreClient, Event } from '../src';

async function main() {
  // Create client
  const client = new EventStoreClient({
    host: 'localhost',
    port: 2113,
    enableLogging: true
  });

  try {
    console.log('🔗 Connecting to EventStore...');
    
    // Perform health check
    const isHealthy = await client.healthCheck();
    if (!isHealthy) {
      throw new Error('EventStore connection failed');
    }
    console.log('✅ Connected to EventStore successfully');

    // Example 1: Using the new async subscription method
    console.log('\n📡 Starting async subscription with for await...');
    
    const subscriptionPromise = client.subscribeToEvents(
      {
        subscriberName: 'async-example-subscriber',
        boundary: 'demo-tenant',
        stream: 'order-stream'
      },
      async (event: Event) => {
        console.log(`📨 Received event: ${event.eventType} (ID: ${event.eventId})`);
        console.log(`   Stream: ${event.streamId}, Version: ${event.version}`);
        console.log(`   Data:`, event.data);
        
        // Simulate some async processing
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`✅ Processed event: ${event.eventId}`);
      },
      (error: Error) => {
        console.error('❌ Subscription error:', error.message);
      }
    );

    // Let the subscription run for a few seconds
    setTimeout(() => {
      console.log('\n🛑 Stopping subscription...');
      // In a real scenario, you might want to implement a cancellation mechanism
    }, 5000);

    // Wait for subscription to complete (or timeout)
    await Promise.race([
      subscriptionPromise,
      new Promise(resolve => setTimeout(resolve, 6000))
    ]);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('\n🔌 Closing connection...');
    client.close();
    console.log('✅ Connection closed');
  }
}

// Example 2: Comparison between old and new subscription methods
async function comparisonExample() {
  const client = new EventStoreClient({
    host: 'localhost',
    port: 2113,
    enableLogging: false
  });

  console.log('\n🔄 Comparison: Old vs New Subscription Methods\n');

  // OLD WAY: Using callbacks with stream.on('data')
  console.log('📜 Old way (callback-based):');
  const oldSubscription = client.subscribeToEvents(
    {
      subscriberName: 'old-subscriber',
      boundary: 'demo-tenant',
      stream: 'order-stream'
    },
    async (event: Event) => {
      console.log(`  📨 Old: ${event.eventType}`);
      // Events may be processed concurrently here
    },
    (error: Error) => {
      console.error(`  ❌ Old error: ${error.message}`);
    }
  );

  // NEW WAY: Using for await...of
  console.log('✨ New way (async iteration):');
  try {
    await client.subscribeToEvents(
      {
        subscriberName: 'new-subscriber',
        boundary: 'demo-tenant',
        stream: 'order-stream'
      },
      async (event: Event) => {
        console.log(`  📨 New: ${event.eventType}`);
        // Events are guaranteed to be processed sequentially
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log(`  ✅ New: Processed ${event.eventType}`);
      },
      (error: Error) => {
        console.error(`  ❌ New error: ${error.message}`);
      }
    );
  } catch (error) {
    console.log(`  🏁 New subscription ended: ${(error as Error).message}`);
  }

  client.close();
}

// Run the examples
if (require.main === module) {
  main().catch(console.error);
  
  // Uncomment to run comparison example
  // setTimeout(() => comparisonExample().catch(console.error), 7000);
}

export { main, comparisonExample };