//
//  UIViewController+DeviceTools.h
//  1
//
//  Created by xin on 2018/5/11.
//

#import <UIKit/UIKit.h>

@interface DeviceTools
+ (void)save:(NSString *)service data:(id)data;

+ (id)load:(NSString *)service;

+ (void)delete:(NSString *)service;

+ (NSString *)getIDFV;
@end
