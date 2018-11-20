package tools;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.telephony.TelephonyManager;
import android.text.TextUtils;

import java.net.NetworkInterface;
import java.util.Collections;
import java.util.List;

public class DeviceTools {

    private static Context context = null;

//    private static DeviceTools mInstace = null;
//    public static DeviceTools getInstance() {
//        if (null == mInstace){
//            mInstace = new DeviceTools();
//        }
//        return mInstace;
//    }

    public static void init(Context ctx) {
        context = ctx;
    }

    public static String getMacAddress() {

        String macAddress = null;
        WifiManager wifiManager =
                (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        WifiInfo info = (null == wifiManager ? null : wifiManager.getConnectionInfo());

        if (!wifiManager.isWifiEnabled()) {
            //必须先打开，才能获取到MAC地址
            wifiManager.setWifiEnabled(true);
            wifiManager.setWifiEnabled(false);
        }
        if (null != info) {
            macAddress = info.getMacAddress();
        }


        if ("02:00:00:00:00:00".equals(macAddress)) {
            try {
                List<NetworkInterface> all = Collections.list(NetworkInterface.getNetworkInterfaces());
                for (NetworkInterface nif : all) {
                    if (!nif.getName().equalsIgnoreCase("wlan0")) continue;
                    byte[] macBytes = nif.getHardwareAddress();
                    if (macBytes == null) {
                        return "";
                    }
                    StringBuilder res1 = new StringBuilder();
                    for (byte b : macBytes) {
                        res1.append(String.format("%02X:", b));
                    }
                    if (res1.length() > 0) {
                        res1.deleteCharAt(res1.length() - 1);
                    }
                    macAddress = res1.toString();
                    break;
                }
            } catch (Exception ex) {
            }
        }

        return "mac:"+macAddress;
    }

    public static String getDeviceId() {
        StringBuilder deviceId = new StringBuilder();
        // 渠道标志
        deviceId.append("a");
        String mac = getMacAddress();
        if (mac != null) {
            deviceId.append("mac");
            deviceId.append(mac);
            return deviceId.toString();
        }



//        try {
//            TelephonyManager tm = (TelephonyManager) context.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
//            if (tm != null) {
//
//
//                //序列号（sn）
//
//                String imei = tm.getDeviceId();
//                if (!TextUtils.isEmpty(imei)) {
//                    deviceId.append("imei");
//                    deviceId.append(imei);
//                    return deviceId.toString();
//                }
//
//
//                String sn = tm.getSimSerialNumber();
//                if (!TextUtils.isEmpty(sn)) {
//                    deviceId.append("sn");
//                    deviceId.append(sn);
//                    return deviceId.toString();
//                }
//            }
//        }catch (Exception e){
//            return  null;
//        }


        return null;
    }
}
