release: apk sign zipalign

apk:
	cordova build --release android

sign:
	jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tnuabus.keystore ./platforms/android/ant-build/TnuaBus-release-unsigned.apk tnuabus

zipalign:
	zipalign -v 4 ./platforms/android/ant-build/TnuaBus-release-unsigned.apk ./platforms/android/ant-build/TnuaBus-release.apk

clean:
	rm -rf ./platforms/android/ant-build/**

.PHONY: apk release sign zipalign