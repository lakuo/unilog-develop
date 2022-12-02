package demo.util;

import java.util.Hashtable;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.ldap.Control;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import demo.service.user.UnilogConfigService;

@Component("ldap")
public class LDAPAuthentication {
    private final String FACTORY = "com.sun.jndi.ldap.LdapCtxFactory";
    private LdapContext ctx = null;
    private final Control[] connCtls = null;
  
	@Autowired
	@Qualifier("UnilogService")
	private UnilogConfigService unilogConfigService;
	
	/**
	 * ex:ldapurl = ldap://192.168.1.205:389/
	 *    ldapbasedn = cn=demo1,dc=sys,dc=com ,可為空值,視ad設定調整
	 * @param account
	 * @param mima
	 */
    public boolean ldapConnect(String account, String mima) {
    	String ldapUrl = unilogConfigService.getUnilogConfigByName("ldap.url");
    	String ldapBasedn = unilogConfigService.getUnilogConfigByName("ldap.basdedn");
    	
        Hashtable<String, String> env = new Hashtable<String, String>();
        env.put(Context.INITIAL_CONTEXT_FACTORY, FACTORY);
        env.put(Context.PROVIDER_URL, ldapUrl + ldapBasedn);
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, account);   // 管理員
        env.put(Context.SECURITY_CREDENTIALS, mima);  // 管理員密碼
         
        try {
            ctx = new InitialLdapContext(env, connCtls);
            System.out.println( "認證成功" ); 
            System.out.println(ctx);
             return true;
        } catch (javax.naming.AuthenticationException e) {
            System.out.println("認證失敗：");
            e.printStackTrace();
            return false;
        } catch (Exception e) {
            System.out.println("認證出錯：");
            e.printStackTrace();
            return false;
        }finally {
        	if (ctx != null) {
                try {
                    ctx.close();
                }
                catch (NamingException e) {
                    e.printStackTrace();
                }
            }
        }
         
        
    }
}
