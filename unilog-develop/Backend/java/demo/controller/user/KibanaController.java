package demo.controller.user;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import demo.service.user.AccountService;
import demo.util.KibanaConfig;

@RestController
public class KibanaController {
	
	@Autowired
	@Qualifier("AccountService")
	private AccountService accountService;
	
//  LogZip	
//	@Autowired
//	private ZipBatchLog zipBatchLog;
	
	/**
	 *  取得kibanajson
	 * 
	 * @param 
	 * @return
	 * @throws Exception 
	 */
	@CrossOrigin
	@GetMapping("/kibana/{kibanaName}")
	public Response GetkibanaJson(@PathVariable String kibanaName,@RequestParam String uuid) throws Exception {
		if (accountService.comfirmByUuid(uuid)) {
			if(accountService.checkExpiredDate(uuid)) {
				accountService.updExpiredDate(uuid);
			}else {
				return Response.status(Response.Status.REQUEST_TIMEOUT).entity("帳號登入逾時").build();
			}
			String jsonString = KibanaConfig.readKibanaConfig(kibanaName);
			if("Config not exist".equals(jsonString)||"Config Reader error".equals(jsonString)) {
				return Response.status(Response.Status.NOT_FOUND).entity(jsonString).build();
			}
			return Response.ok(jsonString, new MediaType("application", "json")).build();
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity("無效的帳號").build();
	}
	
	/**
	 *  測試用
	 * 
	 * @param 
	 * @return
	 * @throws
	 * @throws ParseException 
	 */
//	@CrossOrigin
//	@GetMapping("/test")
//	public Response test(@RequestParam String uuid) throws ParseException {
//		boolean x = false;
//		try {
//			x = zipBatchLog.seasonZip("2020", "01~03", 4, false);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return Response.ok(x).build();
//	}
	
	/**
	 * 
	 * 
	 * @param 
	 * @return
	 * @throws IOException 
	 */
//	@CrossOrigin
//	@PostMapping("/kibana/{uuid}")
//	public String kibanaGetAPI(HttpServletRequest request, @PathVariable String uuid) throws IOException {
//		 try {
//		        RestTemplate restTemplate = new RestTemplate();
//		        String result = null;
//		        String body = IOUtils.toString(request.getReader());
//		        if (request.getMethod().equals("POST")) {
//		        	HttpHeaders headers = new HttpHeaders();
//		            headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
//		            headers.add("kbn-xsrf", "true");
//		            HttpEntity<String> entity = new HttpEntity<>(body, headers);
//		            result = restTemplate.postForObject("http://jsonplaceholder.typicode.com/posts", entity, String.class);
//		            //result = restTemplate.postForObject("http://127.0.0.1:8081/sign/login", entity, String.class);
//		        }
//		        return result.toString();
//
//		    } catch (HttpClientErrorException e) {
//		        System.out.println(e);
//		        return "轉發失敗";
//		    }
//	}
}
