// package: orisun
// file: admin.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as admin_pb from "./admin_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface IAdminService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createUser: IAdminService_ICreateUser;
    deleteUser: IAdminService_IDeleteUser;
    changePassword: IAdminService_IChangePassword;
    listUsers: IAdminService_IListUsers;
    validateCredentials: IAdminService_IValidateCredentials;
    getUserCount: IAdminService_IGetUserCount;
    getEventCount: IAdminService_IGetEventCount;
}

interface IAdminService_ICreateUser extends grpc.MethodDefinition<admin_pb.CreateUserRequest, admin_pb.CreateUserResponse> {
    path: "/orisun.Admin/CreateUser";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.CreateUserRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.CreateUserRequest>;
    responseSerialize: grpc.serialize<admin_pb.CreateUserResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.CreateUserResponse>;
}
interface IAdminService_IDeleteUser extends grpc.MethodDefinition<admin_pb.DeleteUserRequest, admin_pb.DeleteUserResponse> {
    path: "/orisun.Admin/DeleteUser";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.DeleteUserRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.DeleteUserRequest>;
    responseSerialize: grpc.serialize<admin_pb.DeleteUserResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.DeleteUserResponse>;
}
interface IAdminService_IChangePassword extends grpc.MethodDefinition<admin_pb.ChangePasswordRequest, admin_pb.ChangePasswordResponse> {
    path: "/orisun.Admin/ChangePassword";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.ChangePasswordRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.ChangePasswordRequest>;
    responseSerialize: grpc.serialize<admin_pb.ChangePasswordResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.ChangePasswordResponse>;
}
interface IAdminService_IListUsers extends grpc.MethodDefinition<admin_pb.ListUsersRequest, admin_pb.ListUsersResponse> {
    path: "/orisun.Admin/ListUsers";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.ListUsersRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.ListUsersRequest>;
    responseSerialize: grpc.serialize<admin_pb.ListUsersResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.ListUsersResponse>;
}
interface IAdminService_IValidateCredentials extends grpc.MethodDefinition<admin_pb.ValidateCredentialsRequest, admin_pb.ValidateCredentialsResponse> {
    path: "/orisun.Admin/ValidateCredentials";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.ValidateCredentialsRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.ValidateCredentialsRequest>;
    responseSerialize: grpc.serialize<admin_pb.ValidateCredentialsResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.ValidateCredentialsResponse>;
}
interface IAdminService_IGetUserCount extends grpc.MethodDefinition<admin_pb.GetUserCountRequest, admin_pb.GetUserCountResponse> {
    path: "/orisun.Admin/GetUserCount";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.GetUserCountRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.GetUserCountRequest>;
    responseSerialize: grpc.serialize<admin_pb.GetUserCountResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.GetUserCountResponse>;
}
interface IAdminService_IGetEventCount extends grpc.MethodDefinition<admin_pb.GetEventCountRequest, admin_pb.GetEventCountResponse> {
    path: "/orisun.Admin/GetEventCount";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<admin_pb.GetEventCountRequest>;
    requestDeserialize: grpc.deserialize<admin_pb.GetEventCountRequest>;
    responseSerialize: grpc.serialize<admin_pb.GetEventCountResponse>;
    responseDeserialize: grpc.deserialize<admin_pb.GetEventCountResponse>;
}

export const AdminService: IAdminService;

export interface IAdminServer extends grpc.UntypedServiceImplementation {
    createUser: grpc.handleUnaryCall<admin_pb.CreateUserRequest, admin_pb.CreateUserResponse>;
    deleteUser: grpc.handleUnaryCall<admin_pb.DeleteUserRequest, admin_pb.DeleteUserResponse>;
    changePassword: grpc.handleUnaryCall<admin_pb.ChangePasswordRequest, admin_pb.ChangePasswordResponse>;
    listUsers: grpc.handleUnaryCall<admin_pb.ListUsersRequest, admin_pb.ListUsersResponse>;
    validateCredentials: grpc.handleUnaryCall<admin_pb.ValidateCredentialsRequest, admin_pb.ValidateCredentialsResponse>;
    getUserCount: grpc.handleUnaryCall<admin_pb.GetUserCountRequest, admin_pb.GetUserCountResponse>;
    getEventCount: grpc.handleUnaryCall<admin_pb.GetEventCountRequest, admin_pb.GetEventCountResponse>;
}

export interface IAdminClient {
    createUser(request: admin_pb.CreateUserRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
    createUser(request: admin_pb.CreateUserRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
    createUser(request: admin_pb.CreateUserRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
    deleteUser(request: admin_pb.DeleteUserRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.DeleteUserResponse) => void): grpc.ClientUnaryCall;
    deleteUser(request: admin_pb.DeleteUserRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.DeleteUserResponse) => void): grpc.ClientUnaryCall;
    deleteUser(request: admin_pb.DeleteUserRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.DeleteUserResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: admin_pb.ChangePasswordRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: admin_pb.ChangePasswordRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: admin_pb.ChangePasswordRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    listUsers(request: admin_pb.ListUsersRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.ListUsersResponse) => void): grpc.ClientUnaryCall;
    listUsers(request: admin_pb.ListUsersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.ListUsersResponse) => void): grpc.ClientUnaryCall;
    listUsers(request: admin_pb.ListUsersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.ListUsersResponse) => void): grpc.ClientUnaryCall;
    validateCredentials(request: admin_pb.ValidateCredentialsRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.ValidateCredentialsResponse) => void): grpc.ClientUnaryCall;
    validateCredentials(request: admin_pb.ValidateCredentialsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.ValidateCredentialsResponse) => void): grpc.ClientUnaryCall;
    validateCredentials(request: admin_pb.ValidateCredentialsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.ValidateCredentialsResponse) => void): grpc.ClientUnaryCall;
    getUserCount(request: admin_pb.GetUserCountRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.GetUserCountResponse) => void): grpc.ClientUnaryCall;
    getUserCount(request: admin_pb.GetUserCountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.GetUserCountResponse) => void): grpc.ClientUnaryCall;
    getUserCount(request: admin_pb.GetUserCountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.GetUserCountResponse) => void): grpc.ClientUnaryCall;
    getEventCount(request: admin_pb.GetEventCountRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.GetEventCountResponse) => void): grpc.ClientUnaryCall;
    getEventCount(request: admin_pb.GetEventCountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.GetEventCountResponse) => void): grpc.ClientUnaryCall;
    getEventCount(request: admin_pb.GetEventCountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.GetEventCountResponse) => void): grpc.ClientUnaryCall;
}

export class AdminClient extends grpc.Client implements IAdminClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public createUser(request: admin_pb.CreateUserRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
    public createUser(request: admin_pb.CreateUserRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
    public createUser(request: admin_pb.CreateUserRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
    public deleteUser(request: admin_pb.DeleteUserRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.DeleteUserResponse) => void): grpc.ClientUnaryCall;
    public deleteUser(request: admin_pb.DeleteUserRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.DeleteUserResponse) => void): grpc.ClientUnaryCall;
    public deleteUser(request: admin_pb.DeleteUserRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.DeleteUserResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: admin_pb.ChangePasswordRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: admin_pb.ChangePasswordRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: admin_pb.ChangePasswordRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public listUsers(request: admin_pb.ListUsersRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.ListUsersResponse) => void): grpc.ClientUnaryCall;
    public listUsers(request: admin_pb.ListUsersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.ListUsersResponse) => void): grpc.ClientUnaryCall;
    public listUsers(request: admin_pb.ListUsersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.ListUsersResponse) => void): grpc.ClientUnaryCall;
    public validateCredentials(request: admin_pb.ValidateCredentialsRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.ValidateCredentialsResponse) => void): grpc.ClientUnaryCall;
    public validateCredentials(request: admin_pb.ValidateCredentialsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.ValidateCredentialsResponse) => void): grpc.ClientUnaryCall;
    public validateCredentials(request: admin_pb.ValidateCredentialsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.ValidateCredentialsResponse) => void): grpc.ClientUnaryCall;
    public getUserCount(request: admin_pb.GetUserCountRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.GetUserCountResponse) => void): grpc.ClientUnaryCall;
    public getUserCount(request: admin_pb.GetUserCountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.GetUserCountResponse) => void): grpc.ClientUnaryCall;
    public getUserCount(request: admin_pb.GetUserCountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.GetUserCountResponse) => void): grpc.ClientUnaryCall;
    public getEventCount(request: admin_pb.GetEventCountRequest, callback: (error: grpc.ServiceError | null, response: admin_pb.GetEventCountResponse) => void): grpc.ClientUnaryCall;
    public getEventCount(request: admin_pb.GetEventCountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: admin_pb.GetEventCountResponse) => void): grpc.ClientUnaryCall;
    public getEventCount(request: admin_pb.GetEventCountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: admin_pb.GetEventCountResponse) => void): grpc.ClientUnaryCall;
}
