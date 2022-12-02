package demo.controller.user;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import demo.model.user.UserModel;
import demo.service.user.AccountService;
import demo.service.user.SignService;
import demo.util.OperateLog;
import demo.util.RadiusAuth;
import demo.vo.user.LoginVo;
import demo.vo.user.UserVo;

@RestController
public class SignController {
	@Autowired
	@Qualifier("AccountService")
	private AccountService accountService;

	@Autowired
	private RadiusAuth ra;
	
	@Autowired
	@Qualifier("signService")
	private SignService signService;

	/**
	 * User登入檢核
	 * 
	 * @param loginModel
	 * @return
	 * @throws Exception
	 */
	@CrossOrigin
	@PostMapping("/sign/login")
	public Response sign(@RequestBody LoginVo loginVo) throws Exception {
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		try {
			String result = signService.login(loginVo, request);
			return Response.ok(result, new MediaType("application", "json")).build();
		}catch(Exception e) {
			return Response.status(Response.Status.UNAUTHORIZED).entity(e.getMessage()).build();
		}
	}
	
	/**
	 * User登入檢核舊版
	 * 
	 * @param loginModel
	 * @return
	 * @throws Exception
	 */
	@CrossOrigin
	@PostMapping("/sign/loginOld")
	public Response signOld(@RequestBody LoginVo loginVo) throws Exception {
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		if (loginVo.getAccount() == null && loginVo.getMima() == null) {
			OperateLog.doLog(request.getRemoteAddr(), "unknown", request.getMethod(), "login fail", "");
			return Response.status(Response.Status.UNAUTHORIZED).entity("未填入帳密").build();
		} else if (accountService.localComfirm(loginVo.getAccount(), loginVo.getMima())) {
			if (!accountService.comfirm(loginVo.getAccount())) {
				OperateLog.doLog(request.getRemoteAddr(), loginVo.getAccount(), request.getMethod(), "login fail", accountService.getUserEmail(loginVo.getAccount()));
				return Response.status(Response.Status.UNAUTHORIZED).entity("本地使用者資訊未設定").build();
			} else {
				JSONArray data = new JSONArray();
				JSONObject object = new JSONObject();
				// 取得UUID
				String uuid = accountService.getUuid(loginVo);
				// 寫入過期時間
				accountService.updExpiredDate(uuid);
				// 寫入kibanaToken
				accountService.updKibanaToken(loginVo, uuid);
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
				OperateLog.doLog(request.getRemoteAddr(), loginVo.getAccount(), request.getMethod(), "login success", user.getUserEmail());
				return Response.ok(data.toString(), new MediaType("application", "json")).build();
			}
		} else if (ra.RadiusCheck(loginVo.getAccount(), loginVo.getMima())) {
			if (!accountService.comfirm(loginVo.getAccount())) {
				UserVo user = new UserVo();
				user.setUserAccount(loginVo.getAccount());
				user.setGroupId(4);
				user.setUserFirstName(loginVo.getAccount());
				user.setUserLastName(loginVo.getAccount());
				if(!accountService.getUserEmail(loginVo.getAccount()).isEmpty()) {
					user.setUserEmail(accountService.getUserEmail("elkadmin"));
				}else {
					user.setUserEmail(loginVo.getAccount());
				}
				user.setOnAlarm(false);
				user.setDelete(false);
				Integer count = accountService.createAccount(user);
				if (count < 0) {
					return Response.status(Response.Status.NOT_MODIFIED)
							.entity("RadiusCheck success but create user fail").build();
				}
			}
			JSONArray data = new JSONArray();
			JSONObject object = new JSONObject();
			// 取得UUID
			String uuid = accountService.getUuid(loginVo);
			// 寫入過期時間
			accountService.updExpiredDate(uuid);
			// 寫入kibanaToken
			accountService.updKibanaToken(loginVo, uuid);
			UserModel user = accountService.getAccountByUuid(uuid);
			if ("4".equals(user.getGroupId())) {
				OperateLog.doLog(request.getRemoteAddr(), user.getUserAccount(), request.getMethod(), "Authority undefined", user.getUserEmail());
				return Response.status(Response.Status.UNAUTHORIZED).entity("使用者未設定權限").build();
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
			OperateLog.doLog(request.getRemoteAddr(), loginVo.getAccount(), request.getMethod(), "login success", user.getUserEmail());
			return Response.ok(data.toString(), new MediaType("application", "json")).build();
		} else if (accountService.comfirm(loginVo.getAccount())) {
			OperateLog.doLog(request.getRemoteAddr(), loginVo.getAccount(), request.getMethod(), "login fail", accountService.getUserEmail(loginVo.getAccount()));
			return Response.status(Response.Status.UNAUTHORIZED).entity("RadiusCheck reject").build();
		} else{
			OperateLog.doLog(request.getRemoteAddr(), "unknown", request.getMethod(), "login fail", accountService.getUserEmail("elkadmin"));
			return Response.status(Response.Status.UNAUTHORIZED).entity("RadiusCheck reject").build();
		}
	}

	/**
	 * 登出
	 * 
	 * @param token
	 * @return
	 */
	@CrossOrigin
	@PostMapping("/sign/logout")
	public Response logout(@RequestBody UserModel userModel) {
		accountService.logOut(userModel.getUuid());
		return Response.ok("success").build();
	}
}
