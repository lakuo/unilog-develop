package demo.controller.user;

import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import demo.service.user.AccountService;
import demo.service.user.UnilogConfigService;

@RestController
public class UnilogConfigController {
	
	@Autowired
	@Qualifier("AccountService")
	private AccountService accountService;
	
	@Autowired
	@Qualifier("UnilogService")
	private UnilogConfigService unilogConfigService;

	/**
	 *  
	 * 
	 * @param 
	 * @return
	 * @throws Exception 
	 */
	@CrossOrigin
	@GetMapping("/config/{configName}")
	public Response GekibanaJson(@PathVariable String configName,@RequestParam String uuid) throws Exception {
		if (accountService.comfirmByUuid(uuid)) {
			if(accountService.checkExpiredDate(uuid)) {
				accountService.updExpiredDate(uuid);
			}else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			String jsonString = unilogConfigService.getUnilogConfigByName(configName);
			if(jsonString == null) {
				return Response.status(Response.Status.NOT_FOUND).entity("config not found").build();
			}
			return Response.ok(jsonString).build();
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}
	
	@CrossOrigin
	@GetMapping("/config/refresh")
	public String refreshCacheConfig() throws Exception {
		try {
			unilogConfigService.refreshCacheConfig();
		}catch(Exception e) {
			return e.getMessage();
		}
		return "success";
	}
}
