import uniqid from 'uniqid';

// configs
let heighestZIndex = 0;

export default class Drag {
    constructor(){
        this.container = null;
        this.defaultDraggableObject = {
            el : null,
            size : {
                width : 0,
                height : 0
            },
            pos : {
                x : {
                    screenX : 0,
                    clientX : 0,
                    pageX : 0
                },
                y : {
                    screenY : 0,
                    clientY : 0,
                    pageY : 0
                }
            },
            style : {
                zIndex : 0
            },
            options : {
                // moveable : true,
                // onMove : this.move.bind(this),
                // resizable : true,
                // onResize : this.resize.bind(this),
                // border : true,
                // selectable : true,
                // activeBorderStyle : {
                //     borderStyle : "dashed",
                //     borderWidth : "3px"
                // }
            }
        }

        this.draggables = {};

        this.helperFunctions = [
            "push",
            "getIds",
            "moveables",
            "resizables",
            "selectables",
            "findDraggableById"
        ]

        // handlers
        this.moveHandler = new Move();
        this.resizeHandler = new Resizer();
        this.selectionHandler = new Selector();

        // add helpers
        this.draggables.push = this.push.bind(this);
        this.draggables.getIds = this.getIds.bind(this);
        this.draggables.moveables = this.getMovables.bind(this); 
        this.draggables.resizables = this.getResizables.bind(this);
        this.draggables.selectables = this.getSelectables.bind(this); 
        this.draggables.findDraggableById = this.findDraggableById.bind(this);
    }

    /* 
        Helper functions
        1. push
        2. get
        3. movables
    */
    // push draggables
    push(key, obj){
        this.draggables[key] = obj;
    }

    // get ids
    getIds(){
        var innerFunctions = this.helperFunctions;

        var ids = [];
        Object.keys(this.draggables).map((v, k) => {
            if(innerFunctions.indexOf(v) === -1) ids.push(v);
        })

        return ids;
    }

    // get movables
    getMovables(){
        return this.moveHandler.get();
    }

    // get resizables
    getResizables(){
        return this.resizeHandler.get();
    }

    // get selectable
    getSelectables(){
        return this.selectionHandler.get();
    }

    // get default draggable object
    getDefaultDraggableObject(){
        return this.defaultDraggableObject;
    }

    // get draggables
    get(key = null){
        if(key == null) return this.store.state.draggables;
        else return this.this.store.state.draggables[key];
    }

    // reset draggable
    resetDraggable(){
        this.draggables = {}
    }

    // set container
    setContainer(el){
        this.store.set({
            container : el
        }, () => {
            this.container = el;
        })
    }

    // set draggable
    addDraggable(item, options = {}){
        // add to draggables
        var obj = Object.assign({}, this.defaultDraggableObject);
        var className = this._addId(item);
        obj.el = item;
        
        // size
        var size = this.getElementSize(item);
        obj.size = Object.assign({}, size);

        // position
        var pos = this.getElementPosition(item);
        obj.pos = Object.assign({}, pos);

        // style
        var zIndex = this.addZIndex(item);
        obj.style = {
            zIndex : zIndex
        }

        // options
        obj.options = Object.assign({}, options)

        // push to draggables
        this.draggables.push(className, obj);

        // attach handlers
        if(options.moveable) this.moveHandler.attachTo(obj, className);
        if(options.resizable) this.resizeHandler.attachTo(obj, className);
        if(options.selectable) this.selectionHandler.attachTo(obj, className); 

        // add to store
        this.store.set({
            draggables : this.draggables
        })
    }

    // add zindex
    addZIndex(item){
        var zIndex = Object.keys(this.draggables).length;
        item.style.zIndex = zIndex;
        heighestZIndex = zIndex;

        return zIndex;
    }

    // add class
    _addId(item){
        var className = uniqid('ct-');
        item["ct-draggable-uid"] = className;

        return className;
    }

    // find by draggable id
    findDraggableById(id){
        var innerFunctions = this.helperFunctions;
        
        if(innerFunctions.indexOf(id) !== -1) return;
        else return this.draggables[id];
    }

    // get size
    getElementSize(item){
        var boundingRect = item.getBoundingClientRect();

        return {
            width : boundingRect.width,
            height : boundingRect.height
        }
    }

    // get position
    getElementPosition(item){
        var boundingRect = item.getBoundingClientRect();

        var posX = {
            screenX : boundingRect.left,
            clientX : boundingRect.left,
            pageX : boundingRect.left
        }

        var posY = {
            screenY : boundingRect.top,
            clientY : boundingRect.top,
            pageY : boundingRect.top
        }
        
        return {
            x : posX,
            y : posY
        }
    }

    // on select
    onSelect(cb){
        this.selectionHandler.onSelect(cb);
    }
}

/*
    Move element on mouse move
*/
export class Move {
    constructor(){
        this.moveables = {};
        this.activeMove = {
            el : null,
            click : {
                clientX : 0,
                clientY : 0
            }
        }

        // utils
        this.util = new Utility();
        this.resizer = new Resizer();

        // add helpers
        this.moveables.push = this.push.bind(this);
        this.moveables.get = this.get.bind(this);
        
        // bind this
        this.move = this.move.bind(this);
        this._clickOnDoc = this._clickOnDoc.bind(this);
    }

    /* 
        Helper functions
        1. push
        2. get
    */
    // push moveables
    push(key, obj){
        this.moveables[key] = obj;
    }

    // get moveables
    get(key = null){
        if(key === null) return this.moveables;
        else return this.moveables[key];
    }

    // attach move class to an html element
    attachTo(item, className){
        this.moveables.push(className, item);

        // attach events
        this._bindMouseMoveListener(item.el, item.options);
        this._removeMouseMoveListener(item.el);
    }

    // is movable
    _isMoveable(el){
        var moveable = false;
        Object.keys(this.moveables).map((v, k) => {
            if(v.el === el) moveable = true;
        })

        return moveable;
    }

    /* 
        Bind Mouse Move on Mouse down,
        remove Mouse Move listener on Mouse Up 
    */
    _bindMouseMoveListener(el, options){
        el.addEventListener('mousedown', (e) => {
            // set move active
            this._setActiveMove(el);
            // capture click position
            this._setClickPos(e);
            // check position type
            this._checkPositionParameter(el)
            // move element to top
            this._moveElementToTop(el);
            // add border
            this._addBorder(el, options);
            // bind click
            this._bindClickToDocument();

            // add listener from document
            setTimeout(() => {
                var isResizer = this.resizer.isResizer(e.target);
                if(isResizer) return;

                document.addEventListener('mousemove', this.move);
            }, 0)
        });
    }

    // remove event listener
    _removeMouseMoveListener(el){
        document.addEventListener('mouseup', () => {
            // remove listener from document
            document.removeEventListener('mousemove', this.move);

            this.resizer._removeMoveEvent();
        })
    }

    // bind click to document
    _bindClickToDocument(){
        document.addEventListener('click', this._clickOnDoc)
    }

    // remove click to document
    _removeClickToDocument(){
        document.removeEventListener('click', this._clickOnDoc)
    }

    // move element to top
    _moveElementToTop(el){
        el.style.zIndex = heighestZIndex+1;
        heighestZIndex += 1;
    }

    // add border
    _addBorder(el, options = {}, styleOption = {}){
        var style = {
            borderStyle : "dashed",
            borderWidth : "1px",
            borderColor : "#D7D7D7",
            ...(options.activeBorderStyle || {}),
            ...(styleOption)
        }

        this.util._addStyles(el, style);
    }

    // handle move
    _setActiveMove(el){
        if(this.activeMove.el){
            var activeElement = this.activeMove.el;
            // remove border
            this._addBorder(activeElement, {}, { borderStyle : "none"})
        }

        // set new el
        this.activeMove = {
            el : el
        }

        // add to store
        this.store.set({
            activeMovable : this.activeMove
        })
    }

    // click on document
    _clickOnDoc(e){
        var element = e.target; 
        var activeElement = this.activeMove.el;
        
        if(element !== activeElement && this._isMoveable(element)){
            this.activeMove = {};

            // remove border
            this._addBorder(activeElement, {}, { borderStyle : "none"});

            // remove resizer event
            this.resizer._clickOnDoc(e);

            // remove click to doc
            this._removeClickToDocument();
        }
    }

    // set click position
    _setClickPos(e){
        var activeMove = Object.assign({}, this.activeMove);
        activeMove.click = {
            clientX : activeMove.el.offsetLeft - e.clientX,
            clientY : activeMove.el.offsetTop - e.clientY
        }

        this.activeMove = Object.assign({}, activeMove);
    }

    // check position parameter
    _checkPositionParameter(el){
        if(el.style.position !== "absolute")
            el.style.position = "absolute"
    }

    // move
    move(e){
        var activeMove = Object.assign({}, this.activeMove);
        var el = activeMove.el;
        var elemId = el["ct-draggable-uid"];
        var clickPos = activeMove.click;
        
        // position
        var left = e.clientX + clickPos.clientX;
        var top = e.clientY + clickPos.clientY;

        el.style.left = left+"px";
        el.style.top = top+"px";

        // --------------------------- update data
        // update draggables
        var draggables = Object.assign({}, this.store.state.draggables);
        var elem = Object.assign({}, draggables[elemId]);
        elem.pos = {
            x : {
                clientX : left,
                screenX : left,
                pageX : left,
            },
            y : {
                clientY : top,
                screenY : top,
                pageY : top
            }
        }

        draggables[elemId] = Object.assign({}, elem);
        this.store.set({
            draggables : draggables
        })

        // update moveables
        var moveables = Object.assign({}, this.moveables);
        moveables[elemId] = Object.assign({}, elem);

        this.moveables = Object.assign({}, moveables);

        // ------------------------------- callback
        if(elem.options.hasOwnProperty("onMove"))
            elem.options.onMove(elem);
    }
}

/*
    Move element on mouse move
*/
export class Resizer {
    constructor(){
        this.resizables = {};
        this.activeResizer = {
            el : null,
            resizers : {
                left : null,
                right : null,
                bottom : null,
                top : null
            },
            coords : {
                clickPos : [0, 0],
                mousePos : [0, 0],
                originalCoord : [0, 0],
                direction : "left",
                pivots : [0, 0, 0, 0]
            }
        }

        // resizer styles
        this.resizerSize = {
            width : 14,
            height : 14
        }

        this.resizerBaseStyle = {
            position : "absolute",
            width : this.resizerSize.width+"px",
            height : this.resizerSize.height+"px",
            borderRadius : "50%",
            borderStyle : "dashed",
            borderWidth : "1px",
            borderColor : "gray"
        };

        this.xCoeff = 42;
        this.yCoeff = 3.5;

        // bind this
        this._clickOnDoc = this._clickOnDoc.bind(this);
        this._bindMoveEvent = this._bindMoveEvent.bind(this);
        this._removeMoveEvent = this._removeMoveEvent.bind(this);
        this.resize = this.resize.bind(this);
        this._bindEventToResizer = this._bindEventToResizer.bind(this);
        this._removeEventFromResizer = this._removeEventFromResizer.bind(this);

        // utils
        this.html = new Html();
        this.util = new Utility();

        // add helpers
        this.resizables.push = this.push.bind(this);
        this.resizables.get = this.get.bind(this);
    }

    /* 
        Helper functions
        1. push
        2. get
    */
    // push resizables
    push(key, obj){
        this.resizables[key] = obj;
    }

    // get resizables
    get(key = null){
        if(key === null) return this.resizables;
        else return this.resizables[key];
    }

    // check if element is resizer
    isResizer(el){
        var activeResizer = this.store.state.activeResizer;
        var resizers = activeResizer.resizers;

        if(el === resizers.left || el === resizers.right || el === resizers.top || el === resizers.bottom) return true
        else return false;
    }

    // get resizer type
    _getType(el){
        var type = "left";
        var activeResizer = this.store.state.activeResizer;
        var resizers = activeResizer.resizers;

        Object.keys(resizers).map((v, k) => {
            if(el === resizers[v]) type = v
        })

        return type;
    }

    // attach resizer to
    attachTo(item, className){
        this.resizables.push(className, item);

        // attach events
        this._bindClickEvent(item.el);
    }

    // add resizers
    _addResizersHtmlElement(element){
        var elmentBoundRect = element.getBoundingClientRect();
        var resizerSize = this.resizerSize;

        // left resizer
        var leftResizerStyle = {
            ...this.resizerBaseStyle,
            marginLeft : "-"+(resizerSize.width/2)+"px",
            marginTop : (elmentBoundRect.height/2 - resizerSize.height/2)+"px",
            cursor : "ew-resize"
        }
        
        var leftResizer = this.html._createDiv(leftResizerStyle);

        // right resizer
        var rightResizerStyle = {
            ...this.resizerBaseStyle,
            marginLeft : (elmentBoundRect.width - resizerSize.width/2)+"px",
            marginTop : (elmentBoundRect.height/2 - resizerSize.height/2)+"px",
            cursor : "ew-resize"
        }
        
        var rightResizer = this.html._createDiv(rightResizerStyle);

        // top resizer
        var topResizerStyle = {
            ...this.resizerBaseStyle,
            marginLeft : (elmentBoundRect.width/2 - resizerSize.width/2)+"px",
            marginTop : "-"+(resizerSize.height/2)+"px",
            cursor : "ns-resize"
        }
        
        var topResizer = this.html._createDiv(topResizerStyle);

        // bottom resizer
        var bottomResizerStyle = {
            ...this.resizerBaseStyle,
            marginLeft : (elmentBoundRect.width/2 - resizerSize.width/2)+"px",
            marginTop : (elmentBoundRect.height - resizerSize.height/2)+"px",
            cursor : "ns-resize"
        }
        
        var bottomResizer = this.html._createDiv(bottomResizerStyle);

        // append
        element.appendChild(leftResizer);
        element.appendChild(rightResizer);
        element.appendChild(topResizer);
        element.appendChild(bottomResizer);

        // add it to active element
        var activeResizer = {
            ...this.activeResizer,
            resizers : {
                left : leftResizer,
                right : rightResizer,
                bottom : bottomResizer,
                top : topResizer
            }
        }

        this.activeResizer = Object.assign({}, activeResizer);
    }

    // bind click event on the element
    _bindClickEvent(el){
        el.addEventListener('mousedown', (e) => {
            this._setActiveResizer(el);

            // document.addEventListener('click', this._clickOnDoc);
        });
    }

    // click on document
    _clickOnDoc(e){
        var element = e.target; 
        var activeElement = this.activeResizer.el;
        
        if(element !== activeElement){
            // remove resizers
            this._removeActiveResizers();

            this.activeResizer = {
                el : null,
                resizers : {
                    left : null,
                    right : null,
                    bottom : null,
                    top : null
                }
            };

            // remove click to doc
            // this._removeClickToDocument();
        }
    }

    // remove click to document
    // _removeClickToDocument(){
    //     document.removeEventListener('click', this._clickOnDoc);
    // }

    // handle move
    _setActiveResizer(el){
        if(this.activeResizer.el && this.activeResizer.el !== el){
            // remove resizers from active element
            this._removeActiveResizers();
        }

        if(this.activeResizer.el && this.activeResizer.el === el) return;

        // set new el
        this.activeResizer = {
            el : el
        }

        // attach resizer
        this._addResizersHtmlElement(el);
        // bind add event to resizer
        this._bindEventToResizer();
        // bind remove event
        this._removeEventFromResizer();
    }

    // remove active resizer
    _removeActiveResizers(){
        if(!this.activeResizer.el) return;
        
        // remove resizers from active element
        this.activeResizer.resizers.left.remove();
        this.activeResizer.resizers.right.remove();
        this.activeResizer.resizers.bottom.remove();
        this.activeResizer.resizers.top.remove();
    }

    // bind event to resizer
    _bindEventToResizer(){
        if(!this.activeResizer.el) return;

        this.activeResizer.resizers.left.addEventListener('mousedown', this._bindMoveEvent);
        this.activeResizer.resizers.right.addEventListener('mousedown', this._bindMoveEvent);
        this.activeResizer.resizers.bottom.addEventListener('mousedown', this._bindMoveEvent);
        this.activeResizer.resizers.top.addEventListener('mousedown', this._bindMoveEvent);

        // add to store
        this.store.set({
            activeResizer : this.activeResizer
        })
    }

    // remove event from resizer
    _removeEventFromResizer(){
        if(!this.activeResizer.el) return;

        this.activeResizer.resizers.left.addEventListener('mouseup', this._removeMoveEvent);
        this.activeResizer.resizers.right.addEventListener('mouseup', this._removeMoveEvent);
        this.activeResizer.resizers.bottom.addEventListener('mouseup', this._removeMoveEvent);
        this.activeResizer.resizers.top.addEventListener('mouseup', this._removeMoveEvent);

        document.addEventListener('mouseup', this._removeMoveEvent);
    }

    // bind move event
    _bindMoveEvent(e){
        var el = e.target;
        var element = this.activeResizer.el;
        var type = this._getType(el);
        var pivots = [
            e.pageY,
            e.pageX+element.offsetWidth - this.xCoeff,
            e.pageY+element.offsetHeight - this.yCoeff,
            e.pageX
        ];

        var activeResizer = Object.assign({}, this.activeResizer);
        activeResizer["coords"] = {
            clickPos : [e.clientX, e.clientY],
            mousePos : [e.pageX, e.pageY],
            originalCoord : [element.getBoundingClientRect().left, element.getBoundingClientRect().top],
            direction : type,
            pivots : pivots
        }

        this.activeResizer = Object.assign({}, activeResizer);

        document.addEventListener('mousemove', this.resize);
    }

    // remove move event
    _removeMoveEvent(){
        document.removeEventListener('mousemove', this.resize);
    }

    // resize
    resize(e){
        var activeResizer = Object.assign({}, this.activeResizer);
        var pivots = activeResizer.coords.pivots;
        var element = activeResizer.el;
        var elemId = element["ct-draggable-uid"];
        var direction = activeResizer.coords.direction;

        // set size
        switch(direction){
            case "left" : {
                var width = pivots[1] - e.pageX;
                // var left = pivots[1] - width - document.getElementById(this.state.containerId).getBoundingClientRect().left;
                var left = pivots[1] - width;

                element.style.width = width+"px";
                element.style.left = left+"px";
                activeResizer.resizers.right.style.marginLeft = (width - this.resizerSize.width/2)+"px";
                activeResizer.resizers.top.style.marginLeft = (width/2 - this.resizerSize.width/2)+"px";
                activeResizer.resizers.bottom.style.marginLeft = (width/2 - this.resizerSize.width/2)+"px";

                break;
            }

            case "right" : {
                var width = e.pageX - element.getBoundingClientRect().left;
                element.style.width = width+"px";
                activeResizer.resizers.right.style.marginLeft = (width - this.resizerSize.width/2)+"px";
                activeResizer.resizers.top.style.marginLeft = (width/2 - this.resizerSize.width/2)+"px";
                activeResizer.resizers.bottom.style.marginLeft = (width/2 - this.resizerSize.width/2)+"px";

                break;
            }

            case "top" : {
                var height = pivots[2] - e.pageY + this.yCoeff;
                var top = pivots[2] - height;

                element.style.height = height+"px";
                element.style.top = top+"px";

                activeResizer.resizers.bottom.style.marginTop = (height - this.resizerSize.height/2)+"px";
                activeResizer.resizers.left.style.marginTop = (height/2 - this.resizerSize.height/2)+"px";
                activeResizer.resizers.right.style.marginTop = (height/2 - this.resizerSize.height/2)+"px";

                break;
            }

            case "bottom" : {
                var height = e.pageY - element.getBoundingClientRect().top;
                element.style.height = height+"px";

                activeResizer.resizers.bottom.style.marginTop = (height - this.resizerSize.height/2)+"px";
                activeResizer.resizers.left.style.marginTop = (height/2 - this.resizerSize.height/2)+"px";
                activeResizer.resizers.right.style.marginTop = (height/2 - this.resizerSize.height/2)+"px";
       
                break;
            }
        }

        // --------------------------- update data
        // update draggables
        var draggables = Object.assign({}, this.store.state.draggables);
        var elem = Object.assign({}, draggables[elemId]);
        elem.size = {
            width : element.offsetWidth,
            height : element.offsetHeight
        }

        draggables[elemId] = Object.assign({}, elem);
        this.store.set({
            draggables : draggables
        })

        // update resizables
        var resizables = Object.assign({}, this.resizables);
        resizables[elemId] = Object.assign({}, elem);

        this.resizables = Object.assign({}, resizables);

        // ------------------------------- callback
        if(elem.options.hasOwnProperty("onResize"))
            elem.options.onResize(elem);
    }
}

/*
    Select element on mouse drag
*/
export class Selector {
    constructor(){
        this.selectables = {};
        this.selectors = [];
        this.activeSelector = {};

        this.selectState = false;
        this.selectCallback = null;

        // add helpers
        this.selectables.push = this.push.bind(this);
        this.selectables.get = this.get.bind(this);

        // utils
        this.html = new Html();
        this.util = new Utility();

        // bind this
        this._toggleSelectState = this._toggleSelectState.bind(this);
        this._bindResizer = this._bindResizer.bind(this);
        this._unBindResizer = this._unBindResizer.bind(this);
    }

    /* 
        Helper functions
        1. push
        2. get
    */
    // push selectables
    push(key, obj){
        this.selectables[key] = obj;
    }

    // get selectables
    get(key = null){
        if(key === null) return this.selectables;
        else return this.selectables[key];
    }

    // is selector
    isSelector(el){
        var id = el["ct-draggable-uid"];

        if(this.selectables.hasOwnProperty(id)) return true;
        else return false;
    }

    // attach selector to
    attachTo(item, className){
        this.selectables.push(className, item);

        // attach events
        this._bindSelectorEvent();
    }

    // on select
    onSelect(cb){
        this.selectCallback = cb;
    }

    // bind selector event
    _bindSelectorEvent(){
        document.addEventListener('mousedown', this._toggleSelectState);
    }

    // select state
    _toggleSelectState(e){
        if(this.util._isDraggable(e.target)) return;
        // this.selectState = !this.selectState;

        // if(this.selectState) this._createSelector(e);
        this._createSelector(e);
    }

    // create selector
    _createSelector(e){
        var clientX = e.clientX;
        var clientY = e.clientY;

        var selectorStyle = {
            width : "0px",
            height : "0px",
            position : "absolute",
            left : clientX+"px",
            top : clientY+"px",
            borderStyle : "dashed",
            borderWidth : "1px",
            borderColor : "lightgray"
        }

        var selectorElement = this.html._createDiv(selectorStyle);
        selectorElement = this.html._addChild(this.store.state.container, selectorElement, "");

        var obj = {
            el : selectorElement,
            size : {
                width : 0,
                height : 0
            }
        }

        this.selectors.push(obj);

        document.addEventListener('mousemove', this._bindResizer);
        document.addEventListener('mouseup', this._unBindResizer);

        // set active selector
        this.activeSelector = Object.assign({}, obj);
    }

    // bind resizer
    _bindResizer(e){
        var selectors = Object.assign([], this.selectors);

        var pageX = e.pageX;
        var pageY = e.pageY;

        var currentSelector = Object.assign({}, selectors[selectors.length - 1]);

        var element = currentSelector.el;
        var boundRect = element.getBoundingClientRect();
        var left = boundRect.left;
        var top = boundRect.top;
        var width = pageX - left;
        var height = pageY - top;

        currentSelector.size = {
            width : width,
            height : height
        }

        currentSelector.pageX = pageX;
        currentSelector.pageY = pageY;

        selectors[selectors.length - 1] = Object.assign({}, currentSelector);

        this.selectors = Object.assign([], this.selectors);

        // update element
        element.style.left = left+"px";
        element.style.top = top+"px";
        element.style.width = width+"px";
        element.style.height = height+"px";
    }

    // unbind resizer
    _unBindResizer(e){
        document.removeEventListener('mousemove', this._bindResizer);
        document.removeEventListener('mouseup', this._unBindResizer);

        // select nodes inside
        this.selectNodes()
    }

    // select nodes inside
    selectNodes(){
        var selectors = Object.assign([], this.selectors);
        var currentSelector = Object.assign({}, selectors[selectors.length - 1]);

        var element = currentSelector.el;

        var nodes = this.getSelectedNodes(element);
        
        // callback
        if(this.selectCallback) this.selectCallback(nodes);
    }

    // get selected nodes
    getSelectedNodes(element){
        var parent = this.store.state.container;
        var childNodes = parent.childNodes;

        var selectedNodes = [];

        Object.keys(childNodes).map((v, k) => {
            var child = childNodes[v];

            if(element === child) return;

            // if text node
            if(child.nodeType === Node.TEXT_NODE){
                var span = document.createElement('span');
                child.parentNode.insertBefore(span, child);
                span.appendChild(child);

                if(this.isOverlapping(span, element) && this.isSelector(span)) selectedNodes.push(child);
            }
            else if(this.isOverlapping(child, element) && this.isSelector(child)) selectedNodes.push(child);
        })

        return selectedNodes;
    }

    // is overlapping
    isOverlapping(elem1, elem2){
        // elem 1 data
        var d1_offset = elem1.getBoundingClientRect();

        var d1_left = d1_offset.left;
        var d1_top = d1_offset.top;
        var d1_bottom = d1_offset.bottom - d1_offset.height;
        var d1_right = d1_offset.right - d1_offset.width;
    
        // elem 2 data
        var d2_offset = elem2.getBoundingClientRect();

        var d2_left = d2_offset.left;
        var d2_top = d2_offset.top;
        var d2_bottom = d2_offset.bottom - d2_offset.height;
        var d2_right = d2_offset.right - d2_offset.width;

        var flag = false;
        if(d2_left < d1_left && d2_top < d1_top && d2_bottom < d1_bottom && d2_right < d1_right) flag = true;

        return flag;
    }
}

/*
    Html components
*/
export class Html {
    constructor(){
        this.util = new Utility();
    }

    // create a div
    _createDiv(styles = {}){
        var d = document.createElement('div');

        this.util._addStyles(d, styles);
        
        return d;
    }

    // add child to doc
    _addChild(parent, child, childText, attributes){
        var childNode = null;
        var childTextNode = null;
        if(typeof child == "string")
            childNode = document.createElement(child);
        else
            childNode = child;
        
        // if child has text
        if(typeof childText == "string") {
            childTextNode = document.createTextNode(childText);
            childNode.appendChild(childTextNode);
        }

        // if attributes provided
        if(attributes)
            for (var att in attributes) {
                childNode.setAttribute(att,attributes[att]);
            }
        
        parent.appendChild(childNode);
        
        return childNode;
    }
}


/* 
    Utility functions
*/
export class Utility {
    constructor(){
        // bind this
        this._isDraggable = this._isDraggable.bind(this);
    }

    // add style
    _addStyles(el, styles){
        Object.keys(styles).map((v, k) => {
            el.style[v] = styles[v];
        })
    }

    // is draggable
    _isDraggable(el){
        var draggables = this.store.state.draggables;
        var ids = draggables.getIds();
        var isDraggableElement = false;
        // check draggables
        ids.map((v, k) => {
            if(el === draggables[v].el) isDraggableElement = true;
        })

        // check resizers
        var activeResizer = this.store.state.activeResizer;
        if(activeResizer && activeResizer.el){
            Object.keys(activeResizer.resizers).map((v, k) => {
                if(el === activeResizer.resizers[v]) isDraggableElement = true;
            })
        }

        return isDraggableElement;
    }
}

/* 
    Store
*/
export class Store {
    constructor(){
        this.state = {};
    }

    // set store
    set(obj, cb = () => {}){
        this.state = {
            ...this.state,
            ...obj
        }

        // callback
        cb();
    }
}

// linking
var store = new Store();
Utility.prototype.store = store;
Drag.prototype.store = store;
Move.prototype.store = store;
Resizer.prototype.store = store;
Selector.prototype.store = store;