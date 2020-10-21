# Drag.JS

Drag.JS allows to perform various drag operations on HTML element. Some of the common Operations are :-
	1. Move
	2. Resize
	3. Select Elements


## Usage

```
import Drag from 'ct-drag-js';

const drag = new Drag();

// add draggable element
var element = this.refs["some_element_ref"];
var options = {
	moveable : true,
	onMove : (el) => {
		// el is the moved element
	},
	border : true,
	activeBorderStyle : {
		borderStyle :  "solid",
		borderWidth :  "1px"
	}
}

drag.addDraggable(element, options);
drag.setContainer(container);

```

## Options
1. ***moveable** : boolean* :- If moveable is true, the element will be moveable in in the container.
2. ***onMove** : function* :- A callback function, whenever the element has moved, the element will get a callback with the draggable object in the parameter.
3. ***border** : boolean* :- If border is true, border on active element will be visible.
4. ***activeBorderStyle** : Object* :- You can provide border styles of active draggable element.
5. ***resizable** : boolean* : If resizable is true, element will be resizable.
6. ***onResize** : function* :- A callback function, whenever the element is resized the element will get a callback with the draggable object in the parameter.
7. ***selectable** : boolean* :- If selectable is true, Element can be selected.

## Functions
1. **setContainer** :- You can set container, where move event will be captured.
```
drag.setContainer(container);
```
2. **onSelect** :- A callback function, which is called whenever a drag and select operation is performed with an array of elements selected in the parameter.
```
drag.onSelect(this.onSelect.bind(this));
```
3. **get** :- Returns all the draggable elements with some helper functions. Following are the helper functions you can use :-
```
var draggables  =  drag.get(); // returns all the draggables
var ids = draggables.getIds(); // returns all the draggable ids
var movables  =  draggables.moveables(); // returns all the moveable elements
var resizables  =  draggables.resizables(); // returns all the resizabel elements
var selectables  =  draggables.selectables(); // returns all the selectable elements
```
