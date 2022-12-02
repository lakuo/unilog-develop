package demo.service.user.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import demo.entity.user.AccessLevel;
import demo.model.user.AccessLevelModel;
import demo.repository.user.AccessLevelRepository;
import demo.repository.user.GroupRepository;
import demo.repository.user.MainTitleRepository;
import demo.repository.user.SubTitleRepository;
import demo.service.user.AccessLevelService;

@Service("AccessLevelService")
public class AccessLevelServiceImpl implements AccessLevelService {

	@Autowired
	AccessLevelRepository accessLevelRepository;

	@Autowired
	GroupRepository groupRepository;

	@Autowired
	MainTitleRepository mainTitleRepository;

	@Autowired
	SubTitleRepository subTitleRepository;

	@Override
	public List<AccessLevelModel> getAllAccessLevelList(String uuid) {
		List<AccessLevelModel> AccessLevelModelList = new ArrayList<>();
		// AccessLevel轉為AccessLevelModel
		for (AccessLevel result : accessLevelRepository.findAll()) {
			AccessLevelModel AccessLevel = new AccessLevelModel();
			AccessLevel.setAccessLevelId(result.getAccessLevelId());
			AccessLevel.setGroupId(result.getGroupId());
			AccessLevel.setGroupcnname(groupRepository.findGroupCNNameByGroupId(result.getGroupId()));
			AccessLevel.setMainTitleId(result.getMainTitleId());
			AccessLevel.setMainTitleName(mainTitleRepository.getTitleNameByTitleId(result.getMainTitleId()));
			AccessLevel.setSubTitleId(result.getSubTitleId());
			AccessLevel.setSubTitleName(subTitleRepository.getTitleNameByTitleId(result.getSubTitleId()));
			AccessLevel.setClose(result.isClose());
			AccessLevel.setRead(result.isRead());
			AccessLevel.setWrite(result.isWrite());
			AccessLevelModelList.add(AccessLevel);
		}
		return AccessLevelModelList;
	}

	@Override
	public List<AccessLevelModel> getGroupAccessLevelList(String uuid, Integer groupId) {
		List<AccessLevelModel> AccessLevelModelList = new ArrayList<>();
		// AccessLevel轉為AccessLevelModel
		for (AccessLevel result : accessLevelRepository.findByGroupId(groupId)) {
			AccessLevelModel AccessLevel = new AccessLevelModel();
			// userInfo.setUuid(result[0].toString());
			AccessLevel.setAccessLevelId(result.getAccessLevelId());
			AccessLevel.setGroupId(result.getGroupId());
			AccessLevel.setGroupcnname(groupRepository.findGroupCNNameByGroupId(result.getGroupId()));
			AccessLevel.setMainTitleId(result.getMainTitleId());
			AccessLevel.setMainTitleName(mainTitleRepository.getTitleNameByTitleId(result.getMainTitleId()));
			AccessLevel.setSubTitleId(result.getSubTitleId());
			AccessLevel.setSubTitleName(subTitleRepository.getTitleNameByTitleId(result.getSubTitleId()));
			AccessLevel.setClose(result.isClose());
			AccessLevel.setRead(result.isRead());
			AccessLevel.setWrite(result.isWrite());
			AccessLevelModelList.add(AccessLevel);
		}
		return AccessLevelModelList;
	}

	@Override
	public void updateAccessLevel(Integer AccessLevelId,boolean close, boolean read,boolean write) {
		try {
			accessLevelRepository.updateAccessLevelById(close, read, write, AccessLevelId);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
