package demo.controller.user;

import java.text.ParseException;

import javax.ws.rs.core.Response;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import demo.service.user.AccountService;
import demo.service.watch.WatchService;
import demo.vo.api.WatchVo;

@RestController
public class WatchController {

	@Autowired
	@Qualifier("watchService")
	private WatchService watchService;
	
	@Autowired
	@Qualifier("AccountService")
	private AccountService accountService;
	
	@CrossOrigin
	@PostMapping(path = "/watch/watchData")
	public Response watchData(@RequestBody(required=false) WatchVo vo,@RequestParam String uuid) throws Exception {
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
			result = watchService.findWatchData(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/watch/newWatch")
	public Response souItem(@RequestBody WatchVo vo,@RequestParam String uuid) throws Exception {
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
			result = watchService.saveOrUpdateWatch(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/watch/delWatch")
	public Response delItem(@RequestBody WatchVo vo,@RequestParam String uuid) throws Exception {
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
			result = watchService.delWatchById(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/watch/groupList")
	public Response groupList(@RequestBody(required=false) WatchVo vo,@RequestParam String uuid) throws Exception {
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
			result = watchService.findGroupList(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/watch/groupData")
	public Response groupData(@RequestBody(required=false) WatchVo vo,@RequestParam String uuid) throws Exception {
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
			result = watchService.findGroupData(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/watch/delGroup")
	public Response delGroup(@RequestBody WatchVo vo,@RequestParam String uuid) throws Exception {
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
			result = watchService.delGroup(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/watch/souGroup")
	public Response souGroup(@RequestBody WatchVo vo,@RequestParam String uuid) throws Exception {
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
			result = watchService.saveOrUpdateGroup(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
	
	@CrossOrigin
	@PostMapping(path = "/watch/watchIpList")
	public Response watchIpList(@RequestBody WatchVo vo,@RequestParam String uuid) throws Exception {
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
			result = watchService.findWatchIpList(vo);
		}catch(Exception e) {
			JSONObject error = new JSONObject();
			error.put("errorMessage", e.getMessage());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(error.toString()).build();
		}
		
		return Response.status(Response.Status.OK).entity(result).build();
	}
}
