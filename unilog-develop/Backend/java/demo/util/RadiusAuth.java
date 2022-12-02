package demo.util;

import java.io.IOException;
import java.net.UnknownHostException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.tinyradius.packet.AccessRequest;
import org.tinyradius.packet.RadiusPacket;
import org.tinyradius.util.RadiusClient;
import org.tinyradius.util.RadiusException;

import demo.service.user.UnilogConfigService;

@Component
public class RadiusAuth {

	@Autowired
	@Qualifier("UnilogService")
	private UnilogConfigService unilogConfigService;
	
	public boolean RadiusCheck(String account, String mema) {
		System.out.println("Radius Start");
		try {
			//RadiusClient rc = new RadiusClient(ymlConfig.getRadius_server(), ymlConfig.getRadius_secret());
			RadiusClient rc = new RadiusClient(unilogConfigService.getUnilogConfigByName("radius.server"), unilogConfigService.getUnilogConfigByName("radius.secrt"));
			rc.setAcctPort(1812);
			rc.setAuthPort(1812);
			AccessRequest accessRequest = new AccessRequest(account, mema);
	        accessRequest.addAttribute("NAS-IP-Address", unilogConfigService.getUnilogConfigByName("radius.nas"));
	        accessRequest.addAttribute("NAS-Port", "0");
	        System.out.println(accessRequest.toString());
	        RadiusPacket response = rc.authenticate(accessRequest);
			if (response.getPacketType() == RadiusPacket.ACCESS_ACCEPT) {
				return true;
			} else {
				return false;
			}
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (RadiusException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return false;
	}
}