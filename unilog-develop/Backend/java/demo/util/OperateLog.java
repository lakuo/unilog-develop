package demo.util;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

public class OperateLog {

	private static String FILE_NAME = "tmp";
	// c槽下logs
	private static String LOG_PATH = "/home/protal/logs/";

	public static void doLog(String ip, String account, String method, String content,String email) throws Exception {
		File txtFile = new File(LOG_PATH);
		System.out.println("File_PATH: " + txtFile.getAbsolutePath());
		if (!txtFile.exists()) {
			txtFile.mkdirs();
		}
		txtFile = new File(LOG_PATH + FILE_NAME + "_" + new SimpleDateFormat("yyyyMMdd").format(new Date()) + ".log");
		System.out.println("LOG_PATH: " + txtFile.getAbsolutePath());
		if (!txtFile.exists()) {
			txtFile.createNewFile();
		}
		PrintWriter pw = null;
		try {
			StringBuffer txt = new StringBuffer(
					"[" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date()) + "]");
			txt.append("[" + ip + "]");
			txt.append("[" + account + "]");
			if(!email.isEmpty()) {
				txt.append("[" + email + "]");
			}
			txt.append("[" + method + "]");
			txt.append("[" + content + "]");
			txt.append("\r\n");
			FileWriter fw = new FileWriter(txtFile, true);
			pw = new PrintWriter(fw);
			pw.print(txt.toString());
			System.out.println(txt.toString());
		} finally {
			if (pw != null) {
				pw.close();
			}
		}
	}

	public static void doErrLog(String account, String method, Exception e) throws Exception {
		File txtFile = new File(LOG_PATH);
		if (!txtFile.exists()) {
			txtFile.mkdirs();
		}
		txtFile = new File("." + LOG_PATH + new SimpleDateFormat("yyyyMMdd").format(new Date()) + FILE_NAME + ".log");
		if (!txtFile.exists()) {
			txtFile.createNewFile();
		}
		PrintWriter pw = null;
		try {
			StringBuffer txt = new StringBuffer(
					"[" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").format(new Date()) + "]");
			txt.append("[" + account + "]");
			txt.append("[" + method + "]");
			txt.append(" – ");
			StringWriter errorSW = new StringWriter();
			PrintWriter errorPW = new PrintWriter(errorSW);
			e.printStackTrace(errorPW);
			txt.append(errorSW.toString());
			FileWriter fw = new FileWriter(txtFile, true);
			pw = new PrintWriter(fw);
			pw.print(txt.toString());
			System.out.println(txt.toString());
		} finally {
			if (pw != null) {
				pw.close();
			}
		}
	}
}