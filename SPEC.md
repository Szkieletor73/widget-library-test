# Specification

- [x] The library must be environment agnostic (work in browser and in NodeJS; e.g. along with JSDOM).
  - It doesn't use any environment-specific modules or syntax, like `fs`.

- [x] X must have a resolver option that defines how X should load widgets. For simplicity dynamic imports can be used by default.
  - Custom resolver can be supplied to the X.init() function. A template path is fed as it's argument.

- [X] X.init method must be asynchronous while X.destroy synchronous.
  - X.init is asynchronous and Promise-based, X.destroy is synchronous. destroy handles the actual de-rendering of the component in the Widget class, while X handles releasing all the references to the Widget object instance.

- [x] User must be able to set a callback in X.init which is called after whole widgets tree is initialized or when initialization failed. Failure of a widget initialization prevents children initialization only. All errors occurred should be passed to the callback. The callback must be called once.
  - Callback can be specified an will be called after the whole tree is initialized, and the `WidgetLib.init` function completes.

- [X] User can call X.init and X.destroy methods with any node in a tree (including multiple times) and in any order. The library must guarantee that there is only one instance of a widget per node and that its init and destroy methods called only once.
  - `init()` and `destroy()` methods work on both widget nodes, and non-widget nodes, and affect their entire sub-tree.
  - If a widget initialized, we keep some references on it's owner element to let the library know "this is an initialized widget, don't init it again!"
  - A node can only contain one widget - if the element's `widget` property is already set to a reference of a `Widget` object, `init()` on this node will fail.

- [X] In general, after execution of the X.destroy method the tree should behave like the X.init method was not called yet. In case of calling this method on a subtree while another process had started initialization of the same subtree already and has been waiting or the initialization to finish, that process should receive the WidgetDestroyed error.
  - As it was not specified what should happen to content already existing in the widget element (like nested widgets), it is kept intact.  
  The widget template is inserted as the first child of the container element ("owner")  
  Owner element is aware of the Widget class instance controlling the widget, and can only contain one widget at the top level.  
  The widget elements themselves (there can be multiple top-level tags in widget template) keep track of widget ID to identify them from static DOM elements.  
  All of this means that we can easily remove widget elements, and keep the rest of the HTML intact, returning the owner element to it's original state with the `destroy()` method.

- [X] Decision on whether a widget was initialized or not must be made by the widget. X must provide an API for widget classes to finish initialization and means to do it on two stages: before subtree initialization and after that.
  - It is unclear to me what this requirement means, specifically.  
  To fulfill it, a pre- and post-initialization methods were added to the Widget class, which can be implemented in inheriting classes and perform certain widget-specific functionality.  
  Since we're using Promises, there is no need to wait for widgets to report on their initialization status - instead, we simply react to Promises resolving or rejecting.  
  The base Widget class keeps track of and controls it's own state, for purposes of implementing loading states or similar mechanisms.

- [X] Along with the library implementation there must be a base widget class, beyond following conventional API it must provide syntactic sugar for the end users: all widgets that extends the class must have automatic bind to this for methods with names ending with the word Handler.
  - As part of the base `Widget` class' constructor, a binding function is ran that checks for own properties ending with "Handler", and binds `this`.

---

## Testing spec

- [X] Test DOM tree with widgets and regular nodes mixed. User should be able to select any node here (type and its state should be visually clear). For widget nodes you need create a simple widget that exposes its initialization state to CSS classes and probably exposes its finish API. Relative selectors should relate to root of this section.
  - A mix of nodes was added, both widget and non-widget, nested within each other.

- [X] Buttons init, destroy, done and fail that trigger appropriate methods of the library or a widget. Init button should add a logging callback with relative selector of the node and, in case of failure, list of errors.
  - Buttons were added to each node in the initial document. "done" and "fail" were omitted - there is no good way to consistently force a fail with the chosen implementation.

- [X] Info block that shows relative selector of the selected node and any other technical stuff that you think can help with debugging.
  - Implemented as CSS borders that separate each individual `<div>`. The widget names are listed in plain text within the elements, and non-widgets are clearly marked.
