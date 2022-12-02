package demo.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;

public class KibanaConfig {

	// c槽下logs
	private static String CONFIG_PATH = "/home/protal/kibanaConfig/";

	public static String readKibanaConfig(String configName) throws Exception {
		File txtFile = new File(CONFIG_PATH);
		if (!txtFile.exists()) {
			txtFile.mkdirs();
		}
		txtFile = new File(CONFIG_PATH + configName + ".json");
		System.out.println("File_PATH: " + txtFile.getPath());
		if (!txtFile.exists()) {
			return "Config not exist";
		}

		BufferedReader reader = null;
		String configString = "";
		try {
			reader = new BufferedReader(new InputStreamReader(new FileInputStream(txtFile.getAbsolutePath()), "UTF-8"));
			String str = null;
			while ((str = reader.readLine()) != null) {
				configString += " " + str;
			}
			return configString;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				reader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return "Config Reader error";

	}

}