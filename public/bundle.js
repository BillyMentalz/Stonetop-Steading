(() => {
  // src/inject.js
  var stringToHTML = (str) => {
    const parse = new DOMParser();
    const doc = parse.parseFromString(str, "text/html");
    return doc.body.firstChild;
  };

  // src/injects/markers.js
  var markerElement = (row) => {
    return `
       <div> This is an example to be fixed later </div> 
    `;
  };

  // src/animation.js
  var indicateTimers = /* @__PURE__ */ new Map();
  var updateIndicate = (el) => {
    const prior = indicateTimers.get(el);
    if (prior) clearTimeout(prior);
    el.style.transition = "box-shadow 0.15s ease, outline-color 0.15s ease";
    el.style.boxShadow = "0px 0px 3px 2px lightblue";
    el.style.outlineColor = "lightblue";
    const t = setTimeout(() => {
      el.style.boxShadow = "none";
      el.style.outlineColor = "#333";
      indicateTimers.delete(el);
    }, 500);
    indicateTimers.set(el, t);
  };

  // src/document.js
  var socket = io();
  var addBoxTemplate = document.getElementById("addBoxTemplate");
  var maps = document.getElementById("worldMaps");
  var characters = document.getElementById("characters");
  var UpdatingFromServerState = class {
    constructor() {
      this.isUpdatingFromServer = 0;
    }
    stepUp() {
      this.isUpdatingFromServer++;
    }
    stepDown() {
      this.isUpdatingFromServer--;
    }
    check() {
      if (this.isUpdatingFromServer > 0) return false;
      else return true;
    }
  };
  var isUpdatingFromServerState = new UpdatingFromServerState();
  var Node = class {
    constructor(element) {
      this.element = element;
      this.prev = null;
      this.next = null;
    }
  };
  var LinkedList = class {
    constructor() {
      this.head = null;
      this.end = this.head;
    }
    append(element) {
      let newNode = new Node(element);
      if (!this.head) {
        this.head = newNode;
        this.end = newNode;
      } else {
        newNode.prev = this.end;
        this.end.next = newNode;
        this.end = newNode;
      }
      element.__nodeRef = newNode;
      return newNode;
    }
    popNode(node) {
      if (!this.head) return;
      if (this.head === node) {
        this.head = node.next;
        if (this.head) this.head.prev = null;
        if (node === this.end) this.end = null;
      } else {
        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (node === this.end) this.end = node.prev;
      }
      if (node.element) delete node.element.__nodeRef;
      return node;
    }
  };
  var graphNode = class {
    constructor(name, identifiers, children, cascadeRules, createOperator, updateOperator, deleteOperator) {
      this.table = {};
      this.name = name;
      this.identifiers = identifiers;
      this.children = children;
      this.cascadeRules = cascadeRules;
      this.createOperator = createOperator;
      this.updateOperator = updateOperator;
      this.deleteOperator = deleteOperator;
    }
    makeIndex(row) {
      const index = this.identifiers.map(
        (item) => {
          return row[item];
        }
      ).join("/%/");
      return index;
    }
    createRow(row) {
      const index = this.makeIndex(row);
      const element = this.createOperator(index, row);
      row.element = element;
      this.table[index] = row;
      updateIndicate(element);
    }
    updateRow(updateValue) {
      const index = this.makeIndex(updateValue);
      const row = this.table[index];
      if (!row) throw Error(`${row} does not exist!`);
      for (const [key, value] in Object.entries(updateValue)) {
        row[key] = value;
      }
      ;
      this.updateOperator(row);
      updateIndicate(row.element);
      for (const cascadent in this.cascade) {
        cascadent.updateCascade(this.name, row);
      }
    }
    updateCascade(src, updateValue) {
      const rules = this.cascadeRules[src];
      if (!rules) throw Error("cascadeRules mismatch!");
      const ghostIndex = rules.ghostIndex.map(
        (i) => {
          return updateValue[i];
        }
      ).join("/%/");
      const resultValue = {};
      for (let i = 0; i < rules.needValues.length; i++) {
        resultValue[rules.changeValue[i]] = updateValue[rules.needValues[i]];
      }
      for (const [key, pair] of Object.entries(this.table)) {
        if (key.startsWith(ghostIndex)) {
          for (const [subkey, subvalue] of Object.entries(resultValue)) {
            pair[subkey] = subvalue;
          }
          this.updateOperator(pair);
          updateIndicate(pair.element);
          for (const cascadent in this.cascade) {
            cascadent.updateCascade(this.name, pair);
          }
        }
      }
    }
    deleteRow(deletedItem) {
      const row = this.table[deletedItem];
      if (row.latestModified > deletedItem.deletedAt) return;
      this.deleteOperator(row);
      delete this.table[deletedItem];
      for (const thing of this.cascade) {
        thing.deleteCascade(deletedItem);
      }
      ;
    }
    deleteCascade(id) {
      for (const [key, value] of Object.entries(this.table)) {
        if (key.startsWith(id)) {
          this.deleteRow(key);
          for (const cascadent in this.cascade) {
            cascadent.graphNode.deleteCascade(key);
          }
        }
        ;
      }
    }
  };

  // src/dataHandler/data/markersHandler.js
  var markerCreateOperator = (row) => {
    const element = markerElement(row);
    if (true) parent.append(element);
    return element;
  };
  var markersUpdateOperator = (row) => {
    const markerElement2 = row.element;
    const newElement = markerElement2(row);
    if (true) markerElement2.replaceWith(newElement);
    return newElement;
  };
  var markerDeleteOperator = (row) => {
    row.element.remove();
  };
  var markerNode = new graphNode(
    "markers",
    ["markerName", "markerId", "markerOrder", "markerSignifier"],
    [],
    {},
    markerCreateOperator,
    markersUpdateOperator,
    markerDeleteOperator
  );

  // src/injects/stats.js
  var radio = (name, style, options) => {
    const elementString = `
        ${options.map((option) => `
            <div class="${style[0]}">
                <input type="radio" name="${name}" value="${option}">
                <p class="${style[1]}">${option}</p>
            </div>
        `).join("")}`;
    return stringToHTML(elementString);
  };
  var select = (name, style, options) => {
    const elementString = `
        <select class='${style[0]}' name="${name}" >
            ${options.map((option) => `<option value="${option}">${option}</option>`).join("")}
        </select>
    `;
    return stringToHTML(elementString);
  };
  var number = (name, style) => {
    const elementString = `<input type="number" class="${style[0]}" name="${name}">`;
    return stringToHTML(elementString);
  };
  var checkbox = (name, style) => {
    const elementString = `<input type="checkbox" class="${style[0]}" name="${name}" value="${name}">`;
    return stringToHTML(elementString);
  };

  // src/dataHandler/data/statsHandler.js
  var styleTable = {
    "radio": "radioBox,radioChoice",
    "select": "",
    "numbers": "",
    "number-asset": "numsInput",
    "checkbox": ""
  };
  var statsCreateOperator = (row) => {
    let element = null;
    console.log(row);
    const parentElement = document.getElementById(row.statName);
    const style = styleHelper(parentElement);
    let selectedElement = null;
    switch (row.statType) {
      case "radio":
        element = radio(row.statName, style, row.statOptions.split(","));
        parentElement.append(element);
        selectedElement = parentElement.querySelector(`[value="${row.statValue}"]`);
        selectedElement.checked = true;
        break;
      case "select-one":
        element = select(row.statName, style, row.statOptions.split(","));
        parentElement.append(element);
        selectedElement = parentElement.querySelector(`select`);
        selectedElement.value = row.statValue;
        break;
      case "number":
        element = number(row.statName, style);
        element.value = row.statValue;
        parentElement.append(element);
        break;
      case "checkbox":
        element = checkbox(row.statName, style);
        element.checked = row.statValue === "true";
        parentElement.append(element);
        break;
    }
    return parentElement;
  };
  var styleHelper = (parent2) => {
    return styleTable[parent2.dataset.entrypoint].split(",");
  };
  var statsUpdateOperator = (row) => {
    const element = row.element;
    console.log(element);
    switch (row.statType) {
      case "radio":
        element.checked = true;
        break;
      case "select-one":
        element.value = row.statValue;
        break;
      case "number":
        element.value = row.statValue;
        break;
      case "checkbox":
        element.checked = row.statValue === "true";
        break;
    }
    return element;
  };
  var statsDeleteOperator = (row) => {
    const selectedElement = row.element;
    selectedElement.remove();
  };
  var statNode = new graphNode(
    "stats",
    ["statName"],
    [],
    {},
    statsCreateOperator,
    statsUpdateOperator,
    statsDeleteOperator
  );

  // src/injects/lists.js
  var listsRow = (id, index, text) => {
    const elementString = `
        <li>
            ${text}
        </li>`;
    return stringToHTML(elementString);
  };
  var rowEnter = (element) => {
    const elementString = `
        <li data-index="${element.dataset.index}">  
            <textarea value=${element.textContent}>
            </textarea>
        </li>
    `;
  };

  // src/dataHandler/data/listsHandler.js
  var listsOperator = (row) => {
    const parent2 = document.querySelector(`ul#${row.listName}`);
    const element = listsRow(row.listOrder, row.listText);
    parent2.append(element);
    return element;
  };
  var listsUpdateOperator = (row) => {
    const element = row.element;
    const newElement = listsRow(row.listOrder, row.listText);
    element.replaceWith(newElement);
    return newElement;
  };
  var listsDeleteOperator = (row) => {
    row.element.remove();
  };
  var listNode = new graphNode(
    "lists",
    ["listName", "listOrder"],
    [],
    {},
    listsOperator,
    listsUpdateOperator,
    listsDeleteOperator
  );

  // src/injects/characters.js
  var characterRow = (row) => {
    return `
       <div> This is an example to be fixed later </div> 
    `;
  };
  var characterEnter = (row) => {
    return `
        <div> fixing when I get to it. </div>
    `;
  };

  // src/dataHandler/data/charactersHandler.js
  var characterTable = characters.querySelector("#characterTable");
  var characterCreateOperator = (row) => {
    const characterElement = characterRow(row);
    characterTable.append(characterElement);
    return characterElement;
  };
  var characterUpdateOperator = (row) => {
    const characterElement = row.element;
    const newElement = characterRow(row);
    characterElement.replaceWith(newElement);
    return newElement;
  };
  var characterDeleteOperator = (row) => {
    const characterElement = row.element;
    characterElement.remove();
  };
  var characterNode = new graphNode(
    "characters",
    ["characterId"],
    [],
    {},
    characterCreateOperator,
    characterUpdateOperator,
    characterDeleteOperator
  );

  // src/dataHandler/data/locationsHandler.js
  var locationCreateOperator = (row) => {
    const element = characterRow(row);
    if (true) parent.append(element);
    return element;
  };
  var locationsUpdateOperator = (row) => {
    const locationElement = row.element;
    const newElement = characterRow(row);
    if (true) locationElement.replaceWith(newElement);
    return newElement;
  };
  var locationDeleteOperator = (row) => {
    row.element.remove();
  };
  var locationNode = new graphNode(
    "location",
    ["locationName", "locationId"],
    [markerNode],
    {},
    locationCreateOperator,
    locationsUpdateOperator,
    locationDeleteOperator
  );

  // src/injects/homes.js
  var newHome = (row) => {
    return stringToHTML(`
    <div id=${row.homeName} class='S'> 
        ${row.homeName}
    </div>
    `);
  };
  var newSelectionHome = (row) => {
    return stringToHTML(
      `
        <option value="${row.homeName}">${row.homeName} </option>
        `
    );
  };

  // src/dataHandler/data/homesHandler.js
  var homesCreateOperator = (row) => {
    const elements = document.querySelectorAll(`[data-entrypoint="homes"]`);
    elements.forEach((thing) => {
      let element = null;
      if (thing.tagName == "SELECT") {
        element = newSelectionHome(row);
      } else if (thing.tagName == "DATALIST") {
        element = newSelectionHome(row);
      } else if (thing.tagName == "UL") {
        element = newHome(row);
      }
      thing.appendChild(element);
    });
    return elements.item(0);
  };
  var homesUpdateOperator = (row) => {
    const element = row.element;
    throw Error("WHat!?");
    return element;
  };
  var homesDeleteOperator = (row) => {
    const things = document.querySelectorAll(`[data-entrypoint="homes"]`);
    things.forEach((thing) => {
      let element = null;
      if (thing.tagName == "SELECT") {
        element = thing.querySelector(`option[value="${row.homeName}"]`);
      } else if (thing.tagName == "DATALIST") {
        element = thing.querySelector(`option[value="${row.homeName}"]`);
      } else if (thing.tagName == "UL") {
        element = thing.querySelector(`li[value="${row.homeName}"]`);
      }
      if (element) element.remove();
    });
    row.element.remove();
  };
  var homeNode = new graphNode(
    "homes",
    ["homeName"],
    [locationNode],
    {},
    homesCreateOperator,
    homesUpdateOperator,
    homesDeleteOperator
  );

  // src/dataHandler/syncHandler.js
  var graphNodeList = {
    "homes": homeNode,
    "markers": markerNode,
    "characters": characterNode,
    "locations": locationNode,
    "stats": statNode,
    "lists": listNode
  };
  var dataHandlers = () => {
    for (const [key, operator] of Object.entries(graphNodeList)) {
      const payload = JSON.parse(localStorage.getItem(key)) || {};
      operator.table = payload;
      for (const [id, row] of Object.entries(payload)) {
        operator.createOperator(id, row);
      }
    }
  };
  var storeNewRows = (check) => {
    console.log(check);
    for (const [key, value] of Object.entries(check)) {
      console.log(key);
      console.log(value);
      if (key == "deleteRecords") {
        for (const row in Object.entries(value)) {
          const operator = graphNodeList[row.tableName];
          operator.deleteRow(row.deletedItem);
        }
      } else if (key == "time") {
        localStorage.setItem(key, value);
      } else {
        const operator = graphNodeList[key];
        for (const row of value) {
          const index = operator.makeIndex(row);
          console.log(index);
          if (operator.table[index] !== void 0) {
            console.log(operator.table[index]);
            operator.updateRow(row);
          } else {
            operator.createRow(row);
          }
        }
      }
    }
  };
  var saveData = () => {
    if (localStorage.getItem("test") == "true") return;
    for (const [key, operator] of Object.entries(graphNodeList)) {
      localStorage.setItem(key, JSON.stringify(operator.table));
    }
  };

  // src/dataListenerHandlers/dataListeners/homes.js
  var homeAdd = [
    "click",
    ".tabIcon",
    (parent2, element, event) => {
      console.log("ojoijoij");
    }
  ];
  var homeDelete = [
    "dblclick",
    "li",
    (parent2, element, event) => {
      console.log("hoioiojoij");
    }
  ];

  // src/dataListenerHandlers/dataListeners/stats.js
  var sidebarEvents = ["radio", "select-one", "number", "checkbox"];
  var statChange = [
    "change",
    (element, event) => {
      if (isUpdatingFromServerState.check()) return;
      const eType = event.target.type;
      if (sidebarEvents.include(eType)) {
        socket.emit("update", {
          table: "stats",
          name: event.target.name,
          type: event.target.type,
          value: eType == "checkbox" ? event.target.checked.toString() : event.target.value
        });
      }
    }
  ];

  // src/dataListenerHandlers/dataListeners/lists.js
  var listAdd = [
    "click",
    ".tabIcon",
    (parent2, element, event) => {
      const last = parent2.querySelector("ul").lastElementChild;
      const num = last ? parseInt(last.dataset.index) + 1 : 1;
      const result = {
        table: "lists",
        name: parent2.id,
        order: parseInt(num),
        text: "Etc...."
      };
      socket.emit("create", result);
    }
  ];
  var listEdit = [
    "dblclick",
    "li",
    (parent2, element, event) => {
      if (element.querySelector("button")) return;
      const newEntry = document.importNode(addBoxTemplate, true);
      const info = element.__rowReference;
      if (!info) throw Error("There is no row reference, please check again");
      const editor = rowEnter(info);
      element.replaceWith(editor);
      editor.append(newEntry);
      editor.querySelector('button[name="Change"]').addEventListener("click", (e) => {
        socket.emit("update", {
          table: "lists",
          name: info.listName,
          order: info.listOrder,
          text: editor.value
        });
      });
      editor.querySelector('button[name="Delete"]').addEventListener("click", (e) => {
        if (!window.confirm("Delete Item? \n Item:" + newInput.dataset.original)) {
          editor.replaceWith(info.element);
          return;
        }
        socket.emit("delete", {
          table: "lists",
          name: info.listName,
          order: info.listOrder
        });
      });
    }
  ];

  // src/dataListenerHandlers/dataListeners/characters.js
  var characterAdd = [
    "click",
    ".tabIcon",
    (parent2, element, event) => {
      const result = {
        table: "characters",
        id: crypto.randomUUID(),
        home: `At World's End`,
        name: "Add here...",
        pronouns: "(They/them)",
        occupation: "New Occupation",
        info: "New fellow...",
        traits: "Friendly"
      };
      socket.emit("create", result);
    }
  ];
  var characterEdit = [
    "dblclick",
    "li",
    (parent2, element, event) => {
      if (element.querySelector("button")) return;
      const newEntry = document.importNode(addBoxTemplate, true);
      const info = element.__rowReference;
      if (!info) throw Error("There is no row reference, please check again");
      const editor = characterEnter(info);
      element.replaceWith(editor);
      editor.append(newEntry);
      editor.querySelector('button[name="Change"]').addEventListener("click", (e) => {
        socket.emit("update", {
          table: "lists",
          name: info.listName,
          order: info.listOrder,
          text: editor.value
        });
      });
      editor.querySelector('button[name="Delete"]').addEventListener("click", (e) => {
        if (!window.confirm("Delete Item? \n Item:" + newInput.dataset.original)) {
          editor.replaceWith(info.element);
          return;
        }
        socket.emit("delete", {
          table: "lists",
          name: info.listName,
          order: info.listOrder
        });
      });
    }
  ];
  var characterSelect = [
    "click",
    "tr",
    (parent2, element, event) => {
      console.log(element.__rowReference);
    }
  ];
  var characterFilterAndSort = [
    "change",
    ".filterRow",
    (parent2, element, event) => {
      console.log(parent2);
    }
  ];

  // src/dataListenerHandlers/dataListeners/locations.js
  var locationAdd = [
    "click",
    ".tabIcon",
    (parent2, element, event) => {
      console.log(parent2);
    }
  ];
  var locationEdit = [
    "dblclick",
    ".location",
    /*
    (parent, element, event) => {
        if (element.querySelector('button')) return;
        const newEntry = document.importNode(addBoxTemplate,true);
        const info = element.__rowReference;
        if (!info) throw Error( "There is no row reference, please check again");
        const  editor = rowEnter(info) ;
        element.replaceWith(editor);
        editor.append(newEntry);
        editor.querySelector('button[name="Change"]').addEventListener('click', (e)=> {
            socket.emit( 'update', {
                table: 'lists',
                name: info.listName,
                order: info.listOrder, 
                text: editor.value
            })
        });
        editor.querySelector('button[name="Delete"]').addEventListener('click', (e)=> {
            if (!window.confirm("Delete Item? \n Item:" + newInput.dataset.original )) {
                editor.replaceWith(info.element);
                return;
            }
            socket.emit( 'delete',  {
            table: 'lists',
            name: info.listName,
            order: info.listOrder
        })
        });
    } */
    (parent2, element, event) => {
      console.log(parent2);
    }
  ];
  var locationSelect = [
    "click",
    "div",
    (parent2, element, event) => {
      console.log(parent2);
    }
  ];

  // src/dataListenerHandlers/dataListeners/markers.js
  var indicatorDragMap = /* @__PURE__ */ new Map();
  function drags(box, event) {
    let boundaries = box.getBoundingClientRect();
    let newleft = (event.clientX - event.currentTarget.offsetWidth / 2 - boundaries.left) / box.offsetWidth * 100;
    let newtop = (event.clientY - event.currentTarget.offsetHeight / 2 - boundaries.top) / box.offsetHeight * 100;
    if (newleft < -5) newleft = -5;
    if (newleft > 97.5) newleft = 97.5;
    if (newtop < -5) newtop = -5;
    if (newtop > 95) newtop = 95;
    event.currentTarget.style.left = `${newleft}%`;
    event.currentTarget.style.top = `${newtop}%`;
  }
  var mapDrag = [
    "mousedown",
    ".draggable",
    (parent2, element, event) => {
      const dragHandler = (e) => drags(parent2, e);
      element.addEventListener("mousemove", dragHandler);
      indicatorDragMap.set(element, dragHandler);
    }
  ];
  var mapSet = [
    "mouseup",
    ".draggable",
    (parent2, element, event) => {
      for (const [key, value] of indicatorDragMap) {
        key.removeEventListener("mousemove", value);
        const info = key.__rowReference;
        socket.emit(
          "update",
          {
            table: "markers",
            home: info.markerHome,
            id: info.markerId,
            order: info.markerOrder,
            markerSignifier: info.markerSignifier,
            x: key.style.left,
            y: key.style.top
          }
        );
        indicatorDragMap.delete(key);
      }
    }
  ];
  var markerAdd = [
    "click",
    ".tabIcon",
    (parent2, element, event) => {
      socket.emit(
        "create",
        {
          table: "markers",
          home: "temp",
          id: "temp",
          order: "Temp",
          markerSignifier: "A",
          x: "50%",
          y: "50%"
        }
      );
    }
  ];
  var markerEdit = [
    "dblclick",
    ".meaningless",
    (parent2, element, event) => {
      console.log("Tihihih");
    }
  ];
  var markerSelect = [
    "dblclick",
    ".unmeaning",
    (parent2, element, event) => {
      console.log("htihigheiogeij");
    }
  ];

  // src/dataListenerHandlers/dataListeners/tabs.js
  var tablists = new LinkedList();
  function displayToggle(element) {
    if (!element) return;
    if (element.style.display == "") {
      element.style.display = "flex";
      tablists.append(element);
      caltab();
    } else {
      element.style.display = "";
      tablists.popNode(element.__nodeRef.element);
    }
  }
  function caltab() {
    let temp = tablists.head;
    let count = 10;
    while (temp != null) {
      temp.element.style.zIndex = count;
      count += 1;
      temp = temp.next;
    }
  }
  var menuToggle = [
    "click",
    (parent2, event) => {
      if (parent2.style.width == "0%") {
        event.target.style.backgroundPosition = "100px 50px";
        parent2.style.width = "0%";
        parent2.style.overflow = "hidden";
      } else {
        event.target.style.backgroundPosition = "50px 50px";
        parent2.style.width = "100%";
        parent2.style.overflow = "visible";
      }
    }
  ];
  var tabToggle = [
    "click",
    ".openTab",
    (parent2, element, event) => {
      const tab = document.getElementById(element.dataset.toggle);
      if (!tab) return;
      displayToggle(tab);
    }
  ];
  var tabDrag = [
    "mousedown",
    ".tabs",
    (parent2, element, event) => {
      tablists.popNode(element.__nodeRef);
      tablists.append(element);
      caltab();
      element.addEventListener("mousemove", tabDrag);
    }
  ];
  var tabSet = [
    "mouseup",
    ".tabs",
    (parent2, element, event) => {
      element.removeEventListener("mouseup", tabDrag);
    }
  ];

  // src/dataListenerHandlers/dataListenerHandler.js
  var EventListenerRegistry = {
    "homeAdd": (parent2) => ContainerEventFactory(parent2, ...homeAdd),
    "homeDelete": (parent2) => ContainerEventFactory(parent2, ...homeDelete),
    "statChange": (parent2) => GenericEventFactory(parent2, ...statChange),
    "listAdd": (parent2) => ContainerEventFactory(parent2, ...listAdd),
    "listEdit": (parent2) => ContainerEventFactory(parent2, ...listEdit),
    "characterAdd": (parent2) => ContainerEventFactory(parent2, ...characterAdd),
    "characterEdit": (parent2) => ContainerEventFactory(parent2, ...characterEdit),
    "characterSelect": (parent2) => ContainerEventFactory(parent2, ...characterSelect),
    "characterArrange": (parent2) => ContainerEventFactory(parent2, ...characterFilterAndSort),
    "locationAdd": (parent2) => ContainerEventFactory(parent2, ...locationAdd),
    "locationEdit": (parent2) => ContainerEventFactory(parent2, ...locationEdit),
    "locationSelect": (parent2) => ContainerEventFactory(parent2, ...locationSelect),
    "markerAdd": (parent2) => ContainerEventFactory(parent2, ...markerAdd),
    "markerEdit": (parent2) => ContainerEventFactory(parent2, ...markerEdit),
    "markerSelect": (parent2) => ContainerEventFactory(parent2, ...markerSelect),
    "mapDrag": (parent2) => ContainerEventFactory(parent2, ...mapDrag),
    "mapSet": (parent2) => ContainerEventFactory(parent2, ...mapSet),
    "tabToggle": (parent2) => ContainerEventFactory(parent2, ...tabToggle),
    "menuToggle": (parent2) => GenericEventFactory(parent2, ...menuToggle),
    "tabDrag": (parent2) => ContainerEventFactory(parent2, ...tabDrag),
    "tabSet": (parent2) => ContainerEventFactory(parent2, ...tabSet)
  };
  function ContainerEventFactory(parent2, mEvent, selector, handler) {
    parent2.addEventListener(mEvent, (e) => {
      const element = e.target.closest(selector);
      if (!element) return;
      handler(parent2, element, e);
    });
  }
  function GenericEventFactory(element, rEvent, handler) {
    element.addEventListener(rEvent, (e) => {
      handler(element, e);
    });
  }
  var dataListenerHandler = () => {
    const entryPoints = document.querySelectorAll("[data-listener]");
    entryPoints.forEach((entryPoint) => {
      const eventListeners = entryPoint.dataset.listener.split(" ");
      eventListeners.forEach((eventListener) => {
        EventListenerRegistry[eventListener](entryPoint);
      });
    });
  };

  // src/start.js
  dataHandlers();
  dataListenerHandler();
  socket.on("connect", () => {
    let check = localStorage.getItem("time") || 0;
    socket.emit("checkSync", check);
  });
  socket.on("create", (create) => {
    graphNodeList[create.table].createRow(create.result);
  });
  socket.on("update", (update) => {
    isUpdatingFromServerState.stepUp();
    graphNodeList[update.table].updateRow(update.result);
    isUpdatingFromServerState.stepDown();
  });
  socket.on("delete", (deleted) => {
    graphNodeList[deleted.tableName].deleteRow(deleted.deletedItem);
  });
  socket.on("checkSync", (check) => {
    storeNewRows(check);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      console.log("Ending session, saving data locally");
      saveData();
    }
  });
})();
//# sourceMappingURL=bundle.js.map
