// package: eventstore
// file: eventstore.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class Position extends jspb.Message { 
    getCommitPosition(): number;
    setCommitPosition(value: number): Position;
    getPreparePosition(): number;
    setPreparePosition(value: number): Position;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Position.AsObject;
    static toObject(includeInstance: boolean, msg: Position): Position.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Position, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Position;
    static deserializeBinaryFromReader(message: Position, reader: jspb.BinaryReader): Position;
}

export namespace Position {
    export type AsObject = {
        commitPosition: number,
        preparePosition: number,
    }
}

export class Tag extends jspb.Message { 
    getKey(): string;
    setKey(value: string): Tag;
    getValue(): string;
    setValue(value: string): Tag;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Tag.AsObject;
    static toObject(includeInstance: boolean, msg: Tag): Tag.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Tag, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Tag;
    static deserializeBinaryFromReader(message: Tag, reader: jspb.BinaryReader): Tag;
}

export namespace Tag {
    export type AsObject = {
        key: string,
        value: string,
    }
}

export class Criterion extends jspb.Message { 
    clearTagsList(): void;
    getTagsList(): Array<Tag>;
    setTagsList(value: Array<Tag>): Criterion;
    addTags(value?: Tag, index?: number): Tag;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Criterion.AsObject;
    static toObject(includeInstance: boolean, msg: Criterion): Criterion.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Criterion, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Criterion;
    static deserializeBinaryFromReader(message: Criterion, reader: jspb.BinaryReader): Criterion;
}

export namespace Criterion {
    export type AsObject = {
        tagsList: Array<Tag.AsObject>,
    }
}

export class Query extends jspb.Message { 
    clearCriteriaList(): void;
    getCriteriaList(): Array<Criterion>;
    setCriteriaList(value: Array<Criterion>): Query;
    addCriteria(value?: Criterion, index?: number): Criterion;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Query.AsObject;
    static toObject(includeInstance: boolean, msg: Query): Query.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Query, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Query;
    static deserializeBinaryFromReader(message: Query, reader: jspb.BinaryReader): Query;
}

export namespace Query {
    export type AsObject = {
        criteriaList: Array<Criterion.AsObject>,
    }
}

export class EventToSave extends jspb.Message { 
    getEventId(): string;
    setEventId(value: string): EventToSave;
    getEventType(): string;
    setEventType(value: string): EventToSave;
    getData(): string;
    setData(value: string): EventToSave;
    getMetadata(): string;
    setMetadata(value: string): EventToSave;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EventToSave.AsObject;
    static toObject(includeInstance: boolean, msg: EventToSave): EventToSave.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EventToSave, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EventToSave;
    static deserializeBinaryFromReader(message: EventToSave, reader: jspb.BinaryReader): EventToSave;
}

export namespace EventToSave {
    export type AsObject = {
        eventId: string,
        eventType: string,
        data: string,
        metadata: string,
    }
}

export class Event extends jspb.Message { 
    getEventId(): string;
    setEventId(value: string): Event;
    getEventType(): string;
    setEventType(value: string): Event;
    getData(): string;
    setData(value: string): Event;
    getMetadata(): string;
    setMetadata(value: string): Event;

    hasPosition(): boolean;
    clearPosition(): void;
    getPosition(): Position | undefined;
    setPosition(value?: Position): Event;

    hasDateCreated(): boolean;
    clearDateCreated(): void;
    getDateCreated(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setDateCreated(value?: google_protobuf_timestamp_pb.Timestamp): Event;
    getStreamId(): string;
    setStreamId(value: string): Event;
    getVersion(): number;
    setVersion(value: number): Event;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Event.AsObject;
    static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Event;
    static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
    export type AsObject = {
        eventId: string,
        eventType: string,
        data: string,
        metadata: string,
        position?: Position.AsObject,
        dateCreated?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        streamId: string,
        version: number,
    }
}

export class WriteResult extends jspb.Message { 

    hasLogPosition(): boolean;
    clearLogPosition(): void;
    getLogPosition(): Position | undefined;
    setLogPosition(value?: Position): WriteResult;
    getNewStreamVersion(): number;
    setNewStreamVersion(value: number): WriteResult;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): WriteResult.AsObject;
    static toObject(includeInstance: boolean, msg: WriteResult): WriteResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: WriteResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): WriteResult;
    static deserializeBinaryFromReader(message: WriteResult, reader: jspb.BinaryReader): WriteResult;
}

export namespace WriteResult {
    export type AsObject = {
        logPosition?: Position.AsObject,
        newStreamVersion: number,
    }
}

export class SaveStreamQuery extends jspb.Message { 
    getName(): string;
    setName(value: string): SaveStreamQuery;
    getExpectedVersion(): number;
    setExpectedVersion(value: number): SaveStreamQuery;

    hasSubsetquery(): boolean;
    clearSubsetquery(): void;
    getSubsetquery(): Query | undefined;
    setSubsetquery(value?: Query): SaveStreamQuery;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SaveStreamQuery.AsObject;
    static toObject(includeInstance: boolean, msg: SaveStreamQuery): SaveStreamQuery.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SaveStreamQuery, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SaveStreamQuery;
    static deserializeBinaryFromReader(message: SaveStreamQuery, reader: jspb.BinaryReader): SaveStreamQuery;
}

export namespace SaveStreamQuery {
    export type AsObject = {
        name: string,
        expectedVersion: number,
        subsetquery?: Query.AsObject,
    }
}

export class SaveEventsRequest extends jspb.Message { 
    getBoundary(): string;
    setBoundary(value: string): SaveEventsRequest;

    hasStream(): boolean;
    clearStream(): void;
    getStream(): SaveStreamQuery | undefined;
    setStream(value?: SaveStreamQuery): SaveEventsRequest;
    clearEventsList(): void;
    getEventsList(): Array<EventToSave>;
    setEventsList(value: Array<EventToSave>): SaveEventsRequest;
    addEvents(value?: EventToSave, index?: number): EventToSave;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SaveEventsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SaveEventsRequest): SaveEventsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SaveEventsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SaveEventsRequest;
    static deserializeBinaryFromReader(message: SaveEventsRequest, reader: jspb.BinaryReader): SaveEventsRequest;
}

export namespace SaveEventsRequest {
    export type AsObject = {
        boundary: string,
        stream?: SaveStreamQuery.AsObject,
        eventsList: Array<EventToSave.AsObject>,
    }
}

export class GetStreamQuery extends jspb.Message { 
    getName(): string;
    setName(value: string): GetStreamQuery;
    getFromVersion(): number;
    setFromVersion(value: number): GetStreamQuery;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetStreamQuery.AsObject;
    static toObject(includeInstance: boolean, msg: GetStreamQuery): GetStreamQuery.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetStreamQuery, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetStreamQuery;
    static deserializeBinaryFromReader(message: GetStreamQuery, reader: jspb.BinaryReader): GetStreamQuery;
}

export namespace GetStreamQuery {
    export type AsObject = {
        name: string,
        fromVersion: number,
    }
}

export class GetEventsRequest extends jspb.Message { 

    hasQuery(): boolean;
    clearQuery(): void;
    getQuery(): Query | undefined;
    setQuery(value?: Query): GetEventsRequest;

    hasFromPosition(): boolean;
    clearFromPosition(): void;
    getFromPosition(): Position | undefined;
    setFromPosition(value?: Position): GetEventsRequest;
    getCount(): number;
    setCount(value: number): GetEventsRequest;
    getDirection(): Direction;
    setDirection(value: Direction): GetEventsRequest;
    getBoundary(): string;
    setBoundary(value: string): GetEventsRequest;

    hasStream(): boolean;
    clearStream(): void;
    getStream(): GetStreamQuery | undefined;
    setStream(value?: GetStreamQuery): GetEventsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEventsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetEventsRequest): GetEventsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEventsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEventsRequest;
    static deserializeBinaryFromReader(message: GetEventsRequest, reader: jspb.BinaryReader): GetEventsRequest;
}

export namespace GetEventsRequest {
    export type AsObject = {
        query?: Query.AsObject,
        fromPosition?: Position.AsObject,
        count: number,
        direction: Direction,
        boundary: string,
        stream?: GetStreamQuery.AsObject,
    }
}

export class GetEventsResponse extends jspb.Message { 
    clearEventsList(): void;
    getEventsList(): Array<Event>;
    setEventsList(value: Array<Event>): GetEventsResponse;
    addEvents(value?: Event, index?: number): Event;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEventsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetEventsResponse): GetEventsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEventsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEventsResponse;
    static deserializeBinaryFromReader(message: GetEventsResponse, reader: jspb.BinaryReader): GetEventsResponse;
}

export namespace GetEventsResponse {
    export type AsObject = {
        eventsList: Array<Event.AsObject>,
    }
}

export class CatchUpSubscribeToEventStoreRequest extends jspb.Message { 

    hasAfterposition(): boolean;
    clearAfterposition(): void;
    getAfterposition(): Position | undefined;
    setAfterposition(value?: Position): CatchUpSubscribeToEventStoreRequest;

    hasQuery(): boolean;
    clearQuery(): void;
    getQuery(): Query | undefined;
    setQuery(value?: Query): CatchUpSubscribeToEventStoreRequest;
    getSubscriberName(): string;
    setSubscriberName(value: string): CatchUpSubscribeToEventStoreRequest;
    getBoundary(): string;
    setBoundary(value: string): CatchUpSubscribeToEventStoreRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CatchUpSubscribeToEventStoreRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CatchUpSubscribeToEventStoreRequest): CatchUpSubscribeToEventStoreRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CatchUpSubscribeToEventStoreRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CatchUpSubscribeToEventStoreRequest;
    static deserializeBinaryFromReader(message: CatchUpSubscribeToEventStoreRequest, reader: jspb.BinaryReader): CatchUpSubscribeToEventStoreRequest;
}

export namespace CatchUpSubscribeToEventStoreRequest {
    export type AsObject = {
        afterposition?: Position.AsObject,
        query?: Query.AsObject,
        subscriberName: string,
        boundary: string,
    }
}

export class CatchUpSubscribeToStreamRequest extends jspb.Message { 

    hasQuery(): boolean;
    clearQuery(): void;
    getQuery(): Query | undefined;
    setQuery(value?: Query): CatchUpSubscribeToStreamRequest;
    getSubscriberName(): string;
    setSubscriberName(value: string): CatchUpSubscribeToStreamRequest;
    getBoundary(): string;
    setBoundary(value: string): CatchUpSubscribeToStreamRequest;
    getStream(): string;
    setStream(value: string): CatchUpSubscribeToStreamRequest;
    getAfterversion(): number;
    setAfterversion(value: number): CatchUpSubscribeToStreamRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CatchUpSubscribeToStreamRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CatchUpSubscribeToStreamRequest): CatchUpSubscribeToStreamRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CatchUpSubscribeToStreamRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CatchUpSubscribeToStreamRequest;
    static deserializeBinaryFromReader(message: CatchUpSubscribeToStreamRequest, reader: jspb.BinaryReader): CatchUpSubscribeToStreamRequest;
}

export namespace CatchUpSubscribeToStreamRequest {
    export type AsObject = {
        query?: Query.AsObject,
        subscriberName: string,
        boundary: string,
        stream: string,
        afterversion: number,
    }
}

export enum Direction {
    ASC = 0,
    DESC = 1,
}
