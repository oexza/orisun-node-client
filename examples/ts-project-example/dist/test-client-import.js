// Test importing the Orisun Event Store client
import { EventStoreClient } from '@orisun/eventstore-client';
try {
    console.log('✅ Successfully imported EventStoreClient');
    console.log('EventStoreClient type:', typeof EventStoreClient);
    // Test creating a client instance (without connecting)
    const client = new EventStoreClient({
        host: 'localhost',
        port: 5005,
        username: 'test',
        password: 'test'
    });
    console.log('✅ Successfully created EventStoreClient instance');
    console.log('Client type:', client);
}
catch (error) {
    console.error('❌ Failed to import or use EventStoreClient:', error.message);
    process.exit(1);
}
console.log('🎉 All tests passed! The client imports and instantiates correctly.');
