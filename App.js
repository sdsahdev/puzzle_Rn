import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import { TestIds, RewardedAd, RewardedAdEventType, AdEventType, BannerAd, BannerAdSize, useRewardedAd } from 'react-native-google-mobile-ads';

const App = () => {

  const [bannerinfo, setbannerinfo] = useState({})
  const [rewadadsinfo, setrewadadsinfo] = useState({})
  let reward_Id = __DEV__ ? TestIds.REWARDED : !rewadadsinfo.id ? TestIds.REWARDED : rewadadsinfo.id;
  let banner_id = __DEV__ ? TestIds.BANNER : !bannerinfo.id ? TestIds.BANNER : bannerinfo.id;;

  const adConfig = {
    requestConfiguration: {
      tagForChildDirectedTreatment: true, // Set to true if your app is child-directed
      maxAdContentRating: 'G', // Set your desired max ad content rating
    },
  };
  const rewarded = RewardedAd.createForAdRequest(reward_Id, adConfig);

  const getDatadfromapi = () => {
    fetch(
      'https://sheets.googleapis.com/v4/spreadsheets/1fJ9S8xxeti37wff-WPZMhOABXS_cWjagWWcrl_x9o6c/values/Sheet1?valueRenderOption=FORMATTED_VALUE&key=AIzaSyApMSb0vq5eK6iIQJe6duQx4SmIo_6kuJ4'
    )
      .then(res => res.json())
      .then(res => {
        const objects = res.values?.map(innerArray => {
          const obj = {};
          for (let i = 0; i < innerArray.length; i += 2) {
            obj[innerArray[i]] = innerArray[i + 1];
          }
          return obj;
        });

        setbannerinfo(objects?.find(i => i["Ad Type"] == "banner_ad"))
        setrewadadsinfo(objects?.find(i => i["Ad Type"] == "reward_ad"))

        banner_id = objects?.find(i => i["Ad Type"] == "banner_ad")?.id
        reward_Id = objects?.find(i => i["Ad Type"] == "banner_ad")?.id



        console.log(banner_id, "=====adssbanner_id");
        console.log(reward_Id, "=====adssreward_Id");

      })
      .catch(err => {
        console.log(err, '==here data');
      });
  };

  rewarded.addAdEventListener(AdEventType.CLOSED,
    s => {
      try {
        rewarded.load()
      }
      catch (error) {
        Alert.alert(error)
        console.error('Failed to load rewarded ad:', error);
      }
    })

  useEffect(() => {
    console.log(reward_Id);
    console.log(banner_id);
    try {
      getDatadfromapi()
      rewarded.load()
    }
    catch (error) {
      Alert.alert(error)
      console.error('Failed to load rewarded ad:', error);
    }
  }, []);


  useEffect(() => {
    const adTimer = setInterval(() => {

      if (rewarded._loaded) {
        rewarded.show()
      } else {
        try {

          rewarded.load()
        }
        catch (error) {
          Alert.alert(error)
          console.error('Failed to load rewarded ad:', error);
        }
      }
    }, 4 * 60 * 1000); // Load ad every 4 minutes
    // Clean up the interval when the component unmounts
    return () => clearInterval(adTimer);
  }, []);


  return (
    <View style={{ flex: 1 }} >
      <WebView
        scalesPageToFit
        originWhitelist={["*"]}
        source={{
          uri: "file:///android_asset/allweb/pic.html", baseUrl: "file:///android_asset/allweb/"
        }} />
      {bannerinfo.visible == "TRUE" &&
        <BannerAd
          unitId={banner_id}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={adConfig}
        />
      }
    </View>

  )
}

export default App

const styles = StyleSheet.create({})


//   const [test, settest] = useState(0)
//   // let pageSource = { uri: require('./ios/assets/pic.html') };
//   const htmlPath = "ios/Resources/pic.html";
//   const baseurlls = "Resources/";

//   const sourceUri = (
//     Platform.OS === 'android'
//       ? 'file:///android_asset/'
//       : ''
//   ) + 'Web.bundle/loader.html';

//   const params = 'platform=' + Platform.OS;
//   const injectedJS = `
//   if (!window.location.search) {
//     var link = document.getElementById('progress-bar');
//     link.href = './site/index.html?${params}';
//     link.click();
//   }
// `;
//   // require('./html/Web.bundle/site/pic.html')


//   const handleLoad = (res) => {
//     console.log('successfully loaded', res)
//   };

//   const handleError = () => {
//     console.log('error loading');
//   };


