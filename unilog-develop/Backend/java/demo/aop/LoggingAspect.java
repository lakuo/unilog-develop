package demo.aop;

import java.util.*;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import demo.model.user.UserModel;
import demo.util.OperateLog;
import demo.vo.user.LoginVo;

@Aspect
@Component
public class LoggingAspect implements Ordered {
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Pointcut("execution(* demo.controller.*.*..*(..))")
	public void webLog() {
	}

	@Before("webLog()")
	public void doBefore(JoinPoint joinPoint) throws Throwable {
		// 接收到請求，記錄請求內容
		ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attributes.getRequest();
		logger.info("URL : " + request.getRequestURL().toString());
		logger.info("HTTP_METHOD : " + request.getMethod());
		logger.info("IP : " + request.getRemoteAddr());
		logger.info("CLASS_METHOD : " + joinPoint.getSignature().getDeclaringTypeName() + "."
				+ joinPoint.getSignature().getName());
		logger.info("ARGS : " + Arrays.toString(joinPoint.getArgs()));
//		try {
//			if ("sign".equals(joinPoint.getSignature().getName())) {
//				Object[] args = joinPoint.getArgs();
//				String account = "";
//				if (args.length != 0) {
//					LoginVo loginVo = (LoginVo) args[0];
//					account = loginVo.getAccount();
//				}
//				OperateLog.doLog(request.getRemoteAddr(), account, request.getMethod(), " CLASS_METHOD : "
//						+ joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName());
//			} else if ("updateAccessLevelList".equals(joinPoint.getSignature().getName())
//					|| "getAccessLevelByUuid".equals(joinPoint.getSignature().getName())
//					|| "updateAccount".equals(joinPoint.getSignature().getName())) {
//				Object[] args = joinPoint.getArgs();
//				String uuid = (String) args[args.length - 1];
//				OperateLog.doLog(request.getRemoteAddr(), uuid, request.getMethod(), " CLASS_METHOD : "
//						+ joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName());
//			} else {
//				Object[] args = joinPoint.getArgs();
//				String account = "";
//				if (args.length != 0) {
//					UserModel userModel = (UserModel) args[0];
//					account = userModel.getUuid();
//				}
//				OperateLog.doLog(request.getRemoteAddr(), account, request.getMethod(), " CLASS_METHOD : "
//						+ joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName());
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
	}

//    @AfterReturning(returning = "ret", pointcut = "webLog()")
//    public void doAfterReturning(JoinPoint joinPoint,Response ret) throws Throwable {
//        // 處理完請求，返回內容
//    	logger.info("RESPONSE status : " + ret.getStatus());
//    }

	@Override
	public int getOrder() {
		// TODO Auto-generated method stub
		return 0;
	}
}
