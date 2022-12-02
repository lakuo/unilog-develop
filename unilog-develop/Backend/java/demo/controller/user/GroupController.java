package demo.controller.user;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import demo.model.user.GroupModel;
import demo.model.user.UserModel;
import demo.service.user.AccountService;
import demo.service.user.GroupService;

@RestController
public class GroupController {
	
	@Autowired
	@Qualifier("AccountService")
	private AccountService accountService;
	
	@Autowired
	@Qualifier("GroupService")
	private GroupService groupService;

	/**
	 * 取得所有角色
	 * 
	 * @param userModel
	 * @return
	 * @throws ParseException 
	 */
	@CrossOrigin
	@GetMapping("/group")
	public Response getAllGroup(UserModel userModel) throws ParseException {
		String uuid = userModel.getUuid();
		if (accountService.comfirmByUuid(uuid)) {//使用uuid確認使用者身份
			if(accountService.checkExpiredDate(uuid)) {//檢查uudi是否已過期
				accountService.updExpiredDate(uuid);//沒過期自動延長期限
			}else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			JSONArray data = new JSONArray();
			List<GroupModel> allGroup = new ArrayList<>();
			allGroup = groupService.getAllGroup();//取得群組資料

			for (GroupModel gm : allGroup) {
				JSONObject object = new JSONObject();
				object.put("groupId", gm.getGroupId());
				object.put("groupcnname", gm.getGroupcnname());
				data.put(object);
			}
			return Response.ok(data.toString(), new MediaType("application", "json")).build();
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}
}
