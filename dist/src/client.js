"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStoreClient = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const util_1 = require("util");
const path = __importStar(require("path"));
/**
 * Validates client options and throws errors for invalid configurations
 */
function validateClientOptions(options) {
    // Validate connection options
    if (!options.target && !options.host) {
        throw new Error('Either host or target must be provided');
    }
    if (options.host && !options.target && !options.port) {
        throw new Error('Port must be provided when using host without target');
    }
    if (options.port && (options.port < 1 || options.port > 65535)) {
        throw new Error('Port must be between 1 and 65535');
    }
    // Validate load balancing policy
    if (options.loadBalancingPolicy &&
        !['round_robin', 'pick_first'].includes(options.loadBalancingPolicy)) {
        throw new Error('loadBalancingPolicy must be either "round_robin" or "pick_first"');
    }
}
/**
 * Default no-op logger that doesn't log anything
 */
class NoopLogger {
    debug(message, ...args) { }
    info(message, ...args) { }
    warn(message, ...args) { }
    error(message, ...args) { }
}
/**
 * orisun client operations
 */
class EventStoreClient {
    constructor(options = {}) {
        this.disposed = false;
        // Validate options
        validateClientOptions(options);
        const { host = 'localhost', port = 5005, target, credentials = grpc.credentials.createInsecure(), username = 'admin', password = 'changeit', loadBalancingPolicy = 'round_robin', logger, enableLogging = false } = options;
        // Initialize logger
        this.logger = enableLogging ? (logger || console) : new NoopLogger();
        // Load the protobuf definition
        const PROTO_PATH = path.join(__dirname, '../eventstore.proto');
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });
        const eventStoreProto = grpc.loadPackageDefinition(packageDefinition);
        // Create the client with keep-alive options and load balancing
        const channelOptions = {
            // 'grpc.keepalive_time_ms': keepaliveTimeMs,
            // 'grpc.keepalive_timeout_ms': keepaliveTimeoutMs,
            // 'grpc.keepalive_permit_without_calls': keepalivePermitWithoutCalls ? 1 : 0,
            // 'grpc.http2.min_time_between_pings_ms': keepaliveTimeMs,
            // 'grpc.http2.max_pings_without_data': 0,
            'grpc.lb_policy_name': loadBalancingPolicy,
            'grpc.service_config': JSON.stringify({
                loadBalancingConfig: [{ [loadBalancingPolicy]: {} }]
            })
        };
        // Determine the target string
        let targetString;
        if (target) {
            // Use the provided target string directly
            targetString = target;
        }
        else if (host.includes(',')) {
            // Handle comma-separated list of hosts for manual load balancing
            const hosts = host.split(',').map(h => h.trim());
            targetString = hosts.map(h => `${h}:${port}`).join(',');
        }
        else {
            // Standard host:port format
            targetString = `${host}:${port}`;
        }
        this.client = new eventStoreProto.eventstore.EventStore(targetString, credentials, channelOptions);
        // Set up authentication metadata
        this.credentials = new grpc.Metadata();
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
        this.credentials.add('authorization', `Basic ${auth}`);
        // Set up logger
        this.logger = options.logger || {
            debug: () => { },
            info: () => { },
            warn: () => { },
            error: () => { }
        };
        if (options.enableLogging) {
            this.logger.info('EventStoreClient initialized');
        }
        // Perform mandatory health check immediately after connection
        // Use setImmediate to perform health check after constructor completes
        setImmediate(async () => {
            // Skip health check if client has been disposed
            if (this.disposed) {
                return;
            }
            try {
                const isHealthy = await this.healthCheck();
                if (!isHealthy) {
                    const error = new Error('EventStore connection health check failed');
                    this.logger.error('Initial health check failed:', error);
                    throw error;
                }
                this.logger.info('Initial health check passed - connection established');
            }
            catch (error) {
                this.logger.error('Initial health check error:', error);
                throw error;
            }
        });
    }
    /**
     * Save events to a stream
     * @throws {Error} If the request is invalid or the operation fails
     * @returns {Promise<WriteResult>} The write result containing the log position
     */
    async saveEvents(request) {
        // Check if client is disposed
        if (this.disposed) {
            throw new Error('Client has been disposed');
        }
        if (!request) {
            throw new Error('SaveEventsRequest cannot be null or undefined');
        }
        if (!request.boundary) {
            throw new Error('Boundary is required');
        }
        if (!request.stream || !request.stream.name) {
            throw new Error('Stream name is required');
        }
        if (!request.events || !Array.isArray(request.events) || request.events.length === 0) {
            throw new Error('At least one event is required');
        }
        // Validate each event
        request.events.forEach((event, index) => {
            if (!event.eventId) {
                throw new Error(`Event at index ${index} is missing eventId`);
            }
            if (!event.eventType) {
                throw new Error(`Event at index ${index} is missing eventType`);
            }
            if (event.data === undefined || event.data === null) {
                throw new Error(`Event at index ${index} is missing data`);
            }
        });
        this.logger.debug(`Saving ${request.events.length} events to stream '${request.stream.name}'`);
        const saveEventsAsync = (0, util_1.promisify)(this.client.saveEvents.bind(this.client));
        // Try using plain object approach instead of generated protobuf classes
        const grpcRequest = {
            boundary: request.boundary,
            stream: {
                name: request.stream.name,
                expected_version: request.stream.expectedVersion,
                ...(request.stream.subsetQuery && { subsetQuery: request.stream.subsetQuery })
            },
            events: request.events.map(event => ({
                event_id: event.eventId,
                event_type: event.eventType,
                data: JSON.stringify(event.data),
                metadata: JSON.stringify(event.metadata || {})
            }))
        };
        try {
            const response = await saveEventsAsync(grpcRequest, this.credentials || new grpc.Metadata());
            this.logger.info(`Successfully saved events to stream '${request.stream.name}'`);
            // Transform the gRPC response to match our interface
            return {
                logPosition: {
                    commitPosition: Number(response.log_position?.commit_position || '0'),
                    preparePosition: Number(response.log_position?.prepare_position || '0')
                },
                newStreamVersion: Number(response.new_stream_version || '0')
            };
        }
        catch (error) {
            this.logger.error(`Failed to save events to stream '${request.stream.name}':`, error);
            // Enhance error with context
            const enhancedError = new Error(`Failed to save events to stream '${request.stream.name}': ${error.message}`);
            enhancedError.stack = error.stack;
            enhancedError.originalError = error;
            enhancedError.streamName = request.stream.name;
            enhancedError.eventCount = request.events.length;
            throw enhancedError;
        }
    }
    /**
     * Get events from a stream
     * @throws {Error} If the request is invalid or the operation fails
     */
    async getEvents(request) {
        // Check if client is disposed
        if (this.disposed) {
            throw new Error('Client has been disposed');
        }
        if (!request) {
            throw new Error('GetEventsRequest cannot be null or undefined');
        }
        if (!request.boundary) {
            throw new Error('Boundary is required');
        }
        // If stream is specified, validate stream name
        if (request.stream && !request.stream.name) {
            throw new Error('Stream name is required when stream is specified');
        }
        // Validate count if provided
        if (request.count !== undefined && request.count <= 0) {
            throw new Error('Count must be greater than 0');
        }
        const streamInfo = request.stream ? `stream '${request.stream.name}'` : 'all streams';
        this.logger.debug(`Getting events from ${streamInfo}`);
        const getEventsAsync = (0, util_1.promisify)(this.client.getEvents.bind(this.client));
        const countValue = request.count || 100;
        this.logger.debug(`Setting count to: ${countValue}`);
        // Use plain object instead of protobuf classes
        const grpcRequest = {
            boundary: request.boundary,
            count: countValue,
            direction: request.direction === 'DESC' ? 1 : 0 // DESC = 1, ASC = 0
        };
        if (request.query) {
            grpcRequest.query = request.query;
        }
        if (request.fromPosition) {
            grpcRequest.fromPosition = {
                commitPosition: request.fromPosition.commitPosition,
                preparePosition: request.fromPosition.preparePosition
            };
        }
        if (request.stream) {
            grpcRequest.stream = {
                name: request.stream.name,
                fromVersion: request.stream.fromVersion || 0
            };
        }
        this.logger.debug(`Getting events from ${streamInfo} with count: ${countValue}`);
        try {
            const response = await getEventsAsync(grpcRequest, this.credentials || new grpc.Metadata());
            if (!response || !response.events || response.events.length === 0) {
                this.logger.warn(`No events returned from ${streamInfo}`);
                return [];
            }
            const events = response.events.map((event) => {
                try {
                    return {
                        eventId: event.event_id,
                        eventType: event.event_type,
                        data: JSON.parse(event.data),
                        metadata: JSON.parse(event.metadata || '{}'),
                        streamId: event.stream_id,
                        version: Number(event.version || '0'),
                        position: {
                            commitPosition: Number(event.position?.commit_position || '0'),
                            preparePosition: Number(event.position?.prepare_position || '0')
                        },
                        dateCreated: event.date_created ? new Date(Number(event.date_created.seconds) * 1000 + Math.floor(event.date_created.nanos / 1000000)).toISOString() : new Date().toISOString()
                    };
                }
                catch (parseError) {
                    this.logger.error(`Failed to parse event data or metadata: ${parseError.message}`);
                    // Return event with unparsed data to avoid losing the event
                    return {
                        eventId: event.event_id,
                        eventType: event.event_type,
                        data: event.data, // Raw string
                        metadata: event.metadata || '{}', // Raw string
                        streamId: event.stream_id,
                        version: Number(event.version || '0'),
                        position: {
                            commitPosition: Number(event.position?.commit_position || '0'),
                            preparePosition: Number(event.position?.prepare_position || '0')
                        },
                        dateCreated: event.date_created ? new Date(Number(event.date_created.seconds) * 1000 + Math.floor(event.date_created.nanos / 1000000)).toISOString() : new Date().toISOString()
                    };
                }
            });
            this.logger.debug(`Successfully retrieved ${events.length} events from ${streamInfo}`);
            return events;
        }
        catch (error) {
            this.logger.error(`Failed to get events from ${streamInfo}:`, error);
            // Enhance error with context
            const enhancedError = new Error(`Failed to get events from ${streamInfo}: ${error.message}`);
            enhancedError.stack = error.stack;
            enhancedError.originalError = error;
            enhancedError.streamName = request.stream?.name;
            enhancedError.boundary = request.boundary;
            throw enhancedError;
        }
    }
    /**
     * Subscribe to events using async iteration (for await...of)
     * @param request The subscription request
     * @param onEvent Event handler function
     * @param onError Optional error handler function
     * @returns gRPC stream that can be cancelled
     */
    subscribeToEvents(request, onEvent, onError) {
        // Check if client is disposed
        if (this.disposed) {
            throw new Error('Client has been disposed');
        }
        if (!request) {
            throw new Error('SubscribeRequest cannot be null or undefined');
        }
        if (!request.boundary) {
            throw new Error('Boundary is required');
        }
        if (!request.subscriberName) {
            throw new Error('Subscriber name is required');
        }
        if (!onEvent || typeof onEvent !== 'function') {
            throw new Error('Event handler function is required');
        }
        const streamInfo = request.stream ? `stream '${request.stream}'` : 'all streams';
        this.logger.debug(`Subscribing to ${streamInfo} with subscriber '${request.subscriberName}' (async)`);
        let stream;
        try {
            if (request.stream) {
                // Subscribe to a specific stream - use plain object
                const grpcRequest = {
                    subscriber_name: request.subscriberName,
                    boundary: request.boundary,
                    stream: request.stream,
                    afterVersion: request.afterVersion || 0
                };
                if (request.query) {
                    grpcRequest.query = request.query;
                }
                stream = this.client.catchUpSubscribeToStream(grpcRequest, this.credentials || new grpc.Metadata());
            }
            else {
                // Subscribe to all events - use plain object
                const grpcRequest = {
                    subscriber_name: request.subscriberName,
                    boundary: request.boundary,
                };
                if (request.afterPosition) {
                    grpcRequest.afterPosition = {
                        commit_position: request.afterPosition.commitPosition,
                        prepare_position: request.afterPosition.preparePosition
                    };
                }
                if (request.query) {
                    grpcRequest.query = request.query;
                }
                stream = this.client.catchUpSubscribeToEvents(grpcRequest, this.credentials || new grpc.Metadata());
            }
        }
        catch (error) {
            this.logger.error(`Failed to create subscription to ${streamInfo}:`, error);
            // Enhance error with context
            const enhancedError = new Error(`Failed to create subscription to ${streamInfo}: ${error.message}`);
            enhancedError.stack = error.stack;
            enhancedError.originalError = error;
            enhancedError.streamName = request.stream;
            enhancedError.subscriberName = request.subscriberName;
            throw enhancedError;
        }
        this.logger.debug(`Successfully subscribed to ${streamInfo} (async)`);
        // Start async iteration in background
        (async () => {
            try {
                // Use for await...of for cleaner async iteration
                for await (const event of stream) {
                    try {
                        const parsedEvent = {
                            eventId: event.event_id,
                            eventType: event.event_type,
                            data: JSON.parse(event.data),
                            metadata: JSON.parse(event.metadata || '{}'),
                            streamId: event.stream_id,
                            version: Number(event.version || '0'),
                            position: {
                                commitPosition: Number(event.position?.commit_position || '0'),
                                preparePosition: Number(event.position?.prepare_position || '0')
                            },
                            dateCreated: event.date_created ? new Date(Number(event.date_created.seconds) * 1000 + Math.floor(event.date_created.nanos / 1000000)).toISOString() : new Date().toISOString()
                        };
                        // Events are processed sequentially with await
                        await onEvent(parsedEvent);
                    }
                    catch (parseError) {
                        this.logger.error(`Failed to parse event data or metadata: ${parseError.message}`);
                        // Call error handler with enhanced error
                        const enhancedError = new Error(`Failed to parse event: ${parseError.message}`);
                        enhancedError.stack = parseError.stack;
                        enhancedError.originalError = parseError;
                        enhancedError.eventId = event.eventId;
                        enhancedError.eventType = event.eventType;
                        if (onError) {
                            onError(enhancedError);
                        }
                        else {
                            this.logger.error('Subscription parse error:', enhancedError);
                        }
                    }
                }
                this.logger.debug(`Subscription to ${streamInfo} ended (async)`);
            }
            catch (error) {
                this.logger.error(`Subscription error for ${streamInfo}:`, error);
                // Enhance error with context
                const enhancedError = new Error(`Subscription error for ${streamInfo}: ${error.message}`);
                enhancedError.stack = error.stack;
                enhancedError.originalError = error;
                enhancedError.streamName = request.stream;
                enhancedError.subscriberName = request.subscriberName;
                if (onError) {
                    onError(enhancedError);
                }
                else {
                    this.logger.error('Unhandled subscription error:', enhancedError);
                }
            }
        })();
        return stream;
    }
    /**
     * Close the client connection and clean up resources
     */
    close() {
        if (this.disposed) {
            this.logger.debug('EventStoreClient already disposed');
            return;
        }
        this.logger.debug('Closing EventStoreClient connection');
        try {
            // No rate limiter or circuit breaker to clean up
            // In newer versions of gRPC, we need to close the channel
            if (this.client && typeof this.client.close === 'function') {
                this.client.close();
            }
            else if (this.client && this.client.channel) {
                // Try to close the underlying channel
                const channel = this.client.channel;
                if (typeof channel.close === 'function') {
                    channel.close();
                }
            }
            this.disposed = true;
            this.logger.debug('EventStoreClient connection closed successfully');
        }
        catch (error) {
            this.logger.error('Error closing EventStoreClient connection:', error);
            throw new Error(`Failed to close EventStoreClient: ${error.message}`);
        }
    }
    /**
     * Check if the client is connected to the server
     * @returns Promise<boolean> True if connected, false otherwise
     */
    async healthCheck() {
        // Check if client is disposed
        if (this.disposed) {
            throw new Error('Client has been disposed');
        }
        this.logger.debug('Performing health check');
        try {
            // Try to make a simple call to test connectivity
            await this.getEvents({
                boundary: 'orisun_admin',
                stream: { name: 'health-check' }
            });
            this.logger.debug('Health check successful');
            return true;
        }
        catch (error) {
            this.logger.warn('Health check failed:', error);
            return false;
        }
    }
}
exports.EventStoreClient = EventStoreClient;
//# sourceMappingURL=client.js.map