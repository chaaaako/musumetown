//=============================================================================
// AddUnitsToItemWindow.js
//=============================================================================

/*:
 * @plugindesc アイテムウィンドウに単位を追加します。
 * @author jp_asty
 *
 * @param デフォルトの単位
 * @type string
 * @desc デフォルトの単位を指定します。
 * @default 個
 *
 * @help
 * このプラグインは次の条件時にのみ対応しています。
 * ・単位の文字数は全角で1文字。
 * ・アイテムの個数上限は99。
 *
 * アイテムごとに個別の単位を指定する場合は各アイテムのメモ欄に
 * <単位:本>
 * のように記述します。(この場合の単位は本になります)
 *
 * 利用規約
 * This plugin is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

(function() {
  'use strict';
  const inParams = PluginManager.parameters('AddUnitsToItemWindow');

  //-----------------------------------------------------------------------------
  // Window_ItemList
  //
  Window_ItemList.prototype.numberWidth = function() {
    return this.textWidth('00000');
  };

  Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
      this.drawText(':', x, y, width - this.textWidth('0000'), 'right');
      const nums = $gameParty.numItems(item);
      const unit = item.meta["単位"] ? item.meta["単位"] : inParams["デフォルトの単位"];
      this.drawText(nums + unit, x, y, width, 'right');
    }
  };

})();
