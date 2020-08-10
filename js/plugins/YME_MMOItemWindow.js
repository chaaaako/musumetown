//=============================================================================
// MMOItemWindow.js
//=============================================================================


/*:ja
 * @plugindesc アイテムウィンドウをアイコン表示に変更します。
 * @author 弓猫
 *
 * @param Icon Size
 * @desc アイテムリストのアイコンサイズを指定します。
 * @default 64
 *
 * @param Icon Space
 * @desc アイコン同士の横の余白を指定します。
 * @default 25
 *
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * 横に並べる個数は、Icon Sizeと Icon Space の値から自動計算されます。
 * 
 * 利用規約はMITライセンスです
 * https://osdn.jp/projects/opensource/wiki/licenses%2FMIT_license
 * このプラグインに書かれている「@auther 弓猫」を消さない限り、ご自由にお使いいただけます。
 * 
 */

(function() {
    
    var parameters = PluginManager.parameters('MMOItemWindow');
    var iconSize= Number(parameters['Icon Size'] || 64);
    
    	
    var itemList_initialize = Window_ItemList.prototype.initialize;
    Window_ItemList.prototype.initialize = function(x, y, width, height) {
        itemList_initialize.apply(this, arguments);
        this.iconSprite = [];
    };
    
    Window_ItemList.prototype.maxCols = function() {
        return parseInt(this.width / (this.itemWidth() + this.spacing()));
    };

    Window_ItemList.prototype.spacing = function() {
        return 25;
    };

    Window_ItemList.prototype.itemRect = function(index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };


    
    Window_ItemList.prototype.iconBitmap = function(iconIndex) {
        var bitmap = ImageManager.loadSystem('IconSet');
        var bitmap2 = new Bitmap(Window_Base._iconWidth, Window_Base._iconHeight);
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        bitmap2.blt(bitmap, sx, sy, pw, ph, 0, 0);
        
        return bitmap2;
    }
    
    
    Window_ItemList.prototype.itemWidth = function() {
        return iconSize + this.numberWidth();
    };
    
    Window_ItemList.prototype.itemHeight = function(){
        return iconSize + 40;
    }
    
    Window_ItemList.prototype.drawItemIcon = function(item, x, y){
        this.iconSprite[item.id] = new Sprite();
        this.iconSprite[item.id].bitmap = this.iconBitmap(item.iconIndex);
        this.iconSprite[item.id].x = x + this.padding;
        this.iconSprite[item.id].y = y + this.padding;
        this.iconSprite[item.id].scale.x = parseInt(iconSize / Window_Base._iconWidth);
        this.iconSprite[item.id].scale.y = parseInt(iconSize / Window_Base._iconHeight);
        this.addChildAt(this.iconSprite[item.id], 2);
    }
    
    Window_Base.prototype.drawItemName = function(item, x, y, width) {
        width = width || 312;
        if (item) {
            this.resetTextColor();
            this.makeFontSmaller();
            this.drawText(item.name, x, y, width);
            this.resetFontSettings();
        }
    };
    
    
    Window_ItemList.prototype.drawItem = function(index) {
        var item = this._data[index];
        if (item) {
            var numberWidth = this.numberWidth();
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            rect.height = this.itemHeight();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemIcon(item, rect.x + 10, rect.y + 30);
            this.drawItemName(item, rect.x, rect.y)
            this.drawItemNumber(item, rect.x + iconSize, rect.y + rect.height - 30, rect.width);
            this.changePaintOpacity(1);
            
        }
    };
    
    Window_ItemList.prototype.numberWidth = function() {
        return this.textWidth('000');
    };
    Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText('x' + $gameParty.numItems(item), x, y, 'right');
        }
    };
    
    Window_ItemList.prototype.clearIconSprite = function() {
        for(var i=0; i<this.iconSprite.length; i++){
            this.removeChild(this.iconSprite[i]);
        }
    }
    
    Window_ItemList.prototype.refresh = function() {
        this.clearIconSprite();
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

})();