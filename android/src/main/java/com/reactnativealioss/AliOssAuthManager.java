package com.reactnativealioss;

import android.content.Context;
import android.util.Log;

import com.alibaba.sdk.android.oss.ClientConfiguration;
import com.alibaba.sdk.android.oss.ClientException;
import com.alibaba.sdk.android.oss.OSS;
import com.alibaba.sdk.android.oss.OSSClient;
import com.alibaba.sdk.android.oss.common.OSSConstants;
import com.alibaba.sdk.android.oss.common.auth.OSSCredentialProvider;
import com.alibaba.sdk.android.oss.common.auth.OSSCustomSignerCredentialProvider;
import com.alibaba.sdk.android.oss.common.auth.OSSFederationCredentialProvider;
import com.alibaba.sdk.android.oss.common.auth.OSSPlainTextAKSKCredentialProvider;
import com.alibaba.sdk.android.oss.common.auth.OSSFederationToken;
import com.alibaba.sdk.android.oss.common.auth.OSSStsTokenCredentialProvider;
import com.alibaba.sdk.android.oss.common.utils.IOUtils;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.reactnativealioss.utils.ConfigUtils;

import org.json.JSONObject;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class AliOssAuthManager {
    private OSS mOSS;
    private Context mContext;
    private AuthListener mAuthListener;

    /**
     * AliyunAuthManager constructor
     * @param context
     * @param listener
     */
    public AliOssAuthManager(Context context, AuthListener listener) {
        mContext = context;
        mAuthListener = listener;
    }

    /**
     * inteface AuthListener
     */
    public interface AuthListener {
        void onAuthFinished(OSS oss);
    }

    /**
     * initWithSigner
     * @param signature
     * @param accessKey
     * @param endPoint
     * @param configuration
     */
    public void initWithSigner(final String signature,
                               final String accessKey,
                               String endPoint,
                               ReadableMap configuration) {

        OSSCredentialProvider credentialProvider = new OSSCustomSignerCredentialProvider() {
            @Override
            public String signContent(String content) {
                return "OSS " + accessKey + ":" + signature;
            }
        };

        // init conf
        ClientConfiguration conf = ConfigUtils.initAuthConfig(configuration);

        mOSS = new OSSClient(mContext, endPoint, credentialProvider, conf);
        Log.d("AliyunOSS", "OSS initWithSigner ok!");
        mAuthListener.onAuthFinished(mOSS);
    }

  public void initWithSTS(String endPoint,
                          ReadableMap configuration) {
    OSSCredentialProvider credentialProvider = new OSSFederationCredentialProvider() {
      @Override
      public OSSFederationToken getFederationToken() throws ClientException {
        return null;
      }
    };

    // init conf
    ClientConfiguration conf = ConfigUtils.initAuthConfig(configuration);

    mOSS = new OSSClient(mContext, endPoint, credentialProvider, conf);
    Log.d("AliyunOSS", "OSS initWithSigner ok!");
    mAuthListener.onAuthFinished(mOSS);
  }

    /**
     * initWithPlainTextAccessKey
     * @param accessKeyId
     * @param accessKeySecret
     * @param endPoint
     * @param configuration
     */
    public void initWithPlainTextAccessKey(String accessKeyId,
                                           String accessKeySecret,
                                           String endPoint,
                                           ReadableMap configuration) {

        OSSCredentialProvider credentialProvider = new OSSPlainTextAKSKCredentialProvider(accessKeyId,accessKeySecret);
        // init conf
        ClientConfiguration conf = ConfigUtils.initAuthConfig(configuration);

        mOSS = new OSSClient(mContext, endPoint, credentialProvider, conf);
        Log.d("AliyunOSS", "OSS initWithKey ok!");
        mAuthListener.onAuthFinished(mOSS);
    }

    /**
     * initWithPlainTextAccessKey
     * @param securityToken
     * @param accessKeyId
     * @param accessKeySecret
     * @param endPoint
     * @param configuration
     */
    public void initWithSecurityToken(String securityToken,
                                      String accessKeyId,
                                      String accessKeySecret,
                                      String endPoint,
                                      ReadableMap configuration) {
        OSSCredentialProvider credentialProvider = new OSSStsTokenCredentialProvider(accessKeyId, accessKeySecret, securityToken);

        // init conf
        ClientConfiguration conf = ConfigUtils.initAuthConfig(configuration);

        mOSS = new OSSClient(mContext, endPoint, credentialProvider, conf);
        Log.d("AliyunOSS", "OSS initWithKey ok!");
        mAuthListener.onAuthFinished(mOSS);
    }

    /**
     * initWithServerSTS
     * @param server
     * @param endPoint
     * @param configuration
     */
    public void initWithServerSTS(final String server,
                                  String endPoint,
                                  ReadableMap configuration) {
        OSSCredentialProvider credentialProvider = new OSSFederationCredentialProvider() {
            @Override
            public OSSFederationToken getFederationToken() {
                try {
                    URL stsUrl = new URL(server);
                    HttpURLConnection conn = (HttpURLConnection) stsUrl.openConnection();
                    InputStream input = conn.getInputStream();
                    String jsonText = IOUtils.readStreamAsString(input, OSSConstants.DEFAULT_CHARSET_NAME);
                    JSONObject jsonObjs = new JSONObject(jsonText);
                    String ak = jsonObjs.getString("AccessKeyId");
                    String sk = jsonObjs.getString("AccessKeySecret");
                    String token = jsonObjs.getString("SecurityToken");
                    String expiration = jsonObjs.getString("Expiration");
                    return new OSSFederationToken(ak, sk, token, expiration);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return null;
            }
        };

        // init conf
        ClientConfiguration conf = ConfigUtils.initAuthConfig(configuration);

        mOSS = new OSSClient(mContext, endPoint, credentialProvider, conf);
        Log.d("AliyunOSS", "OSS initWithKey ok!");
        mAuthListener.onAuthFinished(mOSS);
    }
}
