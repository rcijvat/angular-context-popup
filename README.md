# Angular Context Popup

**Angular directives for creating context popups that open and close on click of a specified element.**

No dependency on jQuery!


These directives give you way to promote a DOM element to a context popup trigger. 
Whenever this DOM element gets clicked, the context popup opens with its left top aligned to the
current mouse position.
The popup is closed if a click occurs anywhere else on the DOM.

Example usage:

```html
<div id="some-unique-context-popup-id">
    This basically is the template for your context popup. You can put any HTML in here.
    The Angular scope of this template is inherited from the scope in which this div is defined.
</div>

<button type="button" context-popup-bind="some-unique-context-popup-id">Open context popup</button>
```

To programmatically close all context popups, emit the "contextpopupclose" event on the root scope:
 
```javascript
$rootScope.$emit("contextpopupclose")
```


### Dragging context popup
Context popups can define a handle that can be used to drag them around. Example:

```html
<div id="some-unique-context-popup-id">
    <h3 context-popup-drag-handle>This h3 tag will be the drag handle for this popover</h3>
    This basically is the template for your context popup. You can put any HTML in here.
    The Angular scope of this template is inherited from the scope in which this div is defined.
</div>

<button type="button" context-popup-bind="some-unique-context-popup-id">Open context popup</button>
