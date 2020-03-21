//===========================================================================
// MpiPictureAlignment.js
//===========================================================================

/*:
 * @plugindesc ピクチャの表示位置を、右寄せや左寄せなどで指定するプラグインコマンドを提供します。
 * @author 奏ねこま（おとぶき ねこま）
 *
 * @param Plugin Command
 * @desc プラグインコマンドを任意のコマンド名に変更できます。
 * @default pict_align
 * 
 * @help
 * [説明]
 *  ピクチャの表示位置や移動先を、座標ではなく「右寄せ」「左寄せ」などで指定する
 *  プラグインコマンドを提供します。
 * 
 * [使用方法]
 *  後述のプラグインコマンドを実行したあと、イベントコマンドの「ピクチャの表示」
 *  または「ピクチャの移動」を行うと、表示位置や移動先の座標を、左寄せや右寄せし
 *  た場合の座標に置き換えます。
 * 
 * [プラグインコマンド]
 *  *基本的な指定方法
 *  pict_align left         : ピクチャを左寄せで表示します。
 *  pict_align 左寄せ       : 同上
 *  pict_align right        : ピクチャを右寄せで表示します。
 *  pict_align 右寄せ       : 同上
 *  pict_align top          : ピクチャを上寄せで表示します。
 *  pict_align 上寄せ       : 同上
 *  pict_align bottom       : ピクチャを下寄せで表示します。
 *  pict_align 下寄せ       : 同上
 *  pict_align center       : ピクチャを横方向の中央に表示します。
 *  pict_align 左右中央     : 同上
 *  pict_align middle       : ピクチャを縦方向の中央に表示します。
 *  pict_align 上下中央     : 同上
 *
 *  *範囲を含んだ指定方法
 *  pict_align 左右中央 2 1 : 画面を2分割したときの左エリアの中央に表示します。
 *  pict_align 左右中央 3 3 : 画面を3分割したときの右エリアの中央に表示します。
 *   ＿＿＿＿＿ ＿＿＿＿＿
 *  |　　　　　|　　　　　|　画面を2分割で考えて、
 *  |　　　　　|　　　　　|　１（左側）のエリアを基準に中央
 *  |　　１　　|　　２　　|
 *  |　　　　　|　　　　　|
 *  |＿＿＿＿＿|＿＿＿＿＿|
 *   ＿＿＿＿＿ ＿＿＿＿＿ ＿＿＿＿＿
 *  |　　　　　|　　　　　|　　　　　|　画面を3分割で考えて、
 *  |　　　　　|　　　　　|　　　　　|　３（右端）のエリアを基準に中央
 *  |　　１　　|　　２　　|　　３　　|
 *  |　　　　　|　　　　　|　　　　　|
 *  |＿＿＿＿＿|＿＿＿＿＿|＿＿＿＿＿|
 * 
 * *ピクセル単位の位置調整
 *  pict_align 右寄せ -10       : 右寄せの位置から10px左に設定
 *  pict_align 下寄せ 10        : 下寄せの位置から10px下に設定
 *  pict_align 左右中央 2 1 10  : 範囲を含んだ指定方法でも位置調整可能
 * 
 * *横方向と縦方向の同時指定
 *  右寄せかつ上下中央など、横方向と縦方向を同時に指定したい場合は、ピクチャの表
 *  示などの前にプラグインコマンドを2回実行してください。
 * 
 *  pict_align 右寄せ
 *  pict_align 上下中央
 *  {ピクチャの表示...}
 * 
 * [利用規約] ..................................................................
 *  - 本プラグインの利用は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  - 商用、非商用、有償、無償、一般向け、成人向けを問わず、利用可能です。
 *  - 利用の際、連絡や報告は必要ありません。また、製作者名の記載等も不要です。
 *  - プラグインを導入した作品に同梱する形以外での再配布、転載はご遠慮ください。
 *  - 本プラグインにより生じたいかなる問題についても、一切の責任を負いかねます。
 * [改訂履歴] ..................................................................
 *   Version 1.00  2017/05/06  First edition.
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
 *  Web Site: http://makonet.sakura.ne.jp/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 *  Copylight (c) 2017 Nekoma Otobuki
 */

var Imported = Imported || {};
var Makonet = Makonet || {};

(function(){
    'use strict';

    var plugin = 'MpiPictureAlignment';

    Imported[plugin] = true;
    Makonet[plugin] = {};

    var $mpi        = Makonet[plugin];
    $mpi.parameters = PluginManager.parameters(plugin);

    $mpi.plugin_command = $mpi.parameters['Plugin Command'];

    var _  = plugin;
    var __ = `$${_}`;

    //==============================================================================
    // Game_System
    //==============================================================================

    Object.defineProperty(Game_System.prototype,_,{
        get:function(){return this[__]=this[__]||{}},
        set:function(value){this[__]=value},
        configurable: true
    });

    //==============================================================================
    // Game_Interpreter
    //==============================================================================

    (function(o,p){
        var f=o[p];o[p]=function(command, args){
            if (command === $mpi.plugin_command) {
                var data = {
                    alignment:  ['left',   'center',   'right',  'top',    'middle',   'bottom',
                                 '左寄せ', '左右中央', '右寄せ', '上寄せ', '上下中央', '下寄せ'].indexOf(args[0].toLowerCase()).clamp(0, 11),
                    partition:  (!!args[2]) ? +args[1] || 1 : 1,
                    position:   +args[2] || 1,
                    adjustment: (!!args[2]) ? +args[3] || 0 : +args[1] || 0
                };
                if (data.alignment > 5) {
                    data.alignment -= 6;
                }
                if (data.alignment < 3) {
                    $gameSystem[_].horizontal = data;
                } else {
                    data.alignment -= 3;
                    $gameSystem[_].vertical = data;
                }
            }
            f.apply(this,arguments);
        };
    }(Game_Interpreter.prototype,'pluginCommand'));

    //==============================================================================
    // Game_Picture
    //==============================================================================

    Object.defineProperty(Game_Picture.prototype,_,{
        get:function(){return this[__]=this[__]||{ data_list: [] }},
        set:function(value){this[__]=value},
        configurable: true
    });

    //==============================================================================
    // Game_Screen
    //==============================================================================

    function _prepareAlignment(pictureId, action) {
        var picture = this.picture(pictureId);
        if (picture && ($gameSystem[_].horizontal || $gameSystem[_].vertical)) {
            $gameSystem[_].action = action;
            picture[_].data_list.push($gameSystem[_]);
        }
        $gameSystem[_] = {};
    }

    (function(o,p){
        var f=o[p];o[p]=function(pictureId){
            f.apply(this,arguments);
            _prepareAlignment.call(this, pictureId, 'show');
        };
    }(Game_Screen.prototype,'showPicture'));

    (function(o,p){
        var f=o[p];o[p]=function(pictureId){
            f.apply(this,arguments);
            _prepareAlignment.call(this, pictureId, 'move');
        };
    }(Game_Screen.prototype,'movePicture'));

    //==============================================================================
    // Sprite_Picture
    //==============================================================================

    (function(o,p){
        var f=o[p];o[p]=function(){
            f.apply(this,arguments);
            var picture = this.picture();
            if (picture && picture[_].data_list.length > 0) {
                var bitmap = null;
                if (this._pictureName) {
                    bitmap = ImageManager.loadPicture(this._pictureName);
                } else {
                    bitmap = new Bitmap(1, 1);
                }
                if (bitmap && bitmap.width) {
                    picture[_].data_list.forEach(function(data) {
                        var horz_align = data.horizontal;
                        var vert_align = data.vertical;
                        var scale_x = (data.action === 'show') ? picture._scaleX : picture._targetScaleX;
                        var scale_y = (data.action === 'show') ? picture._scaleY : picture._targetScaleY;
                        var bmp_width = Math.floor(bitmap.width * (scale_x / 100));
                        var bmp_height = Math.floor(bitmap.height * (scale_y / 100));
                        var box_width = Graphics.boxWidth;
                        var box_height = Graphics.boxHeight;
                        var box_x = (Graphics.width - box_width) / 2;
                        var box_y = (Graphics.height - box_height) / 2;
                        if (horz_align) {
                            var part_width = box_width / horz_align.partition;
                            var picture_x = box_x + part_width * (horz_align.position - 1);
                            switch (horz_align.alignment) {
                                case 1:
                                    picture_x += (part_width - bmp_width) / 2;
                                    break;
                                case 2:
                                    picture_x += (part_width - bmp_width);
                                    break;
                            }
                            if (picture._origin === 1) {
                                picture_x += (bmp_width / 2);
                            }
                            if (data.action === 'show') {
                                picture._x = picture_x + horz_align.adjustment;
                            } else {
                                picture._targetX = picture_x + horz_align.adjustment;
                            }
                        }
                        if (vert_align) {
                            var part_height = box_height / vert_align.partition;
                            var picture_y = box_y + part_height * (vert_align.position - 1);
                            switch (vert_align.alignment) {
                                case 1:
                                    picture_y += (part_height - bmp_height) / 2;
                                    break;
                                case 2:
                                    picture_y += (part_height - bmp_height);
                                    break;
                            }
                            if (picture._origin === 1) {
                                picture_y += (bmp_height / 2);
                            }
                            if (data.action === 'show') {
                                picture._y = picture_y + vert_align.adjustment;
                            } else {
                                picture._targetY = picture_y + vert_align.adjustment;
                            }
                        }
                    });
                    picture[_].data_list = [];
                }
            }
        };
    }(Sprite_Picture.prototype,'updateBitmap'));
}());
