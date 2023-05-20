import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  EmitterSubscription,
} from 'react-native';

const { AliOss } = NativeModules;

type OSSinit = {
  maxRetryCount: number;
  timeoutIntervalForRequest: number;
  timeoutIntervalForResource: number;
};

type OssListOptions = {
  prefix: string;
  marker?: string;
  maxKeys?: string;
  delimiter?: string;
};

//default configuration for OSS Client
const conf: OSSinit = {
  // @ts-ignore
  verifyCRC64:false,
  maxRetryCount: 3,
  timeoutIntervalForRequest: 30,
  timeoutIntervalForResource: 24 * 60 * 60,
};

const imageXOssProcess = {
  'x-oss-process': '',
};

let partSize = 128 * 1024;
const mulitpartUploadConfig = {
  partSize: partSize,
};
type AppendType = {
  appendPosition: number;
  contentType: string;
  contentMd5: string;
  contentEncoding: string;
  contentDisposition: string;
};

//appendObject
const appendOptions: AppendType = {
  appendPosition: 0,
  contentType: '',
  contentMd5: '',
  contentEncoding: '',
  contentDisposition: '',
};

type StsToken = {
  endpoint: string;
  bucketName: string;
  accessKeyId: string;
  accessKeySecret: string;
  securityToken: string;
  expiration: string;
};
class AliyunOSS {
  /**
   * Enable dev mode
   */
  static enableDevMode() {
    AliOss.enableDevMode();
  }

  /**
   * 初始化sts token
   * @param endPoint
   * @param callback
   */
  static initWithSTSTokenProvider(
    endPoint: string,
    provider: () => Promise<StsToken|undefined>,
    configuration = conf
  ) {
    AliOss.initWithSTS(endPoint, configuration);
    AliyunOSS.addEventListener(
      // @ts-ignore
      'onSeverTokenRequest',
      (param: { request_id: string }) => {
        provider().then((res) => {
          AliOss.setSTSToken(param.request_id, res);
        });
      }
    );
  }

  /**
   * Initialize the OSS Client
   * Mode: PlainTextAKSK
   */
  static initWithPlainTextAccessKey(
    accessKey: string,
    secretKey: string,
    endPoint: string,
    configuration = conf
  ) {
    AliOss.initWithPlainTextAccessKey(
      accessKey,
      secretKey,
      endPoint,
      configuration
    );
  }

  /**
   * Initialize the OSS Client
   * Mode: ImplementedSigner
   */
  static initWithImplementedSigner(
    signature: string,
    accessKey: string,
    endPoint: string,
    configuration = conf
  ) {
    AliOss.initWithImplementedSigner(
      signature,
      accessKey,
      endPoint,
      configuration
    );
  }

  /**
   * Initialize the OSS Client
   * Mode: SecurityToken (STS)
   */
  static initWithSecurityToken(
    securityToken: string,
    accessKey: string,
    secretKey: string,
    endPoint: string,
    configuration = conf
  ) {
    AliOss.initWithSecurityToken(
      securityToken,
      accessKey,
      secretKey,
      endPoint,
      configuration
    );
  }

  /**
   * Initialize the OSS Client
   * Server STS
   */
  static initWithServerSTS(
    server: string,
    endPoint: string,
    configuration = conf
  ) {
    AliOss.initWithServerSTS(server, endPoint, configuration);
  }

  /**
   * Asynchronously uploading
   */
  static asyncUpload(
    bucketName: string,
    objectKey: string,
    filepath: string,
    options = {}
  ): Promise<any> {
    return AliOss.asyncUpload(bucketName, objectKey, filepath, options);
  }

  /**
   * Asynchronously
   */
  static asyncResumableUpload(
    bucketName: string,
    objectKey: string,
    filepath = '',
    options = {}
  ): Promise<any> {
    return AliOss.asyncResumableUpload(
      bucketName,
      objectKey,
      filepath,
      options
    );
  }

  /**
   * Asynchronously asyncAppendObject
   */
  static asyncAppendObject(
    bucketName: string,
    objectKey: string,
    filepath: string,
    options = appendOptions
  ): Promise<any> {
    return AliOss.asyncAppendObject(bucketName, objectKey, filepath, options);
  }

  /**
   * Asynchronously
   */
  static initMultipartUpload(
    bucketName: string,
    objectKey: string
  ): Promise<any> {
    return AliOss.initMultipartUpload(bucketName, objectKey);
  }

  /**
   * Asynchronously multipartUpload
   */
  static multipartUpload(
    bucketName: string,
    objectKey: string,
    uploadId: string,
    filepath = '',
    options = mulitpartUploadConfig
  ): Promise<any> {
    return AliOss.multipartUpload(
      bucketName,
      objectKey,
      uploadId,
      filepath,
      options
    );
  }

  /**
   * Asynchronously listParts
   */
  static listParts(
    bucketName: string,
    objectKey: string,
    uploadId: string
  ): Promise<any> {
    return AliOss.listParts(bucketName, objectKey, uploadId);
  }

  /**
   * Asynchronously abortMultipartUpload
   */
  static abortMultipartUpload(
    bucketName: string,
    objectKey: string,
    uploadId: string
  ): Promise<any> {
    return AliOss.abortMultipartUpload(bucketName, objectKey, uploadId);
  }

  /**
   * Asynchronously downloading
   */
  static asyncDownload(
    bucketName: string,
    objectKey: string,
    filepath = '',
    options = imageXOssProcess
  ): Promise<any> {
    return AliOss.asyncDownload(bucketName, objectKey, filepath, options);
  }

  /*
    asyncListBuckets
    */

  static asyncListBuckets(): Promise<any> {
    return AliOss.asyncListBuckets();
  }

  /**
   * Asynchronously getHeadObject
   */

  static asyncHeadObject(bucketName: string, objectKey: string): Promise<any> {
    return AliOss.asyncHeadObject(bucketName, objectKey);
  }

  /**
   * Asynchronously getAsyncObjects
   */

  static asyncListObjects(
    bucketName: string,
    options?: OssListOptions
  ): Promise<any> {
    return AliOss.asyncListObjects(bucketName, options);
  }

  /**
   * Asynchronously asyncCopyObject
   */
  static asyncCopyObject(
    srcBucketName: string,
    srcObjectKey: string,
    desBucketName: string,
    destObjectKey: string,
    options: any
  ): Promise<any> {
    return AliOss.asyncCopyObject(
      srcBucketName,
      srcObjectKey,
      desBucketName,
      destObjectKey,
      options
    );
  }

  /**
   * Asynchronously doesObjectExist
   */

  static doesObjectExist(bucketName: string, objectKey: string): Promise<any> {
    return AliOss.doesObjectExist(bucketName, objectKey);
  }

  /**
   * Asynchronously asyncDeleteObject
   */

  static asyncDeleteObject(
    bucketName: string,
    objectKey: string
  ): Promise<any> {
    return AliOss.asyncDeleteObject(bucketName, objectKey);
  }

  /**
   * Asynchronously createBucket
   */
  static asyncCreateBucket(
    bucketName: string,
    acl = 'private',
    region: string
  ): Promise<any> {
    return AliOss.asyncCreateBucket(bucketName, acl, region);
  }

  /**
   * Asynchronously getBucketACL
   */
  static asyncGetBucketACL(bucketName: string): Promise<any> {
    return AliOss.asyncGetBucketACL(bucketName);
  }

  /**
   * Asynchronously deleteBucket
   */
  static asyncDeleteBucket(bucketName: string): Promise<any> {
    return AliOss.asyncDeleteBucket(bucketName);
  }

  /**
   * event listener for native upload/download event
   * @param event one of 'uploadProgress' or 'downloadProgress'
   * @param callback a callback function accepts one params: event
   */
  static addEventListener(
    event: 'uploadProgress',
    callback: () => void
  ): EmitterSubscription;
  // eslint-disable-next-line no-dupe-class-members
  static addEventListener(
    event: 'downloadProgress',
    callback: () => void
  ): EmitterSubscription;
  // eslint-disable-next-line no-dupe-class-members
  static addEventListener(event: string, callback: any): EmitterSubscription {
    const RNAliyunEmitter =
      Platform.OS === 'ios'
        ? new NativeEventEmitter(AliOss)
        : DeviceEventEmitter;
    let subscription: EmitterSubscription;
    switch (event) {
      case 'uploadProgress':
        subscription = RNAliyunEmitter.addListener('uploadProgress', (e) =>
          callback(e)
        );
        break;
      case 'downloadProgress':
        subscription = RNAliyunEmitter.addListener('downloadProgress', (e) =>
          callback(e)
        );
        break;
      case 'onSeverTokenRequest':
        subscription = RNAliyunEmitter.addListener('onSeverTokenRequest', (e) =>
          callback(e)
        );
        break;
    }
    // @ts-ignore
    return subscription;
  }

  /**
   * remove event listener for native upload/download event
   * @param event one of 'uploadProgress' or 'downloadProgress'
   */
  // static removeEventListener(event: any) {
  //   switch (event) {
  //     case 'uploadProgress':
  //       subscription.remove();
  //       break;
  //     case 'downloadProgress':
  //       subscription.remove();
  //       break;
  //     case 'downloadProgress':
  //       subscription.remove();
  //       break;
  //     default:
  //       break;
  //   }
  // }
}

export { AliyunOSS };
