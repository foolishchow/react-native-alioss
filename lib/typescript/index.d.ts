import { EmitterSubscription } from 'react-native';
declare type OSSinit = {
    maxRetryCount: number;
    timeoutIntervalForRequest: number;
    timeoutIntervalForResource: number;
};
declare type OssListOptions = {
    prefix: string;
    marker?: string;
    maxKeys?: string;
    delimiter?: string;
};
declare type AppendType = {
    appendPosition: number;
    contentType: string;
    contentMd5: string;
    contentEncoding: string;
    contentDisposition: string;
};
declare type StsToken = {
    endpoint: string;
    bucketName: string;
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    expiration?: number;
    expirationTimeInGMTFormat?: string;
};
declare class AliyunOSS {
    /**
     * Enable dev mode
     */
    static enableDevMode(): void;
    /**
     * 初始化sts token
     * @param endPoint
     * @param callback
     */
    static initWithSTSTokenProvider(endPoint: string, provider: () => Promise<StsToken | undefined>, configuration?: OSSinit): void;
    /**
     * Initialize the OSS Client
     * Mode: PlainTextAKSK
     */
    static initWithPlainTextAccessKey(accessKey: string, secretKey: string, endPoint: string, configuration?: OSSinit): void;
    /**
     * Initialize the OSS Client
     * Mode: ImplementedSigner
     */
    static initWithImplementedSigner(signature: string, accessKey: string, endPoint: string, configuration?: OSSinit): void;
    /**
     * Initialize the OSS Client
     * Mode: SecurityToken (STS)
     */
    static initWithSecurityToken(securityToken: string, accessKey: string, secretKey: string, endPoint: string, configuration?: OSSinit): void;
    /**
     * Initialize the OSS Client
     * Server STS
     */
    static initWithServerSTS(server: string, endPoint: string, configuration?: OSSinit): void;
    /**
     * Asynchronously uploading
     */
    static asyncUpload(bucketName: string, objectKey: string, filepath: string, options?: {}): Promise<any>;
    /**
     * Asynchronously
     */
    static asyncResumableUpload(bucketName: string, objectKey: string, filepath?: string, options?: {}): Promise<any>;
    /**
     * Asynchronously asyncAppendObject
     */
    static asyncAppendObject(bucketName: string, objectKey: string, filepath: string, options?: AppendType): Promise<any>;
    /**
     * Asynchronously
     */
    static initMultipartUpload(bucketName: string, objectKey: string): Promise<any>;
    /**
     * Asynchronously multipartUpload
     */
    static multipartUpload(bucketName: string, objectKey: string, uploadId: string, filepath?: string, options?: {
        partSize: number;
    }): Promise<any>;
    /**
     * Asynchronously listParts
     */
    static listParts(bucketName: string, objectKey: string, uploadId: string): Promise<any>;
    /**
     * Asynchronously abortMultipartUpload
     */
    static abortMultipartUpload(bucketName: string, objectKey: string, uploadId: string): Promise<any>;
    /**
     * Asynchronously downloading
     */
    static asyncDownload(bucketName: string, objectKey: string, filepath?: string, options?: {
        'x-oss-process': string;
    }): Promise<any>;
    static asyncListBuckets(): Promise<any>;
    /**
     * Asynchronously getHeadObject
     */
    static asyncHeadObject(bucketName: string, objectKey: string): Promise<any>;
    /**
     * Asynchronously getAsyncObjects
     */
    static asyncListObjects(bucketName: string, options?: OssListOptions): Promise<any>;
    /**
     * Asynchronously asyncCopyObject
     */
    static asyncCopyObject(srcBucketName: string, srcObjectKey: string, desBucketName: string, destObjectKey: string, options: any): Promise<any>;
    /**
     * Asynchronously doesObjectExist
     */
    static doesObjectExist(bucketName: string, objectKey: string): Promise<any>;
    /**
     * Asynchronously asyncDeleteObject
     */
    static asyncDeleteObject(bucketName: string, objectKey: string): Promise<any>;
    /**
     * Asynchronously createBucket
     */
    static asyncCreateBucket(bucketName: string, acl: string | undefined, region: string): Promise<any>;
    /**
     * Asynchronously getBucketACL
     */
    static asyncGetBucketACL(bucketName: string): Promise<any>;
    /**
     * Asynchronously deleteBucket
     */
    static asyncDeleteBucket(bucketName: string): Promise<any>;
    /**
     * event listener for native upload/download event
     * @param event one of 'uploadProgress' or 'downloadProgress'
     * @param callback a callback function accepts one params: event
     */
    static addEventListener(event: 'uploadProgress', callback: () => void): EmitterSubscription;
    static addEventListener(event: 'downloadProgress', callback: () => void): EmitterSubscription;
}
export { AliyunOSS };
