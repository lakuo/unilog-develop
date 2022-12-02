package demo.aop;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

//@Aspect
//@Component
public class AuthAspect implements Ordered{
	//private Logger logger = LoggerFactory.getLogger(getClass());
	
//	@Autowired
//	TokenService tokenService;
//	@Autowired
//	AdminService adminService;
//	@Autowired
//	AuthService authService;
	
   // @Pointcut("execution(* demo.controller.*.*.*(..))")
    public void doHander(){}
    
    //@Around("doHander()")
    public Object invoke(ProceedingJoinPoint pjp) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        String reqUrl = request.getRequestURL().toString();
        String httpMethod = request.getMethod();
        String strToken = null;
        
        if("GET".equals(httpMethod)) {
        	strToken = request.getParameter("token");
        } else {
        	Object[] args = pjp.getArgs();
            if(args.length != 0) {
            	//TokenVo tokenVo = (TokenVo) args[0];
            	//strToken = tokenVo.getToken();
            }
        }        
//        logger.info("Token : " + strToken);
        
//        Token token = tokenService.findByToken(strToken);
//        
//        if(token != null) {
//        	Date expiredDate = token.getExpiredDate();
//        	if(new Date().before(expiredDate)) {
//        		
//        		String userId = token.getUserId();
//        		Admin admin = adminService.findByUserId(userId);
//        		String roleId = admin.getRoleId();
//        		Auth auth = authService.findByRoleId(roleId);
//        		String actName = auth.getActName();
//        		String funcName = auth.getFuncName();
//        		
//        		logger.info("actName : " + actName);
//        		logger.info("funcName : " + funcName);
//        		
//        		if(httpMethod.equals(actName) && reqUrl.indexOf(funcName) != -1)
        			return pjp.proceed();
//        	}
//        }
//        
//        ResponseEntity<Object> resp = new ResponseEntity<Object>("token is invaild!", HttpStatus.BAD_REQUEST);
//        List<ResponseEntity<Object>> list = new ArrayList<ResponseEntity<Object>>();
//        list.add(resp);
//        
//    	return list;
    }

	@Override
	public int getOrder() {
		// TODO Auto-generated method stub
		return 1;
	}

}
