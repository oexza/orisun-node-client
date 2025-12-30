import {EventStoreClient, Event, EventToSave, Position, WriteResult} from '../src';
import * as grpc from '@grpc/grpc-js';

// Mock gRPC and protobuf modules
const mockSaveEvents = jest.fn();
const mockGetEvents = jest.fn();
const mockCatchUpSubscribeToEvents = jest.fn();
const mockPing = jest.fn();

const mockEventStoreClient = {
    saveEvents: mockSaveEvents,
    getEvents: mockGetEvents,
    catchUpSubscribeToEvents: mockCatchUpSubscribeToEvents,
    ping: mockPing,
};

const mockClient = jest.fn().mockImplementation(() => mockEventStoreClient);

jest.mock('@grpc/grpc-js', () => ({
    credentials: {
        createInsecure: jest.fn(() => 'mock-credentials')
    },
    loadPackageDefinition: jest.fn(() => ({
        orisun: {
            EventStore: mockClient
        }
    })),
    Metadata: jest.fn().mockImplementation(() => {
        const metadata: { [key: string]: string[] } = {};
        return {
            add: jest.fn((key: string, value: string) => {
                if (!metadata[key]) {
                    metadata[key] = [];
                }
                metadata[key].push(value);
            }),
            get: jest.fn((key: string) => metadata[key] || [])
        };
    })
}));

jest.mock('@grpc/proto-loader', () => ({
    loadSync: jest.fn(() => 'mock-package-definition')
}));

// Setup mock implementations
beforeEach(() => {
    mockSaveEvents.mockImplementation((request, metadata, callback) => {
        callback(null, {
            log_position: {
                commit_position: '123',
                prepare_position: '123'
            },
            new_stream_version: '123'
        });
    });

    mockGetEvents.mockImplementation((request, metadata, callback) => {
        // Return a mock call object with an 'on' method
        const mockCall = {
            on: jest.fn((event, handler) => {
                if (event === 'metadata') {
                    // Call the handler with empty metadata
                    handler(new grpc.Metadata());
                }
            })
        };

        // For health check, return empty events array
        if (request.stream && request.stream.name === 'health-check') {
            callback(null, {events: []});
        } else {
            callback(null, {
                events: [
                    {
                        event_id: 'test-event-1',
                        event_type: 'TestEvent',
                        data: JSON.stringify({test: 'data'}),
                        metadata: JSON.stringify({source: 'test'}),
                        stream_id: 'test-stream',
                        position: {commit_position: '0', prepare_position: '0'},
                        date_created: {seconds: '1704067200', nanos: 0}
                    }
                ]
            });
        }
        return mockCall;
    });

    mockCatchUpSubscribeToEvents.mockReturnValue({
        on: jest.fn(),
        cancel: jest.fn()
    });

    mockCatchUpSubscribeToEvents.mockReturnValue({
        on: jest.fn(),
        cancel: jest.fn()
    });

    mockPing.mockImplementation((request, metadata, callback) => {
        // Return a mock call object with an 'on' method
        const mockCall = {
            on: jest.fn((event, handler) => {
                if (event === 'metadata') {
                    // Call the handler with empty metadata
                    handler(new grpc.Metadata());
                }
            })
        };
        callback(null, {});
        return mockCall;
    });
});

describe('EventStoreClient', () => {
    let client: EventStoreClient;

    beforeEach(() => {
        client = new EventStoreClient({
            host: 'localhost',
            port: 5005,
            username: 'test',
            password: 'test'
        });
    });

    afterEach(() => {
        client.close();
    });

    describe('constructor', () => {
        it('should create client with default options', () => {
            const defaultClient = new EventStoreClient({host: 'localhost', port: 5005});
            expect(defaultClient).toBeInstanceOf(EventStoreClient);
            defaultClient.close();
        });

        it('should create client with custom options', () => {
            expect(client).toBeInstanceOf(EventStoreClient);
        });

        it('should create client with keep-alive options', () => {
            const clientWithKeepalive = new EventStoreClient({
                host: 'localhost',
                port: 5005,
                username: 'test',
                password: 'test',
            });
            expect(clientWithKeepalive).toBeInstanceOf(EventStoreClient);
            clientWithKeepalive.close();
        });

        it('should create client with load balancing options', () => {
            const clientWithLoadBalancing = new EventStoreClient({
                host: 'localhost',
                port: 5005,
                username: 'test',
                password: 'test',
                loadBalancingPolicy: 'round_robin'
            });
            expect(clientWithLoadBalancing).toBeInstanceOf(EventStoreClient);
            clientWithLoadBalancing.close();
        });

        it('should create client with comma-separated hosts for load balancing', () => {
            const clientWithMultipleHosts = new EventStoreClient({
                host: 'host1.example.com,host2.example.com,host3.example.com',
                port: 5005,
                username: 'test',
                password: 'test'
            });
            expect(clientWithMultipleHosts).toBeInstanceOf(EventStoreClient);
            clientWithMultipleHosts.close();
        });

        it('should create client with target string for DNS-based load balancing', () => {
            const clientWithTarget = new EventStoreClient({
                target: 'dns:///eventstore.example.com:5005',
                username: 'test',
                password: 'test'
            });
            expect(clientWithTarget).toBeInstanceOf(EventStoreClient);
            clientWithTarget.close();
        });
    });

    var firstSaveResponse: WriteResult
    describe('saveEvents', () => {
        it('should save events successfully', async () => {
            const request = {
                query: {
                    expectedPosition: {
                        commitPosition: -1,
                        preparePosition: -1
                    },
                },
                events: [
                    {
                        eventId: 'test-event-1',
                        eventType: 'TestEvent',
                        data: {test: 'data'},
                        metadata: {source: 'test'}
                    }
                ],
                boundary: 'test-boundary'
            };

            firstSaveResponse = await client.saveEvents(request);
            expect(firstSaveResponse).toBeDefined();
            expect(firstSaveResponse.logPosition).toBeDefined();
            expect(firstSaveResponse.logPosition.commitPosition).toBe(123);
            expect(firstSaveResponse.logPosition.preparePosition).toBe(123);
        });

        it('should save events with subsetQuery successfully', async () => {
            const request = {
                query: {
                    expectedPosition: firstSaveResponse.logPosition,
                    subsetQuery: {
                        criteria: [
                            {
                                tags: [
                                    {key: 'category', value: 'test'}
                                ]
                            }
                        ]
                    }
                },
                events: [
                    {
                        eventId: 'test-event-1',
                        eventType: 'TestEvent',
                        data: {test: 'data'},
                        metadata: {source: 'test'}
                    }
                ],
                boundary: 'test-boundary'
            };

            const result = await client.saveEvents(request);
            expect(result).toBeDefined();
            expect(result.logPosition).toBeDefined();
            expect(result.logPosition.commitPosition).toBe(123);
            expect(result.logPosition.preparePosition).toBe(123);

            // Verify that the mock was called with the correct subsetQuery field
            expect(mockSaveEvents).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    query: expect.objectContaining({
                        subsetQuery: request.query.subsetQuery
                    })
                }),
                expect.any(Object),
                expect.any(Function)
            );
        });
    });

    describe('getEvents', () => {
        it('should retrieve events successfully', async () => {
            const request = {
                stream: {
                    name: 'test-stream'
                },
                boundary: 'test-boundary'
            };

            const events = await client.getEvents(request);

            expect(events).toHaveLength(1);
            expect(events[0]).toEqual({
                eventId: 'test-event-1',
                eventType: 'TestEvent',
                data: {test: 'data'},
                metadata: {source: 'test'},
                position: {
                    commitPosition: 0,
                    preparePosition: 0
                },
                dateCreated: '2024-01-01T00:00:00.000Z'
            });
        });

        it('should handle version range parameters', async () => {
            const request = {
                stream: {
                    name: 'test-stream',
                    fromVersion: 1
                },
                fromPosition: {commitPosition: 1, preparePosition: 1} as Position,
                count: 5,
                direction: 'ASC' as 'ASC',
                boundary: 'test-boundary'
            };

            const events = await client.getEvents(request);
            expect(events).toHaveLength(1);
        });
    });

    describe('subscribeToEvents', () => {
        it('should create subscription successfully', () => {
            const request = {
                subscriberName: 'test-subscriber',
                stream: 'test-stream',
                boundary: 'test-boundary'
            };

            const onEvent = jest.fn();
            const onError = jest.fn();

            const subscription = client.subscribeToEvents({
                subscriberName: 'test-subscriber',
                boundary: 'test-boundary'
            }, onEvent, onError);

            expect(subscription).toBeDefined();
            expect(typeof subscription).toBe('object');
            expect(subscription.cancel).toBeDefined();
            expect(typeof subscription.cancel).toBe('function');
        });

        it('should handle subscription without stream', () => {
            const request = {
                afterPosition: {commitPosition: 100, preparePosition: 100} as Position,
                boundary: 'test-boundary'
            };

            const onEvent = jest.fn();
            const subscription = client.subscribeToEvents({
                subscriberName: 'test-subscriber',
                afterPosition: {commitPosition: 100, preparePosition: 100} as Position,
                boundary: 'test-boundary'
            }, onEvent);

            expect(subscription).toBeDefined();
            expect(subscription.cancel).toBeDefined();
            expect(typeof subscription.cancel).toBe('function');
        });

        it('should allow cancelling subscription', () => {
            const mockStream = {
                on: jest.fn(),
                cancel: jest.fn()
            };

            mockCatchUpSubscribeToEvents.mockReturnValue(mockStream);

            const onEvent = jest.fn();
            const subscription = client.subscribeToEvents({
                subscriberName: 'test-subscriber',
                boundary: 'test-boundary'
            }, onEvent);

            expect(subscription.cancel).toBeDefined();

            // Call cancel
            subscription.cancel();

            // Verify that the stream's cancel method was called
            expect(mockStream.cancel).toHaveBeenCalled();
        });
    });

    describe('ping', () => {
        it('should ping successfully', async () => {
            await expect(client.ping()).resolves.not.toThrow();
            // Check that mock was called (the exact call signature depends on promisify implementation)
            expect(mockPing).toHaveBeenCalled();
        });

        it('should use basic auth for initial ping', async () => {
            await client.ping();

            // Check that the metadata contains authorization header
            const metadataCall = mockPing.mock.calls[mockPing.mock.calls.length - 1][1];
            expect(metadataCall.get).toBeDefined();
            expect(metadataCall.get('authorization')).toContain('Basic dGVzdDp0ZXN0'); // base64 of 'test:test'
        });

        it('should use cached token for subsequent pings', async () => {
            // First call to establish token - we need to manually set the cached token
            // since our mock doesn't properly simulate the response metadata extraction
            const clientInstance = client as any;
            clientInstance.cachedToken = 'cached-token-123';

            // Second call should use cached token
            mockPing.mockImplementationOnce((request, metadata, callback) => {
                // Check that metadata contains cached token
                expect(metadata.get('x-auth-token')).toContain('cached-token-123');

                // Return a mock call object with an 'on' method
                const mockCall = {
                    on: jest.fn((event, handler) => {
                        if (event === 'metadata') {
                            // Call the handler with empty metadata
                            handler(new grpc.Metadata());
                        }
                    })
                };

                callback(null, {});
                return mockCall;
            });

            await client.ping();
        });
    });

    describe('token caching', () => {
        it('should cache token from saveEvents response', async () => {
            // Mock saveEvents to return token in response metadata
            mockSaveEvents.mockImplementationOnce((request, metadata, callback) => {
                const responseMetadata = {
                    get: jest.fn((key: string) => {
                        if (key === 'x-auth-token') {
                            return ['save-events-token'];
                        }
                        return [];
                    })
                };

                // Mock call object with 'on' method
                const mockCall = {
                    on: jest.fn((event, handler) => {
                        if (event === 'metadata') {
                            // Call the handler with the response metadata
                            handler(responseMetadata);
                        }
                    })
                };

                callback(null, {
                    log_position: {
                        commit_position: '123',
                        prepare_position: '123'
                    }
                });

                return mockCall;
            });

            const request = {
                query: {
                    expectedPosition: {
                        commitPosition: -1,
                        preparePosition: -1
                    },
                },
                events: [
                    {
                        eventId: 'test-event-1',
                        eventType: 'TestEvent',
                        data: {test: 'data'},
                        metadata: {source: 'test'}
                    }
                ],
                boundary: 'test-boundary'
            };

            await client.saveEvents(request);

            // Verify next call uses cached token
            mockSaveEvents.mockImplementationOnce((request, metadata, callback) => {
                expect(metadata.get('x-auth-token')).toContain('save-events-token');
                callback(null, {
                    log_position: {
                        commit_position: '124',
                        prepare_position: '124'
                    }
                });
            });

            await client.saveEvents(request);
        });

        it('should cache token from getEvents response', async () => {
            // Mock getEvents to return token in response metadata
            mockGetEvents.mockImplementationOnce((request, metadata, callback) => {
                const responseMetadata = {
                    get: jest.fn((key: string) => {
                        if (key === 'x-auth-token') {
                            return ['get-events-token'];
                        }
                        return [];
                    })
                };

                // Mock call object with 'on' method
                const mockCall = {
                    on: jest.fn((event, handler) => {
                        if (event === 'metadata') {
                            // Call the handler with the response metadata
                            handler(responseMetadata);
                        }
                    })
                };

                callback(null, {
                    events: [
                        {
                            event_id: 'test-event-1',
                            event_type: 'TestEvent',
                            data: JSON.stringify({test: 'data'}),
                            metadata: JSON.stringify({source: 'test'}),
                            position: {commit_position: '0', prepare_position: '0'},
                            date_created: {seconds: '1704067200', nanos: 0}
                        }
                    ]
                });

                return mockCall;
            });

            const request = {
                boundary: 'test-boundary'
            };

            await client.getEvents(request);

            // Verify next call uses cached token
            mockGetEvents.mockImplementationOnce((request, metadata, callback) => {
                expect(metadata.get('x-auth-token')).toContain('get-events-token');
                callback(null, {events: []});
            });

            await client.getEvents(request);
        });

        it('should use cached token for subscriptions', async () => {
            // First, establish a cached token by calling saveEvents
            mockSaveEvents.mockImplementationOnce((request, metadata, callback) => {
                const responseMetadata = {
                    get: jest.fn((key: string) => {
                        if (key === 'x-auth-token') {
                            return ['subscription-token'];
                        }
                        return [];
                    })
                };

                // Mock call object with 'on' method
                const mockCall = {
                    on: jest.fn((event, handler) => {
                        if (event === 'metadata') {
                            // Call the handler with the response metadata
                            handler(responseMetadata);
                        }
                    })
                };

                callback(null, {
                    log_position: {
                        commit_position: '123',
                        prepare_position: '123'
                    }
                });

                return mockCall;
            });

            const saveRequest = {
                query: {
                    expectedPosition: {
                        commitPosition: -1,
                        preparePosition: -1
                    },
                },
                events: [
                    {
                        eventId: 'test-event-1',
                        eventType: 'TestEvent',
                        data: {test: 'data'},
                        metadata: {source: 'test'}
                    }
                ],
                boundary: 'test-boundary'
            };

            // Make the saveEvents call to establish the token
            await client.saveEvents(saveRequest);

            // Now test subscription with cached token
            mockCatchUpSubscribeToEvents.mockImplementationOnce((request, metadata) => {
                expect(metadata.get('x-auth-token')).toContain('subscription-token');
                return {
                    on: jest.fn(),
                    cancel: jest.fn()
                };
            });

            const onEvent = jest.fn();
            client.subscribeToEvents({
                subscriberName: 'test-subscriber',
                boundary: 'test-boundary'
            }, onEvent);
        });
    });

    describe('healthCheck', () => {
        it('should return true for successful connection', async () => {
            const isHealthy = await client.healthCheck();
            expect(isHealthy).toBe(true);
        });

        it('should use ping for health check', async () => {
            await client.healthCheck();
            expect(mockPing).toHaveBeenCalled();
        });
    });

    describe('close', () => {
        it('should close client connection', () => {
            expect(() => client.close()).not.toThrow();
        });
    });
});