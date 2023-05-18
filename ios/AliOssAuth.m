//
//  AliOssAuth.m
//  Created by hfan

#import "AliOss.h"
#import "AliOssShared.h"

@implementation  AliOss(AUTH)



/**
 initWithPlainTextAccessKey
 
 */
RCT_EXPORT_METHOD(initWithPlainTextAccessKey:(NSString *)accessKey secretKey:(NSString *)secretKey endPoint:(NSString *)endPoint configuration:(NSDictionary *)configuration){
    
    id<OSSCredentialProvider> credential = [[OSSPlainTextAKSKPairCredentialProvider alloc] initWithPlainTextAccessKey:accessKey secretKey:secretKey];
    
    [self initConfiguration: configuration];
    
    self.client = [[OSSClient alloc] initWithEndpoint:endPoint credentialProvider:credential clientConfiguration:self.clientConfiguration];
}


/**
 initWithImplementedSigner
 
 */
RCT_EXPORT_METHOD(initWithImplementedSigner:(NSString *)signature accessKey:(NSString *)accessKey endPoint:(NSString *)endPoint configuration:(NSDictionary *)configuration){
    
    id<OSSCredentialProvider> credential = [[OSSCustomSignerCredentialProvider alloc] initWithImplementedSigner:^NSString *(NSString *contentToSign, NSError *__autoreleasing *error) {
        if (signature != nil) {
            *error = nil;
        } else {
            // construct error object
            *error = [NSError errorWithDomain:endPoint code:OSSClientErrorCodeSignFailed userInfo:nil];
            return nil;
        }
        return [NSString stringWithFormat:@"OSS %@:%@", accessKey, signature];
    }];
    
    [self initConfiguration: configuration];
    
    self.client = [[OSSClient alloc] initWithEndpoint:endPoint credentialProvider:credential clientConfiguration:self.clientConfiguration];
}


/**
 initWithSecurityToken
 
 */
RCT_EXPORT_METHOD(initWithSecurityToken:(NSString *)securityToken accessKey:(NSString *)accessKey secretKey:(NSString *)secretKey endPoint:(NSString *)endPoint configuration:(NSDictionary *)configuration){
    
    id<OSSCredentialProvider> credential = [[OSSStsTokenCredentialProvider alloc] initWithAccessKeyId:accessKey secretKeyId:secretKey securityToken:securityToken];
    
    [self initConfiguration: configuration];
    
    
    self.client = [[OSSClient alloc] initWithEndpoint:endPoint credentialProvider:credential clientConfiguration:self.clientConfiguration];
}

/**
 initWithServerSTS
 */
RCT_EXPORT_METHOD(initWithServerSTS:(NSString *)server endPoint:(NSString *)endPoint configuration:(NSDictionary *)configuration){
    //直接访问鉴权服务器（推荐，token过期后可以自动更新）
    id<OSSCredentialProvider> credential = [[OSSAuthCredentialProvider alloc] initWithAuthServerUrl:server];
    
    [self initConfiguration: configuration];

    self.client = [[OSSClient alloc] initWithEndpoint:endPoint credentialProvider:credential clientConfiguration:self.clientConfiguration];
}


RCT_EXPORT_METHOD(setSTSToken:(NSString *)requestId token:(NSDictionary*) token{
//    NSLog(@"%@",token);
    [[AliOssShared shared] setStsTokenWithKey:requestId value:token];
    [[AliOssShared shared] unlock];
})

RCT_EXPORT_METHOD(initWithSTS:(NSString *)endPoint configuration:(NSDictionary *)configuration{
//    NSLog(@"initWithSTS");
//    NSLog(@"%@",endPoint);
    
    __weak __typeof__(self) weakSelf = self;
    id<OSSCredentialProvider> credential = [[OSSFederationCredentialProvider alloc] initWithFederationTokenGetter:^OSSFederationToken * _Nullable{
        __strong __typeof(self) strongSelf = weakSelf;
        //NSLog(@"initWithFederationTokenGetter");
        NSString* requestId = [[AliOssShared shared]randomStringWithNumber:32];
        if (strongSelf.hasListeners) {
            //NSLog(@"hasListeners");
            [strongSelf sendEventWithName:@"onSeverTokenRequest" body:@{@"request_id":requestId}];
            [[AliOssShared shared] lock];
        }
        NSDictionary* object = [[AliOssShared shared] getStsTokenWithKey:requestId];
        if ( object == nil){
            return nil;
        }

        OSSFederationToken * token = [OSSFederationToken new];
        // All the entries below are mandatory.
        token.tAccessKey = [object objectForKey:@"accessKeyId"];
        token.tSecretKey = [object objectForKey:@"accessKeySecret"];
        token.tToken = [object objectForKey:@"securityToken"];
        token.expirationTimeInGMTFormat = [object objectForKey:@"expiration"];
        // NSLog(@"token: %@ %@ %@ %@", token.tAccessKey, token.tSecretKey, token.tToken, [object objectForKey:@"expiration"]);
        return token;
    }];
    
    [self initConfiguration: configuration];
    
    self.client = [[OSSClient alloc] initWithEndpoint:endPoint credentialProvider:credential clientConfiguration:self.clientConfiguration];
})

@end
