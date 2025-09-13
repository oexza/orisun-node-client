// GENERATED CODE -- DO NOT EDIT!

'use strict';
var eventstore_pb = require('./eventstore_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_eventstore_CatchUpSubscribeToEventStoreRequest(arg) {
  if (!(arg instanceof eventstore_pb.CatchUpSubscribeToEventStoreRequest)) {
    throw new Error('Expected argument of type eventstore.CatchUpSubscribeToEventStoreRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eventstore_CatchUpSubscribeToEventStoreRequest(buffer_arg) {
  return eventstore_pb.CatchUpSubscribeToEventStoreRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_eventstore_CatchUpSubscribeToStreamRequest(arg) {
  if (!(arg instanceof eventstore_pb.CatchUpSubscribeToStreamRequest)) {
    throw new Error('Expected argument of type eventstore.CatchUpSubscribeToStreamRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eventstore_CatchUpSubscribeToStreamRequest(buffer_arg) {
  return eventstore_pb.CatchUpSubscribeToStreamRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_eventstore_Event(arg) {
  if (!(arg instanceof eventstore_pb.Event)) {
    throw new Error('Expected argument of type eventstore.Event');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eventstore_Event(buffer_arg) {
  return eventstore_pb.Event.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_eventstore_GetEventsRequest(arg) {
  if (!(arg instanceof eventstore_pb.GetEventsRequest)) {
    throw new Error('Expected argument of type eventstore.GetEventsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eventstore_GetEventsRequest(buffer_arg) {
  return eventstore_pb.GetEventsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_eventstore_GetEventsResponse(arg) {
  if (!(arg instanceof eventstore_pb.GetEventsResponse)) {
    throw new Error('Expected argument of type eventstore.GetEventsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eventstore_GetEventsResponse(buffer_arg) {
  return eventstore_pb.GetEventsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_eventstore_SaveEventsRequest(arg) {
  if (!(arg instanceof eventstore_pb.SaveEventsRequest)) {
    throw new Error('Expected argument of type eventstore.SaveEventsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eventstore_SaveEventsRequest(buffer_arg) {
  return eventstore_pb.SaveEventsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_eventstore_WriteResult(arg) {
  if (!(arg instanceof eventstore_pb.WriteResult)) {
    throw new Error('Expected argument of type eventstore.WriteResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_eventstore_WriteResult(buffer_arg) {
  return eventstore_pb.WriteResult.deserializeBinary(new Uint8Array(buffer_arg));
}


var EventStoreService = exports['eventstore.EventStore'] = {
  saveEvents: {
    path: '/eventstore.EventStore/SaveEvents',
    requestStream: false,
    responseStream: false,
    requestType: eventstore_pb.SaveEventsRequest,
    responseType: eventstore_pb.WriteResult,
    requestSerialize: serialize_eventstore_SaveEventsRequest,
    requestDeserialize: deserialize_eventstore_SaveEventsRequest,
    responseSerialize: serialize_eventstore_WriteResult,
    responseDeserialize: deserialize_eventstore_WriteResult,
  },
  getEvents: {
    path: '/eventstore.EventStore/GetEvents',
    requestStream: false,
    responseStream: false,
    requestType: eventstore_pb.GetEventsRequest,
    responseType: eventstore_pb.GetEventsResponse,
    requestSerialize: serialize_eventstore_GetEventsRequest,
    requestDeserialize: deserialize_eventstore_GetEventsRequest,
    responseSerialize: serialize_eventstore_GetEventsResponse,
    responseDeserialize: deserialize_eventstore_GetEventsResponse,
  },
  catchUpSubscribeToEvents: {
    path: '/eventstore.EventStore/CatchUpSubscribeToEvents',
    requestStream: false,
    responseStream: true,
    requestType: eventstore_pb.CatchUpSubscribeToEventStoreRequest,
    responseType: eventstore_pb.Event,
    requestSerialize: serialize_eventstore_CatchUpSubscribeToEventStoreRequest,
    requestDeserialize: deserialize_eventstore_CatchUpSubscribeToEventStoreRequest,
    responseSerialize: serialize_eventstore_Event,
    responseDeserialize: deserialize_eventstore_Event,
  },
  catchUpSubscribeToStream: {
    path: '/eventstore.EventStore/CatchUpSubscribeToStream',
    requestStream: false,
    responseStream: true,
    requestType: eventstore_pb.CatchUpSubscribeToStreamRequest,
    responseType: eventstore_pb.Event,
    requestSerialize: serialize_eventstore_CatchUpSubscribeToStreamRequest,
    requestDeserialize: deserialize_eventstore_CatchUpSubscribeToStreamRequest,
    responseSerialize: serialize_eventstore_Event,
    responseDeserialize: deserialize_eventstore_Event,
  },
};

