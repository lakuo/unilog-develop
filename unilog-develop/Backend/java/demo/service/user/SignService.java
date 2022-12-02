package demo.service.user;

import javax.servlet.http.HttpServletRequest;

import demo.vo.user.LoginVo;

public interface SignService {
	public String login(LoginVo vo, HttpServletRequest request) throws Exception;
}
