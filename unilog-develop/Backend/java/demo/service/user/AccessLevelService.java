package demo.service.user;

import java.util.List;

import demo.model.user.AccessLevelModel;

public interface AccessLevelService {

	public List<AccessLevelModel> getAllAccessLevelList(String uuid);

	public List<AccessLevelModel> getGroupAccessLevelList(String uuid, Integer groupId);

	void updateAccessLevel(Integer AccessLevelId, boolean close, boolean read, boolean write);

}
