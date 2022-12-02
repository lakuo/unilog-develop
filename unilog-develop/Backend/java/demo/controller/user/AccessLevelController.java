package demo.controller.user;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import demo.entity.user.AccessLevel;
import demo.model.user.AccessLevelModel;
import demo.model.user.UserModel;
import demo.service.user.AccessLevelService;
import demo.service.user.AccountService;
import demo.util.OperateLog;

@RestController
public class AccessLevelController {

	@Autowired
	@Qualifier("AccountService")
	private AccountService accountService;

	@Autowired
	@Qualifier("AccessLevelService")
	private AccessLevelService accesslevelservice;

	/**
	 * 取得該使用者存取權限資料
	 * 
	 * @param UserModel
	 * @return
	 * @throws Exception
	 */
	@CrossOrigin
	@GetMapping("/accesslevel")
	public Response getAccessLevel(UserModel userModel) throws Exception {
		String uuid = userModel.getUuid();
		if (accountService.comfirmByUuid(uuid)) {//使用uuid確認使用者身份
			if(accountService.checkExpiredDate(uuid)) {//檢查uudi是否已過期
				accountService.updExpiredDate(uuid);//沒過期自動延長期限
			} else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			UserModel user = new UserModel();
			user = accountService.getAccountByUuid(uuid);
			JSONArray data = new JSONArray();
			List<AccessLevelModel> AccessLevelList = new ArrayList<>();
			AccessLevelList = accesslevelservice.getGroupAccessLevelList(uuid, Integer.parseInt(user.getGroupId()));
//			//UUid、取得ACCESS權限
			for (AccessLevelModel al : AccessLevelList) {
				JSONObject object = new JSONObject();
				object.put("accessLevelId", al.getAccessLevelId());
				object.put("groupId", al.getGroupId());
				object.put("mainTitleId", al.getMainTitleId());
				object.put("mainTitleName", al.getMainTitleName());
				object.put("subTitleId", al.getSubTitleId());
				object.put("subTitleName", al.getSubTitleName());
				object.put("isClose", al.isClose());
				object.put("isRead", al.isRead());
				object.put("isWrite", al.isWrite());
				data.put(object);
			}
			System.out.println(" :"+data);
			return Response.ok(data.toString(), new MediaType("application", "json")).build();
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}

	/**
	 * 取得該角色存取權限資料
	 * 
	 * @param UserModel,groupId
	 * @return
	 * @throws ParseException
	 */
	@CrossOrigin
	@GetMapping("/accesslevel/{groupId}")
	public Response getAccessLevelByUuid(UserModel userModel, @PathVariable int groupId, @RequestParam String uuid)
			throws ParseException {
		if (accountService.comfirmByUuid(uuid)) {//使用uuid確認使用者身份
			if(accountService.checkExpiredDate(uuid)) {//檢查uudi是否已過期
				accountService.updExpiredDate(uuid);//沒過期自動延長期限
			} else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			JSONArray data = new JSONArray();
			List<AccessLevelModel> AccessLevelList = new ArrayList<>();
//			//UUid、groupid、取得ACCESS權限
			AccessLevelList = accesslevelservice.getGroupAccessLevelList(uuid, groupId);
			for (AccessLevelModel al : AccessLevelList) {
				JSONObject object = new JSONObject();
				object.put("accessLevelId", al.getAccessLevelId());
				object.put("groupId", al.getGroupId());
				object.put("mainTitleId", al.getMainTitleId());
				object.put("mainTitleName", al.getMainTitleName());
				object.put("subTitleId", al.getSubTitleId());
				object.put("subTitleName", al.getSubTitleName());
				object.put("isClose", al.isClose());
				object.put("isRead", al.isRead());
				object.put("isWrite", al.isWrite());
				data.put(object);
			}
			System.out.println(" ::"+data);
			return Response.ok(data.toString(), new MediaType("application", "json")).build();
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}

	/**
	 * 
	 * 
	 * @param userModel , uuid
	 * @return
	 * @throws Exception
	 */
	@CrossOrigin
	@PutMapping(path = "/accesslevel/{updateUuid}")
	public Response updateAccessLevelList(@RequestBody List<Map<String, String>> AccessLevelList,
			@PathVariable String updateUuid, @RequestParam String uuid) throws Exception {
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		if (accountService.comfirmByUuid(uuid)) {//使用uuid確認使用者身份
			if(accountService.checkExpiredDate(uuid)) {//檢查uudi是否已過期
				accountService.updExpiredDate(uuid);//沒過期自動延長期限
			} else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			for (Map<String, String> map : AccessLevelList) {
				AccessLevel access = new AccessLevel();
				access.setAccessLevelId(Integer.parseInt(map.get("accessLevelId")));
				access.setClose(Boolean.parseBoolean(map.get("isClose")));
				access.setRead(Boolean.parseBoolean(map.get("isRead")));
				access.setWrite(Boolean.parseBoolean(map.get("isWrite")));
				accesslevelservice.updateAccessLevel(access.getAccessLevelId(), access.isClose(), access.isRead(),
						access.isWrite());
			}
			OperateLog.doLog(request.getRemoteAddr(), accountService.getAccountByUuid(uuid).getUserAccount(),
					request.getMethod(), "updateAccessLevel success", "");
			return Response.ok("success", new MediaType("application", "json")).build();
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}
}
