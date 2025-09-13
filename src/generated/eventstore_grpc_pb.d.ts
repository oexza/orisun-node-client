// package: eventstore
// file: eventstore.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as eventstore_pb from "./eventstore_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface IEventStoreService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    saveEvents: IEventStoreService_ISaveEvents;
    getEvents: IEventStoreService_IGetEvents;
    catchUpSubscribeToEvents: IEventStoreService_ICatchUpSubscribeToEvents;
    catchUpSubscribeToStream: IEventStoreService_ICatchUpSubscribeToStream;
}

interface IEventStoreService_ISaveEvents extends grpc.MethodDefinition<eventstore_pb.SaveEventsRequest, eventstore_pb.WriteResult> {
    path: "/eventstore.EventStore/SaveEvents";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<eventstore_pb.SaveEventsRequest>;
    requestDeserialize: grpc.deserialize<eventstore_pb.SaveEventsRequest>;
    responseSerialize: grpc.serialize<eventstore_pb.WriteResult>;
    responseDeserialize: grpc.deserialize<eventstore_pb.WriteResult>;
}
interface IEventStoreService_IGetEvents extends grpc.MethodDefinition<eventstore_pb.GetEventsRequest, eventstore_pb.GetEventsResponse> {
    path: "/eventstore.EventStore/GetEvents";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<eventstore_pb.GetEventsRequest>;
    requestDeserialize: grpc.deserialize<eventstore_pb.GetEventsRequest>;
    responseSerialize: grpc.serialize<eventstore_pb.GetEventsResponse>;
    responseDeserialize: grpc.deserialize<eventstore_pb.GetEventsResponse>;
}
interface IEventStoreService_ICatchUpSubscribeToEvents extends grpc.MethodDefinition<eventstore_pb.CatchUpSubscribeToEventStoreRequest, eventstore_pb.Event> {
    path: "/eventstore.EventStore/CatchUpSubscribeToEvents";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<eventstore_pb.CatchUpSubscribeToEventStoreRequest>;
    requestDeserialize: grpc.deserialize<eventstore_pb.CatchUpSubscribeToEventStoreRequest>;
    responseSerialize: grpc.serialize<eventstore_pb.Event>;
    responseDeserialize: grpc.deserialize<eventstore_pb.Event>;
}
interface IEventStoreService_ICatchUpSubscribeToStream extends grpc.MethodDefinition<eventstore_pb.CatchUpSubscribeToStreamRequest, eventstore_pb.Event> {
    path: "/eventstore.EventStore/CatchUpSubscribeToStream";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<eventstore_pb.CatchUpSubscribeToStreamRequest>;
    requestDeserialize: grpc.deserialize<eventstore_pb.CatchUpSubscribeToStreamRequest>;
    responseSerialize: grpc.serialize<eventstore_pb.Event>;
    responseDeserialize: grpc.deserialize<eventstore_pb.Event>;
}

export const EventStoreService: IEventStoreService;

export interface IEventStoreServer extends grpc.UntypedServiceImplementation {
    saveEvents: grpc.handleUnaryCall<eventstore_pb.SaveEventsRequest, eventstore_pb.WriteResult>;
    getEvents: grpc.handleUnaryCall<eventstore_pb.GetEventsRequest, eventstore_pb.GetEventsResponse>;
    catchUpSubscribeToEvents: grpc.handleServerStreamingCall<eventstore_pb.CatchUpSubscribeToEventStoreRequest, eventstore_pb.Event>;
    catchUpSubscribeToStream: grpc.handleServerStreamingCall<eventstore_pb.CatchUpSubscribeToStreamRequest, eventstore_pb.Event>;
}

export interface IEventStoreClient {
    saveEvents(request: eventstore_pb.SaveEventsRequest, callback: (error: grpc.ServiceError | null, response: eventstore_pb.WriteResult) => void): grpc.ClientUnaryCall;
    saveEvents(request: eventstore_pb.SaveEventsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: eventstore_pb.WriteResult) => void): grpc.ClientUnaryCall;
    saveEvents(request: eventstore_pb.SaveEventsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: eventstore_pb.WriteResult) => void): grpc.ClientUnaryCall;
    getEvents(request: eventstore_pb.GetEventsRequest, callback: (error: grpc.ServiceError | null, response: eventstore_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
    getEvents(request: eventstore_pb.GetEventsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: eventstore_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
    getEvents(request: eventstore_pb.GetEventsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: eventstore_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
    catchUpSubscribeToEvents(request: eventstore_pb.CatchUpSubscribeToEventStoreRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eventstore_pb.Event>;
    catchUpSubscribeToEvents(request: eventstore_pb.CatchUpSubscribeToEventStoreRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eventstore_pb.Event>;
    catchUpSubscribeToStream(request: eventstore_pb.CatchUpSubscribeToStreamRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eventstore_pb.Event>;
    catchUpSubscribeToStream(request: eventstore_pb.CatchUpSubscribeToStreamRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eventstore_pb.Event>;
}

export class EventStoreClient extends grpc.Client implements IEventStoreClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public saveEvents(request: eventstore_pb.SaveEventsRequest, callback: (error: grpc.ServiceError | null, response: eventstore_pb.WriteResult) => void): grpc.ClientUnaryCall;
    public saveEvents(request: eventstore_pb.SaveEventsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: eventstore_pb.WriteResult) => void): grpc.ClientUnaryCall;
    public saveEvents(request: eventstore_pb.SaveEventsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: eventstore_pb.WriteResult) => void): grpc.ClientUnaryCall;
    public getEvents(request: eventstore_pb.GetEventsRequest, callback: (error: grpc.ServiceError | null, response: eventstore_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
    public getEvents(request: eventstore_pb.GetEventsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: eventstore_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
    public getEvents(request: eventstore_pb.GetEventsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: eventstore_pb.GetEventsResponse) => void): grpc.ClientUnaryCall;
    public catchUpSubscribeToEvents(request: eventstore_pb.CatchUpSubscribeToEventStoreRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eventstore_pb.Event>;
    public catchUpSubscribeToEvents(request: eventstore_pb.CatchUpSubscribeToEventStoreRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eventstore_pb.Event>;
    public catchUpSubscribeToStream(request: eventstore_pb.CatchUpSubscribeToStreamRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eventstore_pb.Event>;
    public catchUpSubscribeToStream(request: eventstore_pb.CatchUpSubscribeToStreamRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<eventstore_pb.Event>;
}
