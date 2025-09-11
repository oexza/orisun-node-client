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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStoreClient = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
class EventStoreClient {
    constructor(options = {}) {
        const { host = 'localhost', port = 5005, credentials = grpc.credentials.createInsecure(), username = 'admin', password = 'changeit' } = options;
        // Load the protobuf definition
        const PROTO_PATH = path_1.default.join(__dirname, '../../../eventstore/eventstore.proto');
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });
        const eventStoreProto = grpc.loadPackageDefinition(packageDefinition);
        // Create the client
        this.client = new eventStoreProto.eventstore.EventStore(`${host}:${port}`, credentials);
        // Set up authentication metadata
        this.credentials = new grpc.Metadata();
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
        this.credentials.add('authorization', `Basic ${auth}`);
    }
    /**
     * Save events to a stream
     */
    async saveEvents(request) {
        const saveEventsAsync = (0, util_1.promisify)(this.client.saveEvents.bind(this.client));
        const grpcRequest = {
            boundary: request.boundary,
            stream: {
                name: request.stream.name,
                expected_version: request.stream.expectedVersion,
                subsetQuery: request.stream.subsetQuery
            },
            events: request.events.map(event => ({
                event_id: event.eventId,
                event_type: event.eventType,
                data: JSON.stringify(event.data),
                metadata: JSON.stringify(event.metadata || {})
            }))
        };
        await saveEventsAsync(grpcRequest, this.credentials);
    }
    /**
     * Get events from a stream
     */
    async getEvents(request) {
        const getEventsAsync = (0, util_1.promisify)(this.client.getEvents.bind(this.client));
        const grpcRequest = {
            query: request.query,
            from_position: request.fromPosition,
            count: request.count || 100,
            direction: request.direction === 'DESC' ? 1 : 0,
            boundary: request.boundary,
            stream: request.stream ? {
                name: request.stream.name,
                from_version: request.stream.fromVersion || 0
            } : undefined
        };
        const response = await getEventsAsync(grpcRequest, this.credentials);
        return response.events.map((event) => ({
            eventId: event.event_id,
            eventType: event.event_type,
            data: JSON.parse(event.data),
            metadata: JSON.parse(event.metadata || '{}'),
            streamId: event.stream_id,
            version: event.version,
            position: event.position,
            dateCreated: event.date_created
        }));
    }
    /**
     * Subscribe to events from a stream or all streams
     */
    subscribeToEvents(request, onEvent, onError) {
        let stream;
        if (request.stream) {
            // Subscribe to a specific stream
            const grpcRequest = {
                query: request.query,
                subscriber_name: request.subscriberName,
                boundary: request.boundary,
                stream: request.stream,
                after_version: request.afterVersion || 0
            };
            stream = this.client.catchUpSubscribeToStream(grpcRequest, this.credentials);
        }
        else {
            // Subscribe to all events
            const grpcRequest = {
                afterPosition: request.afterPosition,
                query: request.query,
                subscriber_name: request.subscriberName,
                boundary: request.boundary
            };
            stream = this.client.catchUpSubscribeToEvents(grpcRequest, this.credentials);
        }
        stream.on('data', (event) => {
            const parsedEvent = {
                eventId: event.event_id,
                eventType: event.event_type,
                data: JSON.parse(event.data),
                metadata: JSON.parse(event.metadata || '{}'),
                streamId: event.stream_id,
                version: event.version,
                position: event.position,
                dateCreated: event.date_created
            };
            onEvent(parsedEvent);
        });
        stream.on('error', (error) => {
            if (onError) {
                onError(error);
            }
            else {
                console.error('Subscription error:', error);
            }
        });
        return stream;
    }
    /**
     * Close the client connection
     */
    close() {
        this.client.close();
    }
    /**
     * Check if the client is connected
     */
    async healthCheck() {
        try {
            // Try to make a simple call to test connectivity
            await this.getEvents({
                boundary: 'test',
                stream: { name: 'health-check' },
                count: 1
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.EventStoreClient = EventStoreClient;
//# sourceMappingURL=client.js.map