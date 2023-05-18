//
//  AliOss.m
//  Created by hfan


/**
 * Alioss.m refactor comments
 */
#import "AliOssShared.h"
#import <Foundation/Foundation.h>

@interface AliOssShared ()

@property (nonatomic) NSMutableDictionary *cache;
@property (nonatomic) dispatch_semaphore_t semaphore;

@end

@implementation AliOssShared

+ (instancetype) shared{
    static AliOssShared *shared;
    static dispatch_once_t once_token;
    dispatch_once(&once_token, ^{
        shared = [[AliOssShared alloc] init];
    });
    return shared;
}

- (instancetype)init{
    self = [super init];
    self.cache = [[NSMutableDictionary alloc]init];
    self.semaphore = dispatch_semaphore_create(0);
    return self;
}

-(void)lock{
    dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER);
}

-(void)unlock{
    dispatch_semaphore_signal(self.semaphore);
}

- (NSDictionary*) getStsTokenWithKey:(NSString *)key{
    return [self.cache valueForKey:key];
}
- (void) setStsTokenWithKey:(NSString *)key value:(NSDictionary*) value{
    [self.cache setValue:value forKey:key];
}

- (NSString *)randomStringWithNumber:(NSInteger)number{ //number 是需要的个数
    NSString *ramdom;
    NSMutableArray *array = [NSMutableArray array];
    for (int i = 1; i ; i ++) {
    int a = (arc4random() % 122); //如需要可以改变数值大小  这儿的数值是ASCII值
    if (a > 96) { //这儿是小写字母 如需要自行更改
        char c = (char)a;
        [array addObject:[NSString stringWithFormat:@"%c",c]];
        if (array.count == number) {
            break;
        }
    } else continue;
    }
    ramdom = [array componentsJoinedByString:@""];//这个是把数组转换为字符串
    return ramdom;
}
@end
