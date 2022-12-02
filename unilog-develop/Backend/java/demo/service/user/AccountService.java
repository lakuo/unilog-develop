package demo.service.user;

import java.text.ParseException;
import java.util.List;

import demo.model.user.UserModel;
import demo.vo.user.LoginVo;
import demo.vo.user.UserVo;

public interface AccountService {

	public Boolean localComfirm(String account, String mima);
	
	public Boolean localComfirmByUuid(String uuid);
	
	public Boolean comfirm(String account);

	public Boolean comfirmByUuid(String uuid);

	public String getUuid(LoginVo loginVo);

	public Integer getGroupId(String uuid);
	
	public String getUserEmail(String account);

	public UserModel getAccountByUuid(String uuid);
	
	public List<UserModel> getAllAccount();

	public Integer createAccount(UserVo UserVo);

	public Integer updateAccount(UserVo UserVo);
	
	public int updateAccountPWD(UserVo UserVo);

	public void updExpiredDate(String uuid);
	
	public int updatePersonalInfo(UserVo UserVo);
	
	public int deleteAccount(String account);
	
	public boolean checkExpiredDate(String uuid) throws ParseException;

	public void updKibanaToken(LoginVo loginVo, String uuid);

	void logOut(String uuid);


}
