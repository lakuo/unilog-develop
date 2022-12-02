package demo.service.user;

import java.util.List;

import demo.model.user.GroupModel;

public interface GroupService {

	public List<GroupModel> getAllGroup();
	
	public String getGroupCNNameByGroupId(Integer groupId);
	
}
