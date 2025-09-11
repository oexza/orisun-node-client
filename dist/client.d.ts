import * as grpc from '@grpc/grpc-js';
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
export interface EventStoreClientOptions {
    host?: string;
    port?: number;
    credentials?: grpc.ChannelCredentials;
    username?: string;
    password?: string;
}
export declare class EventStoreClient {
    private client;
    private credentials;
    constructor(options?: EventStoreClientOptions);
    /**
     * Save events to a stream
     */
    saveEvents(request: SaveEventsRequest): Promise<void>;
    /**
     * Get events from a stream
     */
    getEvents(request: GetEventsRequest): Promise<Event[]>;
    /**
     * Subscribe to events from a stream or all streams
     */
    subscribeToEvents(request: SubscribeRequest, onEvent: (event: Event) => void, onError?: (error: Error) => void): grpc.ClientReadableStream<any>;
    /**
     * Close the client connection
     */
    close(): void;
    /**
     * Check if the client is connected
     */
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=client.d.ts.map