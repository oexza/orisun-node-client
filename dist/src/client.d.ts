import * as grpc from '@grpc/grpc-js';
import * as pb from './generated/eventstore_pb';
export interface Event {
    eventId: string;
    eventType: string;
    data: any;
    metadata?: Record<string, string>;
    streamId: string;
    version: number;
    position: Position;
    dateCreated: string;
}
export interface EventToSave {
    eventId: string;
    eventType: string;
    data: any;
    metadata?: Record<string, string>;
}
export interface Position {
    commitPosition: number;
    preparePosition: number;
}
export interface Tag {
    key: string;
    value: string;
}
export interface Criterion {
    tags: Tag[];
}
export interface Query {
    criteria: Criterion[];
}
export interface SaveEventsRequest {
    boundary: string;
    stream: {
        name: string;
        expectedVersion: number;
        subsetQuery?: Query;
    };
    events: EventToSave[];
}
export interface GetEventsRequest {
    query?: Query;
    fromPosition?: Position;
    count?: number;
    direction?: 'ASC' | 'DESC';
    boundary: string;
    stream?: {
        name: string;
        fromVersion?: number;
    };
}
export interface SubscribeRequest {
    afterPosition?: Position;
    query?: Query;
    subscriberName: string;
    boundary: string;
    stream?: string;
    afterVersion?: number;
}
export interface WriteResult {
    logPosition: Position;
    newStreamVersion: number;
}
export type PbEvent = pb.Event;
export type PbEventToSave = pb.EventToSave;
export type PbPosition = pb.Position;
export type PbSaveEventsRequest = pb.SaveEventsRequest;
export type PbGetEventsRequest = pb.GetEventsRequest;
export type PbWriteResult = pb.WriteResult;
export type PbSaveStreamQuery = pb.SaveStreamQuery;
export type PbCatchUpSubscribeToStreamRequest = pb.CatchUpSubscribeToStreamRequest;
export type PbCatchUpSubscribeToEventStoreRequest = pb.CatchUpSubscribeToEventStoreRequest;
export type PbGetEventsResponse = pb.GetEventsResponse;
/**
 * Logger interface for client logging
 */
export interface Logger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}
export interface EventStoreClientOptions {
    /**
     * Server hostname or DNS name. Can be a comma-separated list of hosts for load balancing.
     * If using DNS-based load balancing, provide a single DNS name that resolves to multiple IPs.
     */
    host?: string;
    /**
     * Server port. Required when using a single host or comma-separated hosts.
     * Not required when using a target string.
     */
    port?: number;
    /**
     * Alternative to host:port. A fully qualified gRPC target string in the format:
     * dns:[//authority/]host[:port] or ipv4:host:port or ipv6:[host]:port
     * Examples: "dns:///eventstore.example.com:5005", "ipv4:10.0.0.10:5005"
     * When provided, this takes precedence over host and port.
     */
    target?: string;
    /**
     * gRPC credentials for secure connections
     */
    credentials?: grpc.ChannelCredentials;
    /**
     * Authentication username
     */
    username?: string;
    /**
     * Authentication password
     */
    password?: string;
    /**
     * Time in milliseconds between keep-alive pings
     */
    keepaliveTimeMs?: number;
    /**
     * Time in milliseconds to wait for ping response
     */
    keepaliveTimeoutMs?: number;
    /**
     * Allow keep-alive pings when there are no active calls
     */
    keepalivePermitWithoutCalls?: boolean;
    /**
     * Load balancing policy to use. Options: 'round_robin', 'pick_first'
     * - round_robin: Distributes requests across all available servers
     * - pick_first: Connects to the first available server
     */
    loadBalancingPolicy?: 'round_robin' | 'pick_first';
    /**
     * Custom logger implementation
     */
    logger?: Logger;
    /**
     * Enable or disable logging
     */
    enableLogging?: boolean;
}
/**
 * orisun client operations
 */
export declare class EventStoreClient {
    private client;
    private channel;
    private logger;
    private credentials?;
    private disposed;
    constructor(options?: EventStoreClientOptions);
    /**
     * Save events to a stream
     * @throws {Error} If the request is invalid or the operation fails
     * @returns {Promise<WriteResult>} The write result containing the log position
     */
    saveEvents(request: SaveEventsRequest): Promise<WriteResult>;
    saveEvents(streamName: string, events: Event[], expectedVersion?: number): Promise<WriteResult>;
    /**
     * Get events from a stream
     * @throws {Error} If the request is invalid or the operation fails
     */
    getEvents(request: GetEventsRequest): Promise<Event[]>;
    /**
     * Subscribe to events from a stream or all streams
     * @throws {Error} If the request is invalid
     */
    subscribeToEvents(request: SubscribeRequest, onEvent: (event: Event) => void, onError?: (error: Error) => void): grpc.ClientReadableStream<any>;
    /**
     * Close the client connection and clean up resources
     */
    close(): void;
    /**
     * Check if the client is connected to the server
     * @returns Promise<boolean> True if connected, false otherwise
     */
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=client.d.ts.map