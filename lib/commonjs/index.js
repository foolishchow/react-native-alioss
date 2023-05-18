"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AliyunOSS = void 0;

var _reactNative = require("react-native");

const {
  AliOss
} = _reactNative.NativeModules;
//default configuration for OSS Client
const conf = {
  maxRetryCount: 3,
  timeoutIntervalForRequest: 30,
  timeoutIntervalForResource: 24 * 60 * 60
};
const imageXOssProcess = {
  'x-oss-process': ''
};
let partSize = 128 * 1024;
const mulitpartUploadConfig = {
  partSize: partSize
};
//appendObject
const appendOptions = {
  appendPosition: 0,
  contentType: '',
  contentMd5: '',
  contentEncoding: '',
  contentDisposition: ''
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


  static initWithSTSTokenProvider(endPoint, provider, configuration = conf) {
    AliOss.initWithSTS(endPoint, configuration);
    AliyunOSS.addEventListener( // @ts-ignore
    'onSeverTokenRequest', param => {
      provider().then(res => {
        AliOss.setSTSToken(param.request_id, res);
      });
    });
  }
  /**
   * Initialize the OSS Client
   * Mode: PlainTextAKSK
   */


  static initWithPlainTextAccessKey(accessKey, secretKey, endPoint, configuration = conf) {
    AliOss.initWithPlainTextAccessKey(accessKey, secretKey, endPoint, configuration);
  }
  /**
   * Initialize the OSS Client
   * Mode: ImplementedSigner
   */


  static initWithImplementedSigner(signature, accessKey, endPoint, configuration = conf) {
    AliOss.initWithImplementedSigner(signature, accessKey, endPoint, configuration);
  }
  /**
   * Initialize the OSS Client
   * Mode: SecurityToken (STS)
   */


  static initWithSecurityToken(securityToken, accessKey, secretKey, endPoint, configuration = conf) {
    AliOss.initWithSecurityToken(securityToken, accessKey, secretKey, endPoint, configuration);
  }
  /**
   * Initialize the OSS Client
   * Server STS
   */


  static initWithServerSTS(server, endPoint, configuration = conf) {
    AliOss.initWithServerSTS(server, endPoint, configuration);
  }
  /**
   * Asynchronously uploading
   */


  static asyncUpload(bucketName, objectKey, filepath, options = {}) {
    return AliOss.asyncUpload(bucketName, objectKey, filepath, options);
  }
  /**
   * Asynchronously
   */


  static asyncResumableUpload(bucketName, objectKey, filepath = '', options = {}) {
    return AliOss.asyncResumableUpload(bucketName, objectKey, filepath, options);
  }
  /**
   * Asynchronously asyncAppendObject
   */


  static asyncAppendObject(bucketName, objectKey, filepath, options = appendOptions) {
    return AliOss.asyncAppendObject(bucketName, objectKey, filepath, options);
  }
  /**
   * Asynchronously
   */


  static initMultipartUpload(bucketName, objectKey) {
    return AliOss.initMultipartUpload(bucketName, objectKey);
  }
  /**
   * Asynchronously multipartUpload
   */


  static multipartUpload(bucketName, objectKey, uploadId, filepath = '', options = mulitpartUploadConfig) {
    return AliOss.multipartUpload(bucketName, objectKey, uploadId, filepath, options);
  }
  /**
   * Asynchronously listParts
   */


  static listParts(bucketName, objectKey, uploadId) {
    return AliOss.listParts(bucketName, objectKey, uploadId);
  }
  /**
   * Asynchronously abortMultipartUpload
   */


  static abortMultipartUpload(bucketName, objectKey, uploadId) {
    return AliOss.abortMultipartUpload(bucketName, objectKey, uploadId);
  }
  /**
   * Asynchronously downloading
   */


  static asyncDownload(bucketName, objectKey, filepath = '', options = imageXOssProcess) {
    return AliOss.asyncDownload(bucketName, objectKey, filepath, options);
  }
  /*
    asyncListBuckets
    */


  static asyncListBuckets() {
    return AliOss.asyncListBuckets();
  }
  /**
   * Asynchronously getHeadObject
   */


  static asyncHeadObject(bucketName, objectKey) {
    return AliOss.asyncHeadObject(bucketName, objectKey);
  }
  /**
   * Asynchronously getAsyncObjects
   */


  static asyncListObjects(bucketName, options) {
    return AliOss.asyncListObjects(bucketName, options);
  }
  /**
   * Asynchronously asyncCopyObject
   */


  static asyncCopyObject(srcBucketName, srcObjectKey, desBucketName, destObjectKey, options) {
    return AliOss.asyncCopyObject(srcBucketName, srcObjectKey, desBucketName, destObjectKey, options);
  }
  /**
   * Asynchronously doesObjectExist
   */


  static doesObjectExist(bucketName, objectKey) {
    return AliOss.doesObjectExist(bucketName, objectKey);
  }
  /**
   * Asynchronously asyncDeleteObject
   */


  static asyncDeleteObject(bucketName, objectKey) {
    return AliOss.asyncDeleteObject(bucketName, objectKey);
  }
  /**
   * Asynchronously createBucket
   */


  static asyncCreateBucket(bucketName, acl = 'private', region) {
    return AliOss.asyncCreateBucket(bucketName, acl, region);
  }
  /**
   * Asynchronously getBucketACL
   */


  static asyncGetBucketACL(bucketName) {
    return AliOss.asyncGetBucketACL(bucketName);
  }
  /**
   * Asynchronously deleteBucket
   */


  static asyncDeleteBucket(bucketName) {
    return AliOss.asyncDeleteBucket(bucketName);
  }
  /**
   * event listener for native upload/download event
   * @param event one of 'uploadProgress' or 'downloadProgress'
   * @param callback a callback function accepts one params: event
   */


  // eslint-disable-next-line no-dupe-class-members
  static addEventListener(event, callback) {
    const RNAliyunEmitter = _reactNative.Platform.OS === 'ios' ? new _reactNative.NativeEventEmitter(AliOss) : _reactNative.DeviceEventEmitter;
    let subscription;

    switch (event) {
      case 'uploadProgress':
        subscription = RNAliyunEmitter.addListener('uploadProgress', e => callback(e));
        break;

      case 'downloadProgress':
        subscription = RNAliyunEmitter.addListener('downloadProgress', e => callback(e));
        break;

      case 'onSeverTokenRequest':
        subscription = RNAliyunEmitter.addListener('onSeverTokenRequest', e => callback(e));
        break;
    } // @ts-ignore


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

exports.AliyunOSS = AliyunOSS;
//# sourceMappingURL=index.js.map