package demo.service.user.impl;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import demo.model.user.UserModel;
import demo.service.user.AccountService;
import demo.service.user.SignService;
import demo.service.user.UnilogConfigService;
import demo.util.LDAPAuthentication;
import demo.util.OperateLog;
import demo.util.RadiusAuth;
import demo.vo.user.LoginVo;
import demo.vo.user.UserVo;

@Service("signService")
public class SignServiceImpl implements SignService {

	@Autowired
	@Qualifier("AccountService")
	private AccountService accountService;

	@Autowired
	private RadiusAuth ra;
	
	@Autowired
	private LDAPAuthentication ldap;
	
	@Autowired
	@Qualifier("UnilogService")
	private UnilogConfigService unilogConfigService;
	
	private final static String RA = "1";
	private final static String AD = "2";
	
	/**
	 * 本地端驗證
	 * @param vo
	 * @param request
	 * @return
	 * @throws Exception
	 */
	private String localLogin(LoginVo vo, HttpServletRequest request) throws Exception{
		if (!accountService.localComfirm(vo.getAccount(), vo.getMima())) {
			OperateLog.doLog(request.getRemoteAddr(), "unknown", request.getMethod(), "login fail", accountService.getUserEmail(vo.getAccount()));
			throw new Exception("本地使用者不存在");
		}
		
		if (!accountService.comfirm(vo.getAccount())) {
			OperateLog.doLog(request.getRemoteAddr(), vo.getAccount(), request.getMethod(), "login fail", accountService.getUserEmail(vo.getAccount()));
			throw new Exception("本地使用者資訊未設定");
		} 

		JSONArray data = new JSONArray();
		JSONObject object = new JSONObject();
		// 取得UUID
		String uuid = accountService.getUuid(vo);
		// 寫入過期時間
		accountService.updExpiredDate(uuid);
		// 寫入kibanaToken
		accountService.updKibanaToken(vo, uuid);
		UserModel user = accountService.getAccountByUuid(uuid);
		// 登入後取得userUUid、KIBANA
		object.put("uuid", user.getUuid());
		object.put("userFirstName", user.getUserFirstName());
		object.put("userLastName", user.getUserLastName());
		object.put("nickName", user.getNickName());
		object.put("userEmail", user.getUserEmail());
		object.put("groupId", user.getGroupId());
		object.put("groupCNName", user.getGroupcnname());
		object.put("kibanaToken", user.getKibanaToken());
		object.put("isLocal", true);
		data.put(object);
		OperateLog.doLog(request.getRemoteAddr(), vo.getAccount(), request.getMethod(), "login success", user.getUserEmail());
		//return Response.ok(data.toString(), new MediaType("application", "json")).build();
		return data.toString();
		
	}

	/**
	 * radius驗證
	 * @param vo
	 * @param request
	 * @return
	 * @throws Exception
	 */
	private String raLogin(LoginVo vo, HttpServletRequest request) throws Exception{
		if (ra.RadiusCheck(vo.getAccount(), vo.getMima())) {
			OperateLog.doLog(request.getRemoteAddr(), vo.getAccount(), request.getMethod(), "login fail", accountService.getUserEmail(vo.getAccount()));
			throw new Exception("RadiusCheck reject");
		}
		
		if (!accountService.comfirm(vo.getAccount())) {
			UserVo user = new UserVo();
			user.setUserAccount(vo.getAccount());
			user.setGroupId(4);
			user.setUserFirstName(vo.getAccount());
			user.setUserLastName(vo.getAccount());
			if(!accountService.getUserEmail(vo.getAccount()).isEmpty()) {
				user.setUserEmail(accountService.getUserEmail(vo.getAccount()));
			}else {
				user.setUserEmail(vo.getAccount());
			}
			user.setOnAlarm(false);
			user.setDelete(false);
			Integer count = accountService.createAccount(user);
			if (count < 0) {
				throw new Exception("RadiusCheck success but create user fail");
			}
		}
		JSONArray data = new JSONArray();
		JSONObject object = new JSONObject();
		// 取得UUID
		String uuid = accountService.getUuid(vo);
		// 寫入過期時間
		accountService.updExpiredDate(uuid);
		// 寫入kibanaToken
		accountService.updKibanaToken(vo, uuid);
		UserModel user = accountService.getAccountByUuid(uuid);
		if ("4".equals(user.getGroupId())) {
			OperateLog.doLog(request.getRemoteAddr(), user.getUserAccount(), request.getMethod(), "Authority undefined", user.getUserEmail());
			throw new Exception("使用者未設定權限");
		}
		// 登入後取得userUUid、KIBANA
		object.put("uuid", user.getUuid());
		object.put("userFirstName", user.getUserFirstName());
		object.put("userLastName", user.getUserLastName());
		object.put("nickName", user.getNickName());
		object.put("userEmail", user.getUserEmail());
		object.put("groupId", user.getGroupId());
		object.put("groupCNName", user.getGroupcnname());
		object.put("kibanaToken", user.getKibanaToken());
		object.put("isLocal", false);
		data.put(object);
		OperateLog.doLog(request.getRemoteAddr(), vo.getAccount(), request.getMethod(), "login success", user.getUserEmail());
		return data.toString();
	}

	/**
	 * ad驗證
	 * @param vo
	 * @param request
	 * @return
	 * @throws Exception
	 */
	private String adLogin(LoginVo vo, HttpServletRequest request) throws Exception{
		if(!ldap.ldapConnect(vo.getAccount(), vo.getMima())) {
			throw new Exception("認證失敗");
		}
		
		if (!accountService.comfirm(vo.getAccount())) {
			UserVo user = new UserVo();
			user.setUserAccount(vo.getAccount());
			user.setGroupId(4);
			user.setUserFirstName(vo.getAccount());
			user.setUserLastName(vo.getAccount());
			if(!accountService.getUserEmail(vo.getAccount()).isEmpty()) {
				user.setUserEmail(accountService.getUserEmail(vo.getAccount()));
			}else {
				user.setUserEmail(vo.getAccount());
			}
			user.setOnAlarm(false);
			user.setDelete(false);
			Integer count = accountService.createAccount(user);
			if (count < 0) {
				throw new Exception("RadiusCheck success but create user fail");
			}
		}
		
		JSONArray data = new JSONArray();
		JSONObject object = new JSONObject();
		// 取得UUID
		String uuid = accountService.getUuid(vo);
		// 寫入過期時間
		accountService.updExpiredDate(uuid);
		// 寫入kibanaToken
		accountService.updKibanaToken(vo, uuid);
		UserModel user = accountService.getAccountByUuid(uuid);
		
		if ("4".equals(user.getGroupId())) {
			OperateLog.doLog(request.getRemoteAddr(), user.getUserAccount(), request.getMethod(), "Authority undefined", user.getUserEmail());
			throw new Exception("使用者未設定權限");
		}
		// 登入後取得userUUid、KIBANA
		object.put("uuid", user.getUuid());
		object.put("userFirstName", user.getUserFirstName());
		object.put("userLastName", user.getUserLastName());
		object.put("nickName", user.getNickName());
		object.put("userEmail", user.getUserEmail());
		object.put("groupId", user.getGroupId());
		object.put("groupCNName", user.getGroupcnname());
		object.put("kibanaToken", user.getKibanaToken());
		object.put("isLocal", false);
		data.put(object);
		OperateLog.doLog(request.getRemoteAddr(), vo.getAccount(), request.getMethod(), "login success", user.getUserEmail());
		return data.toString();
	}

	@Override
	public String login(LoginVo vo, HttpServletRequest request) throws Exception{
		if (vo.getAccount() == null && vo.getMima() == null) {
			OperateLog.doLog(request.getRemoteAddr(), "unknown", request.getMethod(), "login fail", "");
			throw new Exception("未填入帳密");
		}
		String loginType = unilogConfigService.getUnilogConfigByName("login.type");
		
		if(RA.equals(loginType)) {
			return raLogin(vo, request);
		}
		
		if(AD.equals(loginType)) {
			return adLogin(vo, request);
		}
		
		return localLogin(vo, request);
	}

}
