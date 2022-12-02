package demo.service.user.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import demo.entity.user.GroupInfo;
import demo.model.user.GroupModel;
import demo.repository.user.GroupRepository;
import demo.service.user.GroupService;

@Service("GroupService")
public class GroupServiceImpl implements GroupService {

	@Autowired
	GroupRepository groupRepository;

	@Override
	public List<GroupModel> getAllGroup() {
		List<GroupModel> GroupModelList = new ArrayList<>();
		for (GroupInfo result : groupRepository.findAll()) {
			GroupModel Group = new GroupModel();
			Group.setGroupId(result.getGroupId());
			Group.setGroupcnname(result.getGroupCNName());
			GroupModelList.add(Group);
		}
		return GroupModelList;
	}

	@Override
	public String getGroupCNNameByGroupId(Integer groupId) {
		return groupRepository.findGroupCNNameByGroupId(groupId);
	}

}
