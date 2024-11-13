# TODO

- [x] The library must be environment agnostic (work in browser and in NodeJS; e.g. along with JSDOM).
  - It doesn't use any environment-specific syntax, like `fs` path resolving.

- [x] X must have a resolver option that defines how X should load widgets. For simplicity dynamic imports can be used by default.
  - Custom resolver can be supplied to the X.init() function. A template path is fed as it's argument.

- [ ] X.init method must be asynchronous while X.destroy synchronous.
  - X.init is asynchronous and Promise-based, X.destroy is synchronous and everything is handled within the Widget base class.

- [x] User must be able to set a callback in X.init which is called after whole widgets tree is initialized or when initialization failed. Failure of a widget initialization prevents children initialization only. All errors occurred should be passed to the callback. The callback must be called once.
  - Callback can be specified an will be called after the whole tree is initialized, and the `WidgetLib.init` function completes.

- [ ] User can call X.init and X.destroy methods with any node in a tree (including multiple times) and in any order. The library must guarantee that there is only one instance of a widget per node and that its init and destroy methods called only once.

- [ ] In general, after execution of the X.destroy method the tree should behave like the X.init method was not called yet. In case of calling this method on a subtree while another process had started initialization of the same subtree already and has been waiting or the initialization to finish, that process should receive the WidgetDestroyed error.

- [ ] Decision on whether a widget was initialized or not must be made by the widget. X must provide an API for widget classes to finish initialization and means to do it on two stages: before subtree initialization and after that.

- [ ] Along with the library implementation there must be a base widget class, beyond following conventional API it must provide syntactic sugar for the end users: all widgets that extends the class must have automatic bind to this for methods with names ending with the word Handler.

---

- [ ] Test DOM tree with widgets and regular nodes mixed. User should be able to select any node here (type and its state should be visually clear). For widget nodes you need create a simple widget that exposes its initialization state to CSS classes and probably exposes its finish API. Relative selectors should relate to root of this section.

- [ ] Buttons init, destroy, done and fail that trigger appropriate methods of the library or a widget. Init button should add a logging callback with relative selector of the node and, in case of failure, list of errors.

- [ ] Info block that shows relative selector of the selected node and any other technical stuff that you think can help with debugging.
