package demo.controller.user;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import demo.model.user.UserModel;
import demo.service.user.AccountService;
import demo.util.OperateLog;
import demo.vo.user.UserVo;

@RestController
public class AccountController {

	@Autowired
	@Qualifier("AccountService")
	private AccountService accountService;

	/**
	 * 取得單筆帳號
	 * 
	 * @param UserModel
	 * @return
	 * @throws ParseException
	 */
	@CrossOrigin
	@GetMapping("/account/{targetUuid}")
	public Response getAllAccount(UserModel userModel, @PathVariable String targetUuid, @RequestParam String uuid)
			throws ParseException {
		if (accountService.comfirmByUuid(uuid)) {
			if (accountService.checkExpiredDate(uuid)) {
				accountService.updExpiredDate(uuid);
			} else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			JSONArray data = new JSONArray();
			JSONObject object = new JSONObject();
			UserModel user = new UserModel();
			user = accountService.getAccountByUuid(targetUuid);
//			//登入後取得userUUid、KIBANA
			if (user.getUuid() != null) {
				object.put("uuid", user.getUuid());
				object.put("userFirstName", user.getUserFirstName());
				object.put("userLastName", user.getUserLastName());
				object.put("nickName", user.getNickName());
				object.put("userEmail", user.getUserEmail());
				object.put("groupId", Integer.parseInt(user.getGroupId()));
				object.put("groupCNName", user.getGroupcnname());
				object.put("kibanaToken", user.getKibanaToken());
				object.put("isOnAlarm", Boolean.parseBoolean(user.getIsOnAlarm()));
				object.put("isDelete", Boolean.parseBoolean(user.getIsDelete()));
				object.put("isLocal", accountService.localComfirmByUuid(user.getUuid()));
				data.put(object);
				return Response.ok(data.toString(), new MediaType("application", "json")).build();
			} else {
				return Response.status(Response.Status.NOT_FOUND).entity("找不到該帳號").build();
			}
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}

	/**
	 * 取得所有帳號
	 * 
	 * @param UserModel
	 * @return
	 * @throws ParseException
	 */
	@CrossOrigin
	@GetMapping("/account")
	public Response getAllAccount(UserModel userModel) throws ParseException {
		String userUuid = userModel.getUuid();
		if (accountService.comfirmByUuid(userUuid)) {
			if (accountService.checkExpiredDate(userUuid)) {
				accountService.updExpiredDate(userUuid);
			} else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			JSONArray data = new JSONArray();
			List<UserModel> allUser = new ArrayList<>();
			allUser = accountService.getAllAccount();
//			//登入後取得userUUid、KIBANA
			for (UserModel um : allUser) {
				JSONObject object = new JSONObject();
				object.put("account", um.getUserAccount());
				object.put("uuid", um.getUuid());
				object.put("userFirstName", um.getUserFirstName());
				object.put("userLastName", um.getUserLastName());
				object.put("nickName", um.getNickName());
				object.put("userEmail", um.getUserEmail());
				object.put("groupId", Integer.parseInt(um.getGroupId()));
				object.put("groupCNName", um.getGroupcnname());
				object.put("kibanaToken", um.getKibanaToken());
				object.put("isOnAlarm", Boolean.parseBoolean(um.getIsOnAlarm()));
				object.put("isDelete", Boolean.parseBoolean(um.getIsDelete()));
				object.put("isLocal", accountService.localComfirmByUuid(um.getUuid()));
				data.put(object);
			}
			return Response.ok(data.toString(), new MediaType("application", "json")).build();
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}

	/**
	 * 新增該帳號
	 * 
	 * @param UserModel
	 * @return
	 * @throws Exception
	 */
	@CrossOrigin
	@PostMapping("/account")
	public Response createAccount(@RequestBody UserModel userModel) throws Exception {
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		if (accountService.comfirmByUuid(userModel.getUuid())) {
			if (accountService.comfirm(userModel.getUserAccount())) {
				OperateLog.doLog(request.getRemoteAddr(),
						accountService.getAccountByUuid(userModel.getUuid()).getUserAccount(), request.getMethod(),
						"createAccount fail", "");
				return Response.status(Response.Status.NOT_MODIFIED).entity("已有該帳號").build();
			}
			UserVo user = new UserVo();
			user.setUserAccount(userModel.getUserAccount());
			user.setGroupId(Integer.parseInt(userModel.getGroupId()));
			user.setUserFirstName(userModel.getUserFirstName());
			user.setUserLastName(userModel.getUserLastName());
			user.setUserEmail(userModel.getUserEmail());
			user.setOnAlarm(Boolean.parseBoolean(userModel.getIsOnAlarm()));
			user.setDelete(Boolean.parseBoolean(userModel.getIsDelete()));
			user.setMima(userModel.getMima());
			Integer count = accountService.createAccount(user);
			if (count > 0) {
				OperateLog.doLog(request.getRemoteAddr(),
						accountService.getAccountByUuid(userModel.getUuid()).getUserAccount(), request.getMethod(),
						"createAccount success", "");
				return Response.ok("success", new MediaType("application", "json")).build();
			} else {
				OperateLog.doLog(request.getRemoteAddr(),
						accountService.getAccountByUuid(userModel.getUuid()).getUserAccount(), request.getMethod(),
						"createAccount fail", "");
				return Response.status(Response.Status.NOT_MODIFIED).entity("fail").build();
			}
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}

	/**
	 * 更新該帳號以uuid
	 * 
	 * @param UserModel
	 * @return
	 * @throws Exception
	 */
	@CrossOrigin
	@PutMapping("/account/{updateUuid}")
	public Response updateAccount(@RequestBody UserModel userModel, @PathVariable String updateUuid,
			@RequestParam String uuid) throws Exception {
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		if (accountService.comfirmByUuid(uuid)) {
			if (accountService.checkExpiredDate(uuid)) {
				accountService.updExpiredDate(uuid);
			} else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			UserVo user = new UserVo();
			user.setGroupId(Integer.parseInt(userModel.getGroupId()));
			user.setUserFirstName(userModel.getUserFirstName());
			user.setUserLastName(userModel.getUserLastName());
			user.setUserEmail(userModel.getUserEmail());
			user.setOnAlarm(Boolean.parseBoolean(userModel.getIsOnAlarm()));
			user.setDelete(Boolean.parseBoolean(userModel.getIsDelete()));
			user.setUuid(updateUuid);
			if (!userModel.getMima().isEmpty()) {
				UserModel usermodel = new UserModel();
				usermodel = accountService.getAccountByUuid(updateUuid);
				user.setUserAccount(usermodel.getUserAccount());
				user.setNewmima(userModel.getMima());
			}
			Integer count = accountService.updateAccount(user);
			if (count > 0) {
				OperateLog.doLog(request.getRemoteAddr(), accountService.getAccountByUuid(uuid).getUserAccount(),
						request.getMethod(), "updateAccount success", "");
				return Response.ok("success", new MediaType("application", "json")).build();
			} else {
				OperateLog.doLog(request.getRemoteAddr(), accountService.getAccountByUuid(uuid).getUserAccount(),
						request.getMethod(), "updateAccount fail", "");
				return Response.status(Response.Status.NOT_MODIFIED).entity("fail").build();
			}
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}

	/**
	 * 更新個人帳號
	 * 
	 * @param UserModel
	 * @return
	 * @throws Exception
	 */
	@CrossOrigin
	@PutMapping("/account/personal/{updateUuid}")
	public Response updatepersonalInfo(@RequestBody UserModel userModel, @PathVariable String updateUuid)
			throws Exception {
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		if (accountService.comfirmByUuid(updateUuid)) {
			if (accountService.checkExpiredDate(updateUuid)) {
				accountService.updExpiredDate(updateUuid);
			} else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			UserVo user = new UserVo();
			user.setUserFirstName(userModel.getUserFirstName());
			user.setUserLastName(userModel.getUserLastName());
			user.setUserEmail(userModel.getUserEmail());
			user.setUuid(updateUuid);
			Integer count = accountService.updatePersonalInfo(user);
			if (count > 0) {
				OperateLog.doLog(request.getRemoteAddr(), accountService.getAccountByUuid(updateUuid).getUserAccount(),
						request.getMethod(), "updatePersonalInfo success", "");
				return Response.ok("success", new MediaType("application", "json")).build();
			} else {
				OperateLog.doLog(request.getRemoteAddr(), accountService.getAccountByUuid(updateUuid).getUserAccount(),
						request.getMethod(), "updatePersonalInfo fail", "");
				return Response.status(Response.Status.NOT_MODIFIED).entity("fail").build();
			}
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}

	/**
	 * 更新密碼以uuid
	 * 
	 * @param UserModel
	 * @return
	 * @throws Exception
	 */
	@CrossOrigin
	@PutMapping("/account")
	public Response updateAccountPWD(@RequestBody UserModel userModel, @RequestParam String uuid) throws Exception {
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		if (accountService.comfirmByUuid(uuid)) {
			if (accountService.checkExpiredDate(uuid)) {
				accountService.updExpiredDate(uuid);
			} else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			UserModel getUser = new UserModel();
			getUser = accountService.getAccountByUuid(uuid);
			UserVo user = new UserVo();
			user.setUserAccount(getUser.getUserAccount());
			user.setMima(userModel.getMima());
			if (!userModel.getNewmima().isEmpty()) {
				user.setNewmima(userModel.getNewmima());
			}
			Integer count = accountService.updateAccountPWD(user);
			if (count > 0) {
				OperateLog.doLog(request.getRemoteAddr(), accountService.getAccountByUuid(uuid).getUserAccount(),
						request.getMethod(), "updateAccountPWD success", "");
				return Response.ok("success", new MediaType("application", "json")).build();
			} else {
				OperateLog.doLog(request.getRemoteAddr(), accountService.getAccountByUuid(uuid).getUserAccount(),
						request.getMethod(), "updateAccountPWD fail", "");
				return Response.status(Response.Status.NOT_MODIFIED).entity("fail").build();
			}
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}

	/**
	 * 刪除該帳號以uuid
	 * 
	 * @param UserModel
	 * @return
	 * @throws Exception
	 */
	@CrossOrigin
	@DeleteMapping("/account/{deleteUuid}")
	public Response deleteAccount(@PathVariable String deleteUuid, @RequestParam String uuid) throws Exception {
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		if (accountService.comfirmByUuid(uuid)) {
			if (accountService.checkExpiredDate(uuid)) {
				accountService.updExpiredDate(uuid);
			} else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			UserModel user = new UserModel();
			user = accountService.getAccountByUuid(deleteUuid);
			Integer count = accountService.deleteAccount(user.getUserAccount());
			if (count > 0) {
				OperateLog.doLog(request.getRemoteAddr(), accountService.getAccountByUuid(uuid).getUserAccount(),
						request.getMethod(), "deleteAccount success", "");
				return Response.ok("success", new MediaType("application", "json")).build();
			} else {
				OperateLog.doLog(request.getRemoteAddr(), accountService.getAccountByUuid(uuid).getUserAccount(),
						request.getMethod(), "deleteAccount fail", "");
				return Response.status(Response.Status.NOT_MODIFIED).entity("fail").build();
			}
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}
}
