package demo.service.user.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import demo.config.YmlConfig;
import demo.entity.user.UserInfo;
import demo.model.user.UserModel;
import demo.repository.user.AccountRepository;
import demo.repository.user.GroupRepository;
import demo.repository.user.UserInfoRepository;
import demo.service.user.AccountService;
import demo.util.Encryption;
import demo.vo.user.LoginVo;
import demo.vo.user.UserVo;

@Service("AccountService")
public class AccountServiceImpl implements AccountService {

	@Autowired
	UserInfoRepository userInfoRepository;

	@Autowired
	AccountRepository accountRepository;

	@Autowired
	GroupRepository groupRepository;

	@Autowired
	private Encryption encryption;

	@Autowired
	private YmlConfig ymlConfig;

	@Override
	public Boolean localComfirm(String account, String mima) {
		Integer i = accountRepository.checkLoaclUser(account, encryption.getSHA256(mima));

		if (i > 0) {
			return true;
		}
		return false;
	}

	@Override
	public Boolean localComfirmByUuid(String uuid) {
		UserInfo user = userInfoRepository.findByUuid(uuid);
		Integer i = accountRepository.checkLoaclAccount(user.getUserAccount());
		if (i > 0) {
			return true;
		}
		return false;
	}

	@Override
	public Boolean comfirm(String account) {
		UserInfo user = userInfoRepository.findByUserAccount(account);
		if (user != null) {
			return true;
		}
		return false;
	}

	@Override
	public Boolean comfirmByUuid(String uuid) {
		UserInfo user = userInfoRepository.findByUuid(uuid);
		if (user != null) {
			return true;
		}
		return false;
	}

	@Override
	public String getUuid(LoginVo loginModel) {
		String account = loginModel.getAccount();
		UserInfo user = userInfoRepository.findByUserAccount(account);
		if (user != null) {
			return user.getUuid();
		}
		return null;
	}

	@Override
	public Integer getGroupId(String uuid) {
		return userInfoRepository.findGroupIdByUuid(uuid);
	}

	@Override
	public String getUserEmail(String account) {
		UserInfo user = userInfoRepository.findByUserAccount(account);
		if (user != null) {
			return user.getUserEmail();
		}
		return "";
	}

	@Override
	public UserModel getAccountByUuid(String uuid) {
		UserModel userModel = new UserModel();
		List<Object[]> user = userInfoRepository.getAccountByUuid(uuid);
		for (Object[] objects : user) {
			userModel.setUuid(objects[0].toString());
			userModel.setUserAccount(objects[1].toString());
			if (objects[2] != null)
				userModel.setUserFirstName(objects[2].toString());
			if (objects[3] != null)
				userModel.setUserLastName(objects[3].toString());
			if (objects[4] != null)
				userModel.setNickName(objects[4].toString());
			if (objects[5] != null)
				userModel.setUserEmail(objects[5].toString());
			userModel.setGroupId(objects[6].toString());
			Integer groupId = Integer.parseInt(objects[6].toString());
			userModel.setGroupcnname(groupRepository.findGroupCNNameByGroupId(groupId));
			userModel.setIsDelete(objects[8].toString());
			userModel.setIsOnAlarm(objects[9].toString());
			if (objects[10] != null) {
				userModel.setKibanaToken(objects[10].toString());
			}
		}
		return userModel;
	}

	@Override
	public List<UserModel> getAllAccount() {
		List<UserModel> userInfoModelList = new ArrayList<>();
		for (Object[] objects : userInfoRepository.getAllAccount()) {
			UserModel userInfo = new UserModel();
			userInfo.setUuid(objects[0].toString());
			userInfo.setUserAccount(objects[1].toString());
			if (objects[2] != null)
				userInfo.setUserFirstName(objects[2].toString());
			if (objects[3] != null)
				userInfo.setUserLastName(objects[3].toString());
			userInfo.setGroupId(objects[6].toString());
			userInfo.setGroupcnname(objects[7].toString());
			userInfo.setIsOnAlarm(objects[8].toString());
			userInfo.setIsDelete(objects[9].toString());
			if (objects[10] != null) {
				userInfo.setKibanaToken(objects[10].toString());
			}
			userInfoModelList.add(userInfo);
		}
		return userInfoModelList;
	}

	@Override
	public Integer createAccount(UserVo UserVo) {
		Integer count = userInfoRepository.save(getUUID(), UserVo.getUserAccount(), UserVo.getGroupId(),
				UserVo.getUserFirstName(), UserVo.getUserLastName(), UserVo.getUserEmail(), UserVo.isDelete(),
				UserVo.isOnAlarm(), new Date());
		if (count > 0) {
			accountRepository.createLoaclUser(UserVo.getUserAccount(), UserVo.getMima());
		}
		return count;
	}

	@Override
	public Integer updateAccount(UserVo UserVo) {
		Integer count = userInfoRepository.updateAccountByUuid(UserVo.getGroupId(), UserVo.getUserFirstName(),
				UserVo.getUserLastName(), UserVo.getUserEmail(), UserVo.isDelete(), UserVo.isOnAlarm(), new Date(),
				UserVo.getUuid());
		if (!UserVo.getNewmima().isEmpty()) {
			accountRepository.updateLoaclUser(UserVo.getNewmima(), UserVo.getUserAccount());
		}
		return count;
	}

	@Override
	public int updateAccountPWD(UserVo UserVo) {
		int count = accountRepository.updateLoaclUserPWD(UserVo.getNewmima(), UserVo.getUserAccount(),
				UserVo.getMima());
		return count;
	}

	@Override
	public int updatePersonalInfo(UserVo UserVo) {
		int count = userInfoRepository.updatePersonalInfoByUuid(UserVo.getUserFirstName(), UserVo.getUserLastName(),
				UserVo.getUserEmail(), UserVo.getUuid());
		return count;
	}

	@Override
	public void updExpiredDate(String uuid) {
		int expiredTime = ymlConfig.getExpiredTimeUser();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.add(Calendar.MINUTE, expiredTime);
		userInfoRepository.updateExpiredDateByUuid(calendar.getTime(), uuid);
	}

	@Override
	public boolean checkExpiredDate(String uuid) throws ParseException {
		int expiredTime = ymlConfig.getExpiredTimeUser();
		String expiredDate = userInfoRepository.getExpiredDateByUuid(uuid);
		if (expiredDate == null) {
			return false;
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		Date date = sdf.parse(expiredDate);
		Calendar nowDate = Calendar.getInstance();
		nowDate.setTime(date);
		Calendar expiredCalendar = Calendar.getInstance();
		expiredCalendar.setTime(new Date());

		long userStayTime = nowDate.getTimeInMillis();
		long nowTime = expiredCalendar.getTimeInMillis();

		if (userStayTime > nowTime) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public int deleteAccount(String account) {
		int count = accountRepository.deleteLoaclUser(account);
		count += userInfoRepository.deleteUserInfo(account);
		return count;
	}

	@Override
	public void updKibanaToken(LoginVo loginvo, String uuid) {
		// userInfoRepository.updateKibanaTokenByUuid(base64Encoder(loginvo), uuid);
		userInfoRepository.updateKibanaTokenByUuid(tmpKibana(loginvo), uuid);
	}

	@Override
	public void logOut(String uuid) {
		int expiredTime = ymlConfig.getExpiredTimeUser();
		Calendar expiredCalendar = Calendar.getInstance();
		expiredCalendar.setTime(new Date());
		expiredCalendar.add(Calendar.MINUTE, 0 - expiredTime);
		userInfoRepository.updateExpiredDateByUuid(expiredCalendar.getTime(), uuid);
	}

	public static String getUUID() {
		String s = UUID.randomUUID().toString();
		return s.replaceAll("-", "");
	}

	public static String tmpKibana(LoginVo loginvo) {
		// account:password ->base64
		String transString = "admin:P@ssword";
		byte[] encodedBytes = Base64.getEncoder().encode(transString.getBytes());
		return new String(encodedBytes);
	}

	public static String base64Encoder(LoginVo loginvo) {
		// account:password ->base64
		// control by groupId
		String transString = loginvo.getAccount() + ":" + loginvo.getMima();
		byte[] encodedBytes = Base64.getEncoder().encode(transString.getBytes());
		return new String(encodedBytes);
	}
}
