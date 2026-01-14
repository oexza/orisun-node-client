// GENERATED CODE -- DO NOT EDIT!

'use strict';
var eventstore_pb = require('./eventstore_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_orisun_CatchUpSubscribeToEventStoreRequest(arg) {
  if (!(arg instanceof eventstore_pb.CatchUpSubscribeToEventStoreRequest)) {
    throw new Error('Expected argument of type orisun.CatchUpSubscribeToEventStoreRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_orisun_CatchUpSubscribeToEventStoreRequest(buffer_arg) {
  return eventstore_pb.CatchUpSubscribeToEventStoreRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_orisun_Event(arg) {
  if (!(arg instanceof eventstore_pb.Event)) {
    throw new Error('Expected argument of type orisun.Event');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_orisun_Event(buffer_arg) {
  return eventstore_pb.Event.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_orisun_GetEventsRequest(arg) {
  if (!(arg instanceof eventstore_pb.GetEventsRequest)) {
    throw new Error('Expected argument of type orisun.GetEventsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_orisun_GetEventsRequest(buffer_arg) {
  return eventstore_pb.GetEventsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_orisun_GetEventsResponse(arg) {
  if (!(arg instanceof eventstore_pb.GetEventsResponse)) {
    throw new Error('Expected argument of type orisun.GetEventsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_orisun_GetEventsResponse(buffer_arg) {
  return eventstore_pb.GetEventsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_orisun_PingRequest(arg) {
  if (!(arg instanceof eventstore_pb.PingRequest)) {
    throw new Error('Expected argument of type orisun.PingRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_orisun_PingRequest(buffer_arg) {
  return eventstore_pb.PingRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_orisun_PingResponse(arg) {
  if (!(arg instanceof eventstore_pb.PingResponse)) {
    throw new Error('Expected argument of type orisun.PingResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_orisun_PingResponse(buffer_arg) {
  return eventstore_pb.PingResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_orisun_SaveEventsRequest(arg) {
  if (!(arg instanceof eventstore_pb.SaveEventsRequest)) {
    throw new Error('Expected argument of type orisun.SaveEventsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_orisun_SaveEventsRequest(buffer_arg) {
  return eventstore_pb.SaveEventsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_orisun_WriteResult(arg) {
  if (!(arg instanceof eventstore_pb.WriteResult)) {
    throw new Error('Expected argument of type orisun.WriteResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_orisun_WriteResult(buffer_arg) {
  return eventstore_pb.WriteResult.deserializeBinary(new Uint8Array(buffer_arg));
}


var EventStoreService = exports['orisun.EventStore'] = {
  saveEvents: {
    path: '/orisun.EventStore/SaveEvents',
    requestStream: false,
    responseStream: false,
    requestType: eventstore_pb.SaveEventsRequest,
    responseType: eventstore_pb.WriteResult,
    requestSerialize: serialize_orisun_SaveEventsRequest,
    requestDeserialize: deserialize_orisun_SaveEventsRequest,
    responseSerialize: serialize_orisun_WriteResult,
    responseDeserialize: deserialize_orisun_WriteResult,
  },
  getEvents: {
    path: '/orisun.EventStore/GetEvents',
    requestStream: false,
    responseStream: false,
    requestType: eventstore_pb.GetEventsRequest,
    responseType: eventstore_pb.GetEventsResponse,
    requestSerialize: serialize_orisun_GetEventsRequest,
    requestDeserialize: deserialize_orisun_GetEventsRequest,
    responseSerialize: serialize_orisun_GetEventsResponse,
    responseDeserialize: deserialize_orisun_GetEventsResponse,
  },
  catchUpSubscribeToEvents: {
    path: '/orisun.EventStore/CatchUpSubscribeToEvents',
    requestStream: false,
    responseStream: true,
    requestType: eventstore_pb.CatchUpSubscribeToEventStoreRequest,
    responseType: eventstore_pb.Event,
    requestSerialize: serialize_orisun_CatchUpSubscribeToEventStoreRequest,
    requestDeserialize: deserialize_orisun_CatchUpSubscribeToEventStoreRequest,
    responseSerialize: serialize_orisun_Event,
    responseDeserialize: deserialize_orisun_Event,
  },
  ping: {
    path: '/orisun.EventStore/Ping',
    requestStream: false,
    responseStream: false,
    requestType: eventstore_pb.PingRequest,
    responseType: eventstore_pb.PingResponse,
    requestSerialize: serialize_orisun_PingRequest,
    requestDeserialize: deserialize_orisun_PingRequest,
    responseSerialize: serialize_orisun_PingResponse,
    responseDeserialize: deserialize_orisun_PingResponse,
  },
};

