package demo.service.user.impl;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import demo.entity.user.UnilogConfig;
import demo.repository.user.UnilogConfigRepository;
import demo.service.user.UnilogConfigService;

@Service("UnilogService")
public class UnilogConfigServiceImpl implements UnilogConfigService {

	private static final Logger logger 
	  = LoggerFactory.getLogger(UnilogConfigServiceImpl.class);
	
	@Autowired
	UnilogConfigRepository unilogConfigRepository;

	private static Map<String, String> cachePropertyMap = new ConcurrentHashMap<String, String>();
	
	@Override
	public String getUnilogConfigByName(String name) {
		String value = cachePropertyMap.get(name);
		if(StringUtils.isBlank(value)) {
			logger.warn("param:" + name + " ,is blank");
		}	
		return value;
	}
	
	@PostConstruct
	public void init() {
		this.refreshCacheConfig();
	}

	@Override
	public void refreshCacheConfig() {
		cachePropertyMap.clear();
		List<UnilogConfig> configs = unilogConfigRepository.findAll();
		for(UnilogConfig config : configs) {
			cachePropertyMap.put(config.getConfigName(), config.getConfig());
		}
	}

	
}
