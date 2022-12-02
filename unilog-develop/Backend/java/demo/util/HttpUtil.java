package demo.util;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Base64;
import java.util.List;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.params.ConnRoutePNames;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import demo.service.user.UnilogConfigService;
import demo.service.watch.impl.WatchServiceImpl;

public class HttpUtil {

	private static final Logger logger 
	  = LoggerFactory.getLogger(HttpUtil.class);
	
	private static SecureRandom random;

	private int timeout = 30000;

	private String protocol;
	private String host;
	private int port;

	private String webProxyUrl = null;
	private int webProxyPort;
	
	public HttpUtil(String protocol, String host, int port) {
		super();
		this.protocol = protocol;
		this.host = host;
		this.port = port;
	}

	public HttpUtil(String protocol, String host, int port, int timeout) {
		super();
		this.timeout = timeout;
		this.protocol = protocol;
		this.host = host;
		this.port = port;
	}
	
	public void setProxy(String url, int port) {
		webProxyUrl = url;
		webProxyPort = port;
	}

	public String callDeleteAPI(String path ,int retryCount) throws Exception {
		return callDeleteAPI(path ,retryCount, null);
	}
	
	public String callDeleteAPI(String path ,int retryCount, String auth) throws Exception {
		
		StringBuilder resultBuilder = null;
		URIBuilder uriBuilder = new URIBuilder();
		HttpClient client = null;
		HttpDelete httpDelete = null;
		HttpResponse response = null;
		BufferedReader br = null;
		String output = null;

		Integer statusCode = -1;

		int randomInt = randomInt();
		Exception oe = null;

		// 因為HTTP連線的不穩定，常有失敗的狀況發生，所以在連線時，會嘗試至少
		// retryCount 次，若是超過 retryCount 次還是失敗，則結束迴圈。
		do {
			try {
				resultBuilder = new StringBuilder();
				// step1. 組合uri
				uriBuilder = uriBuilder.setScheme(protocol).setHost(host).setPort(port).setPath(path);

				// step2. 取得HttpClient連線
				client = httpClientFactory(protocol);
				
				client.getParams().setParameter("http.socket.timeout", timeout);

				// step3. 設定連線參數
				URI uri = uriBuilder.build();
				httpDelete = new HttpDelete(uri);
				
				if(StringUtils.isNotBlank(auth)) {
					String encoding = Base64.getEncoder().encodeToString((auth).getBytes("utf-8"));
					httpDelete.setHeader("Authorization", "Basic " + encoding);
					httpDelete.setHeader("kbn-xsrf","true");
				}
				
				// step4. 連線，並取得回傳時間
				response = client.execute(httpDelete);

				statusCode = response.getStatusLine().getStatusCode();

				// step6. 取得輸出串流
				br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
				while ((output = br.readLine()) != null) {
					resultBuilder.append(output);
				}

				// step7. 結束迴圈，count設為0
				retryCount = 0;
			} catch (Exception e) {
				oe = e;
			} finally {
				// 關閉reader
				try {
					if (br != null)
						br.close();
				} catch (IOException e) {
				}
				// 關閉HttpClient
				if (client != null)
					client.getConnectionManager().shutdown();
			}
		} while (--retryCount > 0);

		String result = resultBuilder.toString();
		if(result.isEmpty() && oe != null) {
			result = oe.getMessage();
		}
		if (statusCode == -1) {
			throw new HttpUtilException(concatLogTimeStr(path, randomInt) + ": Fail", statusCode,
					result, oe);
		} else if (statusCode == 700) {
			throw new HttpUtilServiceException("Failed : by Service", statusCode,
					result);
		} else if (statusCode != 200) {
			throw new HttpUtilException("Failed : HTTP error code : " + statusCode, statusCode,
					result, oe);
		}

		return resultBuilder.toString();
		
	}
	
	public String callGetAPI(String path ,int retryCount) throws Exception{
		return callGetAPI(path,retryCount,null);
	}
	
	public String callGetAPI(String path ,int retryCount, String auth) throws Exception {
		
		StringBuilder resultBuilder = null;
		URIBuilder uriBuilder = new URIBuilder();
		HttpClient client = null;
		HttpGet httpGet = null;
		HttpResponse response = null;
		BufferedReader br = null;
		String output = null;

		Integer statusCode = -1;

		int randomInt = randomInt();
		Exception oe = null;

		// 因為HTTP連線的不穩定，常有失敗的狀況發生，所以在連線時，會嘗試至少
		// retryCount 次，若是超過 retryCount 次還是失敗，則結束迴圈。
		do {
			try {
				resultBuilder = new StringBuilder();
				
				// step2. 取得HttpClient連線
				client = httpClientFactory(protocol);
				
				client.getParams().setParameter("http.socket.timeout", timeout);

				// step3. 設定連線參數
				httpGet = new HttpGet(protocol + "://" + host + ":" + port + "/" + path);
								
				if(StringUtils.isNotBlank(auth)) {
					String encoding = Base64.getEncoder().encodeToString((auth).getBytes("utf-8"));
					httpGet.setHeader("Authorization", "Basic " + encoding);
					httpGet.setHeader("kbn-xsrf","true");
				}
				
				// step4. 連線，並取得回傳時間
				response = client.execute(httpGet);

				statusCode = response.getStatusLine().getStatusCode();

				// step6. 取得輸出串流
				br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
				while ((output = br.readLine()) != null) {
					resultBuilder.append(output);
				}

				// step7. 結束迴圈，count設為0
				retryCount = 0;
			} catch (Exception e) {
				oe = e;
			} finally {
				// 關閉reader
				try {
					if (br != null)
						br.close();
				} catch (IOException e) {
				}
				// 關閉HttpClient
				if (client != null)
					client.getConnectionManager().shutdown();
			}
		} while (--retryCount > 0);

		String result = resultBuilder.toString();
		if(result.isEmpty() && oe != null) {
			result = oe.getMessage();
		}
		if (statusCode == -1) {
			throw new HttpUtilException(concatLogTimeStr(path, randomInt) + ": Fail", statusCode,
					result, oe);
		} else if (statusCode == 700) {
			throw new HttpUtilServiceException("Failed : by Service", statusCode,
					result);
		} else if (statusCode != 200) {
			throw new HttpUtilException("Failed : HTTP error code : " + statusCode, statusCode,
					result, oe);
		}

		return resultBuilder.toString();
		
	}
	
	public String callPutAPI(String path, String reqBody, int retryCount) throws Exception{
		return callPutAPI(path, reqBody, retryCount, null);
	}
	
	public String callPutAPI(String path, String reqBody, int retryCount, String auth) throws Exception{
		StringBuilder resultBuilder = null;
		URIBuilder uriBuilder = new URIBuilder();
		HttpClient client = null;
		HttpPut httpPut = null;
		HttpResponse response = null;
		BufferedReader br = null;
		String output = null;

		Integer statusCode = -1;

		int randomInt = randomInt();
		Exception oe = null;

		// 因為HTTP連線的不穩定，常有失敗的狀況發生，所以在連線時，會嘗試至少
		// retryCount 次，若是超過 retryCount 次還是失敗，則結束迴圈。
		do {
			try {
				resultBuilder = new StringBuilder();
				// step1. 組合uri
				uriBuilder = uriBuilder.setScheme(protocol).setHost(host).setPort(port).setPath(path);

				// step2. 取得HttpClient連線
				client = httpClientFactory(protocol);
				
				client.getParams().setParameter("http.socket.timeout", timeout);

				// step3. 設定連線參數
				URI uri = uriBuilder.build();
				httpPut = new HttpPut(protocol + "://" + host + ":" + port + "/" + path);
				
				if(StringUtils.isNotBlank(auth)) {
					String encoding = Base64.getEncoder().encodeToString((auth).getBytes("utf-8"));
					httpPut.setHeader("Authorization", "Basic " + encoding);
					httpPut.setHeader("kbn-xsrf","true");
				}

				StringEntity entity = new StringEntity(reqBody);
//				entity.setContentType("application/x-www-form-urlencoded");
				entity.setContentType("application/json");
				httpPut.setEntity(entity);
				// log.info(concatLogTimeStr(path, randomInt) + "request url:" +
				// uri);

				// step4. 連線，並取得回傳時間
				response = client.execute(httpPut);

				statusCode = response.getStatusLine().getStatusCode();
				
				// step5. 判斷是否連線成功，若是不成功則拋出例外
//				if (statusCode != 200) {
//					throw new ServiceException("Failed : HTTP error code : " + statusCode);
//				}

				// step6. 取得輸出串流
				br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
				while ((output = br.readLine()) != null) {
					resultBuilder.append(output);
				}

				// step7. 結束迴圈，count設為0
				retryCount = 0;
			} catch (Exception e) {
				oe = e;
			} finally {
				// 關閉reader
				try {
					if (br != null)
						br.close();
				} catch (IOException e) {
				}
				// 關閉HttpClient
				if (client != null)
					client.getConnectionManager().shutdown();
			}
		} while (--retryCount > 0);

		String result = resultBuilder.toString();
		if(result.isEmpty() && oe != null) {
			result = oe.getMessage();
		}
		if (statusCode == -1) {
			throw new HttpUtilException(concatLogTimeStr(path, randomInt) + ": Fail", statusCode,
					result, oe);
		} else if (statusCode == 700) {
			throw new HttpUtilServiceException("Failed : by Service", statusCode,
					result);
		} else if (statusCode != 200) {
			System.out.println("result :"+result);
			throw new HttpUtilException("Failed : HTTP error code : " + statusCode, statusCode,
					result, oe);
		}

		return resultBuilder.toString();
	}
	
	/**
	 * 系統介接
	 * @param path
	 * @param pairList
	 * @param retryCount
	 * @return
	 * @throws HttpUtilException
	 * @throws NoSuchAlgorithmException
	 */
	public String callPostAPI(String path, List<NameValuePair> pairList, int retryCount) throws HttpUtilException, NoSuchAlgorithmException {
		String reqBody = URLEncodedUtils.format(pairList, "UTF-8");
		return callPostAPI(path, reqBody, retryCount, null);
	}

	public String callPostAPI(String path, String reqBody, int retryCount) throws HttpUtilException, NoSuchAlgorithmException {
		return callPostAPI(path, reqBody, retryCount, null);
	}
	
	public String callPostAPI(String path, String reqBody, int retryCount, String auth) throws HttpUtilException, NoSuchAlgorithmException {
		// Declare
		StringBuilder resultBuilder = null;
		URIBuilder uriBuilder = new URIBuilder();
		HttpClient client = null;
		HttpPost httpPost = null;
		HttpResponse response = null;
		BufferedReader br = null;
		String output = null;

		Integer statusCode = -1;

		int randomInt = randomInt();
		Exception oe = null;

		// 因為HTTP連線的不穩定，常有失敗的狀況發生，所以在連線時，會嘗試至少
		// retryCount 次，若是超過 retryCount 次還是失敗，則結束迴圈。
		do {
			try {
				resultBuilder = new StringBuilder();
				// step1. 組合uri
				uriBuilder = uriBuilder.setScheme(protocol).setHost(host).setPort(port).setPath(path);

				logger.info("protocol :"+protocol);
				logger.info("host :"+host);
				logger.info("port :"+port);
				
				// step2. 取得HttpClient連線
				client = httpClientFactory(protocol);
				
				client.getParams().setParameter("http.socket.timeout", timeout);

				// step3. 設定連線參數
				URI uri = uriBuilder.build();
				httpPost = new HttpPost(uri);
				
				if(StringUtils.isNotBlank(auth)) {
					String encoding = Base64.getEncoder().encodeToString((auth).getBytes("utf-8"));
					httpPost.setHeader("Authorization", "Basic " + encoding);
					httpPost.setHeader("kbn-xsrf","true");
				}
				
				if(StringUtils.isNotBlank(reqBody)) {
					logger.info("reqBody :"+reqBody);
					StringEntity entity = new StringEntity(reqBody);
					entity.setContentType("application/json");
					httpPost.setEntity(entity);
				}

//				entity.setContentType("application/x-www-form-urlencoded");
				
				// log.info(concatLogTimeStr(path, randomInt) + "request url:" +
				// uri);

				// step4. 連線，並取得回傳時間
				response = client.execute(httpPost);

				statusCode = response.getStatusLine().getStatusCode();
				
				// step5. 判斷是否連線成功，若是不成功則拋出例外
//				if (statusCode != 200) {
//					throw new ServiceException("Failed : HTTP error code : " + statusCode);
//				}

				// step6. 取得輸出串流
				br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
				while ((output = br.readLine()) != null) {
					resultBuilder.append(output);
				}

				// step7. 結束迴圈，count設為0
				retryCount = 0;
			} catch (Exception e) {
				oe = e;
			} finally {
				// 關閉reader
				try {
					if (br != null)
						br.close();
				} catch (IOException e) {
				}
				// 關閉HttpClient
				if (client != null)
					client.getConnectionManager().shutdown();
			}
		} while (--retryCount > 0);

		String result = resultBuilder.toString();
		if(result.isEmpty() && oe != null) {
			result = oe.getMessage();
		}
		if (statusCode == -1) {
			logger.error(" :"+result);
			throw new HttpUtilException(concatLogTimeStr(path, randomInt) + ": Fail", statusCode,
					result, oe);
		} else if (statusCode == 700) {
			logger.error(" :"+result);
			throw new HttpUtilServiceException("Failed : by Service", statusCode,
					result);
		} else if (statusCode >= 400) {
			logger.error(" :"+result);
			throw new HttpUtilException("Failed : HTTP error code : " + statusCode + " ,error message :"+result, statusCode,
					result, oe);
		}

		return resultBuilder.toString();
	}
	
	/**
	 * API Server 自定義錯誤拋出 
	 * @author tim
	 */
	public class HttpUtilServiceException extends HttpUtilException {
		public HttpUtilServiceException(String error, int statusCode, String result) {
			super(error, statusCode, result);
		}
	};
	
	/**
	 * HttpUtil 拋出錯誤 
	 * @author tim
	 */
	public class HttpUtilException extends RuntimeException {
		private int statusCode;
		String result;
		public HttpUtilException(String error, int statusCode, String result, Throwable th) {
			super(error, th);
			this.result = result;
			this.statusCode = statusCode;
		}
		public HttpUtilException(String error, int statusCode, String result) {
			super(error);
			this.result = result;
			this.statusCode = statusCode;
		}
		public int getStatusCode() {
			return statusCode;
		}
		public String getResult() {
			return result;
		}
		public void setResult(String r) {
			this.result = r;
		}
	}

	private String concatLogTimeStr(String uri, int random) {
		String logTimeStr = null;
		uri = StringUtils.defaultString(uri);
		return "[" + uri + "][" + random + "][" + logTimeStr + "]";
	}

	/**
	 * ref:
	 * http://javaskeleton.blogspot.tw/2010/07/avoiding-peer-not-authenticated
	 * -with.html
	 * 
	 * @param protocol
	 * @param port
	 * @return
	 * @throws KeyManagementException
	 * @throws NoSuchAlgorithmException
	 * @throws UnrecoverableKeyException
	 * @throws KeyStoreException
	 * @throws IOException
	 * @throws FileNotFoundException
	 * @throws NumberFormatException
	 */
	private HttpClient httpClientFactory(String protocol) throws KeyManagementException, NoSuchAlgorithmException {
		return "http".equals(protocol) ? getHttpClient() : getHttpsClient();
	}

	private HttpClient getHttpClient() {
		return setDefaultSocketTime(new DefaultHttpClient());
	}

	private HttpClient getHttpsClient() throws KeyManagementException, NoSuchAlgorithmException {
		SSLSocketFactory ssf = buildSSLSocketFactory();

		DefaultHttpClient base = new DefaultHttpClient();
		ClientConnectionManager ccm = base.getConnectionManager();
		SchemeRegistry sr = ccm.getSchemeRegistry();
		sr.register(new Scheme("https", ssf, 443));

		HttpClient client = setDefaultSocketTime(new DefaultHttpClient(ccm, base.getParams()));

		// connect by proxy
		if (webProxyUrl != null) {
			HttpHost proxy = new HttpHost(webProxyUrl, webProxyPort);
			client.getParams().setParameter(ConnRoutePNames.DEFAULT_PROXY, proxy);
		}

		return client;
	}

	@SuppressWarnings("deprecation")
	private SSLSocketFactory buildSSLSocketFactory() throws NoSuchAlgorithmException, KeyManagementException {
		SSLContext ctx = SSLContext.getInstance("TLS");
		X509TrustManager tm = new X509TrustManager() {

			public void checkClientTrusted(X509Certificate[] xcs, String string) throws CertificateException {
			}

			public void checkServerTrusted(X509Certificate[] xcs, String string) throws CertificateException {
			}

			public X509Certificate[] getAcceptedIssuers() {
				return null;
			}
		};
		ctx.init(null, new TrustManager[] { tm }, null);
		SSLSocketFactory ssf = new SSLSocketFactory(ctx);
		ssf.setHostnameVerifier(new X509HostnameVerifier() {

			@Override
			public void verify(String string, SSLSocket ssls) throws IOException {
			}

			@Override
			public void verify(String string, X509Certificate xc) throws SSLException {
			}

			@Override
			public void verify(String string, String[] strings, String[] strings1) throws SSLException {
			}

			@Override
			public boolean verify(String string, SSLSession ssls) {
				return true;
			}
		});
		return ssf;
	}

	/**
	 * 設置外部api的http socket timeout
	 * 
	 * @param client
	 * @return
	 * @throws IOException
	 * @throws FileNotFoundException
	 * @throws NumberFormatException
	 */
	protected HttpClient setDefaultSocketTime(HttpClient client) {
		client.getParams().setParameter("http.socket.timeout", timeout);
		client.getParams().setParameter("http.connection.timeout", timeout);
		return client;
	}
	
	protected int randomInt() throws NoSuchAlgorithmException {
		// step1. 實體化亂數產生器
		if (random == null) {
			random = SecureRandom.getInstance("SHA1PRNG");
		}
		return random.nextInt(Integer.MAX_VALUE);
	}
}
