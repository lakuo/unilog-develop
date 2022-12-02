package demo.controller.user;

import javax.ws.rs.core.Response;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import demo.service.backup.BackupService;
import demo.service.user.AccountService;
import demo.vo.api.JobVo;

@RestController
public class BackupController {

	private static final Logger logger 
	  = LoggerFactory.getLogger(BackupController.class);
	@Autowired
	@Qualifier("backupService")
	private BackupService backupService;
	
	@Autowired
	@Qualifier("AccountService")
	private AccountService accountService;
	
	@CrossOrigin
	@PostMapping(path = "/backup/main")
	public Response backupMain(@RequestBody(required=false) JobVo vo,@RequestParam String uuid) throws Exception {
		if (!accountService.comfirmByUuid(uuid)) {
			return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
		}
		
		if(accountService.checkExpiredDate(uuid)) {
			accountService.updExpiredDate(uuid);
		}else {
			return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
		}
		
		String result = "";
		
		try {
			result = backupService.backupMain(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/backup/restore")
	public Response restore(@RequestBody(required=true) JobVo vo,@RequestParam String uuid) throws Exception {
		if (!accountService.comfirmByUuid(uuid)) {
			return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
		}
		
		if(accountService.checkExpiredDate(uuid)) {
			accountService.updExpiredDate(uuid);
		}else {
			return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
		}
		
		String result  = "";
		
		try {
			result = backupService.restore(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/backup/newPolicy")
	public Response newPolicy(@RequestBody JobVo vo,@RequestParam String uuid) throws Exception {
		if (!accountService.comfirmByUuid(uuid)) {
			return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
		}
		
		if(accountService.checkExpiredDate(uuid)) {
			accountService.updExpiredDate(uuid);
		}else {
			return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
		}
		
		String result = "";
		
		try {
			result = backupService.newPolicy(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/backup/delPolicy")
	public Response delPolicy(@RequestBody JobVo vo,@RequestParam String uuid) throws Exception {
		if (!accountService.comfirmByUuid(uuid)) {
			return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
		}
		
		if(accountService.checkExpiredDate(uuid)) {
			accountService.updExpiredDate(uuid);
		}else {
			return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
		}
		
		String result = "";
		
		try {
			result = backupService.delPolicy(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/backup/policy_list")
	public Response policyList(@RequestBody(required=true) JobVo vo,@RequestParam String uuid) throws Exception {
		if (!accountService.comfirmByUuid(uuid)) {
			return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
		}
		
		if(accountService.checkExpiredDate(uuid)) {
			accountService.updExpiredDate(uuid);
		}else {
			return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
		}
		
		String result  = "";
	
		try {
			result = backupService.policyList(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}

		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/backup/index_list")
	public Response indexList(@RequestBody(required=false) JobVo vo,@RequestParam String uuid) throws Exception {
		if (!accountService.comfirmByUuid(uuid)) {
			return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
		}
		
		if(accountService.checkExpiredDate(uuid)) {
			accountService.updExpiredDate(uuid);
		}else {
			return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
		}
		
		String result  = "";

		try {
			result = backupService.indexList(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/backup/delIndex")
	public Response delIndex(@RequestBody JobVo vo,@RequestParam String uuid) throws Exception {
		if (!accountService.comfirmByUuid(uuid)) {
			return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
		}
		
		if(accountService.checkExpiredDate(uuid)) {
			accountService.updExpiredDate(uuid);
		}else {
			return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
		}
		
		String result = "";
		
		try {
			result = backupService.delIndex(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			logger.error("移除規則失敗 :" + e.getMessage());
			error.put("errorMessage", "移除規則失敗");
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/backup/newIndex")
	public Response newIndex(@RequestBody JobVo vo,@RequestParam String uuid) throws Exception {
		if (!accountService.comfirmByUuid(uuid)) {
			return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
		}
		
		if(accountService.checkExpiredDate(uuid)) {
			accountService.updExpiredDate(uuid);
		}else {
			return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
		}
		
		String result = "";
		
		try {
			result = backupService.newIndex(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
}
