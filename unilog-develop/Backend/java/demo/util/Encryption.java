package demo.util;

import java.math.BigInteger;
import java.security.MessageDigest;

import org.springframework.stereotype.Component;

@Component
public class Encryption {

	/**
	 * SHA256加密
	 * 
	 * @param str 加密後的報文
	 * @return
	 */
	public String getSHA256(String input) {

		String toReturn = null;
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			digest.reset();
			digest.update(input.getBytes("utf8"));
			toReturn = String.format("%064x", new BigInteger(1, digest.digest()));
		} catch (Exception e) {
			e.printStackTrace();
		}

		return toReturn;
	}
}