#!/bin/bash

# 1. Force the correct Temurin Java & Android paths
export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk-amd64
export ANDROID_HOME=$HOME/Android/Sdk

# Dynamically find the latest build-tools (for zipalign and apksigner)
BUILD_TOOLS_DIR=$(ls -d $ANDROID_HOME/build-tools/* 2>/dev/null | tail -n 1)
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$BUILD_TOOLS_DIR:$PATH

echo "--- Starting Farsi Bible Build Process ---"

# 2. Build Web Assets
npm run build

# 3. Sync to Android
npx cap sync android

# 4. Compile the APK
cd android
./gradlew assembleRelease
cd ..

# 5. Safety Check: Did the APK actually build?
# Note: Depending on your Gradle config, this might be app-release-unsigned.apk 
# or just app-release.apk if signing isn't configured in build.gradle
APK_PATH="android/app/build/outputs/apk/release/app-release-unsigned.apk"

if [ ! -f "$APK_PATH" ]; then
    # Fallback check if Gradle produced a different filename
    APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
fi

if [ ! -f "$APK_PATH" ]; then
    echo "❌ ERROR: APK file not found."
    echo "Check the Gradle output above for compilation errors."
    exit 1
fi

# 6. Clean up old files
rm -f farsi-bible-android.apk
rm -f farsi-bible-aligned.apk

# 7. Align the APK
echo "--- Aligning APK ---"
zipalign -v 4 "$APK_PATH" farsi-bible-aligned.apk

# 8. Sign the APK
echo "--- Signing APK ---"
# Ensure the --ks file matches the one you generated in step 1
apksigner sign --ks farsi-bible.jks --out farsi-bible-android.apk farsi-bible-aligned.apk

# 9. Clean up
rm farsi-bible-aligned.apk

echo "------------------------------------------------"
echo "DONE! Your optimized APK is: farsi-bible-android.apk"
echo "------------------------------------------------"