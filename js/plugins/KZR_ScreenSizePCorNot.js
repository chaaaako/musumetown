//=============================================================================
// KZR_ScreenSizePCorNot.js
// Version : 1.01
// -----------------------------------------------------------------------------
// [Homepage]: かざり - ホームページ名なんて飾りです。偉い人にはそれがわからんのですよ。 -
//             http://nyannyannyan.bake-neko.net/
// -----------------------------------------------------------------------------
// [Version]
// 1.01 2016/12/30 ウィンドウサイズを自動で修正するように改善
// 1.00 2016/12/29 公開
//=============================================================================

/*:
 * @plugindesc PCとスマホでそれぞれ別の解像度にします。
 * @author ぶちょー
 *
 * @param PC Width
 * @desc PCの解像度（横）
 * デフォルトは 816
 * @default 816
 *
 * @param PC Height
 * @desc PCの解像度（縦）
 * デフォルトは 624
 * @default 624
 *
 * @param Phone Width
 * @desc スマホでの解像度（横）
 * @default 816
 *
 * @param Phone Height
 * @desc スマホでの解像度（縦）
 * @default 624
 *
 * @help
 * スマホと認識するのは、iPhone、iPad、Androidです。
 */

(function() {
  var parameters = PluginManager.parameters('KZR_ScreenSizePCorNot');
  var PC_Width  = Number(parameters['PC Width']  || 816);
  var PC_Height = Number(parameters['PC Height'] || 624);
  var Phone_Width  = Number(parameters['Phone Width']  || 816);
  var Phone_Height = Number(parameters['Phone Height'] || 624);

  var ua = navigator.userAgent.toLowerCase();
  var isiPhone  = (ua.indexOf('iphone') > -1);
  var isiPad    = (ua.indexOf('ipad') > -1);
  var isAndroid = (ua.indexOf('android') > -1);
  if (isiPhone || isiPad || isAndroid) {
      var screenWidth  = Phone_Width;
      var screenHeight = Phone_Height;
  } else {
      var screenWidth  = PC_Width;
      var screenHeight = PC_Height;
  }

//=============================================================================
// SceneManager
//
SceneManager._screenWidth  = screenWidth;
SceneManager._screenHeight = screenHeight;
SceneManager._boxWidth     = screenWidth;
SceneManager._boxHeight    = screenHeight;

var _kzr_SceneManager_run = SceneManager.run;
SceneManager.run = function(sceneClass) {
    _kzr_SceneManager_run.call(this, sceneClass);
    if (!Utils.isNwjs()) return;
    this.updateResolution();
};

SceneManager.updateResolution = function() {
    var resizeWidth = screenWidth - window.innerWidth;
    var resizeHeight = screenHeight - window.innerHeight;
    window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2);
    window.resizeBy(resizeWidth, resizeHeight);
};

})();
