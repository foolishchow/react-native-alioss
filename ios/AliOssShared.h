//
//  AliOss.h
//  Created by hfan

#import <Foundation/Foundation.h>

@interface AliOssShared : NSObject


 
-(void)lock;
-(void)unlock;

- (NSDictionary*) getStsTokenWithKey:(NSString *)key;
- (void) setStsTokenWithKey:(NSString *)key value:(NSDictionary*) value;
- (NSString *)randomStringWithNumber:(NSInteger)number;
+ (instancetype) shared;

@end

