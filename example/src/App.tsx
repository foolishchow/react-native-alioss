import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AliyunOSS } from '../../src';

export default function App() {
  const [result, _setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    AliyunOSS.initWithSTSTokenProvider(
      'https://oss-cn-hangzhou.aliyuncs.com',
      async () => {
        return {
          endpoint: 'oss-cn-hangzhou.aliyuncs.com',
          bucketName: 'public',
          accessKeyId: 'accessKeyId',
          accessKeySecret: 'accessKeyId',
          securityToken: 'securityToken',
          rootPath: 'rootPath',
          expirationTimeInGMTFormat: '2022-05-18T15:35:47Z',
        };
      }
    );
    // AliyunOSS.initWithSecurityToken();
    AliyunOSS.asyncListBuckets();

    // setInterval(() => {
    //   AliyunOSS.asyncListBuckets();
    // }, 5000);
    // AliyunOSS.listParts('bk-public', 'abc', '123');
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
